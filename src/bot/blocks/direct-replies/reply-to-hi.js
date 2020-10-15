module.exports = { send }
require('dotenv/config');


async function send(cloner)
{
    const Bot = require('../../bot');
    let bot = await new Bot(null, cloner);

    bot.messageSender.sendText({
        recipientID: bot.sender.id, 
        content: `Xin chào. Mình là ${process.env.BOT_NAME}.\n\nChọn vào thanh menu ≡ ở dưới cùng để thao tác nhé.`,
        typingDelay: 1.25
    });

    setTimeout(() => {
        bot.blocks.show_functions.send(bot);
    }, 2000);
}