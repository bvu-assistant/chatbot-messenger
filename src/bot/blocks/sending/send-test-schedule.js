module.exports = { send }


async function send(cloner, studentID)
{
    const Bot = require('../../bot');
    let bot = await new Bot(null, cloner);


    bot.messageSender.sendSenderAction({recipientID: bot.sender.id, action: 'mark_seen'});
    bot.messageSender.sendSenderAction({recipientID: bot.sender.id, action: 'typing_on'});

    let scheduleHandler = require('../../../self_modules/test-schedule-handler');
    let testScheduleTemplate = Array.from(await scheduleHandler.renderTestScheduleTemplate(studentID));


    testScheduleTemplate.forEach((value, index) =>
    {
        (()=> {
            setTimeout(() => {
                bot.messageSender.sendMessageObject({recipientID: bot.sender.id, messageObj: value});
            }, 2000);
        })();
    });


    setTimeout(() => {
        bot.blocks.continue_test_schedule.send(bot);
    }, 1275);
}
