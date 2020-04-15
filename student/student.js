

module.exports = 
{
    getTestSchedule, getLiability, getStudentNews, createNewsElements
}


require('dotenv').config();
const request = require('request');
const cheerio = require('cheerio');




async function getTestSchedule(studentID)
{
    let stream = await new Promise((resolve, reject) =>
    {
        request
        (
            {
                method: 'GET',
                url: process.env.SEARCHER_HOST,
                qs: 
                {
                    method: 'ViewTestSchedule',
                    id: studentID
                }
            },
            (err, res, body) =>
            {
                // console.log(JSON.parse(body));
                if (err || (res.statusCode !== 200))
                {
                    console.log(`Can\'t get test schedule for: ${studentID} - err:`, err || body);
                    return reject(err);
                }
                else
                {
                    console.log('Successfully get schedule.');
                    let textTemplates = [];
                    let schedules = JSON.parse(body);
    
    
                    for (let i = 0; i < schedules.length; ++i)
                    {
                        let currSchedule  = '';
                        currSchedule += `- Lớp học phần: ${schedules[i].Class}.\n`;
                        currSchedule += `- Môn: ${schedules[i].Subject}.\n`;
                        currSchedule += `- Nhóm: ${schedules[i].Group || "Không"}.\n`;
                        currSchedule += `- Từ sĩ số: ${schedules[i].FromOrdinal || "Không"}.\n`;
                        currSchedule += `- Ngày: ${schedules[i].Date}.\n`;
                        currSchedule += `- Ca: ${schedules[i].Period}.\n`;
                        currSchedule += `- Phòng: ${schedules[i].Room || "Không"}.\n`;
                        currSchedule += `- Loại thi: ${schedules[i].TestType || "Không"}.\n`;
                        currSchedule += `- Ghi chú: ${schedules[i].Notes || "Không"}.\n`;
    
                        textTemplates.push(
                        {
                            text: currSchedule
                        });
                    }
    
                    
                    // console.log(textTemplates);
                    return resolve(textTemplates);
                }
            }
        );
    });


    return stream;
}

async function getLiability(studentID)
{
    let stream = await new Promise((resolve, reject) =>
    {
        request
        (
            {
                method: 'GET',
                url: process.env.SEARCHER_HOST,
                qs: 
                {
                    method: 'ViewLiabilities',
                    id: studentID
                }
            },
            (err, res, body) =>
            {
                // console.log(JSON.parse(body));
                if (err || (res.statusCode !== 200))
                {
                    console.log(`Can\'t get liability for: ${studentID} - err:`, err || body);
                    return resolve(undefined);
                }
                else
                {
                    console.log('Successfully get liability.');
                    return resolve(body.length === 2 ? undefined:body.replace(/[ \n]*/gm, ''));
                }
            }
        );
    });


    return stream;
}




//  For StudentNews
async function getStudentNews()
{
    try
    {
        const cherrio = require('cheerio');
        let stream = await new Promise((resolve, reject) =>
        {
            let links = [];    
            request
            ({
                method: 'GET',
                strictSSL: 'none',
                url: 'https://sinhvien.bvu.edu.vn/',
                strictSSL: false,
                headers: { "Content-Type": "text/html" }
            },
            function(err, res, body)
            {
                if (err)
                {
                    return reject(err);
                }

                const $ = cherrio.load(body);
                $('div.head').each(function(index)
                {
                    if ($(this).find('h3').text().indexOf("Tin tức Sinh viên - Học viên") !== -1)
                    {
                        // console.log($(this).text());
                        let bodyTag = $(this).next();

                        let items = bodyTag.find('div.item >p.title >a').each(function(index)
                        {
                            if($(this).next().is('img'))
                            {
                                let url = `https://sinhvien.bvu.edu.vn/${$(this).attr('href')}`;
                                let title = $(this).attr('title');
                                let span = $(this).next().next().next();
                                let date = span.text().replace("Ngày đăng: ", "");

                                links.push({Title: title, Url: url, Date: date});
                            }
                        });
                    }
                });

                // console.log(links);
                return resolve(links);
            });
        });

        return stream;
    }
    catch (err)
    {
        console.log("Error at: getStudentNews(): " + err);
    }
}

async function createNewsElements(links)
{
    try
    {
        let stream = await new Promise((resolve, reject) =>
        {
            let elems = [];
            links.forEach((tag, index) =>
            {
                elems.push({
                    "title": tag.Date,
                    "image_url": "https://i.imgur.com/8cXovCw.png",
                    "subtitle": tag.Title,
                    "default_action":
                    {
                        "type": "web_url",
                        "url": tag.Url,
                        "webview_height_ratio": "tall"
                    },
                    buttons:
                    [
                        {
                            type: "web_url",
                            url: tag.Url,
                            title: "Xem"
                        }
                    ]
                });
            });

            // console.log(elems);
            return resolve(elems);
        });

        return stream;
    }
    catch (err)
    {
        console.log("Error at: createNewsElements(): " + err);
    }
}
