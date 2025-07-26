const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then((data) => {
      console.log(`✅ MongoDB connected with server: ${data.connection.host}`);
    })
    .catch((err) => {
      console.error(`❌ MongoDB connection error: ${err.message}`);
      process.exit(1);
    });
};

module.exports = connectDatabase;
