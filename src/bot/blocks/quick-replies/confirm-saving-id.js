module.exports = { send }


async function send(cloner, reset = false)
{
    const Bot = require('../../bot');
    let bot = await new Bot(null, cloner);


    let quickrelies = [
        bot.builder.createQuickReply({
            content_type: 'text',
            title: 'Có',
            image_url: 'https://tinyurl.com/ya8crapy',
            payload: 'CONTINUE_SAVING_ID'
        }),
        bot.builder.createQuickReply({
            title: 'Không',
            content_type: 'text',
            image_url: 'https://tinyurl.com/yatzb2nw',
            payload: 'CANCEL_SAVING_ID'
        })
    ];


    if (reset) {
        quickrelies.push(bot.builder.createQuickReply({
            title: 'Xoá mã',
            content_type: 'text',
            image_url: 'https://tinyurl.com/y3of838b',
            payload: 'DELETE_SAVING_ID'
        }));
    }

    
    let quickReplyTemplate = bot.builder.createQuickRepliesTemplate({title: reset? 'Đặt lại mã sinh viên ?': 'Tiến hành đặt Mã Sinh viên ?', quickReplies: quickrelies});
    setTimeout(() => {
        bot.messageSender.sendMessageObject({recipientID: bot.sender.id, messageObj: quickReplyTemplate});
    }, 1750);
}