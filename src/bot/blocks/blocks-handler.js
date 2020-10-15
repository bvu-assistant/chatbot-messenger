
let defaut_answer               = require('./direct-replies/default-answer');
let reply_to_hi                 = require('./direct-replies/reply-to-hi');
let show_functions              = require('./direct-replies/show-functions');

let show_headlines              = require('./sending/send-headlines');
let show_studentNews            = require('./sending/send-student-news');
let send_test_schedule          = require('./sending/send-test-schedule');
let send_liability              = require('./sending/send-liability');
let send_summary_marks          = require('./sending/send-summary-marks');

let get_student_id              = require('./getting-answer/get-student-id');
let continue_test_schedule      = require('./quick-replies/continue-testschedule-lookingup');



module.exports = 
{
    defaut_answer, reply_to_hi,show_functions, 

    show_headlines, show_studentNews, send_test_schedule, send_liability, send_summary_marks, 

    get_student_id, 
    continue_test_schedule
};
