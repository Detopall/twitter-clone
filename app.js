"use strict";

const express = require("express");
const app = express();
const PORT = 3000;
const server = app.listen(PORT, () => console.log("server listening on port: ", PORT));



app.set("view engine", "pug");
