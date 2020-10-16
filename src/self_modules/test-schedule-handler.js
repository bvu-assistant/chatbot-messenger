const request = require('request');
require('dotenv/config');


async function renderTestScheduleTemplate(studentID)
{
    try
    {
        return new Promise( async(resolve, reject) =>
        {
            let rawSchedules = await getRawTestSchedule(studentID);
            if (Array.from(rawSchedules).length === 0)
            {
                return resolve([{text: 'Không tìm được lịch thi.\n\nMã sinh viên sai hoặc máy chủ đang quá tải.'}]);
            }


            let schedules = [];
            let jsonSchedule = Array.from(rawSchedules);
            let detailSchedule = Array.from(jsonSchedule[1]);
            let indentifier = jsonSchedule[0];


            schedules.push({text: `Mã sinh viên: ${indentifier.ID}.\nTên: ${indentifier.FullName}.\nHọc kỳ: ${indentifier.Term}.`});
            detailSchedule.forEach((item, index) =>
            {
                let content = '';
                content += `- Môn: ${item.Subject}.\n`;
                content += `- Ngày: ${item.Date}.\n`;
                content += `- Ca: ${item.Period}.\n`;
                content += `- Phòng: ${item.Room}.\n`;
                content += `- Lớp HP: ${item.Class}.\n`;
                content += `- Nhóm: ${item.Group || 'Không'}.\n`;
                content += `- Từ sĩ số: ${item.FromOrdinal || 'Không'}.\n`;
                content += `- Loại thi: ${item.TestType}.\n`;
                content += `- Ghi chú: ${item.Notes || 'Không'}.\n`;


                schedules.push({ text: content });
            });


            console.log(schedules.length);
            return resolve(schedules);
        });
    }
    catch(error)
    {
        console.log(error);
    }
}

async function getRawTestSchedule(studentID)
{
    try
    {
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
                    return resolve([]);
                }


                return resolve(JSON.parse(body));
            });
        });
    }   
    catch (err)
    {
        console.log(err);
    } 
}


module.exports = { renderTestScheduleTemplate }