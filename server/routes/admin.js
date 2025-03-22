var express = require('express');
var router = express.Router();
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const movieModel = require('../models/movieModel')
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
dotenv.config();










router.get('/', (req, res) => {
    res.render('adminLogin.ejs', { message: null, errors: [] })

})







router.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log("email and password are", email, password);

    userModel.findOne({ email })
        .then((user) => {
            if (!user) {
                return res.render('adminLogin.ejs', { message: "User not found", errors: [] });
            }

            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) {
                return res.render('adminLogin.ejs', { message: "Invalid password", errors: [] });
            }

            if (!user.isAdmin) {
                return res.render('adminLogin.ejs', { message: 'Access denied. User is not an Admin', errors: [] });
            }

            req.session.userId= user._id;
            req.session.isAdmin= user.isAdmin;
            req.session.expiresAt = Date.now()+ 3600000;// 1 hour from now

            console.log("Admin logged in successfully:", res.getHeaders());
            res.redirect('/admin/home');
        })
        .catch(err => {
            console.error('Error during login:', err);
            res.render('adminLogin.ejs', { message: "An error occurred", errors: [] });
        });
});


function verifyAdminSession(req, res, next) {
    if (req.session && req.session.userId && req.session.isAdmin&& req.session.expiresAt && req.session.expiresAt > Date.now()) {
        // The user is logged in and is an admin and the session is valid
        return next();
    } else {
        console.log("Session verification failed or user is not admin");
        return res.status(403).render('adminLogin.ejs', { message: 'Access denied. Not an admin or session expired.', errors: [] });
    }
}




router.get('/home',verifyAdminSession, (req, res) => {
    movieModel.find()
        .then((movies) => {
            res.render('adminHome.ejs', { movies })
            console.log(movies)

        })
        .catch(err => {
            console.log("Error fetching movies:", err);
            res.status(500).send('Server Error')
        })
})


router.get('/view/:id',verifyAdminSession, (req, res) => {

    const movieId = req.params.id;
    movieModel.findById(movieId)
        .then(movie => {
            if (!movie) {
                return res.status(404).send("Movie not found")
            }
            res.render("view", { movie })
            console.log("MOVIE FOUND", movie)
        })
        .catch(err => {
            console.log("Error fetching movie details:", err)
            res.status(500).send("Server Error");
        });
});


router.get('/edit/:id',verifyAdminSession, (req, res) => {

    const movieId = req.params.id;
    movieModel.findById(movieId)
        .then((movie) => {
            if (!movie) {
                return res.status(404).send("Movie not found")
            }
            res.render("edit", { movie })

        })
        .catch(err => {
            console.log("Error fetching movie details:", err)
            res.status(500).send("Server Error");
        });

})

router.post('/edit/:id',verifyAdminSession, (req, res) => {

    const movieId = req.params.id
    const { title, description, thumbnail, video } = req.body;
    console.log("THE TITLE AND DESCRIPTION ARE: ", title, description)

    let updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (thumbnail) updateFields.thumbnail = thumbnail;
    if (video) updateFields.video = video;


    movieModel.findByIdAndUpdate(
        movieId,
        updateFields,
        { new: true }

    ).then(updatedMovie => {
        if (!updatedMovie) {
            // return res.render("edit.ejs",{message:"Movie not found", errors:[]});
            console.log("Movie not found")
        }
        //    return res.render('edit.ejs',{message:"Movie updated successfully",errors:[]})
        console.log("Movie updated successfully")
        res.redirect('/admin/home')


    })
        .catch((error) => {
            console.error("Error updating movie:", error)
            res.status(500).send("Server error")
        })

})


router.post('/delete/:id',verifyAdminSession, (req, res) => {

    const movieId = req.params.id;
    console.log("Received ID for deletion:", movieId)
    movieModel.findByIdAndDelete(movieId)
        .then(() => {



            res.redirect('/admin/home');
        })
        .catch((error) => {
            console.error("Error while deleting movie:", error);  // Print detailed error message
            res.status(500).send("Internal server error");

        })

})

router.get('/create',verifyAdminSession, (req, res) => {
    console.log("Fetched createpage successfully")
    res.render('create.ejs')

});


router.post('/create',verifyAdminSession, (req, res) => {
    const { title, description, thumbnail, video } = req.body

    const newMovie = new movieModel({ title, description, thumbnail, video })

    newMovie.save()
        .then(() => {

            res.redirect('/admin/home')

        })
        .catch((error) => {
            res.redirect('/admin/create')
            4
        })


})


router.get('/userManagement',verifyAdminSession, (req, res) => {

    userModel.find({ isAdmin: false })
        .then((users) => {
            res.render('userManagement.ejs', { users })
            console.log(users)

        })
        .catch(err => {
            console.log("Error fetching movies:", err);
            res.status(500).send('Server Error')
        })


})

router.get('/movieHistory/:id',verifyAdminSession, (req, res) => {
    const userId = req.params.id
    userModel.findById(userId)
        .populate({
            path: 'watchHistorySchema.movieId',
            select: 'title' // Only fetch the title field from the Movie collection
        })



        .then((user) => {

            if (!user) {
                return res.status(404).send('user not found')
            }


            //for map correct iterated moviedetails in userWatchHistory
            const userWatchHistory = user.watchHistorySchema.map(history => ({
                watchedAt: history.watchedAt,
                title: history.movieId ? history.movieId.title : 'Title not found'
            }));
            console.log(userWatchHistory)

            res.render('movieHistory.ejs', { userWatchHistory })

        })
        .catch((error) => {
            console.error("Error while fetching watch history", error)
        })

})


router.get('/blockUser/:id',verifyAdminSession, (req, res) => {
    const userId = req.params.id;
    const shouldBlock = req.query.block === "true";
    userModel.findByIdAndUpdate(userId, { block: shouldBlock }, { new: true })
        .then(updatedUser => {
            if (updatedUser) {

                res.redirect('/admin/userManagement')
                console.log(`user ${shouldBlock ? 'blocked' : 'unblocked'}  successfully`)
            } else {
                console.log("User not found")
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'Error blockin user', error: err })
        })

})





router.get("/movieCount",verifyAdminSession, (req, res) => {

    movieModel.find()
        .then(movies => {
            res.render('viewCount.ejs', { movies });
          
        })
        .catch(error => {
            console.error('Error fetching movie Counts:', error);
            res.status(500).send("An error occured while fetching movie counts.")
        })



})
module.exports = router;