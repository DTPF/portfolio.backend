const mongoose = require("mongoose");
const app = require("./app");
const { API_VERSION, IP_SERVER, PORT_DB, PORT_SERVER } = require("./config");

mongoose.set("useFindAndModify", false);
mongoose.connect(
  `mongodb://${IP_SERVER}:${PORT_DB}/davidthomaspizarrofrick`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, res) => {
    if (err) {
      throw err;
    } else {
      console.log("La conexión a la base de datos es correcta");
      app.listen(PORT_SERVER, () => {
        console.log(`http://${IP_SERVER}:${PORT_SERVER}/api/${API_VERSION}`);
      });
    }
  }
);
