module.exports = { send }


async function send(cloner)
{
    const Bot = require('../../../../bot');
    let bot = await new Bot(null, cloner);

    bot.messageSender.sendSenderAction({recipientID: bot.sender.ID, action: 'typing_on'});
    let newsScraper = require('../../../../../self_modules/news-handler');
    let headlinesTemplate = await newsScraper.renderHeadlinesTemplate();

    bot.messageSender.sendMessageObject({recipientID: bot.sender.ID, messageObj: headlinesTemplate});
}