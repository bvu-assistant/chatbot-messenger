module.exports = { send }


async function send(cloner, changes)
{
    try
    {
        const Bot = require('../../../../bot');
        let bot = await new Bot(null, cloner);
        let MessageBuilder = require('../../../message-builder');
        let builder = new MessageBuilder();
    
        let template = await renderNewScheduleTemplate(changes);
        let allUsersID = Array.from(await bot.sender.getAllUsersID());
        

        console.log('\n\nTemplate:', template);
        console.log('Users:', allUsersID, allUsersID.length, '\n\n');


        await bulkSendToAllUser(template, allUsersID);
        bot.messageSender.sendText({recipientID: bot.sender.ID, content: `Đã gửi xong thông báo E-Learning cho người dùng.`});
    
    
        
        async function bulkSendToAllUser()
        {
            try
            {
                while (allUsersID.length)
                {
                    let spliced = (allUsersID.length >= 10) ? (allUsersID.splice(0, 10)):(allUsersID.splice(0));
                    spliced.forEach((id, index) =>
                    {
                        console.log('\n\nSending new -schedule for:', id);
                        bot.messageSender.sendText({recipientID: id, content: `Đã có ${changes.length} lịch học E-Learning mới.`});
                        bot.messageSender.sendMessageObject({recipientID: id, messageObj: template});
                    });
                }
            }
            catch (err)
            {
                console.log(err);
            }
        }
    }
    catch (err)
    {
        console.log(err);
    }
}



async function renderNewScheduleTemplate(changes)
{
    try
    {
        let MessageBuilder = require('../../../message-builder');
        let builder = new MessageBuilder();
        let eFinder = require('../../../../../self_modules/elearning-finder');
        let arr = Array.from(changes);


        let stream = await new Promise((resolve, reject) =>
        {
            let elems = [];
            arr.forEach( async(change, index) =>
            {
                let subtitle = await eFinder.getDateName(change.Date);
                elems.push(builder.createGeneric({
                    title: `E-Learning ngày ${change.Date}`,
                    subtitle: subtitle,
                    image_url: 'https://i.imgur.com/jaPexPt.jpg',
                    buttons: [
                        builder.createButton({
                            title: 'Tải xuống',
                            type: 'web_url',
                            url: change.Link
                        }),
                        builder.createButton({
                            title: 'Tra cứu',
                            type: 'postback',
                            payload: `ELEARNING_${change.Date}`
                        })
                    ]
                }));


                if (index === arr.length - 1)
                {
                    // console.log('elems:', elems);
                    return resolve(elems);
                }
            });
        });
    

        // console.log('\n\nTemplate:', stream);
        return builder.createGenericTemplate({elements: stream});
    }
    catch (err)
    {
        console.log(err);
    }
}