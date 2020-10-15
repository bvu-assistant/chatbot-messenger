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
    }
}