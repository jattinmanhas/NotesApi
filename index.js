require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT;
const mongouri = process.env.MONGO_URI;
const connectDb = require('./db/connect')
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const multer = require('multer');

const authRouter = require('./routes/auth')
const notesRouter = require('./routes/notes')

app.use(express.json());
app.use(morgan('tiny'));
app.use(cookieParser(process.env.JWT_SECRET))

const fileStorage = multer.diskStorage({
    destination : (req, file , cb) => {
     cb(null, 'images');
    },
    filename : (req, file, cb) => {
      cb(null,  new Date().toISOString() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('images'));


app.use('/api/auth', authRouter);
app.use('/api', notesRouter);

const start = async() => {
  try {
    await connectDb(mongouri);
    app.listen(port, () => console.log('Server is running on port: '+port));
  } catch (error) {
    console.log(error);
  }
}

start();
