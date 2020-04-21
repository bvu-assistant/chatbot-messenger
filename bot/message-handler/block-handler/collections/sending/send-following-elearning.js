module.exports = { send }


async function send(cloner)
{
    const Bot = require('../../../../bot');
    let bot = await new Bot(null, cloner);
    let MessageBuilder = require('../../../message-builder');
    let builder = new MessageBuilder();


    bot.messageSender.sendSenderAction({recipientID: bot.sender.ID, action: 'typing_on'});
    let scheduleHandler = require('../../../../../self_modules/schedule-handler');
    let arr = await scheduleHandler.elearningFinder.getFollowingSchedules();

    

    if (arr.length === 0)    //  Không còn lịch
    {
        bot.messageSender.sendText({recipientID: bot.sender.ID,
            content: "Không có lịch học E-learning nào khả dụng."});
    }
    else
    {
        while (arr.length)
        {
            let buttons = [];


            if (arr.length >= 3)
            {
                let spliced = arr.splice(0, 3);
                for (let i = 0; i < spliced.length; ++i)
                {
                    buttons.push(builder.createButton({
                        type: 'postback',
                        title: `Ngày ${spliced[i]}`,
                        payload: `ELEARNING_${spliced[i]}`
                    }));
                }
            }
            else
            {
                let spliced = arr.splice(0);    //  Lấy hết các phần tử còn lại (lúc này còn nhiều nhất 2 phấn tử)
                for (let i = 0; i < spliced.length; ++i)
                {
                    buttons.push(builder.createButton({
                        type: 'postback',
                        title: `Ngày ${spliced[i]}`,
                        payload: `ELEARNING_${spliced[i]}`
                    }));
                }
            }


            let buttonBlock = builder.createButtonTemplate({title: "Chọn ngày", buttons: buttons});
            bot.messageSender.sendMessageObject({recipientID: bot.sender.ID, messageObj: buttonBlock});
        }
    }
}