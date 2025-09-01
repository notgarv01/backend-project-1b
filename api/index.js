const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  fs.readdir(path.join(__dirname, '../files'), (err, files) => {
    if (err) return res.status(500).send('Error reading files');
    res.render('index', { files });
  });
});

app.get('/file/:filename', (req, res) => {
  fs.readFile(path.join(__dirname, '../files', req.params.filename), 'utf-8', (err, fileData) => {
    if (err) return res.status(404).send('File not found');
    res.render('show', { filename: req.params.filename, fileData });
  });
});

app.post('/create', (req, res) => {
  fs.writeFile(path.join(__dirname, './files', `${req.body.title}.txt`), req.body.details, (err) => {
    if (err) return res.status(500).send('Error creating file');
    res.redirect('/');
  });
});

// IMPORTANT: No app.listen() here
module.exports = app;
