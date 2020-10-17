module.exports = {handle}


async function handle(cloner)
{
    const Bot = require('../bot');
    let bot = await new Bot(null, cloner);
    console.log('Bot cloned to "quick-reply-handler".');


    switch (bot.payload)
    {
        case 'CONTINUE_SCHEDULE_LOOKINGUP':
            {
                bot.blocks.get_student_id.send(bot, 'TESTSCHEDULE_LOOKINGUP');
                break;
            }
        
        case 'CONTINUE_SAVING_ID':
            {
                bot.blocks.get_student_id.send(bot, 'SAVING_ID');
                break;
            }

        case 'DELETE_SAVING_ID':
            {
                bot.sender.info.studentId = '';
                bot.sender.updateSelf()
                    .then(() => {
                        bot.messageSender.sendText({recipientID: bot.sender.id, content: '✔️ Đã xoá bỏ mã sinh viên của bạn.', typingDelay: 1.35});
                    })
                    .catch(err => {
                        console.log(err);
                        bot.messageSender.sendText({recipientID: bot.sender.id, content: '❌ Có lỗi xảy ra.', typingDelay: 1.35});
                    });

                break;
            }
    }
}