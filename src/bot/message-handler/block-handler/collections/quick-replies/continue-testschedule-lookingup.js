module.exports = { send }

const MessageBuilder = require('../../../message-builder');
const builder = new MessageBuilder();



async function send(cloner)
{
    const Bot = require('../../../../bot');
    let bot = await new Bot(null, cloner);


    let quickrelies = [
        builder.createQuickReply({
            content_type: 'text',
            title: 'Có',
            image_url: 'https://tinyurl.com/ya8crapy',
            payload: 'CONTINUE_SCHEDULE_LOOKINGUP'
        }),
        builder.createQuickReply({
            title: 'Không',
            content_type: 'text',
            image_url: 'https://tinyurl.com/yatzb2nw',
            payload: 'CANCEL_TESTSCHEDULE_LOOKINUP'
        })
    ];

    
    let quickReplyTemplate = builder.createQuickRepliesTemplate({title: 'Tiếp tục tra cứu lịch thi ?', quickReplies: quickrelies});
    bot.messageSender.sendMessageObject({recipientID: bot.sender.ID, messageObj: quickReplyTemplate});
}