

module.exports = { handle };
const _bot = require('../bot/bot');
const _builder = require('../bot/message-builder');
const _student = require('../student/student.js');




async function handle(cloner)
{
    let bot = await new _bot("", cloner);
    let builder = new _builder();


    if (bot.hasMessage)
    {
        bot.sender.changeSession("");
        bot.sendTypingAction(bot.sender.ID);
        let liability = await _student.getLiability(bot.receivedText);


        if (liability === undefined)
        {
            bot.sendText(bot.sender.ID, "Không tìm được công nợ.\n\nMã sinh viên không tồn tại, hoặc máy chủ đang quá tải.");
            askForContinue();
        }
        else
        {
            bot.sendText(bot.sender.ID, liability);
            askForContinue();
        }


        function askForContinue(delaySeconds = 1.5)
        {
            //  Hỏi xem có tiếp tục tìm không
            let quickreplies = 
            [
                {
                    "content_type":"text",
                    "title":"Có",
                    "payload":"CONTINUE_LIABILITY_LOOKING",
                    "image_url":"https://tinyurl.com/v92omjj"
                },
                {
                    "content_type":"text",
                    "title":"Không",
                    "payload":"CANCEL_LIABILITY_LOOKING",
                    "image_url":"https://tinyurl.com/wey7urf"
                }
            ];


            console.log('Sending quickreplies ...');
            let quickrepliesBlock = builder.createQuickReply("Tiếp tục tra cứu công nợ ?", quickreplies);
            bot.sendMessage(bot.sender.ID, quickrepliesBlock, delaySeconds, "RESPONSE");
        }
    }
}