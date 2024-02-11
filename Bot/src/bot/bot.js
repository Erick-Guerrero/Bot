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

const validarNumeroAction = addKeyword(["validar"]).addAction(
  async (ctx, { database, provider }) => {
    try {
      const phoneNumber = ctx.from;
      const userNumber = ctx.body; // El número que el usuario envía

      // Consulta Axios a la base de datos para validar el número
      const response = await axios.post('https://erick-guerrero-back-production.up.railway.app/checkTicket', {
        checkTicket: userNumber,
      });

      const isValid = response.data;

      console.log(isValid);

      if (isValid) {
        // El número es válido
        await provider.sendMessage(phoneNumber, "¡Número válido! Gracias por participar.");
      } else {
        // El número no es válido
        await provider.sendMessage(phoneNumber, "Lo siento, el número no es válido. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al validar el número:", error);
    }
  }
);

const flowSecundario = addKeyword(["siguiente"]).addAnswer([
  "📄 Aquí tenemos el flujo secundario",
]);

const opcion1 = addKeyword(["1"]).addAnswer(
  [
    "Para más detalles, visita: https://erick-guerrero-front.vercel.app/",
  ],
  null,
  null,
  [flowSecundario]
);

const opcion2 = addKeyword(["2"]).addAnswer(
  [
    "Por favor, envía un número para validar la información.",
  ],
  null,
  null,
  [validarNumeroAction]
);

const opcion3 = addKeyword(["3"]).addAnswer(
  [
    "La Quiniela se lleva a cabo todos los días del año con horarios específicos establecidos por entidades autorizadas. Los tres números ganadores se eligen aleatoriamente y se anuncian en el establecimiento o se pueden consultar en el sitio web www.fortunenumber.com.",
  ],
  null,
  null,
  [flowSecundario]
);

const opcion4 = addKeyword(["4"]).addAction(
  async (ctx, { database, provider }) => {
    // Este bloque se ejecutará cuando se invoque la palabra clave "comprobante"
    try {
      // Obtener el número de teléfono del cliente
      const phoneNumber = ctx.from;

      // Consulta Axios a la otra base de datos

      //http://localhost:3002/getData

      //https://erick-guerrero-back-production.up.railway.app/getData

  const response = await axios.post('http://localhost:3002/getData', {
    phoneNumber: phoneNumber,
  });

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
      message += `\nPara más detalles, visita: https://erick-guerrero-front.vercel.app/`;

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
      "Te comparto los siguientes enlaces de interés sobre el proyecto:",
      "1. Quiero jugar, aprende a jugar aqui:",
      "\nhttps://erick-guerrero-front.vercel.app/comojugar.",
      "2. ¿Gane? revisa tus numeros aqui:",
      "https://erick-guerrero-front.vercel.app/eresganador",
      "3. Qué loterías juegan? conoce mas:",
      "https://erick-guerrero-front.vercel.app/",
      "4. Para ver tus tickets envie la palabra tickets",
      "5. Correo de contacto: norwichandcompany@gmail.com"
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
