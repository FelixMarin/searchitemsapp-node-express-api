const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.static(__dirname + '/public'));

app.get('/login',function(req,res) {
    res.sendFile(__dirname + '/public/login.html');
  });

  app.get('/main',function(req,res) {
    res.sendFile(__dirname + '/public/main.html');
  });

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));