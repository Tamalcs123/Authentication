const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes= require('./routes/userRoutes');

dotenv.config();

const PORT = 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`Successfully connected..`);
  })
  .catch((error) => {
    console.log(error);
  });

  app.use(express.json());

  app.use('/api/auth',userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
