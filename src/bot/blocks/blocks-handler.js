
let defaut_answer               = require('./direct-replies/default-answer');
let reply_to_hi                 = require('./direct-replies/reply-to-hi');
let show_functions              = require('./direct-replies/show-functions');

let show_headlines              = require('./sending/send-headlines');
let show_studentNews            = require('./sending/send-student-news');

let send_test_schedule          = require('./sending/send-test-schedule');
let send_normal_schedule        = require('./sending/send-normal-schedule');

let send_liability              = require('./sending/send-liability');
let send_summary_marks          = require('./sending/send-summary-marks');

let get_student_id              = require('./getting-answer/get-student-id');
let continue_test_schedule      = require('./quick-replies/continue-testschedule-lookingup');
let continue_saving_id          = require('./quick-replies/confirm-saving-id');

let ask_for_saving_id           = require('./sending/ask-for-saving-id');
let ask_for_alert_learning_schedule  = require('./sending/ask-for-alert-learning-schedule');

let confirm_alert_learning_schedule = require('./quick-replies/confirm-alert-learning-schedule');
let confirm_studentid_for_learning_schedule = require('./quick-replies/confirm-studentid-for-alert-learning-schedule');

module.exports = 
{
    defaut_answer, reply_to_hi, show_functions, 

    show_headlines, show_studentNews, 
    send_liability, send_summary_marks, 
    send_test_schedule, send_normal_schedule,
    
    get_student_id, 
    ask_for_saving_id, ask_for_alert_learning_schedule,
    continue_test_schedule, continue_saving_id,

    confirm_alert_learning_schedule, confirm_studentid_for_learning_schedule
};
