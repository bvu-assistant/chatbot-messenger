module.exports = {handle}
let nsh = require('../../self_modules/normal-schedule-handler');


async function handle(cloner)
{
    const Bot = require('../bot');
    let bot = await new Bot(null, cloner);
    console.log('Bot cloned to "user-reply-handler".');


    switch (bot.sender.info.session.reply_for)
    {
        case 'StudentID':
            {

                switch (bot.sender.info.session.payload)
                {
                    case 'TESTSCHEDULE_LOOKINGUP':
                        {
                            bot.blocks.send_test_schedule.send(bot, bot.sender.info.session.last_response);
                            break;
                        }
                    
                    case 'LIABILITY_LOOKINGUP':
                        {
                            bot.blocks.send_liability.send(bot, bot.sender.info.session.last_response);
                            break;
                        }
                    
                    case 'MARKS_LOOKINGUP':
                        {
                            bot.blocks.send_summary_marks.send(bot, bot.sender.info.session.last_response);
                            break;
                        }


                    case 'THISWEEKSCHEDULE_LOOKINGUP':
                        {
                            bot.blocks.send_normal_schedule.send({cloner: bot, studentId: bot.sender.info.session.last_response, type: nsh.ScheduleType.THIS_WEEK});
                            break;
                        }
                    case 'NEXTWEEKSCHEDULE_LOOKINGUP':
                        {
                            bot.blocks.send_normal_schedule.send({cloner: bot, studentId: bot.sender.info.session.last_response, type: nsh.ScheduleType.NEXT_WEEK});
                            break;
                        }
                    case 'TODAYSCHEDULE_LOOKINGUP':
                        {
                            bot.blocks.send_normal_schedule.send({cloner: bot, studentId: bot.sender.info.session.last_response, type: nsh.ScheduleType.TODAY});
                            break;
                        }
                    case 'TOMORROWSCHEDULE_LOOKINGUP':
                        {
                            bot.blocks.send_normal_schedule.send({cloner: bot, studentId: bot.sender.info.session.last_response, type: nsh.ScheduleType.TOMORROW});
                            break;
                        }


                    case 'SAVING_ID': {
                        bot.sender.info.studentId = bot.sender.info.session.last_response;
                        bot.sender.updateSelf()
                            .then(() => {
                                bot.messageSender.sendText({recipientID: bot.sender.id, content: '✔️ Đã lưu mã sinh viên của bạn.', typingDelay: 1.35});
                            })
                            .catch(err => {
                                console.log(err);
                                bot.messageSender.sendText({recipientID: bot.sender.id, content: '❌ Có lỗi xảy ra.', typingDelay: 1.35});
                            });
                        break;
                    }
                }

                break;
            }
    }

    bot.sender.info.session.last_response = "";
    bot.sender.info.session.payload = "";
    bot.sender.info.session.reply_for = "";
    bot.sender.updateSelf();
}