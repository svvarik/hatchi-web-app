// variables
let userName = getUserName();
let email = getEmail();
let editingName = false;
let editingEmail = false;
let editingPW = false;

// load above info onto page
function load_info(Ele, value, id){
    const valueEle = '<h2 id=' + id + '>' + value + '</h2>';
    Ele.append(valueEle);
} 
load_info($('#name-section'), userName, "username");
load_info($('#email-section'), email, "email");

//add edit functionality
//---username---
$('#edit-name-btn').click(function () {
    if(!editingName){
        //change username to a text input
        $('#name-section')[0].lastChild.remove();
        
        const form = '<form><input type="text" id="new-name" value=' + userName + '></form>';
        $('#name-section').append(form)
        //change text in btn
        $('#edit-name-btn')[0].innerText = 'done';
        editingName = true;
    }else{
        //get input and change username variable
        console.log()
        const newName = $('#new-name').val();
        const res = changeName(newName);
        if (res.status === 200 && res.newName != userName) {
            userName = res.newName;
        } else if (res.notice !== null){
            alert(res.notice);
        } else {
            alert('Username Change Failed.')
        }
        $('#name-section form').remove();
        load_info($('#name-section'), userName, "username");
        //change text in btn
        $('#edit-name-btn')[0].innerText = 'edit';
        editingName = false
    }
   
})
//---email---
$('#edit-email-btn').click(function () {
    if(!editingEmail){
        //change email to a text input
        $('#email-section')[0].lastChild.remove();
        const form = '<form><input type="text" id="new-email" value=' + email + '></form>';
        $('#email-section').append(form)
        //change text in btn
        $('#edit-email-btn')[0].innerText = 'done';
        editingEmail = true;
    }else{
        //get input and change email variable
        const newEmail = $('#new-email').val();
        const res = changeEmail(newEmail);
        if (res.status === 200 && res.newEmail != email) {
            email = res.newEmail;
        } else {
            alert('Email Change Failed.')
        }
        $('#email-section form').remove();
        load_info($('#email-section'), email, "email");
        //change text in btn
        $('#edit-email-btn')[0].innerText = 'edit';
        editingName = false
    }
})
//---password---
$('#edit-pw-btn').click(function () {
    if(!editingPW){
        //change password to a text input
        $('#password').remove();
        const oldPasswordForm = '<form><input type="text" id="old-pw" placeholder="old password"></form>';
        const newPasswordForm = '<form><input type="text" id="new-pw" placeholder="new password"></form>';
        $('#password-section').append(oldPasswordForm);
        $('#password-section').append(newPasswordForm);
        //change text in btn
        $('#edit-pw-btn')[0].innerText = 'done';
        editingPW = true;
    }else{
        const oldPW = $('#old-pw').val();
        const newPW = $('#new-pw').val();
        changePassword(oldPW, newPW);
        $('#password-section form').remove();
        $('#password-section').append($('<h2 id="password">******</h2>'));
        //change text in btn
        $('#edit-pw-btn')[0].innerText = 'edit';
        editingPW = false;
        console.log(password)
    }
})

//log out
$('#logout-section').click(function(){
    sessionStorage.setItem('user', null);
    sessionStorage.setItem('admin', null);
    window.location = '../login/login.html';
})

function changeName(newName){
    const url = '/views/setting/setting.html/changeName';
    const data = {
        userid: sessionStorage.getItem('user'),
        newName: newName
    }
    const request = new Request(url, {
        method: 'post', 
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });

    fetch(request).then(function(res) {
        return res;
    }).catch((error) => {
        console.log(error);
    })
}

function changeEmail(newEmail){
    const url = '/views/setting/setting.html/changeEmail';
    const data = {
        userid: sessionStorage.getItem('user'),
        newEmail: newEmail
    }
    const request = new Request(url, {
        method: 'post', 
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });

    fetch(request).then(function(res) {
        return res;
    }).catch((error) => {
        console.log(error);
    })
}

function changePassword(oldPW, newPW){
    if (newPW == ''){
        alert('New Password Cannot Be Empty.')
        return false;
    }
    const url = '/views/setting/setting.html/changePassword';
    const data = {
        userid: sessionStorage.getItem('user'),
        oldPassword: oldPW,
        newPassword: newPW,
    }
    const request = new Request(url, {
        method: 'post', 
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });

    fetch(request).then(function(res) {
        if (res.status === 200 && res.notice === null) {
            return true;
        } else if (res.notice !== null) {
            alert(res.notice);
        } else {
            alert('Password Change Failed');
        }
    }).catch((error) => {
        console.log(error);
    })

    return false;
}
function getUserName(){
    const url = 'views/setting/setting.html/getUsername';
    const data = {userid: sessionStorage.getItem('user')};
    const request = new Request(url, {
        method: 'post', 
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    fetch(request).then(function(res) {
        return res.username;
    }).catch((error) => {
        console.log(error);
    })
}

function getEmail(){
    const url = 'views/setting/setting.html/getEmail';
    const data = {userid: sessionStorage.getItem('user')};
    const request = new Request(url, {
        method: 'post', 
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    fetch(request).then(function(res) {
        return res.email;
    }).catch((error) => {
        console.log(error);
    })
}
