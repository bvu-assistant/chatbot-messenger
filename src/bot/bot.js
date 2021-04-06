require('dotenv').config();
const profileHanlder = require('./bot-profile-handler');
const messageSender = require('./message-handler/message-sender');
const messageBuilder = require('./message-handler/message-builder');
const blocks_handler = require('./blocks/blocks-handler');
const facebook_user = require('../models/user');
const firebaseAdmin = require('../self_modules/firebase/firebase-instance');
const request = require('request');


class Bot
{
    access_token = process.env.PAGE_ACCESS_TOKEN;       //  Private field - Can only be used in this class

    constructor(webhookRequest, cloner = undefined)
    {
        if (cloner !== undefined)
        {
            return cloner;
        }

        this.isNewsAdded = false;
        this.mockData = undefined;
        this.profileHandler = new profileHanlder();
        this.messageSender = new messageSender();
        this.blocks = blocks_handler;
        this.is_echo = false;
        this.hasMessage = false;
        this.isPostBack = false;
        this.isQuickReply = false;
        this.receivedText = undefined;
        this.payload = undefined;
        this.timestamp = undefined;
        this.recipientID = undefined;
        this.attachments = undefined;
        this.sender = undefined;
        this.waitingFor = undefined;
        this.builder = new messageBuilder();
        this.nlp = undefined;


        return new Promise( async(resolve, reject) =>
        {
            if (cloner !== undefined)    //  cloner là một instance đã được khởi tạo của bot  ==> gán tham chiếu
            {
                return resolve(cloner);
            }

            console.log(webhookRequest.body);

            //  news has just added
            if (webhookRequest.body.isNewsAdded) {
                this.isNewsAdded = true;
                this.mockData = webhookRequest.body.mockData;
                return resolve(this);
            }

            
            let messaging = webhookRequest.body.entry[0].messaging[0];
            console.log('\n\n■■■ Received messaging:', messaging);
            console.log('\n■■■ Initializing bot...');
            console.log(messaging);

            this.recipientID = messaging.recipient.id;
            this.timestamp = messaging.timestamp;
            let senderID = messaging.sender.id;
            
            
            //  Nếu người dùng gửi tin nhắn văn bản
            if (messaging.message)
            {
                this.hasMessage = true;
                let message = messaging.message;


                if (message.is_echo)        //  reply from bot to user
                {
                    this.is_echo = true;
                    console.log('Unable to initialize the bot. Nothing changes. Reason: is_echo');
                    return reject(undefined);
                }

                if (message.attachments)
                {
                    this.attachments = message.attachments;
                }

                if (message.text)
                {
                    this.receivedText = message.text;
                }

                if (message.nlp) {
                    this.nlp = message.nlp;
                    console.log('\n\nnlp:', this.nlp, this.nlp.entities);
                }

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
            else
            {
                console.log('\n■■■ Unable to initialize the bot. Nothing changes.');
                return reject(undefined);  //  unable to initialize the bot
            }


            this.sender = await new facebook_user(senderID);  //  Lấy thông tin User cần nhiều thời gian


            this.waitingFor = this.sender.info.session.payload;
            if (this.sender.info.session.payload !== null &&
                this.sender.info.session.payload !== '') {  //  cập nhật câu trả lời trong session
                this.sender.info.session.last_response = this.receivedText || '';
                this.sender.updateSelf();
            }

            return resolve(this);
        });
    }


    /**
     * Begin handle the conversation between bot with user.
     */
    process()
    {
        if (this.isNewsAdded) {
            this.sendNewsBroadcast();
            return;
        }


        //  luôn đánh dấu đã đọc
        this.messageSender.sendSenderAction({recipientID: this.sender.id, action: 'mark_seen'});


        if (this.sender.info.session.payload !== null && this.sender.info.session.payload !== '')
        {
            //  ghi đè sự kiện postback khi đang trong luồng Reply
            if (this.isPostBack)
            {
                this.sender.info.session.reply_for = '';
                this.sender.updateSelf();
            }
            else {
                if (this.isQuickReply) {
                    this.handleQuickReply();
                    return;
                }

                this.handleUserReply();
                return;
            }
        }

        if (this.isPostBack === true)
        {
            this.handlePostBack();
            return;
        }

        if (this.isQuickReply === true)
        {
            this.handleQuickReply();
            return;
        }

        if (this.receivedText !== undefined)
        {
            this.handlePlainText();
            return;
        }
    }


    handlePlainText()
    {
        let plain_text_handler = require('./message-handler/plaintext-handler');
        plain_text_handler.handle(this);
    }

    handleUserReply()
    {
        let user_reply_handler = require('./message-handler/user-reply-handler');
        user_reply_handler.handle(this);
    }

    handlePostBack()
    {
        let postback_handler = require('./message-handler/postback-handler');
        postback_handler.handle(this);
    }

    handleQuickReply()
    {
        let quick_reply_handler = require('./message-handler/quick-reply-handler');
        quick_reply_handler.handle(this);
    }


    sendNewsBroadcast() {
        console.log('mock data...', this.mockData);
        const view_url = `${process.env.VIEWER_HOST}/${this.mockData.Id}`;

        const generic = this.builder.createGeneric({
            title: this.mockData.Title,
            subtitle: this.mockData.Date,
            image_url: 'https://i.imgur.com/okwgAyw.jpg',
            default_action: this.builder.createDefaultAction({
                url: this.mockData.Link
            }),
            buttons: [
                this.builder.createButton({
                    type: 'web_url',
                    webview_height_ratio: "tall",
                    url: this.mockData.Link,
                    title: 'Truy cập'
                }),
                this.builder.createButton({
                    type: 'web_url',
                    "webview_height_ratio": "tall",
                    url: view_url,
                    title: 'Xem nhanh'
                }),
            ]
        });

        console.log(generic);
        this.sendBroadcast({message: this.builder.createGenericTemplate({
            elements: generic,
        })});
    }

    sendBroadcast({message}) {
        this.getAllUsersId()
            .then((users) => {

                let delay = 1000;
                users.forEach(data => {
                    let id = data.val()['id'];
                    console.log(id);

                    setTimeout(() => {
                        // this.messageSender.sendMessageObject({recipientID: id, messageObj: message, typingDelay: 1.5});

                        request({
                            method: 'POST',
                            url: process.env.MESSAGE_API,
                            qs: { access_token: this.access_token },
                            json: {
                                recipient: {id: id},
                                messaging_type: "MESSAGE_TAG",
                                tag: "CONFIRMED_EVENT_UPDATE",
                                message: message,
                            },
                        },
                        (err, res, body) => {
                            if (err || (res.statusCode !== 200)) {
                                console.log(`■■■ bot.js:270 - Can\'t send the broadcast message for: ${id}' — Err:`, err || body);
                            }
                            else {
                                console.log('■■■ Sended message objects for:', id);
                            }
                        });

                        delay += 1000;
                    }, delay);
                });
            })
            .catch((err) => {
                console.log('Error during sending Broadcast.\n', err);
            });
    }

    getAllUsersId() {
        return new Promise((resolve, reject) => {
            firebaseAdmin.facebookRealtimeDbRef.once('value',
                (snapshot) => {
                return resolve(snapshot);
            },
                (error) => {
                return reject(error.message);
            });
        });
    }
    
}


module.exports = Bot;