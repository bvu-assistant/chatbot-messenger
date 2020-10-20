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

        case 'CONTINUE_ALERT_LEARNING_SCHEDULE': {
            if (bot.sender.info.studentId) {
                bot.messageSender.sendText({recipientID: bot.sender.id, content: `Mã sinh viên của bạn là: ${bot.sender.info.studentId}`});
                setTimeout(() => {
                    bot.blocks.confirm_studentid_for_learning_schedule.send(bot);
                }, 450);
            }
            else {
                bot.blocks.ask_for_saving_id.send(bot);
            }

            break;
        }

        case 'CONFIRM_STUDENTID_FOR_ALERT_LEARNING_SCHEDULE': {
            bot.sender.info.auto_alert_learning_schedule.enabled = true;
            bot.sender.updateSelf()
                .then(() => {
                    bot.messageSender.sendText({recipientID: bot.sender.id, content: 'Đã đăng ký.', typingDelay: 1.35});
                })
                .catch(() => {
                    bot.messageSender.sendText({recipientID: bot.sender.id, content: 'Có lỗi xảy ra', typingDelay: 1.35});
                });
            break;
        }

        case 'CANCEL_ALERT_LEARNING_SCHEDULE': {
            bot.sender.info.auto_alert_learning_schedule.enabled = false;
            bot.sender.updateSelf()
                .then(() => {
                    bot.messageSender.sendText({recipientID: bot.sender.id, content: 'Đã huỷ.', typingDelay: 1.35});
                })
                .catch(() => {
                    bot.messageSender.sendText({recipientID: bot.sender.id, content: 'Có lỗi xảy ra', typingDelay: 1.35});
                });
            break;
        }

        default: {
            bot.messageSender.sendText({recipientID: bot.sender.id, content: 'Chưa xử lý'});
        }
    }
}