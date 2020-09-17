const Contact = require("../models/contact");

function contactMe(req, res) {
  const contact = new Contact();
  const { email, name, subject } = req.body;
  contact.email = email.toLowerCase();
  contact.name = name;
  contact.subject = subject;
  contact.readed = false;
  contact.date = contact.date;

  if (!email && !subject) {
    res.status(404).send({
      status: 404,
      message: "El email y el asunto son obligatorios.",
    });
  } else if (!email) {
    res.status(404).send({
      status: 404,
      message: "El email es obligatorio.",
    });
  } else if (!subject) {
    res.status(404).send({
      status: 404,
      message: "El asunto es obligatorio.",
    });
  } else {
    Contact.find({ email: contact.email }, (err, getContact) => {
      let contactsReverse = getContact.reverse();
      let getLastContact = contactsReverse[0];
      if (err) {
        return res.status(500).send({
          status: 500,
          message: "Error al hacer la consulta con la base de datos.",
        });
      } else if (!getLastContact) {
        contact.save((err, contactStored) => {
          if (err) {
            return res
              .status(500)
              .send({ status: 500, message: "Error del servidor." });
          } else if (!contactStored) {
            return res
              .status(404)
              .send({ status: 404, message: "Error al enviar la petición." });
          } else {
            return res
              .status(200)
              .send({ status: 200, contact: contactStored });
          }
        });
      } else if (getLastContact.readed === false) {
        return res.status(404).send({
          status: 404,
          message:
            "Hasta que no lea el último mensaje que has enviado no puedes enviar más.",
        });
      } else {
        contact.save((err, contactStored) => {
          if (err) {
            return res
              .status(500)
              .send({ status: 500, message: "Error del servidor." });
          } else if (!contactStored) {
            return res
              .status(404)
              .send({ status: 404, message: "Error al enviar la petición." });
          } else {
            return res
              .status(200)
              .send({ status: 200, contact: contactStored });
          }
        });
      }
    });
  }
}

function getMessages(req, res) {
  Contact.find()
         .sort({ order: "asc"})
         .exec((err, messagesStored) => {
           console.log(messagesStored);
           if(err) {
             res.status(500).send({ status: 500, message: "Error del servidor." });
           } else if (!messagesStored) {
             res.status(404).send({ status: 404, message: "No hay mensajes en la base de datos." });
           } else {
             res.status(200).send({ status: 200, messages: messagesStored });
           }
         });
}

function getMessagesUnread(req, res) {
  const query = req.query;
  Contact.find({ readed: query.readed })
        .sort({ order: "asc"})
        .exec((err, messagesStored) => {
          console.log(messagesStored);
          if(err) {
            res.status(500).send({ status: 500, message: "Error del servidor." });
          } else if (!messagesStored) {
            res.status(404).send({ status: 404, message: "No hay mensajes en la base de datos." });
          } else {
            res.status(200).send({ status: 200, messages: messagesStored });
          }
        });
}

module.exports = {
  contactMe,
  getMessages,
  getMessagesUnread
};