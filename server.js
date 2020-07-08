const app = require('./app');
const chalk = require('chalk');
const allRoutes = require('express-list-endpoints');
let mongoose = require('mongoose');

let uri = `mongodb+srv://cuong:Buicong08@cluster0.ej3o4.mongodb.net/test?retryWrites=true&w=majority`;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
mongoose.connection.once('open', () => {
  console.log('mongodb connected');
  app.listen(app.get('port'), () => {
    console.log(
      '%s App is running at http://localhost:%d in %s mode',
      chalk.green('✓'),
      app.get('port'),
      app.get('env'),
    );
    console.log('Registered Routes: ');
    console.log(allRoutes(app));
  });
});
