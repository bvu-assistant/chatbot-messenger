module.exports = { send }
const MessageBuilder = require('../../../message-builder');
const builder = new MessageBuilder();


async function send(cloner)
{
    const Bot = require('../../../../bot');
    let bot = await new Bot(null, cloner);


    let buttonBlock_1 = [
        builder.createButton({type: 'postback', payload: 'HEADLINE_LOOKINGUP', title: 'Tin chính'}),
        builder.createButton({type: 'postback', payload: 'STUDENTNEWS_LOOKINGUP', title: 'Tin tức sinh viên'})
    ];
    let newsLookingUp_button_template = builder.createButtonTemplate({title: 'Tin tức', buttons: buttonBlock_1});


    let buttonBlock_2 = [
        builder.createButton({type: 'postback', payload: 'TESTSCHEDULE_LOOKINGUP', title: 'Lịch thi'}),
        builder.createButton({type: 'postback', payload: 'NORMALSCHEDULE_LOOKINGUP', title: 'Lịch học trên lớp'}),
        builder.createButton({type: 'postback', payload: 'ELEARNING_LOOKINGUP', title: 'Lịch học E-Learning'})
    ];
    let scheduleLookingUp_button_template = builder.createButtonTemplate({title: 'Tra cứu lịch', buttons: buttonBlock_2});


    let buttonBlock_3 = [
        builder.createButton({type: 'postback', payload: 'LIABILITY_LOOKINGUP', title: 'Công nợ'}),
        builder.createButton({type: 'postback', payload: 'MARKS_LOOKINGUP', title: 'Điểm học tập'})
    ];
    let infoLookingUp_button_template = builder.createButtonTemplate({title: 'Tra cứu thông tin', buttons: buttonBlock_3});


    bot.messageSender.sendMessageObject({recipientID: bot.sender.ID, messageObj: newsLookingUp_button_template});
    bot.messageSender.sendMessageObject({recipientID: bot.sender.ID, messageObj: scheduleLookingUp_button_template});
    bot.messageSender.sendMessageObject({recipientID: bot.sender.ID, messageObj: infoLookingUp_button_template});
}