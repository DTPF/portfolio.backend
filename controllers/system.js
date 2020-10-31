function connection(req, res) {
  return res
    .status(200)
    .send({ status: 200 });
}

module.exports = {
  connection,
};
