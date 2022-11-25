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

async function breakNftSubscription(mint) {
  try {
    console.log(mint);
    mongoose.connect(mongoPath);
    const key = process.env.SIGNER;

    const signer = Keypair.fromSecretKey(bs58.decode(key));

    const mintAddress = new PublicKey(mint);

    const metaplex = Metaplex.make(connection).use(keypairIdentity(signer));
    const doc = await subscriptionModel.findOne({ mint: mint });

    console.log(doc);

    if (doc) {
      const nft = await metaplex
        .nfts()
        .findByMint({ mintAddress: mintAddress });

      console.log(nft);
      await metaplex.nfts().update({ nftOrSft: nft, uri: doc.broken_metadata });
      const updatedNft = await metaplex.nfts().refresh(nft);
      console.log(updatedNft);
      return updatedNft;
    } else {
      console.log("bullshit");
      return "doc not found";
    }
  } catch (err) {
    return err;
  }
}

module.exports = { breakNftSubscription };
