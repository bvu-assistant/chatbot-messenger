module.exports = { send }


async function send(cloner, doing)
{
    try
    {
        const Bot = require('../../bot');
        let bot = await new Bot(null, cloner);
        console.log('Bot cloned to "get-student-id"');
    

        bot.sender.info.session.reply_for = "StudentID";
        bot.sender.info.session.payload = doing;
        bot.sender.updateSelf()
            .then(() => {
                if (bot.sender.info.studentId) {
                    let showIdChips = bot.builder.createQuickReply({
                        content_type: 'text',
                        title: bot.sender.info.studentId,
                        image_url: 'https://tinyurl.com/ya8crapy',
                        payload: ''
                    });
        
                    let quickReplyTemplate = bot.builder.createQuickRepliesTemplate({title: 'Nhập mã sinh viên.\n\nVí dụ: 18033747', quickReplies: showIdChips});
                    bot.messageSender.sendMessageObject({recipientID: bot.sender.id, messageObj: quickReplyTemplate});
                }
                else {
                    bot.messageSender.sendText({
                        recipientID: bot.sender.id, 
                        content: 'Nhập mã sinh viên.\n\nVí dụ: 18033747',
                        typingDelay: 1.25
                    });
                }
            })
            .catch(err => {
                console.log(err);
                bot.messageSender.sendText({recipientID: bot.sender.id, content: 'Có lỗi xảy ra', typingDelay: 1.25});
            });
    }
    catch (err)
    {
        console.log(err);
    }
}