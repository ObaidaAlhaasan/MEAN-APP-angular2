const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 8000;
const path = require("path");
const config = require("./config/database");


/// connect to server 
app.listen(port , (err) =>{
    console.log("Server Run On Port "+port);
});

/// connect to database 
mongoose.Promise = global.Promise ;
mongoose.connect(config.uri, (err) => {
    if (err) {
        console.log(err);
    }
    console.log("connected to database" + config.db);
});

/// use middlware 
app.use(express.static(__dirname+"/Client/dist/"));


app.get("*" , (req,res,next) =>{
    res.sendfile(path.join(__dirname+"/Client/dist/index.html"));
});
