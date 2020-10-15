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

        case 'LIABILITY_LOOKINGUP':
            {
                bot.blocks.get_student_id.send(bot, 'LIABILITY_LOOKINGUP');
                break;
            }
        
        case 'NORMALSCHEDULE_LOOKINGUP':
            {
                bot.messageSender.sendText({recipientID: bot.sender.ID, content: 'Chức năng đang phát triển. Vui lòng quay lại sau.'});
                break;
            }
        case 'MARKS_LOOKINGUP':
            {
                bot.blocks.get_student_id.send(bot, 'MARKS_LOOKINGUP');
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