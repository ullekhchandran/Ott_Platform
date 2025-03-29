var express = require('express');
var router = express.Router();
const userModel = require('../models/userModel');
const movieModel = require('../models/movieModel');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator');





router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json("Password didn't match");
  }

  const user = new userModel({ name, email, password });


  const validationError = user.validateSync();
  if (validationError) {
    console.error(validationError);
    return res.status(400).json({ errors: validationError.errors });
  }

  try {

    const existingUser = await userModel.findOne({ email });
    console.log(` here is the ${existingUser}`)
    if (existingUser) {
      return res.status(400).json("Email already taken");
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    const signupUser = new userModel({ name, email, password: hashedPassword });
    await signupUser.save();

    return res.status(200).json({ message: "User registered successfully" })
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      return res.status(500).json({ error: error.message || "Internal server error" });
    }
  }
});


router.post("/login", async (req, res) => {
  try {
    console.log(req);
    const { email, password } = req.body;
    console.log(req.body);

    const foundUser = await userModel.findOne({ email });

    console.log("Found user:", foundUser);
    if (!foundUser || !bcrypt.compare(password, foundUser.password)) {
      return res.status(401).json({ message: "Invalid credentials" })
    }
    if (foundUser.block === true) {
      return res.status(402).json({ message: "User has been blocked" });
    }

    const token = jwt.sign({ userId: foundUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",//User secure cookies in production
      sameSite: 'strict',
      maxAge: 3600000//1 hour
    })
    return res.status(201).json({ message: "loginsuccess", userName: foundUser.name })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server Error" })
  }
})



const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // Extract token from cookies
  console.log("Incoming token from cookie:", token);

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.userId = decoded.userId;
    next();
  });
};







router.get('/home', verifyToken, (req, res) => {

  res.status(200).json({ message: "Welcome to home page!,you are authenticated " })

});







router.get("/movies", verifyToken, (req, res) => {
  movieModel.find()
    .then(movies => {
      res.status(200).json({ message: "movies finded", movies })
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: "Internal sever error" })
    })
})

router.get("/latestMovies", verifyToken, (req, res) => {
  movieModel.find()
    .sort({ createdAt: -1 })
    .limit(6)
    .then(movies => {
      res.status(200).json({ message: "latest movie finded", movies })
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: "Internal sever error" })

    })
})

router.get("/movie/:id", (req, res) => {
  const movieId = req.params.id;
  console.log(movieId)

  movieModel.findByIdAndUpdate(
    movieId,
    { $inc: { count: 1 } },
    { new: true }
  ).then(movie => {
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    return movieModel.findById(movieId)
      .then(userWithMovie => {
        if (!userWithMovie) {
          return res.status(403).json({ message: "User with movie in watch history not found" });
        }
        res.status(200).json({ movie, user: userWithMovie });
      })
  })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: "Internal server error" })
    });
})




router.get("/latestmovies", verifyToken, (req, res) => {

  movieModel.find()
    .sort({ createdAt: -1 })
    .limit(3)
    .then(latestmovies => {
      console.log(latestmovies)
      res.status(200).json(latestmovies)
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    });

});

//-----------------  search------------------


router.get('/searchmovie', verifyToken, (req, res) => {
  const searchTerm = req.query.q
  console.log("Search term is:", searchTerm)
  console.log("Search term type:", typeof searchTerm);

  if (!searchTerm) {
    return res.status(400).json({ message: "Search term is required" })
  }

  movieModel.find({
    title: { $regex: searchTerm, $options: "i" }
  })


    .then((movies) => {
      console.log("movies are", movies);

      if (movies.length === 0) {

        return res.status(404).json({ message: "No movies found" })

      }
      return res.status(200).json({ movies })


    })
    .catch((error) => {
      console.error("Error searching for movies:", error);
      return res.status(500).json({ error: "Internal server error" });
    })




})











router.post("/watchlater", verifyToken, (req, res) => {

  const userId = req.userId;
  const { movieId } = req.body;
  userModel.findById(userId)

    .then((user) => {

      if (!user) {

        return res.status(400).json({ message: "user not found" })
      }

      console.log("UserFOUND", user._id)
      const isAlreadyAdded = user.watchLaterSchema.some(
        (entry) => entry.movieId.toString() === movieId
      );

      if (isAlreadyAdded) {

        console.log("Movie already in watchlaterSchema")
        res.status(400).json({ message: "movie already added" });
        return null;
      }

      user.watchLaterSchema.push({
        userId: userId,
        movieId: movieId,

      });
      return user.save();

    })
    .then((result) => {
      if (result) {
        console.log("Movie successfully added to watchLaterSchema", result);
        return res.status(201).json({ message: "movie added to watch laterschema" })

      }

    })
    .catch((error) => {

      console.log(error)
      return res.status(500).json({ message: "Error while adding movie to watchlater", error })
    });

});



router.get('/watchlater', verifyToken, (req, res) => {

  const userId = req.userId
  console.log(userId)

  userModel.findById(userId)
    .select("watchLaterSchema")
    .populate("watchLaterSchema.movieId")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "USER NOT FOUND" })
      }

      return res.status(200).json({ watchLaterMovies: user.watchLaterSchema });

    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({ message: "Error retrieving watch later movies", error })
    });

});

router.delete("/removemovie", verifyToken, (req, res) => {

  const userId = req.userId;
  const { movieId } = req.body;

  userModel.findByIdAndUpdate(
    userId,
    { $pull: { watchLaterSchema: { movieId: movieId } } },
    { new: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }


      res.status(200).json({ message: "Movie removed from watchLaterSchema", watchLaterSchema: user.watchLaterSchema });
    })
    .catch((error) => {
      console.error("Error removing movie:", error);
      res.status(500).json({ message: "Error while removing movie from watchLaterSchema", error });
    });
});


router.post('/watchhistory', verifyToken, (req, res) => {

  const userId = req.userId;
  const { movieId } = req.body
  userModel.findById(userId)

    .then((user) => {
      if (!user) {
        res.status(400).json({ message: "USER NOT FOUND" })
      }

      const isAlreadyAdded = user.watchHistorySchema.some(
        (entry) => entry.movieId.toString() === movieId
      );

      if (isAlreadyAdded) {

        return userModel.findOneAndUpdate(
          {
            _id: userId,
            "watchHistorySchema.movieId": movieId

          },
          {
            $set: { "watchHistorySchema.$.watchedAt": new Date() }
          },


        )
          .then((updatedUser) => {
            return res.status(200).json({ message: "updated watchhistory with time", updatedWatchHistory: updatedUser.watchHistorySchema });

          })
          .catch((error) => {
            return res.status(500).json({ message: "Error updating watch history", error })
          })
      }

      user.watchHistorySchema.push({
        userId,
        movieId,
      });
      return user.save().then(() => {
        return res.status(200).json({ message: "movie saved to watchHistorySchema" })
      })



    })
    .catch((error) => {
      return res.status(500).json({ message: "Error while adding to watchhistoryschema", error })
    })


});


router.get('/watchhistory', verifyToken, (req, res) => {


  const userId = req.userId;
  userModel.findById(userId)
    .select("watchHistorySchema")
    .populate("watchHistorySchema.movieId")
    .then((user) => {

      if (!user) {

        return res.status(400).json({ message: "User not found" })
      }

      return res.status(200).json({ watchHistory: user.watchHistorySchema })


    })
    .catch((error) => {
      return res.status(500).json({ message: "Error retrieving watch later movies", error })
    })

});

router.post('/changepassword', verifyToken, (req, res) => {

  const userId = req.userId;


  const { currentPassword, newPassword, confirmPassword } = req.body;

  userModel.findById(userId)
    .then((user) => {

      if (!user) {
        return res.status(400).json({ message: "USER NOT FOUND" })
      }
      return bcrypt.compare(currentPassword, user.password)
        .then(isMatch => {
          if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });

          }

          if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "newPassword and confirmPassword didnt match" })

          }
          const email = user.email;
          const updateuser = new userModel({ email: email, password: newPassword });
          const validationError = updateuser.validateSync();
          if (validationError) {
            console.error(validationError);
            return res.status(400).json({ errors: validationError.errors })
          }

          return bcrypt.hash(newPassword, 10)
            .then((hashedPassword) => {

              return userModel.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });

            })
            .then((updatedUser) => {
              if (!updatedUser) {
                return res.status(400).json({ message: "USER NOT FOUND" })
              }
              return res.status(200).json({ message: "Password updated successfully", user: updatedUser });

            })
        })
    })

    .catch((error) => {
      res.status(500).json({ message: "An error occured", error: error.message })
    })



});


module.exports = router;
