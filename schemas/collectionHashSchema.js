var mongoose = require("mongoose");
const userName = process.env.MONGO_DB_USERNAME;
const pass = process.env.MONGO_DB_PASSWORD;
const mongoPath = `mongodb+srv://${userName}:${pass}@cluster0.795zabb.mongodb.net/engagement-tracking`;
var db = mongoose.createConnection(mongoPath);

var collectionHashSchema = mongoose.Schema({
  mint: String,
  active: Boolean,
  active_image: String,
  active_metadata: String,
  broken_image: String,
  broken_metadata: String,
  activation_fee: String,
  lastTx: String,
});
var collectionHashModel = db.model(
  "collectionHash",
  collectionHashSchema,
  "collectionHash"
);

module.exports = collectionHashModel; // this is what you want
