var express = require("express");
const routes = require("../routes/routes.js");

const server = express();

server.set("port", process.env.PORT || 5000);
server.use("/", routes);

module.exports = server;