module.exports = { send }


async function send(cloner)
{
    const Bot = require('../../bot');
    let bot = await new Bot(null, cloner);
    let builder = bot.builder;


    let buttonBlock_1 = [
        builder.createButton({type: 'postback', payload: 'HEADLINE_LOOKINGUP', title: '📰 Tin tức chính'}),
        builder.createButton({type: 'postback', payload: 'STUDENTNEWS_LOOKINGUP', title: '📢 Tin tức sinh viên'})
    ];
    let newsLookingUp_button_template = builder.createButtonTemplate({title: 'Tin tức', buttons: buttonBlock_1});



    let buttonBlock_2 = [
        builder.createButton({type: 'postback', payload: 'TESTSCHEDULE_LOOKINGUP', title: '📝 Lịch thi'}),
        builder.createButton({type: 'postback', payload: 'THISWEEKSCHEDULE_LOOKINGUP', title: '📚 Lịch học tuần này'})
    ];
    let scheduleLookingUp_button_template = builder.createButtonTemplate({title: 'Tra cứu lịch', buttons: buttonBlock_2});


    let buttonBlock_3 = [
        builder.createButton({type: 'postback', payload: 'TODAYSCHEDULE_LOOKINGUP', title: '📖 Lịch học hôm nay'}),
        builder.createButton({type: 'postback', payload: 'TOMORROWSCHEDULE_LOOKINGUP', title: '📖 Lịch học ngày mai'})
    ];
    let scheduleLookingUp_button_template_1 = builder.createButtonTemplate({title: 'Tra cứu lịch học', buttons: buttonBlock_3});



    let buttonBlock_4 = [
        builder.createButton({type: 'postback', payload: 'LIABILITY_LOOKINGUP', title: '💵 Công nợ'}),
        builder.createButton({type: 'postback', payload: 'MARKS_LOOKINGUP', title: '💯 Điểm học tập'})
    ];
    let infoLookingUp_button_template = builder.createButtonTemplate({title: 'Tra cứu thông tin', buttons: buttonBlock_4});


    
    bot.messageSender.sendMessageObject({recipientID: bot.sender.id, messageObj: newsLookingUp_button_template});
    bot.messageSender.sendMessageObject({recipientID: bot.sender.id, messageObj: scheduleLookingUp_button_template});
    bot.messageSender.sendMessageObject({recipientID: bot.sender.id, messageObj: scheduleLookingUp_button_template_1});
    bot.messageSender.sendMessageObject({recipientID: bot.sender.id, messageObj: infoLookingUp_button_template});
}