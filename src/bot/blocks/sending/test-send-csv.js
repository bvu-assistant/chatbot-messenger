const data = {
  "info": {
      "id": "18033747",
      "fullName": "Nguyễn Anh Tuấn",
      "sessionId": "adnvhlafx0wrsj1qgacnizwc",
      "term": "Học kỳ 2 [2020-2021]"
  },
  "details": [
      {
          "Class": "0101121787- DH18LT",
          "Subject": "Lập trình ứng dụng di động, game  3",
          "Group": "",
          "FromOrdinal": "",
          "Date": "Thứ 6(23-04-2021)",
          "Period": "1->3",
          "Room": "2204",
          "TestType": "Cuối kỳ",
          "Notes": ""
      },
      {
          "Class": "0101121787- DH18LT",
          "Subject": "Lập trình ứng dụng di động, game  3",
          "Group": "",
          "FromOrdinal": "",
          "Date": "Thứ 6(23-04-2021)",
          "Period": "4->6",
          "Room": "2204",
          "TestType": "Cuối kỳ",
          "Notes": ""
      },
      {
          "Class": "0101121619- DH18AN",
          "Subject": "Tiếp thị số (Digital Marketing)",
          "Group": "",
          "FromOrdinal": "",
          "Date": "Thứ 3(20-04-2021)",
          "Period": "2->3",
          "Room": "2204",
          "TestType": "Cuối kỳ",
          "Notes": ""
      },
      {
          "Class": "0101121619- DH18AN",
          "Subject": "Tiếp thị số (Digital Marketing)",
          "Group": "",
          "FromOrdinal": "",
          "Date": "Thứ 3(20-04-2021)",
          "Period": "4->6",
          "Room": "2204",
          "TestType": "Cuối kỳ",
          "Notes": ""
      },
      {
          "Class": "0101122018- DH18AN",
          "Subject": "Hệ thống thông tin thông minh 1",
          "Group": "1",
          "FromOrdinal": "",
          "Date": "Thứ 5(15-04-2021)",
          "Period": "2->3",
          "Room": "2204",
          "TestType": "Cuối kỳ",
          "Notes": ""
      },
      {
          "Class": "0101122018- DH18AN",
          "Subject": "Hệ thống thông tin thông minh 1",
          "Group": "2",
          "FromOrdinal": "",
          "Date": "Thứ 5(15-04-2021)",
          "Period": "4->6",
          "Room": "2204",
          "TestType": "Cuối kỳ",
          "Notes": ""
      },
      {
          "Class": "0101121638- DH18AN",
          "Subject": "Thiết kế và phát triển website 3",
          "Group": "",
          "FromOrdinal": "",
          "Date": "Thứ 4(14-04-2021)",
          "Period": "2->3",
          "Room": "2203",
          "TestType": "Cuối kỳ",
          "Notes": ""
      },
      {
          "Class": "0101121638- DH18AN",
          "Subject": "Thiết kế và phát triển website 3",
          "Group": "",
          "FromOrdinal": "",
          "Date": "Thứ 4(14-04-2021)",
          "Period": "4->6",
          "Room": "2203",
          "TestType": "Cuối kỳ",
          "Notes": ""
      },
      {
          "Class": "0101060016- DH18LT-DH18PA",
          "Subject": "Tư tưởng Hồ Chí Minh",
          "Group": "1",
          "FromOrdinal": "",
          "Date": "Thứ 4(07-04-2021)",
          "Period": "4->6",
          "Room": "1GD2",
          "TestType": "Cuối kỳ",
          "Notes": ""
      }
  ]
};


require('dotenv').config();
const request = require('request');
const path = require('path');
const fs = require('fs');


fs.exists(path.resolve(__dirname, '../../../self_modules/test-schedules-csv/', `${18033747}.csv`), (isExists) => {
  console.log(isExists);
});



request({
  method: 'POST',
  url: `https://graph.facebook.com/v9.0/me/message_attachments?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
  json: {
      "message":{
          "attachment":{
              "type":"file", 
              "payload":{
                  "is_reusable": true,
                  url: path.resolve(__dirname, '../../../self_modules/test-schedules-csv/', `${18033747}.csv`),
              }
          }
      },
      // "filedata": fs.createReadStream(path.resolve(__dirname, '../../../self_modules/test-schedules-csv/', `${18033747}.csv`))
  },
},
(err, res, body) => {
  if (err || (res.statusCode !== 200)) {
      console.log('error:', err || body);
  }
  else {
      console.log('body:', body);
      // bot.messageSender.sendText({recipientID: bot.sender.id, content: 'attached.', typingDelay: 2.5});
  }
});