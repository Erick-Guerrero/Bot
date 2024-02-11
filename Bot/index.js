require("dotenv").config();
// const server = require("./src/app.js");
// const { conn } = require("./src/db.js");
// const { PORT } = process.env;
const bot = require("././src/bot/bot.js");

const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MockAdapter = require("@bot-whatsapp/database/mock");

// conn.sync({ force: false }).then(() => {
//   server.listen(3002, async () => {
//     console.log(`Server running...`);

    QRPortalWeb();
//   });
// });
