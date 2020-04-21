module.exports = { send }
const MessageBuilder = require('../../../message-builder');
const builder = new MessageBuilder();


async function send(cloner)
{
    const Bot = require('../../../../bot');
    let bot = await new Bot(null, cloner);


    bot.messageSender.sendText({
        recipientID: bot.sender.ID, 
        content: 'Xin chào. Mình là Hyena.\n\nChọn vào thanh menu ≡ ở dưới cùng để thao tác nhé.',
        typingDelay: 1.25
    });


    setTimeout(() => {
        bot.blocks.show_functions.send(bot);
    }, 1.75);
}