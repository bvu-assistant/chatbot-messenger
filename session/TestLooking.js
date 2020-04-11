

module.exports = { handle };
const _bot = require('../bot/bot');
const _builder = require('../bot/MessageBuilder');
const _student = require('../student/student.js');



async function handle(cloner)
{
    let bot = await new _bot("", cloner);
    let builder = new _builder();


    if (bot.hasMessage)
    {
        bot.sender.changeSession("");
        bot.sendTypingAction(bot.sender.ID);


        //  Lấy thông tin lịch thi
        let textTemplates = await _student.getTestSchedule(bot.receivedText);
        if (textTemplates.length === 0)
        {
            bot.sendText(bot.sender.ID, "Không tìm được lịch thi.\n\nMã sinh viên không tồn tại, hoặc máy chủ đang quá tải.");
            askForContinue();
        }
        else
        {
            textTemplates.forEach(element =>
            {
                bot.sendMessage(bot.sender.ID, element);
            });
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
                    "payload":"CONTINUE_TEST_SCHEDULE_LOOKING",
                    "image_url":"https://tinyurl.com/v92omjj"
                },
                {
                    "content_type":"text",
                    "title":"Không",
                    "payload":"CANCEL_TEST_SCHEDULE_LOOKING",
                    "image_url":"https://tinyurl.com/wey7urf"
                }
            ];


            console.log('Sending quickreplies ...');
            let quickrepliesBlock = builder.createQuickReply("Tiếp tục tra cứu lịch thi ?", quickreplies);
            bot.sendMessage(bot.sender.ID, quickrepliesBlock, delaySeconds, "RESPONSE");
        }
    }
}