const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();

const { connectDB } = require("./configs/db");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use(express.json());
app.use(cookieParser())



app.use("/", [authRouter, profileRouter, requestRouter, userRouter])

connectDB().then(() => {
  app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
  });
})