module.exports = { send }


async function send(cloner, studentID)
{
    const Bot = require('../../bot');
    let bot = await new Bot(null, cloner);


    bot.messageSender.sendSenderAction({recipientID: bot.sender.id, action: 'mark_seen'});
    bot.messageSender.sendSenderAction({recipientID: bot.sender.id, action: 'typing_on'});

    let scheduleHandler = require('../../../self_modules/test-schedule-handler');
    let testScheduleTemplate = Array.from(await scheduleHandler.renderTestScheduleTemplate(studentID));


    testScheduleTemplate.forEach((value, index) => {
        setTimeout(() => {
            bot.messageSender.sendMessageObject({recipientID: bot.sender.id, messageObj: value});
        }, 2000 + index * 750);
    });

    if (testScheduleTemplate.length === 0) {
        bot.messageSender.sendText({recipientID: bot.sender.id, content: 'Không có kết quả.', typingDelay: 2.5});
    }


    setTimeout(() => {
        bot.blocks.continue_test_schedule.send(bot);
    }, 3000 + testScheduleTemplate.length * 750);
}
