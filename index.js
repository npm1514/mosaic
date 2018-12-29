const express = require('express');
const compression = require('compression');
const fs = require('fs');
const http = require('http');
var CronJob = require('cron').CronJob;

var port = process.env.PORT || 3000;
var url = process.env.PORT ? "http://mosaic-fun.herokuapp.com/" : "http://localhost:" + port;
var app = express();

app.use(compression());
app.use(express.static(__dirname + '/public'));

app.get('/health', (req, res) => {
  console.log("Healthy");
  res.send('Healthy')
});

app.listen(port, function(){
  console.log("listening to " + port);
});

http.get(url + '/health');
new CronJob('0 */15 * * * *', () => {
  http.request(url + '/health');
})
