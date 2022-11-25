const { Metaplex, keypairIdentity } = require("@metaplex-foundation/js");
const { PublicKey, Connection, Keypair } = require("@solana/web3.js");
require("dotenv").config();
const mongoose = require("mongoose");
const userName = process.env.MONGO_DB_USERNAME;
const pass = process.env.MONGO_DB_PASSWORD;
const mongoPath = `mongodb+srv://${userName}:${pass}@cluster0.795zabb.mongodb.net/engagement-tracking`;
const subscriptionModel = require("../schemas/subscriptionSchema");
mongoose.connect(mongoPath);
const bs58 = require("bs58");
const connection = new Connection(
  "https://frosty-shy-violet.solana-mainnet.quiknode.pro/45c1c31d6e058e521eb0c8d9be91c2bc640fbfae/",
  "confirmed"
);

async function restoreNftSubscription(mint) {
  try {
    mongoose.connect(mongoPath);
    const key = process.env.SIGNER;
    console.log(mint);
    const signer = Keypair.fromSecretKey(bs58.decode(key));

    const mintAddress = new PublicKey(mint);

    const metaplex = Metaplex.make(connection).use(keypairIdentity(signer));
    const doc = await subscriptionModel.findOne({ mint: mint });

    if (doc) {
      const nft = await metaplex
        .nfts()
        .findByMint({ mintAddress: mintAddress });

      await metaplex.nfts().update({ nftOrSft: nft, uri: doc.active_metadata });
      const updatedNft = await metaplex.nfts().refresh(nft);
      doc.active = true;
      doc.subscription_renew = new Date().getTime().toString();
      doc.save();
      return updatedNft;
    }
  } catch (err) {
    console.log(err.message);
    return "error";
  }
}

module.exports = { restoreNftSubscription };
