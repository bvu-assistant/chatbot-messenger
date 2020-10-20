module.exports = { send }


async function send(cloner)
{
    const Bot = require('../../bot');
    let bot = await new Bot(null, cloner);

    bot.messageSender.sendText({
        recipientID: bot.sender.id,
        content: 'Chọn menu ≡ hoặc gõ phím M để xem các chức năng.\n\n',
        typingDelay: 0.75
    });
}