const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const userController = require('./controllers/userController');
const mongoURI =
  'mongodb+srv://helios:ProjectHelios21@projecthelios.fjemz.mongodb.net/Helios?retryWrites=true&w=majority';

mongoose
  .connect(mongoURI, {
    dbName: 'Helios',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/build', express.static(path.resolve(__dirname, '../build')));

app.get('/', (req, res) => {
  return res
    .status(200)
    .sendFile(path.resolve(__dirname, '../public/index.html'));
});
app.post('/signup', userController.createUser, (req, res) => {
  res.status(200).json(res.locals.confirmation);
});

app.post('/login', userController.verifyUser, (req, res) => {
  res.status(200).json(res.locals.confirmation);
});

app.post('/register', userController.addArn, (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
});

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  };
  const errObj = Object.assign(defaultErr, err);
  console.log('Error: ', errObj.log);
  res.status(errObj.status).send(errObj.message);
});

module.exports = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
