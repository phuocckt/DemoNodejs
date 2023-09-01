const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const http = require('http');
const app = express();
const port = 1234;
const admin =require("./admin");
const accounts = require("./account");
const products = require("./products");
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(cors());

app.use(express.urlencoded({
    extended: true
}));
app.use(express.static(__dirname+"/static"));
//app.use(express.static(path.join(__dirname, "../client")));
app.use("/account", accounts);
app.use("/products", products);
app.use("/admin", admin);
app.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, "../client/index.html"), 'utf8', (err, data) => {
      if (err) {
        console.error("Lỗi khi đọc tệp index.html", err);
        res.status(500).send("Internal Server Error");
      } else {
        res.send(data);
      }
    });
  });

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});