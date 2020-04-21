module.exports = { send }


async function send(cloner, pickedDate)
{
    const Bot = require('../../../../bot');
    let bot = await new Bot(null, cloner);
    let MessageBuilder = require('../../../message-builder');
    let builder = new MessageBuilder();


    let eFinder = require('../../../../../self_modules/elearning-finder');
    let classes = Array.from(await eFinder.getClassInEDate(pickedDate));


    while (classes.length)
    {
        let buttons = [];


        if (classes.length >= 3)
        {
            let spliced = classes.splice(0, 3);
            for (let i = 0; i < spliced.length; ++i)
            {
                buttons.push(builder.createButton({
                    type: 'postback',
                    title: `${spliced[i]}`,
                    payload: `GET_EL_${pickedDate}_CLASS_${spliced[i]}`
                }));
            }
        }
        else
        {
            let spliced = classes.splice(0);    //  Lấy hết các phần tử còn lại (lúc này còn nhiều nhất 2 phấn tử)
            for (let i = 0; i < spliced.length; ++i)
            {
                buttons.push(builder.createButton({
                    type: 'postback',
                    title: `${spliced[i]}`,
                    payload: `GET_EL_${pickedDate}_CLASS_${spliced[i]}`
                }));
            }
        }


        let buttonBlock = builder.createButtonTemplate({title: "Chọn lớp", buttons: buttons});
        bot.messageSender.sendMessageObject({recipientID: bot.sender.ID, messageObj: buttonBlock});
    }
}