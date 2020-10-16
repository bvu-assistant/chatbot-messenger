const request = require('request');
const moment = require('moment');
require('dotenv/config');

module.exports = { renderThisWeekSchedulesMessage, renderTodaySchedulesMessage }




async function renderThisWeekSchedulesMessage(studentId) {
    try {
        console.log('\n\n\nGetting this week schedules...');

        let info = await getThisWeekSchedulesJSON(studentId);
        let thisWeekDays = await getThisWeekDays();
        let messages = [];

        //  duyệt qua từng ngày trong tuần / zero-based
        let dates = info[1];
        for (date in dates) {
            if (dates[date].morning.length !== 0) {
                let arr = Array.from(dates[date].morning);

                //  duyệt qua các ngày trong thứ (một thứ chứa lịch học của nhiều ngày)
                arr.forEach((value, index) => {
                    if (thisWeekDays.includes(value.date)) {
                        let content = '';

                        let dayName = moment(value.date, 'DD-MM-YYYY').locale('vi').format('dddd');
                        dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);

                        content += dayName + ' - ';
                        content += `Ngày: ${value.date}\n\n`;
                        content += `- Ca: ${value.period}\n`;
                        content += `- Phòng: ${value.room}\n`;
                        content += `- Môn: ${value.subject_name}\n`;
                        content += `- Hình thức: ${value.type}\n`;
                        content += `- Giảng viên: ${value.teacher}\n`;

                        messages.push({text: content});
                    }
                });
            }
        }

        return messages;
    }
    catch (error) {
        console.log(error);
        return [];  
    }
}

async function renderTodaySchedulesMessage(studentId) {
    try {
        console.log('\n\n\nGetting today schedules...');

        let info = await getThisWeekSchedulesJSON(studentId);
        let today = moment().format('DD-MM-YYYY');
        let messages = [];

        //  duyệt qua từng ngày trong tuần / zero-based
        let dates = info[1];
        for (date in dates) {
            if (dates[date].morning.length !== 0) {
                let arr = Array.from(dates[date].morning);

                //  duyệt qua các ngày trong thứ (một thứ chứa lịch học của nhiều ngày)
                arr.forEach((value, index) => {
                    if (today === value.date) {
                        let content = '';

                        let dayName = moment(value.date, 'DD-MM-YYYY').locale('vi').format('dddd');
                        dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);

                        content += dayName + ' - ';
                        content += `Ngày: ${value.date}\n\n`;
                        content += `- Ca: ${value.period}\n`;
                        content += `- Phòng: ${value.room}\n`;
                        content += `- Môn: ${value.subject_name}\n`;
                        content += `- Hình thức: ${value.type}\n`;
                        content += `- Giảng viên: ${value.teacher}\n`;

                        messages.push({text: content});
                    }
                });
            }
        }

        return messages;
    }
    catch (error) {
        console.log(error);
        return [];  
    }
}




async function getThisWeekSchedulesJSON(studentId) {
    return new Promise((resolve, reject) =>
        {
            request({
                method: 'GET',
                url: `${process.env.SEARCHER_HOST}/?method=3&id=${studentId}`
            },
            (err, res, body) =>
            {
                if (err || (res.statusCode !== 200))
                {
                    return resolve({});
                }


                console.log(JSON.parse(body));
                return resolve(JSON.parse(body));
            });
        });
}


async function getThisWeekDays() {
    let now = moment();


    let startDay = now.clone().startOf('isoWeek');
    let endDay = now.clone().endOf('isoWeek');
    let days = [];


    for (let i = 0; i < 7; i++) {
        days.push(moment(startDay).add(i, 'days').format('DD-MM-YYYY'));
    }

    return days;
}