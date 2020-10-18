module.exports = {handle}


async function handle(cloner)
{
    const Bot = require('../bot');
    let bot = await new Bot(null, cloner);
    console.log('Bot cloned to "plaintext-handler".');


    //  đánh dấu đã xem cho mọi tin nhắn văn bản gửi cho Bot
    bot.messageSender.sendSenderAction({recipientID: bot.sender.id, action: 'mark_seen'});


    switch (bot.receivedText)
    {
        case 'sPM':
            {
                bot.profileHandler.setupPersistentMenu()
                    .then(() =>
                    {
                        bot.messageSender.sendText({recipientID: bot.sender.id, content: 'Đã cập nhật Persistent Menu.'})
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
                        bot.messageSender.sendText({recipientID: bot.sender.id, content: 'Đã cập nhật Greeting Message.'})
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
        case 'hello': case 'Hello': 
        case 'chào': case 'Chào':
            {
                bot.blocks.reply_to_hi.send(bot);
                break;
            }
        
        default:
            {
                bot.blocks.defaut_answer.send(bot);
            }
    }
}