module.exports = { send }


async function send(cloner, doing)
{
    try
    {
        const Bot = require('../../../../bot');
        let bot = await new Bot(null, cloner);
    

        bot.sender.replyFor('StudentID', doing)
            .then( () =>
            {
                bot.messageSender.sendText({
                    recipientID: bot.sender.ID, 
                    content: 'Nhập mã sinh viên.\n\n Ví dụ: 18033747',
                    typingDelay: 1.25
                });
            })
            .catch(err =>
                {
                    console.log(err);
                });
    }
    catch (err)
    {
        console.log(err);
    }
}