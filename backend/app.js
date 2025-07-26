const express = require("express");
const app = express();
const cors = require("cors"); // ✅ Added
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");

const errorMiddleware = require("./middleware/error");

// ✅ CORS CONFIGURATION
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// ✅ Routes
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);


// ✅ Error middleware
app.use(errorMiddleware);

module.exports = app;
