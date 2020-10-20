module.exports = {handle}
require('dotenv/config');


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
        case 'NEXTWEEKSCHEDULE_LOOKINGUP':
            {
                bot.blocks.get_student_id.send(bot, 'NEXTWEEKSCHEDULE_LOOKINGUP');
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
                bot.blocks.ask_for_saving_id.send(bot);
                break;
            }

        case 'AUTO_ALERT_LEARNING_SCHEDULE':
            {
                if (bot.sender.info.auto_alert_learning_schedule) {
                    bot.blocks.ask_for_alert_learning_schedule.send(bot, bot.sender.info.auto_alert_learning_schedule.enabled);
                }
                else {
                    bot.sender.info.auto_alert_learning_schedule = {
                        enabled: false
                    }

                    bot.sender.updateSelf()
                        .then(() => {
                            bot.blocks.ask_for_alert_learning_schedule.send(bot, false);
                        })
                        .catch(err => {
                            console.log(err);
                            bot.messageSender.sendText({recipientID: bot.sender.id, content: process.env.ERROR_MESSAGE, typingDelay: 1.35});
                        })
                }

                break;
            }

        default:
            {
                bot.messageSender.sendText({recipientID: bot.sender.id, content: 'Chưa xử lý'});
            }
    }
}