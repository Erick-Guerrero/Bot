const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
} = require("@bot-whatsapp/bot");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MockAdapter = require("@bot-whatsapp/database/mock");
const moment = require("moment");
const { Op } = require("sequelize");
const axios = require('axios');

const adapterDB = new MockAdapter();

const opcion4 = addKeyword(["4"]).addAction(
  async (ctx, { database, provider }) => {
    // Este bloque se ejecutará cuando se invoque la palabra clave "comprobante"
    try {
      // Obtener el número de teléfono del cliente
      const phoneNumber = ctx.from;

      // Consulta Axios a la otra base de datos

      //http://localhost:3002/getData

      //https://back-production-3b46.up.railway.app/getData

  const response = await axios.post('https://back-production-3b46.up.railway.app/getData', {
    phoneNumber: phoneNumber,
  });

  // Los datos obtenidos estarán en response.data
  const tickets = response.data;


  const ticketDetails = Array.isArray(tickets.data) ? tickets.data.map((ticket) => {
    return {
        lotteryName: ticket.lotteryName,
        lotteryHr: ticket.lotteryHr,
        validationCode: ticket.validationCode,
        day: moment(ticket.createdAt).format("YYYY-MM-DD"),
        hr: moment(ticket.createdAt).format("HH:mm:ss"),
        id: ticket.idTicket,
        total: ticket.total,
        numbers: ticket.TicketNumbers.map((tn) => ({
            number: tn.number,
            bet: tn.bet,
        })),
    };
}) : [];

      let prov = provider.getInstance();

      // Construir el mensaje en formato Markdown
      let message = `*Detalles de los comprobantes para el ${moment().format(
        "YYYY-MM-DD"
      )}*\n\n`;

      message += `*Fortune Numbers*\n\n`;

      ticketDetails.forEach((ticket) => {
        message += `*Fecha:* ${ticket.day}\n`;
        message += `*Hora:* ${ticket.hr}\n`;
        message += `*ID del Ticket:* ${ticket.id}\n`;
        message += `*N. Validacion:* ${ticket.validationCode}\n`;
        message += `*Loteria:* ${ticket.lotteryName} - ${ticket.lotteryHr}\n\n`;
        message += `*Números Apostados:*\n\n`;

        ticket.numbers.forEach((number) => {
          message += `- Número: ${
            number.number === 100
              ? "00"
              : number.number.toString().padStart(2, "0")
          } - Monto: ${number.bet.toString().padStart(3, "")}\n`;
        });

        message += `\n*Total Ticket:* ${ticket.total}`;
        message += "\n\n------------------\n\n"; // Separador entre tickets
      });

      // Agregar la URL al final del mensaje
      message += `\nPara más detalles, visita: https://www.pegatres.app/`;

      // Enviar el mensaje formateado al cliente
      await provider.sendMessage(phoneNumber, message, {
        contentType: "text/markdown",
      });
    } catch (error) {
      console.error("Error al generar el comprobante:", error);
    }
  }
);

const opcion6 = addKeyword(["4","tickets"]).addAction(
  async (ctx, { database, provider }) => {
    // Este bloque se ejecutará cuando se invoque la palabra clave "comprobante"
    try {
      // Obtener el número de teléfono del cliente
      const phoneNumber = ctx.from;

      // Consulta Axios a la otra base de datos

      //http://localhost:3002/getData

      //https://back-production-3b46.up.railway.app/

      //https://back-production-3b46.up.railway.app/getData
      //https://prueba-back-production-ec63.up.railway.app/

  const response = await axios.post('https://back-production-3b46.up.railway.app/getData', {
    phoneNumber: phoneNumber,
  });

        // // Verificar si la respuesta indica que el cliente no fue encontrado
        // if (response.data.message === "Cliente no encontrado") {
        //   await provider.sendMessage(phoneNumber, "El cliente no existe.");
        //   return;
        // }
  
        // // Verificar si no hay tickets para el cliente
        // if (response.data.message === "No se encontraron tickets para el cliente") {
        //   await provider.sendMessage(phoneNumber, "No tiene tickets comprados el día de hoy.");
        //   return;
        // }

  // Los datos obtenidos estarán en response.data
  const tickets = response.data;


      const ticketDetails = tickets.data.map((ticket) => {
        return {
          lotteryName: ticket.lotteryName,
          lotteryHr: ticket.lotteryHr,
          validationCode: ticket.validationCode,
          day: moment(ticket.createdAt).format("YYYY-MM-DD"),
          hr: moment(ticket.createdAt).format("HH:mm:ss"),
          id: ticket.idTicket,
          total: ticket.total,
          numbers: ticket.TicketNumbers.map((tn) => ({
            number: tn.number,
            bet: tn.bet,
          })),
        };
      });

      let prov = provider.getInstance();

      // Construir el mensaje en formato Markdown
      let message = `*Detalles de los comprobantes para el ${moment().format(
        "YYYY-MM-DD"
      )}*\n\n`;

      message += `*Fortune Numbers*\n\n`;

      ticketDetails.forEach((ticket) => {
        message += `*Fecha:* ${ticket.day}\n`;
        message += `*Hora:* ${ticket.hr}\n`;
        message += `*ID del Ticket:* ${ticket.id}\n`;
        message += `*N. Validacion:* ${ticket.validationCode}\n`;
        message += `*Loteria:* ${ticket.lotteryName} - ${ticket.lotteryHr}\n\n`;
        message += `*Números Apostados:*\n\n`;

        ticket.numbers.forEach((number) => {
          message += `- Número: ${
            number.number === 100
              ? "00"
              : number.number.toString().padStart(2, "0")
          } - Monto: ${number.bet.toString().padStart(3, "")}\n`;
        });

        message += `\n*Total Ticket:* ${ticket.total}`;
        message += "\n\n------------------\n\n"; // Separador entre tickets
      });

      // Agregar la URL al final del mensaje
      message += `\nPara más detalles, visita: https://www.pegatres.app/`;

      // Enviar el mensaje formateado al cliente
      await provider.sendMessage(phoneNumber, message, {
        contentType: "text/markdown",
      });
    } catch (error) {
      console.error("Error al generar el comprobante:", error);
    }
  }
);

const flowPrincipal = addKeyword(["hola", "ole", "alo", "fortune"])
  .addAnswer("Hola! Soy Adrián, tu asistente y estoy aquí para ayudarte en lo que necesites:*")
  .addAnswer(
    [
      "Te comparto los siguientes enlaces de interés sobre Pega3:",
      "1. Aprende a jugar aquí:",
      "\nhttps://www.pegatres.app/comojugar",
      "2. ¿Gane? revisa tus números aquí:",
      "\nhttps://www.pegatres.app/eresganador",
      "3. ¿Qué sorteos existen? conoce más:",
      "\nhttps://www.pegatres.app/sorteos",
      "4. Para ver tus tickets envíe la palabra tickets o pulse 4.",
    
    ],
    async (ctx, { provider }) => {},
    null,
    [ opcion4]
  );

const adapterFlow = createFlow([flowPrincipal]);

const adapterProvider = createProvider(BaileysProvider);
const bot = createBot({
  flow: adapterFlow,
  provider: adapterProvider,
  database: adapterDB,
});

module.exports = bot;
