const express = require('express');
const {engine} = require('express-handlebars');
const fileUpload = require('express-fileupload');
const mysql = require('mysql');

const app = express();
const port = 5000;


app.use(fileUpload());


app.use(express.static('public'));
app.use(express.static('upload'));


app.engine('handlebars', engine({ extname: '.hbs', defaultLayout: "main"}));


app.set('view engine', 'handlebars');


const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'userprofile'
});

pool.getConnection((err, connection) => {
  if (err) throw err; 
  console.log('Connected!');
});

app.get('', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; 
    console.log('Connected!');

    connection.query('SELECT * FROM user WHERE id = "1"', (err, rows) => {

      connection.release();
      if (!err) {
        res.render('index', { rows });
      }
    });

  });
});


app.post('', (req, res) => {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  e
  sampleFile = req.files.sampleFile;
  uploadPath = __dirname + '/upload/' + sampleFile.name;

  console.log(sampleFile);

  
  sampleFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    pool.getConnection((err, connection) => {
      if (err) throw err; 
      console.log('Connected!');

      connection.query('UPDATE user SET profile_image = ? WHERE id ="1"', [sampleFile.name], (err, rows) => {
        
        connection.release();

        if (!err) {
          res.redirect('/');
        } else {
          console.log(err);
        }

      });
    });

    
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));