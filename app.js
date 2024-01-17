const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const PORT = 5050;
const cors = require('cors');


require("./model/userModel");

app.use(cors());

app.use(express.json());
app.use(require("./routes/userRouter"));

mongoose
  .connect(process.env.MONGOURL)
  .then(() => {
    console.log("DB connected");
  })
  .catch((error) => {
    console.log(error);
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });