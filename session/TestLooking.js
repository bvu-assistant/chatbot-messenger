

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
        let testSchedules = await _student.getTestSchedule(bot.receivedText);
        if (testSchedules.length === 0)
        {
            bot.sendText(bot.sender.ID, "Không tìm được lịch thi.\n\nMã sinh viên không tồn tại, hoặc máy chủ đang quá tải.");
            askForContinue();
        }
        else
        {
            askForContinue(testSchedules);
            testSchedules.forEach(element =>
            {
                bot.sendMessage(bot.sender.ID, element);
            });
        }


        
        function askForContinue(testSchedules, delaySeconds = 1.5)
        {
            if (testSchedules)
            {
                doGenerateICS(testSchedules);
            }

            
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

        
        function doGenerateICS(testSchedules)
        {
            console.log('First schedule:', testSchedules.slice(0, 1));


            const ics = require('ics');
            const { error, value } = ics.createEvents([
                {
                    title: 'Lunch',
                    start: [2018, 1, 15, 12, 15],
                    duration: { minutes: 45 }
                },
                {
                    title: 'Dinner',
                    start: [2018, 1, 15, 12, 15],
                    duration: { hours: 1, minutes: 30 }
                }
            ])
            
            if (error) {
                console.log(error)
                return
            }
            
            console.log(value)
        }
    }
}


