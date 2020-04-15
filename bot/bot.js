require('dotenv').config();
const request = require('request');
const _user = require('../user/user');



class Bot
{
    #accessToken = process.env.PAGE_ACCESS_TOKEN;       //  Private field - Can only be used in this class
    hasMessage = false;
    isPostBack = false;
    isQuickReply = false;
    receivedText = null;
    payload = null;
    timestamp = null;
    recipientID = null;
    sender = null;


    constructor(webhookRequest, cloner = null)
    {
        return new Promise(async (resolve, reject) =>
        {
            if (cloner === null)
            {
                let messaging = webhookRequest.body.entry[0].messaging[0];
                console.log('————————————————————————————————————————————————————————————————————————————————————————————————');
                console.log('Received messaging:', messaging);
                let senderID = messaging.sender.id;
                this.timestamp = messaging.timestamp;
                this.recipientID = messaging.recipient.id;
                
                
                //  Nếu người dùng gửi tin nhắn văn bản
                if (messaging.message)
                {
                    this.hasMessage = true;
                    let message = messaging.message;
                    this.receivedText = message.text;
    
    
                    if (message.quick_reply)            //  Nếu có nút trả lời (lựa chọn) nhanh
                    {
                        this.isQuickReply = true;
                        if (message.quick_reply.payload)    //  Nếu nút trả lời nhanh có payload
                        {
                            this.payload = message.quick_reply.payload;
                        }
                    }
                }
                else if (messaging.postback)       //  Khi người dùng lựa chọn các Postback
                {
                    this.isPostBack = true;
                    this.payload = messaging.postback.payload;
                }
    

                this.sender = await new _user(senderID);        //  Lấy thông tin User cần nhiều thời gian, do giao tiếp với Database (mongoDB) trên cloud
            }
            else
            {
                Object.assign(this, cloner);
            }

            
            return resolve(this);
        });
    }


    


    sendText(recipientID, content, typingDelay = 0)   //  Show typing action delay in second(s)
    {
        this.sendMessage(recipientID, {text: content}, typingDelay);
    }

    sendMessage(recipientID, messageObj, typingDelay = 0, messaging_type = "")
    {
        console.log('Begin send message for:', recipientID);
        if (typingDelay > 0)
        {
            this.sendTypingAction(recipientID);
        }


        setTimeout(() =>
        {
            request
            (
                {
                    method: 'POST',
                    url: process.env.MESSAGE_API,
                    qs: { access_token: this.#accessToken },
                    json:
                    {
                        recipient: {id: recipientID},
                        messaging_type: messaging_type,
                        message: messageObj,
                    }
                },
                (err, res, body) =>
                {
                    if (err || (res.statusCode !== 200))
                    {
                        console.log(`bot.js:97 - Can\'t send the message objects for: ${recipientID}' — Err:`, err || body);
                    }
                    else
                    {
                        console.log('Sended message objects for:', recipientID);
                    }
                }
            );
        }, typingDelay * 1000);
    }

    sendTypingAction(recipientID)
    {
        request
        (
            {
                method: 'POST',
                url: process.env.MESSAGE_API,
                qs: {access_token: this.#accessToken},
                headers: {'Content-Type': 'application/json'},
                json:
                {
                    "recipient": {"id": recipientID},
                    "sender_action" :"typing_on"
                }
            },
            (err, res, body) =>
            {
                if (err || (res.statusCode !== 200))
                {
                    console.log(`Can\'t send the Typing action for: ${recipientID}' — Err:`, err || body);
                }
                else
                {
                    console.log('Sended typing action for:', recipientID);
                }
            }
        );
    }



    //  Creating profile for ChatBot page
    createPersistentMenu(buttons, disabledComposer = false)
    {
        request
        (
            {
                method: 'POST',
                url: process.env.PROFILE_API,
                qs: {access_token: this.#accessToken},
                headers: {'Content-Type': 'application/json'},
                json:
                {
                    "persistent_menu":
                    [
                        {
                            "locale": "default",
                            "composer_input_disabled": disabledComposer,
                            "call_to_actions": buttons
                        }
                    ]
                }
            },
            (err, res, body) =>
            {
                if (err || (res.statusCode !== 200))
                {
                    console.log('Can\'t create the PersistentMenu buttons. Error:', err || body);
                }
                else
                {
                    console.log('Successfully create the PersistentMenu buttons. Result:', body);
                }
            }
        );
    }

    createGettingStarted()
    {
        request
        (
            {
                method: 'POST',
                url: process.env.PROFILE_API,
                qs: {access_token: this.#accessToken},
                headers: {'Content-Type': 'application/json'},
                json:
                {
                    "get_started":
                    {
                        "payload":"GET_STARTED"
                    }
                }
            },
            (err, res, body) =>
            {
                if (err || (res.statusCode !== 200))
                {
                    console.log('Can\'t create the Getstarted Payload. Error:', err || body);
                }
                else
                {
                    console.log('Successfully create the Getstarted Payload. Result:', body);
                }
            }
        );
    }

    createGreetingMessage(greetingContent)
    {
        /** Allowed to use following phrases in the greetingContent:
         * 
         * {{user_first_name}}
         * {{user_last_name}}
         * {{user_full_name}}
         * 
         */

        request
        (
            {
                method: 'POST',
                url: process.env.PROFILE_API,
                qs: {access_token: this.#accessToken},
                headers: {'Content-Type': 'application/json'},
                json:
                {
                    "greeting":
                    [
                      {
                        "locale":"default",
                        "text": greetingContent
                      }
                    ]
                }
            },
            (err, res, body) =>
            {
                if (err || (res.statusCode !== 200))
                {
                    console.log('Can\'t create the GreetingMessage. Error:', err || body);
                }
                else
                {
                    console.log('Successfully create the GreetingMessage. Result:', body);
                }
            }
        );
    }

}




module.exports = Bot;