require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT;
const mongouri = process.env.MONGO_URI;
const connectDb = require('./db/connect')
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const authRouter = require('./routes/auth')
const notesRouter = require('./routes/notes')

app.use(express.json());
app.use(morgan('tiny'));
app.use(cookieParser(process.env.JWT_SECRET))

app.use('/api/auth', authRouter);
app.use('/api', notesRouter);

const start = async() => {
  try {
    await connectDb(process.env['MONGO_URI']);
    app.listen(port, () => console.log('Server is running on port: '+port));
  } catch (error) {
    console.log(error);
  }
}

start();
