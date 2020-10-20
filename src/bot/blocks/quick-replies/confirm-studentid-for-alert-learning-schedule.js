module.exports = { send }


async function send(cloner)
{
    const Bot = require('../../bot');
    let bot = await new Bot(null, cloner);


    let quickrelies = [];
    let quickReplyTemplate = {};


    quickrelies.push(bot.builder.createQuickReply({
        title: 'Tiếp tục',
        content_type: 'text',
        image_url: 'https://tinyurl.com/ya8crapy',
        payload: 'CONFIRM_STUDENTID_FOR_ALERT_LEARNING_SCHEDULE'
    }));
    quickrelies.push(bot.builder.createQuickReply({
        title: 'Huỷ bỏ',
        content_type: 'text',
        image_url: 'https://tinyurl.com/yatzb2nw',
        payload: ''
    }));

    quickReplyTemplate = bot.builder.createQuickRepliesTemplate({
        title: 'Bạn đã chắc chắn về Mã số của mình ?', 
        quickReplies: quickrelies
    });

    setTimeout(() => {
        bot.messageSender.sendMessageObject({recipientID: bot.sender.id, messageObj: quickReplyTemplate});
    }, 750);
    
}