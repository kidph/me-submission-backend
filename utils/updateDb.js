const mongoose = require("mongoose");
const userName = process.env.MONGO_DB_USERNAME;
const pass = process.env.MONGO_DB_PASSWORD;
const mongoPath = `mongodb+srv://${userName}:${pass}@cluster0.795zabb.mongodb.net/engagement-tracking`;
const collectionHashModel = require("../schemas/collectionHashSchema");
mongoose.connect(mongoPath);

async function update(saleInfo) {
  if (saleInfo.didPay) {
    const docs = await collectionHashModel.findByIdAndUpdate(
      { mint: saleInfo.mint },
      {
        lastTx: saleInfo.tx,
      }
    );
    return "Royalty Paid";
  } else {
    const docs = await collectionHashModel.findOneAndUpdate(
      { mint: saleInfo.mint },
      {
        active: false,
        activation_fee: saleInfo.feeToPay,
        lastTx: saleInfo.tx,
      }
    );
    return "Database Updated";
  }
}
module.exports = { update };
