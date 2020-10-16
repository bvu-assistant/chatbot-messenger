module.exports = { send }


async function send(cloner, studentID)
{
    const Bot = require('../../bot');
    let bot = await new Bot(null, cloner);

    let normalScheduleHandler = require('../../../self_modules/normal-schedule-handler');

    
    bot.messageSender.sendSenderAction({recipientID: bot.sender.id, action: 'mark_seen'});
    bot.messageSender.sendText({recipientID: bot.sender.id, content: 'Processing...', typingDelay: 1.35});
}