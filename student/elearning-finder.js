module.exports =
{
    findSchedule, getFollowingSchedules, getSchedulesTemplate
}


require('dotenv').config();
const request = require('request');
const fs = require('fs');




function findSchedule(classname, date)
{
    try
    {
        return new Promise((resolve, reject) =>
        {
            let query = `${process.env.CRAWLER_HOST}/schedules?date=${date}&class=${classname}`;
            console.log('Lokking for:', query);

            request
            ({
                method: 'GET',
                url: query
            },
            (err, res, body) =>
            {
                let pBody = JSON.parse(body);
                console.log('Foud schedules:', pBody);

                if (err || (res.statusCode != 200) || (pBody.length === 0))
                {
                    console.log("Find schedule failed: " + err);
                    resolve([]);
                }
                else
                {
                    resolve(pBody);
                }
            });
        });
    }
    catch(error)
    {
        console.log(error);
    }
}

async function getSchedulesTemplate(schedules, date)
{
    try
    {
        let dateName = await getDateName(date);
        dateName += ` – Ngày ${date}`;


        let allSchedules = [];
        for (let i = 0; i < schedules.length; ++i)
        {
            let message = '';
            message += `${dateName}.\n\n\n`;
            message += `– Môn: ${schedules[i].Name}.\n\n`;
            message += `– Lớp: ${schedules[i].Class}.\n\n`;
            message += `– Ca: ${schedules[i].Period}.\n\n`;
            message += `– Giảng viên: ${schedules[i].Teacher}.\n\n`;
            message += `– Ghi chú: ${schedules[i].Notes}.\n\n`;
            message += `– Giờ học trực tuyến: ${schedules[i].LiveTime}.`;

            allSchedules.push({text: message});
        }


        return allSchedules;
    }
    catch(error)
    {
        console.log(error);
    }
}



//  For finding following schedules
function getFollowingSchedules()
{
    console.log('\nGetting following elearning schedules...');
    return new Promise((resolve, reject) =>
    {
        request
        (
            {
                method: 'GET',
                url: `${process.env.CRAWLER_HOST}/followingSchedules`
            },
            function(err, res, body)
            {
                if (err || (res.statusCode !== 200))
                {
                    console.log('Error when getting following elarning schedules.');
                    reject(err || body);
                }
                else
                {
                    let pBbody = JSON.parse(body);
                    console.log("Schedules: " + pBbody, pBbody.length);
                    resolve(pBbody);
                }
            }
        );
    });
}




async function getCurrentDate()
{
    try
    {
        let stream = await new Promise((resolve, reject) =>
        {
            let d = new Date();
            let date = d.getDate();
            let dateString = (date >= 10) ? date:`0${date}`;
            let month = d.getMonth() + 1;
            let monthString = (month >= 10) ? month: `0${month}`;
            let year = d.getFullYear();
    
            return resolve(`${dateString}-${monthString}-${year}`);
        });


        return stream;
    }
    catch (err)
    {
        console.log(err);
    }
}

function getDateName(date)
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let day = new Date(date.split('-').reverse().join('-')).getDay();
            let dateName = "";
            switch (day)
            {
                case 0: dateName = "Chủ Nhật"; break;
                case 1: dateName = "Thứ Hai"; break;
                case 2: dateName = "Thứ Ba"; break;
                case 3: dateName = "Thứ Tư"; break;
                case 4: dateName = "Thứ Năm"; break;
                case 5: dateName = "Thứ Sáu"; break;
                case 6: dateName = "Thứ Bảy"; break;
            }
    
            return resolve(dateName);
        }
        catch(err)
        {
            throw err;
        }
    });
}