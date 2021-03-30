module.exports = { renderTestScheduleTemplate }
const request = require('request');
const csvSaver = require('./csv-creator');
require('dotenv/config');


function renderTestScheduleTemplate(studentID) {
    return new Promise((resolve, reject) => {

        getRawTestSchedule(studentID)
            .then(json => {

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
        
        
                //  save csv file
                if (detailSchedule.length) {
                    csvSaver(studentID, json)
                        .then((fileName) => {
                            return resolve({
                                schedules,
                                fileName,
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            return resolve({
                                schedules,
                                fileName: '',
                            });
                        });
                }
            })
            .catch(err => {
                switch (err) {
                    case 'Student not found.': {
                        return reject({text: 'Không tìm được lịch thi.\n\nMã sinh viên sai hoặc máy chủ đang quá tải.'});
                    }

                    case 'Application Error.': {
                        return reject({text: 'Không tìm được điểm.\n\nMã sinh viên sai hoặc máy chủ đang quá tải.'});
                    }
                }
            });
    });
}

function getRawTestSchedule(studentID) {
    console.log('\n\nGetting raw test schedule...');
    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            url: `${process.env.SEARCHER_HOST}/?method=2&id=${studentID}`
        },
        (err, res, body) => {
            if (res.statusCode == 503) {
                return reject('Application Error.');
            }

            if (err || (res.statusCode !== 200)) {
                return reject('Student not found.');
            }


            return resolve(JSON.parse(body));
        });
    });
}
