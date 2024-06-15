const express = require('express');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/', userRoutes);

module.exports = app;