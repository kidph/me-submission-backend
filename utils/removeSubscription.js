const mongoose = require("mongoose");
require("dotenv").config();
const userName = process.env.MONGO_DB_USERNAME;
const pass = process.env.MONGO_DB_PASSWORD;
const mongoPath = `mongodb+srv://${userName}:${pass}@cluster0.795zabb.mongodb.net/engagement-tracking`;
const subscriptionModel = require("../schemas/subscriptionSchema");
mongoose.connect(mongoPath);

async function refreshSubscription(mint, tx) {
  const currentTime = new Date().getTime();
  try {
    const docs = await subscriptionModel.findOne({ mint: mint });

    docs.active = true;
    docs.payment_transaction = tx;

    docs.save(function (err, doc) {
      if (err) {
        return "error";
      } else {
        return `success`;
      }
    });
  } catch (err) {
    console.log(err);
    return "error";
  }
}

module.exports = { refreshSubscription };
