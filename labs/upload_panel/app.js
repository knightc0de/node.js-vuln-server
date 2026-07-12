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
                                  files.forEach(file => {
const ext = path.extname(file).toLowerCase();

              if ([".jpg",".jpeg",".png",".gif",".webp"].includes(ext)){
                  html +=`<div style="margin:20px0"> <img src="/uploads/${file}" width="300"><br>
                             <a href="/uploads/${file}" target="_blank">${file}</a> </div>`;
            } else {
                 html +=`<p>
                             <a href="uploads/${file}" target="_blank">${file}</a>
                        </p>
                     `;
            }
          });

          res.send(html);
    });

});
 
app.listen(PORT,() => { console.loglog(`Server running on http://localhost:${PORT}`)});






