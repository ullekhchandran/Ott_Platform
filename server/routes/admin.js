var express = require('express');
var router = express.Router();
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const movieModel = require('../models/movieModel')








router.get('/', (req, res) => {
    res.render('adminLogin.ejs', { message: null, errors: [] })

})







router.post('/login', (req, res) => {

    const { email, password } = req.body
    console.log("email and password are", email, password)
    userModel.findOne({ email })
        .then((user) => {
            if (!user) {
                return res.render('adminLogin.ejs', { message: "user not found", errors: [] })
            }
            const isPasswordValid = bcrypt.compareSync(password, user.password)
            if (!isPasswordValid) {
                return res.render('adminLogin.ejs', { message: "Invalid password", errors: [] })
            }
            if (!user.isAdmin) {
                return res.render('adminLogin.ejs', { message: 'Access denied. user is not an Admin', errors: [] });
            }
            console.log("Admin logged in successfully:", user.email)
            res.redirect('/admin/home');
        })


})


router.get('/home', (req, res) => {
    movieModel.find()
        .then((movies) => {
            res.render('adminHome', { movies })
            console.log(movies)

        })
        .catch(err => {
            console.log("Error fetching movies:", err);
            res.status(500).send('Server Error')
        })
})


router.get('/view/:id', (req, res) => {

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


router.get('/edit/:id', (req, res) => {

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

router.post('/edit/:id', (req, res) => {

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


router.post('/delete/:id', (req, res) => {

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

router.get('/create', (req, res) => {
    console.log("Fetched createpage successfully")
    res.render('create.ejs')

});


router.post('/create', (req, res) => {
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


router.get('/userManagement',(req,res)=>{
   
    userModel.find()
    .then((users)=>{
        res.render('userManagement.ejs',{users})
        console.log(users)

    })
    .catch(err => {
        console.log("Error fetching movies:", err);
        res.status(500).send('Server Error')
    })

  
})

router.get('/movieHistory/:id',(req,res)=>{
   const userId=req.params.id
   userModel.findById(userId)
   .populate({
    path: 'watchHistorySchema.movieId',
    select: 'title' // Only fetch the title field from the Movie collection
  })



   .then((user)=>{

    if(!user){
        return res.status(404).send('user not found')
    }


    //for map correct iterated moviedetails in userWatchHistory
    const userWatchHistory = user.watchHistorySchema.map(history => ({
        watchedAt: history.watchedAt,
        title: history.movieId ? history.movieId.title : 'Title not found'
      }));
    console.log(userWatchHistory)

    res.render('movieHistory.ejs',{userWatchHistory})

   })
   .catch((error)=>{
    console.error("Error while fetching watch history",error)
   })

})




module.exports = router;