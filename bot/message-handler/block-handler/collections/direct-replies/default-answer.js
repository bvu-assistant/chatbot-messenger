module.exports = { send }


async function send(cloner)
{
    const Bot = require('../../../../bot');
    let bot = await new Bot(null, cloner);

    bot.messageSender.sendText({
        recipientID: bot.sender.ID,
        content: 'Chọn menu ≡ để thao tác.\n\nVui lòng không nhập nội dung spam.',
        typingDelay: 0.75
    });
}