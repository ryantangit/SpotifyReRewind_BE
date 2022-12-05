require('dotenv').config();
const express = require('express');
const Spotify = require('./routes/spotify')
const app = express();
const path = require('path')
const port = 3000;

app.use('/spotify', Spotify)


app.get('/', (req, res) => { 
  	res.sendFile(path.join(__dirname, "views/index.html"));
	console.log("root");
});

app.listen(port, () =>
{
  console.log(`listening on port:${port}`)
});


