"use strict";

require("dotenv").config({path: './config/config.env'});
const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.engine('.hbs', exphbs.engine({defaultLayout: "main", extname: ".hbs",  partialsDir: __dirname + '/views/partials'}));
app.set('view engine', '.hbs');

app.use('/', require('./routes/routes'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({extended: true})); 
app.use(express.json());

app.listen(PORT, () => console.log("server listening on port: ", PORT));