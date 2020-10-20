module.exports = { send }


async function send(cloner, enabled = false)
{
    const Bot = require('../../bot');
    let bot = await new Bot(null, cloner);

    bot.messageSender.sendText({
        recipientID: bot.sender.id, 
        content: 'Alita sẽ gửi tin nhắn nhắc nhở bạn mỗi khi đến giờ học của môn sắp tới.', 
        typingDelay: 1.75
    });

    setTimeout(() => {
        bot.blocks.confirm_alert_learning_schedule.send(bot, enabled);
    }, 750);
}