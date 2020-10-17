module.exports = { send }
let nsh = require('../../../self_modules/normal-schedule-handler');


async function send({cloner, studentId, type = nsh.ScheduleType.TODAY})
{
    const Bot = require('../../bot');
    let bot = await new Bot(null, cloner);

    
    bot.messageSender.sendSenderAction({recipientID: bot.sender.id, action: 'mark_seen'});
    bot.messageSender.sendText({recipientID: bot.sender.id, content: 'Đang xử lý...', typingDelay: 1.35});


    let messages = await nsh.renderNormalSchedulesTemplate({studentId: studentId, type: type});
    messages = Array.from(messages);

    
    if (messages.length === 0) {
        bot.messageSender.sendText({recipientID: bot.sender.id, content: 'Không có kết quả.', typingDelay: 1.35});
    }
    else {
        messages.forEach((value, index) => {
            setTimeout(() => {
                bot.messageSender.sendMessageObject({recipientID: bot.sender.id, messageObj: value});
            }, 2000 + index * 750);
        });
    }
}