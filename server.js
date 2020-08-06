const app = require('./app');
const chalk = require('chalk');
const allRoutes = require('express-list-endpoints');
let mongoose = require('mongoose');
var fs = require('fs');
var https = require('https');

var httpsServer = https.createServer(
  {
    key: fs.readFileSync('ssl/domain.key'),
    cert: fs.readFileSync('ssl/domain.crt'),
  },
  app,
);
let uri = `mongodb+srv://cuong:Buicong08@cluster0.ej3o4.mongodb.net/test?retryWrites=true&w=majority`;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
mongoose.connection.once('open', () => {
  console.log('mongodb connected');
  httpsServer.listen(8080, () => {
    console.log('%s HttpsServer is running at http://localhost:%d in %s mode', chalk.green('✓'), 3000);
    console.log('Registered Routes: ');
    console.log(allRoutes(app));
  });
});
