module.exports = {handle}


async function handle(cloner)
{
    const Bot = require('../bot');
    let bot = await new Bot(null, cloner);
    console.log('Bot cloned to "user-reply-handler".');


    switch (bot.sender.ReplyFor)
    {
        case 'StudentID':
            {
                await bot.sender.replyFor(null, null);
                switch (bot.sender.DoIng)
                {
                    case 'TESTSCHEDULE_LOOKINGUP':
                        {
                            bot.blocks.send_test_schedule.send(bot, bot.sender.LastResponse);
                            break;
                        }
                    
                    case 'LIABILITY_LOOKINGUP':
                        {
                            bot.blocks.send_liability.send(bot, bot.sender.LastResponse);
                            break;
                        }
                }

                break;
            }
    }
}