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
        bot.messageSender.sendText({
            recipientID: bot.sender.id, 
            content: 'Nhập mã sinh viên.\n\n Ví dụ: 18033747',
            typingDelay: 1.25
        });
    }
    catch (err)
    {
        console.log(err);
    }
}