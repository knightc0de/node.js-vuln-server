const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// server 
app.use("/uploads",express.static(path.join(__dirname,"uploads")));

const storage = multer.diskStorage({
                destination :(req,file,cb) => {cb(null,"uploads/");},
                filename:(req,file,cb) => {
                  cb(null,Date.now() + path.extname(file.originalname));
                }  
});

const upload = multer({storage});

// home page 

app.get("/",(req,res) => {
                           res.sendfile(
                            path.join(__dirname,"index.html"));
});

app.get("./uploads",(req,res) => {fs.readdir("./uploads",(err,files) => { 
                                  if (err){
                                    return res.status(500).send("Error reading upload folder");
                                  }       
                                  let html = ` 
                                      <h1>Uploaded Files<h1>
                                      <a> href="/">upload New File</a><hr>
                                  `;
                                  
}






