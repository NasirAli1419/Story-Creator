const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require('fs');
const path = require("path");
const homeStartingContent = "Lacus at";
const aboutContent = "Hac habitasse s vestibulum lorem sed. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut t";
const contactContent = "Sceleerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

let posts=[];

mongoose.connect("mongodb+srv://admin-noah:Nasir123@cluster0.5vhzq.mongodb.net/loveAlwaysWins?retryWrites=true&w=majority",{useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const chapterSchema = mongoose.Schema({
part:Number,
Image:{contentType:String,path:String,image:Buffer},
title:String,
story:String,
music:String
});

const partSchema = mongoose.Schema({
part:Number,
chapters:[chapterSchema]
});
//-----------------------------------------------------
var storage = multer.diskStorage({
  destination:function(req,res,cb){
    cb(null,'public/uploads')
  },
  filename:function(req,file,cb){
    cb(null,file.fieldname + '-' +Date.now()+path.extname(file.originalname))
  }
});

var upload = multer({
  storage:storage
});

//---------------------------------------------------------
const Parts = mongoose.model("Parts",partSchema);

app.get("/",function(req,res){

  Parts.find({},function(err,parts){
    if(err){
      console.log(err);
    }
    else{
      res.render("home",{parts:parts});
    }
  })

});
// Image Upload

// Image Upload
app.get("/about",function(req,res){
  res.render("about",{aboutContent:aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{contactContent:contactContent});
});

app.get("/Noah@123",function(req,res){
  res.render("compose");
});

app.post("/Noah@123",upload.single('myFile'),function(req,res){
 var img = fs.readFileSync(req.file.path);
 var encode_image = img.toString('base64');

 const chapter = {
   part:req.body.partNumber,
   Image:{contentType:req.file.mimetype,path:req.file.path,image:new Buffer(encode_image,'base64')} ,
   title:req.body.title,
   story:req.body.story,
   music:"Dsagfsadas"
 };

 Parts.findOne({part:req.body.partNumber},function(err,Part){

 if(!err){
  if(!Part){
   const part = new Parts({
     part:req.body.partNumber,
     chapters:[chapter]
   });

    part.save(function(err){

    if (!err){

      res.redirect("/");

    }

  });

  }
  else{
   Part.chapters.push(chapter);
   Part.save(function(err){

   if (!err){

     res.redirect("/");

   }

 });
  }

 }

});
});


app.get("/posts/:partNumber/:chapterName",function(req,res){

const requestedPart = req.params.partNumber;
const requestedChapter = req.params.chapterName;

Parts.findOne({part:requestedPart},function(err,Part){

if(!err){

Part.chapters.forEach(function(chapter){
 if(requestedChapter===chapter.title){
   let newChapter=[];
   let start=0;
   for(let i=0;i<chapter.story.length;i++){
     if(chapter.story.charAt(i)==="~"){
       newChapter.push(chapter.story.substring(start,i));
      start=i+1;
     }
   }
   res.render("post",{newChapter,Chapter:chapter});
 }

});

}
});

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});
