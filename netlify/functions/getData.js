
const mongoose = require("mongoose");
const Movie = require("./models/Movie"); // you may need to adjust the path
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

let isConnected = false;

exports.handler = async (event, context) => {
  if (!isConnected) {
    try {
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      isConnected = true;
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "MongoDB connection failed" }),
      };
    }
  }

  try {
    const movies = await Movie.find();
    return {
      statusCode: 200,
      body: JSON.stringify(movies),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};