module.exports = { send }


async function send(cloner, studentID)
{
    const Bot = require('../../../../bot');
    let bot = await new Bot(null, cloner);



    bot.messageSender.sendSenderAction({recipientID: bot.sender.ID, action: 'typing_on'});
    let scheduleHandler = require('../../../../../self_modules/schedule-handler');
    let testScheduleTemplate = Array.from(await scheduleHandler.renderTestScheduleTemplate(studentID));


    await testScheduleTemplate.forEach((value, index) =>
    {
        bot.messageSender.sendMessageObject({recipientID: bot.sender.ID, messageObj: value});
    });


    setTimeout(() => {
        bot.blocks.continue_test_schedule.send(bot);
    }, 1275);
}
