const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cors = require("cors");
const services = require("./routes");
const cookies = require("cookie-parser");

const CLIENT_HOST = process.env.CLIENT_HOST;
const SERVER_PORT = process.env.SERVER_PORT;

app.use(express.json());
app.use(cookies());
app.use(cors({ origin: CLIENT_HOST, credentials: true }));

// route configuration
app.use("/api/auth", services.authRoute);
app.use("/api/user", services.userRoute);
app.use("/api/post", services.postRoute);

app.listen(SERVER_PORT, () => {
  console.log(`Server connected on port ${SERVER_PORT}`);
});
