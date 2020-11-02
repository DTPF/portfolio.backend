const Utils = require("../models/utils");

function connection(req, res) {
  return res.status(200).send({ status: 200 });
}

function createUtil(req, res) {
  const util = new Utils();
  util.id = 1;
  util.reloadMessages = true;
  util.save((err, utilStored) => {
    if (err) {
      res.status(400).send({ status: 400, message: "El util ya existe." });
    } else {
      if (!utilStored) {
        res.status(404).send({ status: 404, message: "Error al crear el útil." });
      } else {
          res.status(200).send({ status: 200, message: "Útil creado correctamente.", utilStored: utilStored });
        }
      }    
  });
}

function messagesStatus(req, res) {
  Utils.findOne({id: 1}).exec((err, statusStored) => {
    if (err) {
      res.status(500).send({ status: 500, message: "Error del servidor." });
    } else {
      if (!statusStored) {
        res.status(404).send({
          status: 404,
          message: "Error al enviar los parámetros."
        });
      } else {
        res.status(200).send({ messagesStatus: statusStored.reloadMessages });
      }
    }
  });
}

function reloadMessagesTrue(req, res) {
  Utils.findOneAndUpdate({id: 1}, {reloadMessages: true}, (err, reload) => {
    if (err) {
      res.status(500).send({ status: 500, message: "Error del servidor." });
    } else {
      if (!reload) {
        res.status(404).send({ status: 404, message: "Error al enviar los parámetros." });
      } else {
        res.status(200).send({ status: 200, message: "Mensaje enviado." });
      }
      
    }
  });
}

function reloadMessagesFalse(req, res) {
  Utils.findOneAndUpdate({id: 1}, {reloadMessages: false}, (err, reload) => {
    if (err) {
      res.status(500).send({ status: 500, message: "Error del servidor." });
    } else {
      if (!reload) {
        res.status(404).send({ status: 404, message: "No hay parámetro." });
      } else {
        res.status(200).send({ status: 200, message: "Mensaje leído." });
      }
    }
  });
}

module.exports = {
  connection,
  reloadMessagesTrue,
  reloadMessagesFalse,
  messagesStatus,
  createUtil
};
