module.exports = { send }


async function send(cloner, studentID)
{
    const Bot = require('../../bot');
    let bot = await new Bot(null, cloner);

    let normalScheduleHandler = require('../../../self_modules/normal-schedule-handler');

    
    bot.messageSender.sendSenderAction({recipientID: bot.sender.id, action: 'mark_seen'});
    bot.messageSender.sendText({recipientID: bot.sender.id, content: 'Processing...', typingDelay: 1.35});


    let messages = await normalScheduleHandler.renderThisWeekSchedulesMessage(studentID);
    messages = Array.from(messages);

    
    if (messages.length === 0) {
        bot.messageSender.sendText({recipientID: bot.sender.id, content: 'No result...', typingDelay: 1.35});
    }
    else {
        messages.forEach((value, index) => {
            bot.messageSender.sendMessageObject({recipientID: bot.sender.id, messageObj: value});
        });
    }
}