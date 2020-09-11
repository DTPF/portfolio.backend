const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const User = require("../models/user");

function signUp(req, res) {
  const user = new User();

  const { name, lastName, email, password, repeatPassword } = req.body;
  user.name = name;
  user.lastName = lastName;
  user.email = email.toLowerCase();
  user.role = "admin";
  user.active = false;

  if (!password || !repeatPassword) {
    res.status(404).send({ message: "Las contraseñas son obligatorias." });
  } else {
    if (password !== repeatPassword) {
      res
        .status(404)
        .send({ message: "Las contraseñas tienen que ser iguales." });
    } else {
      bcrypt.hash(password, null, null, function (err, hash) {
        if (err) {
          res
            .status(500)
            .send({ message: "Error al encriptar la contraseña." });
        } else {
          user.password = hash;
          user.save((err, userStored) => {
            if (err) {
              res.status(500).send({ message: "El usuario ya existe." });
            } else {
              if (!userStored) {
                res.status(404).send({ message: "Error al crear el usuario." });
              } else {
                res.status(200).send({ user: userStored });
              }
            }
          });
        }
      });
    }
  }
}

function signIn(req, res) {
  const params = req.body;
  const email = params.email.toLowerCase();
  const password = params.password;

  User.findOne({ email }, (err, userStored) => {
    if (err) {
      res.status(500).send({ message: "Error del servider." });
    } else {
      if (!userStored) {
        res.status(404).send({ message: "Usuario no encontrado." });
      } else {
        bcrypt.compare(password, userStored.password, (err, check) => {
          if (err) {
            res.status(500).send({ message: "Error del servidor." });
          } else if (!check) {
            res.status(404).send({ message: "La contraseña es incorrecta." });
          } else {
            if (!userStored.active) {
              res
                .status(200)
                .send({ code: 200, message: "El usuario no se ha activado." });
            } else {
              res.status(200).send({
                accessToken: jwt.createAccessToken(userStored),
                refreshToken: jwt.createRefreshToken(userStored),
              });
            }
          }
        });
      }
    }
  });
}

function getUsers(req, res) {
  User.find().then((users) => {
    if (!users) {
      res.status(404).send({ message: "No se ha encontrado ningún usuario" });
    } else {
      res.status(200).send({ users });
    }
  });
}

function getUsersActive(req, res, next) {
  const query = req.query;
  User.find({ active: query.active }).then((users) => {
    if (!users) {
      res
        .status(404)
        .send({ message: "No se ha encontrado ningún usuario activo" });
    } else {
      res.status(200).send({ users });
    }
  });
}

function uploadAvatar(req, res) {
  const params = req.params;

  User.findById({ _id: params.id }, (err, userData) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!userData) {
        res
          .status(404)
          .send({ message: "No se ha encontrado ningún usuario." });
      } else {
        let user = userData;
        const avatarNameOld = user.avatar;
        const filePathOld = "./uploads/avatar/" + avatarNameOld;
        // Si no tiene avatar
        if (avatarNameOld === undefined) {
          if (req.files) {
            let filePath = req.files.avatar.path;
            let fileSplit = filePath.split("/");
            let fileName = fileSplit[2];

            let extSplit = fileName.split(".");
            let fileExt = extSplit[1];

            if ( fileExt !== "png" && fileExt !== "jpg" && fileExt !== "jpeg" && fileExt !== "JPG" ) {
              res.status(400).send({
                message:
                  "La extensión de la imagen no es válida. (Extensiones permitidas: .png y .jpg)",
              });
            } else {
              user.avatar = fileName;
              User.findByIdAndUpdate(
                { _id: params.id },
                user,
                (err, userResult) => {
                  if (err) {
                    res.status(500).send({ message: "Error del servidor." });
                  } else {
                    if (!userResult) {
                      res
                        .status(404).send({ message: "No se ha encontrado ningún usuario." });
                    } else {
                      res.status(200).send({ avatarName: fileName });
                    }
                  }
                }
              );
            }
          }
        } 
        // Si tiene avatar eliminamos el avatar anterior
        else {
          if (req.files) {
            let filePath = req.files.avatar.path;
            let fileSplit = filePath.split("/");
            let fileName = fileSplit[2];

            let extSplit = fileName.split(".");
            let fileExt = extSplit[1];

            if ( fileExt !== "png" && fileExt !== "jpg" && fileExt !== "jpeg" && fileExt !== "JPG" ) {
              res.status(400).send({
                message:
                  "La extensión de la imagen no es válida. (Extensiones permitidas: .png y .jpg)",
              });
            } else {
              user.avatar = fileName;
              User.findByIdAndUpdate(
                { _id: params.id },
                user,
                (err, userResult) => {
                  if (err) {
                    res.status(500).send({ message: "Error del servidor." });
                  } else {
                    if (!userResult) {
                      res.status(404).send({ message: "No se ha encontrado ningún usuario." });
                    } else {
                      fs.unlinkSync(filePathOld);
                      res.status(200).send({ avatarName: fileName });
                    }
                  }
                }
              );
            }
          }
        }
      }
    }
  });
}

function getAvatar(req, res) {
  const avatarName = req.params.avatarName;
  const filePath = "./uploads/avatar/" + avatarName;

  fs.exists(filePath, (exists) => {
    if (!exists) {
      res.status(404).send({ message: "El avatar que buscas no existe." });
    } else {
      res.sendFile(path.resolve(filePath));
    }
  });
}

async function updateUser(req, res) {
  let userData = req.body;
  userData.email = req.body.email.toLowerCase();
  const params = req.params;

  if (userData.password) {
    await bcrypt.hash(userData.password, null, null, (err, hash) => {
      if (err) {
        res.status(500).send({ message: "Error al encriptar la contraseña." });
      } else {
        userData.password = hash;
      }
    });
  }

  User.findByIdAndUpdate({ _id: params.id }, userData, (err, userUpdate) => {
    if(err) {
      if(err.codeName === "DuplicateKey") {
        res.status(500).send({ message: "Este email ya existe en la base de datos.", status: 500 });
      } else {
        res.status(500).send({ message: "Error del servidor.", status: 500 });
      }
    } else {
      if (!userUpdate) {
        res.status(404).send({ message: "No se ha encontrado ningún usuario.", status: 404 });
      } else {
        res.status(200).send({ message: "Usuario actualizado correctamente.", status: 200 });
      }
    }
  });
}

function activateUser(req, res) {
  const { id } = req.params;
  const { active } = req.body;

  User.findByIdAndUpdate(id, { active }, (err, userStored) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!userStored) {
        res.status(404).send({ message: "No se ha encontrado el usuario." });
      } else {
        if (active === true) {
          res.status(200).send({ message: "Usuario activado correctamente." });
        } else {
          res
            .status(200)
            .send({ message: "Usuario desactivado correctamente." });
        }
      }
    }
  });
}

function deleteUser(req, res) {
  const { id } = req.params;

  User.findByIdAndRemove(id, (err, userDelete) => {
    const avatarPath = userDelete.avatar;
    const filePathToDelete = "./uploads/avatar/" + avatarPath;
    if (err) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!userDelete) {
        res.status(404).send({ message: "Usuario no encontrado." });
      } else {
        res
          .status(200)
          .send({ message: "El usuario ha sido eliminado correctamente" });
        if (avatarPath !== undefined) {
          fs.unlinkSync(filePathToDelete);
        }
      }
    }
  });
}

module.exports = {
  signUp,
  signIn,
  getUsers,
  getUsersActive,
  uploadAvatar,
  getAvatar,
  updateUser,
  activateUser,
  deleteUser,
};
