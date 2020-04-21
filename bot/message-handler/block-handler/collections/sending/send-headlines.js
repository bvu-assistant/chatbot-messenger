module.exports = { send }


async function send(cloner)
{
    const Bot = require('../../../../bot');
    let bot = await new Bot(null, cloner);

    let newsScraper = require('../../../../../self_modules/news-handler');
    let headlinesTemplate = await newsScraper.renderHeadlinesTemplate();

    bot.messageSender.sendMessageObject({recipientID: bot.sender.ID, messageObj: headlinesTemplate, typingDelay: 0.1});
}