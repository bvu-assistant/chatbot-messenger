module.exports = { send }


async function send(cloner, studentID)
{
    const Bot = require('../../../../bot');
    let bot = await new Bot(null, cloner);
    let markHandler = require('../../../../../self_modules/mark-handler');


    bot.messageSender.sendSenderAction({recipientID: bot.sender.ID, action: 'typing_on'});
    let markTemplate = await markHandler.renderSummaryMarks(studentID);
    bot.messageSender.sendMessageObject({recipientID: bot.sender.ID, messageObj: markTemplate});
}