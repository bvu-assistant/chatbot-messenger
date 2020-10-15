module.exports = { send }


async function send(cloner)
{
    const Bot = require('../../bot');
    let bot = await new Bot(null, cloner);


    let quickrelies = [
        bot.builder.createQuickReply({
            content_type: 'text',
            title: 'Có',
            image_url: 'https://tinyurl.com/ya8crapy',
            payload: 'CONTINUE_SCHEDULE_LOOKINGUP'
        }),
        bot.builder.createQuickReply({
            title: 'Không',
            content_type: 'text',
            image_url: 'https://tinyurl.com/yatzb2nw',
            payload: 'CANCEL_TESTSCHEDULE_LOOKINUP'
        })
    ];

    
    let quickReplyTemplate = bot.builder.createQuickRepliesTemplate({title: 'Tiếp tục tra cứu lịch thi ?', quickReplies: quickrelies});
    setTimeout(() => {
        bot.messageSender.sendMessageObject({recipientID: bot.sender.id, messageObj: quickReplyTemplate});
    }, 1750);
}