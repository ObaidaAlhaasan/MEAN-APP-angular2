const mongoose  = require("mongoose");
const Schema    = mongoose.Schema ; 
const bcrypt = require("bcrypt-nodejs");


///validate Username

let validateUserName = function (username) {
  
    if (!username) {
        return false ;
    }  else if(username.length < 6 || username.length > 15) {
        return false ;
    }else{
         let regusername = new RegExp(/^[a-zA-Z0-9]+$/);
         return regusername.test(username);   
    }
};

/// validate password
// "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}"
// Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character

let passwordLengthChecker=function (password) {
    if (!password) {
        return false;
    } else if(password.length <8 || password.length>20){
        return false;
    }else{
        return true ;
    }
};

let validatePassword = function (password) {
    if (!password) {
        return false ;
    } else {
        const regExp = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/);
        return regExp.test(password);
    }
};
const passwordValidator =[{
    validator:passwordLengthChecker ,
    message:"Minimum eight characters, and No more than 20 character"
},{
    validator:validatePassword,
    message:"Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"

    
}

];


///validateEmail
let validateEmail = function(email) {
    let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};
///////////////////////  declare user Constructor

const UserSchema= new Schema({
email:{type:String , required:true , unique:true , lowercase:true , validate:validateEmail,match:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/},
username:{type:String , required:true , unique:true , lowercase:true, validate:validateUserName},
password:{type:String , required:true, validate:passwordValidator  }
});

/// hash password befor saving user in db
UserSchema.pre('save',function (next){
    if (!this.isModified('password')) {
        return next();
    }else{
        bcrypt.hash(this.password ,null,null ,(err,hash)=>{
            if (err) {
                return next(err);
            }
            this.password = hash ;
            next(); 
        });
    }
});

/// compare password for loginpage
UserSchema.methods.comparePassword = function (password) {
  return  bcrypt.compareSync(password,this.password);  
};



module.exports = mongoose.model("User",UserSchema);