const User = require('../../models/user');


const firebaseAdmin = require('./firebase-instance');
const db = require('./firebase-instance').admin.database();



function getUser(user) {
    console.log('\ninside addUser');
    let ref = firebaseAdmin.facebookRealtimeDbRef;

    if (user.is_exist) {  //  user đã tồn tại theo id đã cung cấp
        ref.child(user.id).set(user.info);
    }
    else {  //  user không tồn tại theo id đã cung cấp (đôi khi user đã lưu bị thay đổi id)
        ref.child(user.id).remove();
    }
}


( async () => {
    let user = await new User(23659296335070456);
    console.log('\nreceived user', user);
    getUser(user);
})();
