const { app } = require('./app');
const { databaseConnection } = require('./database/dbConnection');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const Port = process.env.PORT;

databaseConnection().then(() => {
  app.listen(Port || 5000, () => {
    console.log(`Server is running on Port ${Port}`);
  });
});
