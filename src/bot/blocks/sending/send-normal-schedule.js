module.exports = { send }
let nsh = require('../../../self_modules/normal-schedule-handler');


async function send({cloner, studentId, type = nsh.ScheduleType.TODAY})
{
    const Bot = require('../../bot');
    let bot = await new Bot(null, cloner);

    
    bot.messageSender.sendSenderAction({recipientID: bot.sender.id, action: 'mark_seen'});
    bot.messageSender.sendSenderAction({recipientID: bot.sender.id, action: 'typing_on'});

    
    nsh.renderNormalSchedulesTemplate({studentId: studentId, type: type})
        .then((messages) => {
            messages = Array.from(messages);

            if (messages.length === 0 || messages.length === 1) {
                bot.messageSender.sendText({recipientID: bot.sender.id, content: 'Không có lịch.', typingDelay: (2500 + messages.length * 750)/1000});
            }

            messages.forEach((value, index) => {
                setTimeout(() => {
                    bot.messageSender.sendMessageObject({recipientID: bot.sender.id, messageObj: value});
                }, 2000 + index * 750);
            });
        })
        .catch((err) => {
            bot.messageSender.sendText({recipientID: bot.sender.id, content: 'Không tra cứu được. Bạn vui lòng kiểm tra trên Website.', typingDelay: (2500 + messages.length * 750)/1000});
        })
}