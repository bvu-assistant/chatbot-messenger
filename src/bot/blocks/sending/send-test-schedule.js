module.exports = { send }
const request = require('request');
const path = require('path');
const fs = require('fs');


async function send(cloner, studentID)
{
    const Bot = require('../../bot');
    let bot = await new Bot(null, cloner);


    bot.messageSender.sendSenderAction({recipientID: bot.sender.id, action: 'mark_seen'});
    bot.messageSender.sendSenderAction({recipientID: bot.sender.id, action: 'typing_on'});


    let scheduleHandler = require('../../../self_modules/test-schedule-handler');
    scheduleHandler.renderTestScheduleTemplate(studentID)
        .then(({schedules, fileName}) => {

            // schedules.forEach((value, index) => {
            //     setTimeout(() => {
            //         bot.messageSender.sendMessageObject({recipientID: bot.sender.id, messageObj: value});
            //     }, 2000 + index * 750);
            // });
        
        
            if (schedules.length === 0 ||
                 schedules.length === 1) {
                bot.messageSender.sendText({recipientID: bot.sender.id, content: 'Không có kết quả.', typingDelay: 2.5});
            }
        
        
            setTimeout(() => {
                if (fileName) {

                    request({
                        method: 'POST',
                        url: `https://graph.facebook.com/v9.0/me/message_attachments?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
                        json: {
                            "message":{
                                "attachment":{
                                    "type":"file", 
                                    "payload":{
                                        "is_reusable": true,
                                        url: `http://bvu-assistant.herokuapp.com/test-ics/${studentID}`
                                    }
                                }
                            },
                          //   "filedata": fs.createReadStream(path.resolve(__dirname, '../../../self_modules/test-schedules-csv/', `${18033747}.csv`))
                        },
                      },
                      (err, res, body) => {
                        if (err || (res.statusCode !== 200)) {
                            console.log('error:', err || body);
                        }
                        else {
                            console.log('body:', body);

                            request({
                                method: 'POST',
                                url: `https://graph.facebook.com/v9.0/me/messages?access_token=${bot.access_token}`,
                                json: {
                                    "recipient": {
                                        "id": bot.sender.id,
                                    },
                                    "message":{
                                        "attachment":{
                                            "type":"file", 
                                            "payload":{
                                                "attachment_id": body.attachment_id,
                                            }
                                        }
                                    },
                                }
                            },
                            (merr, mres, mbody) => {
                                if (err || (res.statusCode !== 200)) {
                                    console.log('error:', err || body);
                                }
                                else {
                                    console.log('sent file:', body);
                                }
                            });
                        }
                      });
                }
            }, /*2750 + schedules.length * 750*/ 1000);
        })
        .catch(err => {
            bot.messageSender.sendText({recipientID: bot.sender.id, content: 'Có lỗi trong quá trình xử lý.', typingDelay: 2.5});
        });
}
