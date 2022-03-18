const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = "mongodb://127.0.0.1:27017/donations";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

function sendDonation(amount, currency) {
  return new Promise((resolve, reject) => {
    client.connect(async (err) => {
      if (err) reject(err);
      try {
        const donations = await client.db().collection("donations");
        await donations.insertOne({ amount, currency });
        await client.close();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

module.exports = { sendDonation };
