"use strict";

const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");

const app = express();
const PORT = 3000;
const server = app.listen(PORT, () => console.log("server listening on port: ", PORT));

app.engine('.hbs', exphbs.engine({defaultLayout: "main", extname: ".hbs",  partialsDir: __dirname + '/views/partials'}));
app.set('view engine', '.hbs');

app.use('/', require('./routes/routes'));
app.use(express.static(path.join(__dirname, 'public')));
