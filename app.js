"use strict";

require("dotenv").config({path: './config/config.env'});
const express = require("express");
const connectDB = require("./config/db");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json()); //has to be before all routes are defined

app.engine('.hbs', exphbs.engine({defaultLayout: "main", extname: ".hbs",  partialsDir: __dirname + '/views/partials'}));
app.set('view engine', '.hbs');

if (process.env.NODE_ENV === "development"){
	app.use(morgan('dev'));
}

app.use('/', require('./routes/routes'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({extended: true})); 

app.listen(PORT, () => console.log("server listening on port: ", PORT));
