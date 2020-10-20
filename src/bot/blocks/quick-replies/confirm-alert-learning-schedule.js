module.exports = { send }


async function send(cloner, enabled = false)
{
    const Bot = require('../../bot');
    let bot = await new Bot(null, cloner);


    let quickrelies = [];
    let quickReplyTemplate = {};


    if (enabled) {
        quickrelies.push(bot.builder.createQuickReply({
            title: 'Huỷ đăng ký',
            content_type: 'text',
            image_url: 'https://tinyurl.com/yatzb2nw',
            payload: 'CANCEL_ALERT_LEARNING_SCHEDULE'
        }));

        quickReplyTemplate = bot.builder.createQuickRepliesTemplate({
            title: 'Bạn đã đăng ký Nhận thông báo Lịch học.', 
            quickReplies: quickrelies
        });

        setTimeout(() => {
            bot.messageSender.sendMessageObject({recipientID: bot.sender.id, messageObj: quickReplyTemplate});
        }, 1750);
    }
    else {
        quickrelies = [
            bot.builder.createQuickReply({
                content_type: 'text',
                title: 'Có',
                image_url: 'https://tinyurl.com/ya8crapy',
                payload: 'CONTINUE_ALERT_LEARNING_SCHEDULE'
            }),
            bot.builder.createQuickReply({
                title: 'Không',
                content_type: 'text',
                image_url: 'https://tinyurl.com/yatzb2nw',
                payload: ''
            })
        ];

        quickReplyTemplate = bot.builder.createQuickRepliesTemplate({
            title: 'Tiến hành đăng ký ?', 
            quickReplies: quickrelies
        });

        setTimeout(() => {
            bot.messageSender.sendMessageObject({recipientID: bot.sender.id, messageObj: quickReplyTemplate});
        }, 1750);
    }
    
}