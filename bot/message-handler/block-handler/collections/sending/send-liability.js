module.exports = { send }


async function send(cloner, studentID)
{
    const Bot = require('../../../../bot');
    let bot = await new Bot(null, cloner);
    let liabilityHanlder = require('../../../../../self_modules/liability-handler');

    bot.messageSender.sendSenderAction({recipientID: bot.sender.ID, action: 'typing_on'});
    bot.messageSender.sendMessageObject({recipientID: bot.sender.ID, messageObj: await liabilityHanlder.renderLiabilityTemplate(studentID)});
}