const request = require('request');
require('dotenv/config');



class MessageSender
{
    #access_token = process.env.PAGE_ACCESS_TOKEN;
    constructor()
    {

    }



    sendText({recipientID, content, typingDelay = 0})   //  Show typing action, delay in second(s)
    {
        this.sendMessageObject({recipientID: recipientID, messageObj: {text: content}, typingDelay: typingDelay});
    }
    
    sendMessageObject({recipientID, messageObj, typingDelay = 0})
    {
        console.log('■■■ Begin send message for:', recipientID, messageObj);
    
    
        //  send the typing action if required
        if (typingDelay > 0)
        {
            setTimeout(() => {
                this.sendSenderAction({recipientID: recipientID, action: 'typing_on'});
            }, 750);
        }
    
    
        setTimeout(() =>
        {
            request
            (
                {
                    method: 'POST',
                    url: process.env.MESSAGE_API,
                    qs: { access_token: this.#access_token },
                    json:
                    {
                        recipient: {id: recipientID},
                        messaging_type: 'RESPONSE',
                        message: messageObj
                    }
                },
                (err, res, body) =>
                {
                    if (err || (res.statusCode !== 200))
                    {
                        console.log(`■■■ bot.js:120 - Can\'t send the message objects for: ${recipientID}' — Err:`, err || body);
                    }
                    else
                    {
                        console.log('■■■ Sended message objects for:', recipientID);
                    }
                }
            );
        }, typingDelay * 1000);
    }
    
    
    /**
     * Making sender actions, like typing action, mark as seen...
     * @param {*} recipientID the ID of facebook user who will receive this action.
     * @param {*} action One of: typing_on | typing_off | mark_seen
     */
    sendSenderAction({recipientID, action})
    {
        request
        (
            {
                method: 'POST',
                url: process.env.MESSAGE_API,
                qs: {access_token: this.#access_token},
                headers: {'Content-Type': 'application/json'},
                json:
                {
                    recipient: {id: recipientID},
                    sender_action: action
                }
            },
            (err, res, body) =>
            {
                if (err || (res.statusCode !== 200))
                {
                    console.log(`■■■ Can\'t send the ${action} action for: ${recipientID}' — Err:`, err || body);
                }
                else
                {
                    console.log(`■■■ Sended ${action} action for:`, recipientID);
                }
            }
        );
    }
    
}


module.exports = MessageSender;