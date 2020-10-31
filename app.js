const express = require("express");
const bodyParser = require("body-parser");
var path = require('path');

const app = express();
const { API_VERSION } = require("./config");

// Load routings
const authRoutes = require("./routers/auth");
const userRoutes = require("./routers/user");
const menuRoutes = require("./routers/menu");
const contactRoutes = require("./routers/contact");
const educationRoutes = require("./routers/education");
const systemRoutes = require("./routers/system");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

// Router Basic
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, menuRoutes);
app.use(`/api/${API_VERSION}`, contactRoutes);
app.use(`/api/${API_VERSION}`, educationRoutes);
app.use(`/api/${API_VERSION}`, systemRoutes);
// app.use('/', express.static('client', {redirect: false}));
// app.get('*', function(req, res, next){
//   res.sendFile(path.resolve('client/index.html'));
// });

module.exports = app;
