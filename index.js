require("dotenv").config();
const express = require("express");
const cors = require("cors");
const apiKeys = require("./apiKeys.json");
const { getRoyalties } = require("./utils/getRoyaltyResults");
const PORT = process.env.PORT;
const app = express();
const hashlist = require("./hashlist.json");
const bodyParser = require("body-parser");
const { breakNft } = require("./utils/breakNft");
const { restoreNft } = require("./utils/restoreNft");
const { update } = require("./utils/updateDb");
const HELIUS = process.env.HELIUS_KEY;
const axios = require("axios");

const corsOpts = {
  origin: ["http://localhost:3000"],

  methods: ["GET", "POST"],

  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOpts));

const accessGranted = (req, res, next) => {
  if (!apiKeys.includes(req.query.key)) {
    return res.status(401).json("Access Denied.");
  } else next();
};

app.use(bodyParser.json());

//Base Route
app.post("/", accessGranted, (req, res) => {
  res.status(200).json("Welcome To Corn Pop's Stuf boiiiii");
});

app.get("/api/restore", accessGranted, async (req, res) => {
  const mint = req.query.mint;
  console.log(mint);
  const restore = await restoreNft(mint);
  console.log(restore);
  res.status(200).json("successful restoration");
});

app.post("/api/helius-hook", async (req, res) => {
  try {
    if (hashlist.includes(req.body[0]?.events?.nft?.nfts[0]?.mint)) {
      const mint = req.body[0]?.events?.nft?.nfts[0]?.mint;
      console.log(mint);
      try {
        await axios
          .post(`https://api.helius.xyz/v0/tokens/metadata?api-key=${HELIUS}`, {
            mintAccounts: [mint],
          })
          .then((response) => {
            console.log(response.data);
            const data = response.data;
            const tx = req.body[0]?.events?.nft?.signature;

            const creators = data[0]?.onChainData?.data?.creators?.map(
              (creator) => creator.address
            );

            if (
              !req.body[0].nativeTransfers.some((e) =>
                creators?.includes(e.toUserAccount)
              )
            ) {
              const feeToPay =
                (req.body[0]?.events?.nft?.amount / 1000000000) *
                (data[0]?.onChainData?.data?.sellerFeeBasisPoints / 10000);

              const saleInfo = {
                mint: mint,
                didPay: false,
                feeToPay: feeToPay,
                tx: tx,
              };

              async function runFuncs() {
                console.log(mint);
                const updateDatabase = await update(saleInfo);
                console.log(updateDatabase);
                const brokenNft = await breakNft(mint);
                console.log(brokenNft);
              }
              runFuncs();
            } else {
              console.log("paid");
            }
          });
      } catch (err) {
        console.log(err);
      }
    }
    res.status(200).end();
  } catch (err) {
    console.log(err);
  }
});
app.listen(
  PORT,
  () => console.log("Server Live on Port: " + PORT) /* , "0.0.0.0" */
);
