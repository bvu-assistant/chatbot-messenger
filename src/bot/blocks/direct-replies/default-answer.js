module.exports = { send }


async function send(cloner)
{
    const Bot = require('../../bot');
    let bot = await new Bot(null, cloner);

    bot.messageSender.sendText({
        recipientID: bot.sender.id,
        content: 'Chọn menu ≡ hoặc gõ phím M để chọn các chức năng.\n\nVui lòng không nhập nội dung spam.',
        typingDelay: 0.75
    });
}