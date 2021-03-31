const ics = require('ics');
const moment = require('moment');
const fs = require('fs');
const path = require('path');


function periodToTime(period) {
  const first = period.split('->')[0];
  const last = period.split('->')[1];

  return {
    first: getTimeByIndex(first).start,
    last: getTimeByIndex(last).end,
  }


  function getTimeByIndex(index) {
    const incresingMinutes = 50;
    let breakTime = 0;

    for (let i = 1; i <= index; ++i) {
      switch (i) {
        case 3: case 5: case 9: case 11: case 13: case 15: {
          breakTime += 10;
          break;
        }
    
        case 7: {
          breakTime += 40;
          break;
        }
      }
    }

    const start = moment('06:45', 'HH:mm').add((index - 1) * incresingMinutes + breakTime, 'minutes')
    return {
      start: start.format('HH:mm'),
      end: start.add(incresingMinutes, 'minutes').format('HH:mm'),
    };
  }
}

function getScheduleData(scheduleArr) {

  const icsData = Array.from(scheduleArr.details).map((value, index, arr) => {
    const theDate = value.Date.split('(')[1].split(')')[0];
    const theTime = periodToTime(value.Period);

    const duration = moment.duration(
      moment(theTime.last, 'HH:mm').diff(moment(theTime.first, 'HH:mm')));

    const record = {
      title: value.Subject,
      start: [
        theDate.split('-')[2],
        theDate.split('-')[1],
        theDate.split('-')[0],
        moment(theTime.first, 'HH:mm').hours(),
        moment(theTime.first, 'HH:mm').minutes(),
      ],
      duration: {
        minutes: duration.minutes() + duration.hours() * 60,
      },
      location: `Phòng ${value.Room}`,
      description: `Type: ${value.TestType}\nGroup: ${value.Group}\nNotes: ${value.Notes}\nFrom ordinal: ${value.FromOrdinal}`
    };

    return record;
  });

  return icsData;
}



module.exports = function saveICS(studentID, scheduleArr) {
  return new Promise((resolve, reject) => {

    ics.createEvents(getScheduleData(scheduleArr), (err, value) => {
      if (err) {
        console.log(err);
        return reject('error while creating icsses..');
      }

      fs.writeFile(path.resolve(__dirname, './test-schedules-ics/', `${studentID}.ics`), value, {encoding: 'utf8'}, (err) => {
        if (err) {
          console.log(err);
          return reject('error while saving ics...');
        }
        else {
          console.log('ics saved.');
          return resolve(`${studentID}.ics`);
        }
      });
    });

  });
}
