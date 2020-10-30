module.exports = { renderTestScheduleTemplate }
const request = require('request');
require('dotenv/config');


async function renderTestScheduleTemplate(studentID)
{
    try
    {
        let json = await getRawTestSchedule(studentID);
        switch (json) {
            case 'Student not found.': {
                return ({text: 'Không tìm được lịch thi.\n\nMã sinh viên sai hoặc máy chủ đang quá tải.'});
            }
            case undefined: //  lỗi xử lý từ hàm getRawTestSchedule()
                return ({text: process.env.ERROR_MESSAGE});
        }


        let schedules = [];
        let jsonSchedule = json;
        let detailSchedule = Array.from(jsonSchedule.details);
        let indentifier = jsonSchedule.info;


        schedules.push({text: `Mã sinh viên: ${indentifier.id}.\nTên: ${indentifier.fullName}.\nHọc kỳ: ${indentifier.term}.`});
        detailSchedule.forEach((item, index) =>
        {
            let content = '';
            content += `- Môn: ${item.Subject}.\n`;
            content += `- Lớp HP: ${item.Class}.\n`;
            content += `- Loại thi: ${item.TestType}.\n\n`;
            content += `- Ngày: ${item.Date}.\n`;
            content += `- Tiết: ${item.Period}.\n`;
            content += `- Phòng: ${item.Room}.\n\n`;
            content += `- Thứ tự: ${item.FromOrdinal || 'Không'}.\n`;
            content += `- Nhóm: ${item.Group || 'Không'}.\n\n`;
            content += `- Ghi chú: ${item.Notes || 'Không'}.\n`;

            schedules.push({ text: content });
        });


        console.log(schedules.length);
        return schedules;
    }
    catch(error)
    {
        console.log(error);
        return ({text: process.env.ERROR_MESSAGE});
    }
}

async function getRawTestSchedule(studentID)
{
    try
    {
        console.log('\n\nGetting raw test schedule...');
        return new Promise((resolve, reject) =>
        {
            request({
                method: 'GET',
                url: `${process.env.SEARCHER_HOST}/?method=2&id=${studentID}`
            },
            (err, res, body) =>
            {
                if (err || (res.statusCode !== 200))
                {
                    // console.log(err || body);
                    return resolve('Student not found.');
                }

                // console.log(body);
                return resolve(JSON.parse(body));
            });
        });
    }   
    catch (err)
    {
        console.log(err);
        return undefined;
    } 
}

