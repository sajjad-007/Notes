const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });

const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errorMiddleware } = require('./middleware/error');
const myAllRoutes = require('./routes/index');
const fileUpload = require('express-fileupload');

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ['POST,DELETE,PUT,GET'],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(fileUpload({ useTempFiles: true, tempFileDir: './temp/' }));
app.use(express.urlencoded({ extended: true }));
app.use(myAllRoutes);

// we don't have to call errorMiddleware, if we call it. it will throw an error
app.use(errorMiddleware);

module.exports = { app };
