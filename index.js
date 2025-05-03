const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

const client = new Client();

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ WhatsApp conectado');
});

client.on('message', async (msg) => {
    const texto = msg.body;

    // Filtrar solo si incluye #registro
    if (texto.includes('#registro')) {
        const parteImportante = texto.split('#registro')[1]?.trim();

        if (parteImportante) {
            try {
                await axios.post('https://TU_WEBHOOK_DE_N8N', {
                    texto: parteImportante,
                    remitente: msg.from,
                    fecha: new Date().toLocaleString()
                });
                console.log(`✅ Enviado a n8n: ${parteImportante}`);
            } catch (error) {
                console.error('❌ Error al enviar a n8n:', error.message);
            }
        }
    }
});

client.initialize();
