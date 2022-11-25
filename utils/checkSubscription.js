const mongoose = require("mongoose");
require("dotenv").config();
const userName = process.env.MONGO_DB_USERNAME;
const pass = process.env.MONGO_DB_PASSWORD;
const mongoPath = `mongodb+srv://${userName}:${pass}@cluster0.795zabb.mongodb.net/engagement-tracking`;
const subscriptionModel = require("../schemas/subscriptionSchema");
const { breakNftSubscription } = require("./breakNftSubscription");
mongoose.connect(mongoPath);

async function checkSubscription() {
  const currentTime = new Date().getTime();
  try {
    const docs = await subscriptionModel.find({});

    docs.forEach((doc, i) => {
      if (parseInt(docs.subscription_renew) < currentTime) {
        console.log("payment due");
        docs.active = false;
        docs.save(function (err, doc) {
          if (err) {
            return "error";
          } else {
            console.log("success");
          }
          async function breakIt() {
            await breakNftSubscription(mint);
          }
          breakIt();
        });
      } else {
        return "subscription active";
      }
      if (i === docs.length - 1) {
        return "Subscriptions Updated";
      }
    });
  } catch (err) {
    console.log(err);
    return "error";
  }
}

module.exports = { checkSubscripton };
