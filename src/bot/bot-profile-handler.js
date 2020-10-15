
require('dotenv/config');
const Bot = require('./bot');
const request = require('request');



class BotProfile
{
    #access_token = process.env.PAGE_ACCESS_TOKEN;
    constructor()
    {
        
    }



    async setupPersistentMenu()
    {
        try
        {
            let buttons = [
                {
                    "type": "nested",
                    "title": "Tin tức",
                    "call_to_actions":[
                        {
                            "title":"Tin chính",
                            "type":"postback",
                            "payload":"HEADLINE_LOOKINGUP"
                        },
                        {
                            "title":"Tin sinh viên",
                            "type":"postback",
                            "payload":"STUDENTNEWS_LOOKINGUP"
                        }]
                },
                {
                    "title":"Tra cứu lịch",
                    "type":"nested",
                    "call_to_actions":[
                        {
                            "title":"Lịch thi",
                            "type":"postback",
                            "payload":"TESTSCHEDULE_LOOKINGUP"
                        },
                        {
                            "title":"Lịch học tuần này",
                            "type":"postback",
                            "payload":"NORMALSCHEDULE_LOOKINGUP"
                        }
                    ]
                },
                {
                    "type": "nested",
                    "title": "Tra cứu thông tin",
                    "call_to_actions":[
                        {
                            "title":"Công nợ",
                            "type":"postback",
                            "payload":"LIABILITY_LOOKINGUP"
                        },
                        {
                            "title":"Điểm học tập",
                            "type":"postback",
                            "payload":"MARKS_LOOKINGUP"
                        }
                    ]
                },
            ];

            this.createPersistentMenu({buttons: buttons});
        }
        catch (err)
        {
            console.log(err);
        }
    }
    
    async setupGreetingMessage()
    {
        try
        {
            // Pre-defined by Facebook's API
            const attrs = {
                firstName: '{{user_first_name}}', 
                lastName: '{{user_last_name}}', 
                fullName: '{{user_full_name}}'
            };

            let greetingMessage = `Xin chào ${attrs.firstName}. Đây là trang thông báo tin tức và lịch học - lịch thi cho sinh viên BVU.`;
            this.createGreetingMessage({greetingContent: greetingMessage});
        }
        catch (err)
        {
            console.log(err);
        }
    }
    
    async setupGetstartedMessage()
    {
        try
        {
            this.createGettingStarted();
        }
        catch(err)
        {
            console.log('Error when setting up Getstarted Message:', err);
        }
    }


        
    //  Creating profile for ChatBot page
    createPersistentMenu({buttons, disabledComposer = false})
    {
        request
        (
            {
                method: 'POST',
                url: process.env.PROFILE_API,
                qs: {access_token: this.#access_token},
                headers: {'Content-Type': 'application/json'},
                json:
                {
                    persistent_menu:
                    [
                        {
                            locale: "default",
                            composer_input_disabled: disabledComposer,
                            call_to_actions: buttons
                        }
                    ]
                }
            },
            (err, res, body) =>
            {
                if (err || (res.statusCode !== 200))
                {
                    console.log('■■■ Can\'t create the PersistentMenu buttons. Error:', err || body);
                }
                else
                {
                    console.log('■■■ Successfully setup the PersistentMenu buttons. Result:', body);
                }
            }
        );
    }

    createGettingStarted()
    {
        const payload = 'GET_STARTED';

        request
        (
            {
                method: 'POST',
                url: process.env.PROFILE_API,
                qs: {access_token: this.#access_token},
                headers: {'Content-Type': 'application/json'},
                json:
                {
                    get_started:
                    {
                        payload: payload
                    }
                }
            },
            (err, res, body) =>
            {
                if (err || (res.statusCode !== 200))
                {
                    console.log('■■■ Can\'t create the Getstarted Payload. Error:', err || body);
                }
                else
                {
                    console.log(`■■■ Successfully create the Getstarted Payload {${payload}}. Result:`, body);
                }
            }
        );
    }

    createGreetingMessage({greetingContent})
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
                qs: {access_token: this.#access_token},
                headers: {'Content-Type': 'application/json'},
                json:
                {
                    greeting:
                    [
                        {
                            locale: "default",
                            text: greetingContent
                        }
                    ]
                }
            },
            (err, res, body) =>
            {
                if (err || (res.statusCode !== 200))
                {
                    console.log('\n■■■ Can\'t create the GreetingMessage. Error:', err || body);
                }
                else
                {
                    console.log('\n■■■ Successfully setup the GreetingMessage. Result:', body);
                }
            }
        );
    }

}


module.exports = BotProfile;

