const axios = require('axios');
const { WHATSAPP_TOKEN } = process.env;

module.exports = async (to, templateName, languageCode, messageVariables) => {
  try {

    const whatsappPayload = {
      messaging_product: 'whatsapp',
      to: to,
      type: 'template',
      sender_name: 'Fortune Numbers',
      template: {
        name: templateName,
        language: {
          code: languageCode,
        },
        components: [
          {
            type: 'body',
            parameters: messageVariables,
          },
        ],
      },
    };

    const response = await axios.post('https://graph.facebook.com/v17.0/131712886701836/messages', whatsappPayload, {
      headers: {
        'Authorization': WHATSAPP_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
