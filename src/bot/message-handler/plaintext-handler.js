module.exports = {handle}


async function handle(cloner)
{
    const Bot = require('../bot');
    let bot = await new Bot(null, cloner);
    console.log('Bot cloned to "plaintext-handler".');


    switch (bot.receivedText)
    {
        case 'sPM':
            {
                bot.profileHandler.setupPersistentMenu()
                    .then(() =>
                    {
                        bot.messageSender.sendText({recipientID: bot.sender.ID, content: 'Đã cập nhật Persistent Menu.'})
                    })
                    .catch(err =>
                        {
                            console.log(err);
                        });
                break;
            }
        case 'sGRM':
            {
                bot.profileHandler.setupGreetingMessage()
                    .then(() =>
                    {
                        bot.messageSender.sendText({recipientID: bot.sender.ID, content: 'Đã cập nhật Greeting Message.'})
                    })
                    .catch(err =>
                        {
                            console.log(err);
                        });
                break;
            }
        case 'sGM':
            {
                bot.profileHandler.setupGetstartedMessage();
                break;
            }

        case 'M': case 'm':
            {
                bot.blocks.show_functions.send(bot);
                break;
            }

        case 'hi': case 'Hi':
            {
                bot.blocks.reply_to_hi.send(bot);
                break;
            }

        case 'gaui':
            {
                let usersID = Array.from(await bot.sender.getAllUsersID());
                bot.messageSender.sendText({recipientID: bot.sender.ID, content: `Có ${usersID.length} người dùng.`});
                break;
            }
        
        default:
            {
                bot.blocks.defaut_answer.send(bot);
            }
    }
}