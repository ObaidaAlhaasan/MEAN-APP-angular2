const mongoose  = require("mongoose");
const Schema    = mongoose.Schema ; 

///validate Username


let commentsLengthChecker=function (comment) {
    if (!comment[0]) {
        return false;
    } else if(comment[0].length <1 || comment[0].length>200){
        return false;
    }else{
        return true ;
    }
};
const commentsValidator =[{
    validator:commentsLengthChecker ,
    message:"Comments may not exceed 220 character"
}
];


let bodyLengthChecker=function (body) {
    if (!body) {
        return false;
    } else if(body.length <8 || body.length>220){
        return false;
    }else{
        return true ;
    }
};


const bodyValidator =[{
    validator:bodyLengthChecker ,
    message:" Body Blog Minimum eight characters, and No more than 220 character"
}
];
//// ttile length checker

let titleLengthChecker = (title) => {
  if (!title) {
      return false ;

  } else if(title.length <5 || title.length>70) {
      return false ;
  }else{
      return true ;

  }
};

let alphaNumerictitle = function (title) {
    if (!title) {
        return false ;
    } else {
        const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
        return regExp.test(title);
    }
};


const titleValidator =[{
    validator:titleLengthChecker ,
    message:"title Minimum 5 characters, and No more than 70 character"
},{
    validator:alphaNumerictitle,
    message:"Title Must Be alphaNumeric"   
}
];
///////////////////////  declare user Constructor

const BlogSchema= new Schema({

title:{type:String , required:true  , validate:titleValidator},

body:{type:String , required:true ,validate:bodyValidator},
createdBy:{type:String},
createdAt:{type:Date , default:Date.now()},
likes:{type:Number , default:0},
likesBy:{type:Array},
dislikes:{type:Number , default:0},
dislikesBy:{type:Array},
comments:[
    {
        comment:{type:String , validate:commentsValidator},
        commentator:{type:String}
    }
]



});






module.exports = mongoose.model("Blog",BlogSchema);