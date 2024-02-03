// import express from 'express';
const express = require("express");
const multer = require("multer");
const path = require("path");
const mime = require("mime");
const domain = require("./config");
const bodyParser = require("body-parser");
const app = express();
console.log([path.join(__dirname, "public")]);
app.use(express.static(path.join(__dirname, "public/")));
app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).json({ message: "welcome to file upload" });
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("req.body", req.body);
    console.log("file", file);
    req.body.url = `uploads/${req.body.role}`;
    cb(null, `./public/uploads/${req.body.role}`);
    // cb(null, `./public/uploads/user/`);
  },
  filename: (req, file, cb) => {
    const ext = mime.getExtension(file.mimetype);
    console.log(ext);
    const filename = `${req.body.userId}-${file.originalname}`;
    cb(null, filename);
  },
});
const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    console.log("body", req.body);
    console.log("file", req.file);
    console.log("files", req.files);
    const documentUrl = `${domain}/${req.body.url}/${req.file.filename}`;

    res
      .status(200)
      .json({
        ok: true,
        message: "document uploaded successfully",
        url: documentUrl,
      });
  } catch (err) {
    console.log("🚀 ~ file: index.js:32 ~ app.post ~ err:", err);
    res
      .status(500)
      .json({ ok: false, message: "something went wrong", err: err });
  }
});
app.listen(5000, () => {
  console.log("server is running on port 500");
});
