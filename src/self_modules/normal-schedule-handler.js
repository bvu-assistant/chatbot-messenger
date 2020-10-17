const request = require('request');
const moment = require('moment');
require('dotenv/config');

const ScheduleType = {
    THIS_WEEK: 0,
    TODAY: 1,
    TOMORROW: 2
};Object.freeze(ScheduleType);


module.exports = { renderNormalSchedulesTemplate, ScheduleType };



async function renderNormalSchedulesTemplate({studentId, type = ScheduleType.TODAY}) {
    try {

        let json = await getAllSchedulesJSON(studentId);
        switch (json) {
            case 'Student not found.': {
                return ({text: 'Không tìm được điểm.\n\nMã sinh viên sai hoặc máy chủ đang quá tải.'});
            }
            case undefined: //  lỗi xử lý từ hàm getAllSchedulesJSON()
                return ({text: process.env.ERROR_MESSAGE});
        }


        //  chuyển mọi lịch học tồn tại vào Array
        let schedulesArr = [];
        let days = json.details;
        for (day in days) {
            if (days[day].morning.length !== 0)
                schedulesArr = schedulesArr.concat(days[day].morning);

            if (days[day].afternoon.length !== 0)
                schedulesArr = schedulesArr.concat(days[day].afternoon);

            if (days[day].evening.length !== 0)
                schedulesArr = schedulesArr.concat(days[day].evening);
        }


        //  render các tin nhắn
        let messages = [];
        switch (type) {
            case ScheduleType.THIS_WEEK: {
                messages = await renderThisWeekSchedulesMessages(schedulesArr);
                break;
            }
            case ScheduleType.TODAY: {
                messages = await renderTodaySchedulesMessages(schedulesArr);
                break;
            }
            case ScheduleType.TOMORROW: {
                messages = await renderTomorrowSchedulesMessages(schedulesArr);
                break;
            }
        }


        //  thêm thông tin Sinh viên vào đầu
        messages.unshift({
            text: `${json.info.id} - ${json.info.fullName}\n${json.info.term}`
        });


        return messages;
    }
    catch (err) {
        console.log(err);
        return ({text: process.env.ERROR_MESSAGE});
    }
}



async function renderThisWeekSchedulesMessages(schedulesArr) {
    let thisWeekDays = await getThisWeekDays(); //  các ngày trong tuần hiện tại (DD-MM-YYYY)
    let messages = [];

    schedulesArr.forEach( async (value, index) => {
        if (thisWeekDays.includes(value.date)) {
            messages.push({text: (await getMessageTemplate(value))});
        }
    });

    return messages;
}

async function renderTodaySchedulesMessages(schedulesArr) {
    let today = moment().format('DD-MM-YYYY');
    let messages = [];

    schedulesArr.forEach(async(value, index) => {
        if (today === value.date) {
            messages.push({text: (await getMessageTemplate(value))});
        }
    });

    return messages;
}

async function renderTomorrowSchedulesMessages(schedulesArr) {
    let today = moment().add(1, 'day').format('DD-MM-YYYY');
    let messages = [];

    schedulesArr.forEach(async(value, index) => {
        if (today === value.date) {
            messages.push({text: (await getMessageTemplate(value))});
        }
    });

    return messages;
}



async function getAllSchedulesJSON(studentId) {
    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            url: `${process.env.SEARCHER_HOST}/?method=3&id=${studentId}`
        },
        (err, res, body) =>
        {
            if (err || (res.statusCode !== 200))
            {
                return resolve('Student not found.');
            }

            // console.log(JSON.parse(body));
            return resolve(JSON.parse(body));
        });
    });
}

async function getMessageTemplate(schedule) {
    let content = '';

    let dayName = moment(schedule.date, 'DD-MM-YYYY').locale('vi').format('dddd');  //  lấy tên ngày trong tuần
    dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);   //  viết hoa chữ cái đầu

    content += dayName + ' - ';
    content += `Ngày: ${schedule.date}\n\n`;
    content += `- Tiết: ${schedule.period}\n`;
    content += `- Phòng: ${schedule.room}\n\n`;
    content += `- Môn: ${schedule.subject_name}\n`;
    content += `- Hình thức: ${schedule.type}\n\n`;
    content += `- Giảng viên: ${schedule.teacher}\n`;

    return content;
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