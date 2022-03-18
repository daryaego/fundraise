function checkDonateBody(body) {
  return (
    body.hasOwnProperty("amount") &&
    body.hasOwnProperty("currency") &&
    body.amount > 0
  );
}

module.exports = { checkDonateBody };
