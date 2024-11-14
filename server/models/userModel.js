const mongoose= require('mongoose');


const watchHistorySchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, 
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true, 
    },
    watchedAt: {
      type: Date,
      default: Date.now, 
    },
  });


  const watchLaterSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, 
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true, 
    },
    addedAt: {
      type: Date,
      default: Date.now, 
    },
  });
  



const userSchema =new mongoose.Schema({

    name:{
        type:String
       
        
    },
    email:{
        type: String,
        lowercase:true,
        unique:true,
        required: [true, 'Email field is required'],
        validate:{
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
          }
    },
    password:{
        type: String,
        required: [true, 'password field is required'],
        minlength: [6, 'password should atleast characters required'],
        validate:{

            validator: function(v){
                return /^(?=.*[A-Z])(?=.*[!@#$%^&*])^/.test(v)
            },
            message:'password should contain one uppercase and a specialcharacter'
        }

    },
    date:{
        type:Date,
        default:Date.now
    },

    resettoken:{
        type:String,

    },
    isAdmin:{
      type:Boolean,
      default:false
    },

    watchHistorySchema:[watchHistorySchema],
    watchLaterSchema:[watchLaterSchema],
})

const userModel= mongoose.model('User',userSchema);
module.exports=userModel;