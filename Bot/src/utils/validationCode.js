// Importa Sequelize para poder utilizarlo en la función
const { v4: uuidv4 } = require('uuid');
const { DataTypes, Op } = require("sequelize");

// Función para generar un código único para un ticket
module.exports = async (Tickets) => {
  let isUnique = false;
  let validationCode;

  // Genera un código único hasta que se encuentre uno que no exista en la base de datos
  while (!isUnique) {
    const randomString = Math.random().toString(36).substring(2, 9);
    const uuidFragment = uuidv4().substring(0, 1);
    validationCode = `${randomString}${uuidFragment}`;

    // Verifica si el código generado ya existe en la base de datos
    const existingTicket = await Tickets.findOne({
      where: {
        validationCode: validationCode
      }
    });

    // Si no existe, marca la bandera como true y termina el bucle
    if (!existingTicket) {
      isUnique = true;
    }
  }

  return validationCode;
};
