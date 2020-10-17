module.exports = {handle}


async function handle(cloner)
{
    const Bot = require('../bot');
    let bot = await new Bot(null, cloner);
    console.log('Bot cloned to "postback-handler".');


    switch (bot.payload)
    {
        case 'GET_STARTED':
            {
                bot.blocks.reply_to_hi.send(bot);
                break;
            }
        

        case 'HEADLINE_LOOKINGUP':
            {
                bot.blocks.show_headlines.send(bot);
                break;
            }
        case 'STUDENTNEWS_LOOKINGUP':
            {
                bot.blocks.show_studentNews.send(bot);
                break;
            }
        

        case 'TESTSCHEDULE_LOOKINGUP':
            {
                bot.blocks.get_student_id.send(bot, 'TESTSCHEDULE_LOOKINGUP');
                break;
            }
        case 'THISWEEKSCHEDULE_LOOKINGUP':
            {
                bot.blocks.get_student_id.send(bot, 'THISWEEKSCHEDULE_LOOKINGUP');
                break;
            }
        case 'TODAYSCHEDULE_LOOKINGUP':
            {
                bot.blocks.get_student_id.send(bot, 'TODAYSCHEDULE_LOOKINGUP');
                break;
            }
        case 'TOMORROWSCHEDULE_LOOKINGUP':
            {
                bot.blocks.get_student_id.send(bot, 'TOMORROWSCHEDULE_LOOKINGUP');
                break;
            }


        case 'LIABILITY_LOOKINGUP':
            {
                bot.blocks.get_student_id.send(bot, 'LIABILITY_LOOKINGUP');
                break;
            }
        case 'MARKS_LOOKINGUP':
            {
                bot.blocks.get_student_id.send(bot, 'MARKS_LOOKINGUP');
                break;
            }
            

        case 'SAVING_ID':
            {
                if (!bot.sender.info.studentId) {
                    let info = 'Bạn chưa đặt mã số sinh viên.\n\nMã này giúp bạn không cần nhập mã sinh viên của mình mỗi khi tra cứu thông tin.';
                    bot.messageSender.sendText({recipientID: bot.sender.id, content: info, typingDelay: 1.25});
                    bot.blocks.continue_saving_id.send(bot);
                }
                else {
                    let info = `Mã sinh viên của bạn: ${bot.sender.info.studentId}`;
                    bot.messageSender.sendText({recipientID: bot.sender.id, content: info, typingDelay: 1.25});
                    bot.blocks.continue_saving_id.send(bot, true);
                }

                break;
            }


        case 'NEW_ELEARNING_SCHEDULE':
            {
                //  Saky Naga là tài khoản sẽ gửi postback này đến Bot ==> Bot thông tin cho tài khoản biết.
                bot.messageSender.sendText({recipientID: bot.sender.ID, content: 'Đang gửi lịch E-Learning mới cho các thành viên...'});
                break;
            }

        default:
            {
                
            }
    }
}