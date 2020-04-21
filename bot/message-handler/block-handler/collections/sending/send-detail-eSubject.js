module.exports = { send }


async function send(cloner, pickedDate, pickedClass)
{
    const Bot = require('../../../../bot');
    let bot = await new Bot(null, cloner);
    let MessageBuilder = require('../../../message-builder');
    let builder = new MessageBuilder();
    let eFinder = require('../../../../../self_modules/elearning-finder');


    bot.messageSender.sendText({recipientID: bot.sender.ID, content: `Đang tìm kiếm lịch E-Learning...\n\nNgày: ${pickedDate}.\nLớp: ${pickedClass}.`});
    let subjects = await eFinder.findELearningSchedule(pickedClass, pickedDate);
    let templates = await eFinder.renderElearningTemplate(subjects, pickedDate);

    
    templates.forEach((value, index) =>
    {
        bot.messageSender.sendMessageObject({recipientID: bot.sender.ID, messageObj: value});
    });
}