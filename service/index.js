const express = require("express");
const { sendDonation } = require("./dbHelper");
const app = express();
const port = 3000;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  console.log(
    `${req.method} ${req.path} with body: ${JSON.stringify(req.body)}`
  );
  next();
});

const currencies = ["USD", "EUR", "GBP", "RUB"];
function checkBody(body) {
  if (typeof body?.amount !== "number" || body?.amount <= 0) {
    return "Amount must be more than 0";
  }
  if (
    typeof body?.currency !== "string" ||
    !currencies.find((currency) => currency === body.currency)
  ) {
    return `${body.currency} is not allowed as currency`;
  }
}

function getResponse(error) {
  return {
    ok: !error,
    error,
  };
}

app.post("/donate", (req, res) => {
  const checkError = checkBody(req.body);
  if (checkError) {
    res.send(getResponse(checkError));
    return;
  }

  const { amount, currency } = req.body;
  sendDonation(amount, currency)
    .then(() => {
      res.send(getResponse());
    })
    .catch((error) => {
      res.status(500).send(getResponse(error));
    });
});

app.listen(port, () => {
  console.log(`Service is listening on port ${port}`);
});
