module.exports = {handle}


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
                }

                break;
            }
    }

    bot.sender.info.session.last_response = "";
    bot.sender.info.session.payload = "";
    bot.sender.info.session.reply_for = "";
    bot.sender.updateSelf();
}