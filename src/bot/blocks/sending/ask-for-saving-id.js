module.exports = { send }


async function send(cloner)
{
    const Bot = require('../../bot');
    let bot = await new Bot(null, cloner);

    if (!bot.sender.info.studentId) {
        let info = 'Bạn chưa đặt mã số sinh viên.\n\nMã này giúp bạn không cần nhập mã sinh viên của mình mỗi khi tra cứu thông tin.';
        bot.messageSender.sendText({recipientID: bot.sender.id, content: info, typingDelay: 1.25});
        setTimeout(() => {
            bot.blocks.continue_saving_id.send(bot);
        }, 1750);
    }
    else {
        let info = `Mã sinh viên của bạn: ${bot.sender.info.studentId}`;
        bot.messageSender.sendText({recipientID: bot.sender.id, content: info, typingDelay: 1.25});
        setTimeout(() => {
            bot.blocks.continue_saving_id.send(bot, true);
        }, 1750);
    }
}