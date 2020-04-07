const _bot = require('./bot');
const _user = require('./user');
const _student = require('./student');
const _builder = require('./MessageBuilder');
const eFinder = require('./student/elearning-finder');
const morgan = require('morgan');
const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');



const app = express();
app.use(morgan('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));
app.listen(3000, () =>
{
    console.log('Assistant server listening on port 3000.');
});


app.get('/', (req, res) =>
{
    res.send('Assistant server running Oke.');
});



//  Xử lí khi Facebook gọi request để Verify token
app.get('/webhook', (req, res) =>
{
    if (req.query['hub.verify_token'] === process.env.VERIFY_TOKEN)
    {
        res.status(200).send(req.query['hub.challenge']);
    }
    else
    {
        res.status(404).send('Error, wrong validation token');
    }
});



// Đoạn code xử lý khi có người nhắn tin cho bot
app.post('/webhook', async function(req, res)
{
    let builder = new _builder();
    let bot = await new _bot(req);  //  Hàng ngàn dòng code phía sau ...
    console.log('BOT:', bot);
    


    if (bot.sender.Session && bot.isPostBack)    //..Khi người dùng xoá cuộc hội thoại, mở lại vẫn còn Session cũ
    {
        if (bot.payload === "GET_STARTED")
        {
            bot.sender.Session = "";
            bot.sender.changeSession("");
        }
    }

    switch (bot.sender.Session)     //  Kiểm tra phiên trò chuyện
    {
        case "TestLooking":
            {
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
                break;
            }

        case "LiabilityLooking":
            {
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
                break;
            }


        default:
            {
                // Nếu người dùng gửi tin nhắn đến
                if (bot.hasMessage)
                {
                    let text = bot.receivedText;
                    switch (text)
                    {
                        case 'ga':  //..get all user ids
                            {
                                let allUserIDs = await _user.getAllUserIDs();
                                console.log('All users id:', allUserIDs);
                                break;
                            }

                        case 'sGM':
                            {
                                setGreetingMessage();
                                break;
                            }

                        case 'sPM':
                            {
                                setPersistentMenu();
                                break;
                            }
                        
                        default:
                        {
                            if (bot.isQuickReply)
                            {
                                switch (bot.payload)
                                {
                                    case "CONTINUE_LIABILITY_LOOKING":
                                    {
                                        startLiailityLooking();
                                        break;
                                    }
                                    case "CONTINUE_TEST_SCHEDULE_LOOKING":
                                    {
                                        startTestScheduleLooking();
                                        break;
                                    }
                                    case "CONTINUE_ELEARNING_LOOKING":
                                    {
                                        startElearningLooking();
                                        break;
                                    }
                                    case "CONTINUE_ELEARNING_LOOKING":
                                    {
                                        startElearningLooking();
                                        break;
                                    }
                                }
                            }
                            else if (bot.sender.Session.indexOf('ELEARNING_') !== -1)   //..Xử lý và gửi lịc elearning cho người dùng
                            {
                                bot.sender.changeSession("");
                                let enteredClass = bot.receivedText;
                                let pickedDate = bot.sender.Session.split('_')[1];
                                bot.sendTypingAction(bot.sender.ID);


                                let foundSchedule = await eFinder.findSchedule(enteredClass, pickedDate);
                                let schedulesBlock = await eFinder.getSchedulesTemplate(foundSchedule, pickedDate);


                                if (schedulesBlock.length === 0)
                                {
                                    bot.sendText(bot.sender.ID, "Không có lịch học E-Learning.");
                                    askForContinue();
                                }
                                else
                                {
                                    for (let i = 0; i < schedulesBlock.length; ++i)
                                    {
                                        bot.sendMessage(bot.sender.ID, schedulesBlock[i]);
                                        askForContinue();
                                    }
                                }


                                
                                function askForContinue(delaySeconds = 1.5)
                                {
                                    //  Hỏi xem có tiếp tục tìm không
                                    let quickreplies = 
                                    [
                                        {
                                            "content_type":"text",
                                            "title":"Có",
                                            "payload":"CONTINUE_ELEARNING_LOOKING",
                                            "image_url":"https://tinyurl.com/v92omjj"
                                        },
                                        {
                                            "content_type":"text",
                                            "title":"Không",
                                            "payload":"CANCEL_ELEARNING_LOOKING",
                                            "image_url":"https://tinyurl.com/wey7urf"
                                        }
                                    ];


                                    console.log('Sending quickreplies ...');
                                    let quickrepliesBlock = builder.createQuickReply("Tiếp tục tra cứu lịch học E-Learning ?", quickreplies);
                                    bot.sendMessage(bot.sender.ID, quickrepliesBlock, delaySeconds, "RESPONSE");
                                }
                            }
                        }
                    }
                }
                else if (bot.isPostBack)    //  Hoặc nếu chọn các nút PostBack
                {
                    switch (bot.payload)
                    {
                        case "GET_STARTED":     // Bắt đầu cuộc trò chuyện mới
                            {
                                sendGetStatedMessage(0.75);
                                sendScheduleLoookingButtons(1.75);
                                sendInfoLookingButtons(1.9);
                                break;
                            }

                        case "SETTING":
                            {
                                sendSetingButtons();
                                break;
                            }
                        
                        case "SCHEDULE_LOOKING":
                            {
                                sendScheduleLoookingButtons();
                                break;
                            }

                        case "INFO_LOOKING":
                            {
                                sendInfoLookingButtons();
                                break;
                            }
                        
                        case "TEST_SCHEDULE_LOOKING":
                            {
                                startTestScheduleLooking();
                                break;
                            }
                        
                        case "LIABILITY_LOOKING":
                            {
                                startLiailityLooking();
                                break;
                            }

                        case "NEWS_LOOKING":
                            {
                                let sending = await sendStudentNews(bot.sender.ID);
                                break;
                            }
                        
                        case "ONCLASS_SCHEDULE_LOOKING": case "MARKS_LOOKING":
                            {
                                bot.sendText(bot.sender.ID, "Tính năng chưa phát triển.", 1.25);
                                break;
                            }

                        case "ELEARNING_SCHEDULE_LOOKING":
                            {
                                startElearningLooking();
                                break;
                            }
                        
                        default:
                            {
                                if (bot.payload.indexOf('ELEARNING_') !== -1)       //..Khi chọn ngày để tra cứu lịch học elearning
                                {
                                    bot.sender.changeSession(bot.payload);
                                    bot.sendText(bot.sender.ID, "Nhập mã lớp. Không phân biệt chữ hoa ~ thường.\nVí dụ: dh18lt", 1.05);
                                    console.log('Waiting for enter class name...');
                                }
                            }
                    }
                }
            }
    }



    res.status(200).send("OK");






    async function startElearningLooking()
    {
        bot.sender.changeSession("ElearningLooking");
        // bot.sendText(bot.sender.ID, "Tra cứu lịch học E-Learning.\n\nNhập mã lớp. Không phân biệt chữ hoa ~ thường.\nVí dụ: dh18lt", 1.25);


        bot.sendTypingAction(bot.sender.ID);
        let followingSchedules = await eFinder.getFollowingSchedules();     //  Lấy mảng [] những ngày có lịch học elearning
        if (followingSchedules.length === 0)    //  Không tìm được lịch
        {
            bot.sender.changeSession("");
            bot.sendText(bot.sender.ID, "Không tìm được lịch học E-learning.\n\nMã lớp không tồn tại, hoặc máy chủ đang quá tải.");
        }
        else
        {
            // bot.sendText(bot.sender.ID, "Những ngày có lịch E-Learning khả dụng");
            while (followingSchedules.length)
            {
                if (followingSchedules.length >= 3)
                {
                    let spliced = followingSchedules.splice(0, 3);
                    let buttons = [];
                    for (let i = 0; i < spliced.length; ++i)
                    {
                        buttons.push({
                            type: "postback",
                            title: `Ngày ${spliced[i]}`,
                            payload: `ELEARNING_${spliced[i]}`
                        });
                    }
                    
                    let buttonBlock = builder.createButtonTemplate("Chọn ngày", buttons);
                    bot.sendMessage(bot.sender.ID, buttonBlock);
                }
                else
                {
                    let spliced = followingSchedules.splice(0);let buttons = [];
                    for (let i = 0; i < spliced.length; ++i)
                    {
                        buttons.push({
                            type: "postback",
                            title: `Ngày ${spliced[i]}`,
                            payload: `ELEARNING_${spliced[i]}`
                        });
                    }
                    
                    let buttonBlock = builder.createButtonTemplate("Chọn ngày", buttons);
                    bot.sendMessage(bot.sender.ID, buttonBlock);
                }
            }
        }
    }
    function startTestScheduleLooking()
    {
        bot.sender.changeSession("TestLooking");
        bot.sendText(bot.sender.ID, "Tra cứu lịch thi.\n\nNhập mã sinh viên.\n\Ví dụ: 18033747", 1.5);
    }
    function startLiailityLooking()
    {
        bot.sender.changeSession("LiabilityLooking");
        bot.sendText(bot.sender.ID, "Tra cứu công nợ.\n\nNhập mã sinh viên.\n\Ví dụ: 18033747", 1.5);
    }
    async function sendStudentNews(recipientID)
    {
        try
        {
            bot.sendTypingAction(bot.sender.ID);
            let gettingLinks = await _student.getStudentNews();
            // console.log(gettingLinks);
            let elems = await _student.createNewsElements(gettingLinks);
            // console.log(creatingElems);
        

            let genericTemplate = builder.createGenericTemplate(elems);
            bot.sendMessage(recipientID, genericTemplate);
        }
        catch (err)
        {
            console.log(err);
        }
    }




    function sendGetStatedMessage(typingDelay = 0)
    {
        try
        {
            console.log(`Sending getstarted greeting for: ${bot.sender.ID} [${bot.sender.FirstName}]`);
            let getstarted_Greeting = `Xin chào ${bot.sender.FirstName}.\n\nMình là Hyena. Mình sẽ hỗ trợ bạn trong việc thông báo tin tức tại BVU.`;
            bot.sendText(bot.sender.ID, getstarted_Greeting, typingDelay);
            bot.sendText(bot.sender.ID, `Chọn các mục bên dưới để tra cứu. Hoặc chọn vào menu ☰ ở thanh dưới cùng.`, typingDelay + 0.45);
        }
        catch (err)
        {
            console.log('Failed to send the GetStatedMessage [index.js:251]');
        }
    }
        
    function sendInfoLookingButtons(typingDelay = 0)
    {
        let infoButtons = 
        [
            {
                type: "postback",
                title: "Công nợ",
                payload: "LIABILITY_LOOKING"
            },
            {
                type: "postback",
                title: "Điểm học tập",
                payload: "MARKS_LOOKING"
            },
            {
                type: "postback",
                title: "Tin tức sinh viên mới",
                payload: "NEWS_LOOKING"
            }
        ];


        let infoButtonBlock = builder.createButtonTemplate("Tra cứu thông tin", infoButtons);
        bot.sendMessage(bot.sender.ID, infoButtonBlock, typingDelay);
    }

    function sendScheduleLoookingButtons(typingDelay = 0)  //  Gửi các nút xem lịch
    {
        let scheduleButtons =
        [
            {
                type: "postback",
                title: "Lịch thi",
                payload: "TEST_SCHEDULE_LOOKING"
            },
            {
                type: "postback",
                title: "Lịch học trên lớp",
                payload: "ONCLASS_SCHEDULE_LOOKING"
            },
            {
                type: "postback",
                title: "Lịch học E-Learning",
                payload: "ELEARNING_SCHEDULE_LOOKING"
            }
        ];
    
        let scheduleButtonBlock = builder.createButtonTemplate("Tra cứu lịch", scheduleButtons);
        bot.sendMessage(bot.sender.ID, scheduleButtonBlock, typingDelay);
    }
    
    function sendSetingButtons()
    {
        // let settingButtons = 
        // [
        //     {
        //         type: "postback",
        //         title: "",
        //         payload: ""
        //     }
        // ];

        // let settingButtonBlock = builder.createButtonTemplate("Cài đặt", settingButtons);
        // bot.sendMessage(bot.sender.ID, settingButtonBlock);
        bot.sendText(bot.sender.ID, "Tính năng chưa phát triển");
    }
    


    function setPersistentMenu()
    {
        let persistentButtons =
        [
            // {
            //     "type": "postback",
            //     "title": "Cài đặt",
            //     "payload": "SETTING"
            // },
            {
                "type": "postback",
                "title": "Tra cứu lịch",
                "payload": "SCHEDULE_LOOKING"
            },
            {
                "type": "postback",
                "title": "Tra cứu thông tin",
                "payload": "INFO_LOOKING"
            }
        ];

        bot.createPersistentMenu(persistentButtons, false);
    }

    function setGreetingMessage()
    {
        bot.createGreetingMessage("Xin chào {{user_first_name}}. Đây là trang hỗ trợ thông báo tin tức cho sinh viên BVU.");
    }
});






