if (sessionStorage.getItem('user') === null){
    redirectToHomePage();
}


getUserName();
getEmail();
let editingName = false;
let editingEmail = false;
let editingPW = false;
// let email = $('#email')[0].innerText;

$('#edit-name-btn').click(function () {
    if(!editingName){
        let userName = $('#username')[0].innerText;
        //change username to a text input
        $('#name-section')[0].lastChild.remove();
        
        const form = '<form><input type="text" id="new-name" value=' + userName + '></form>';
        $('#name-section').append(form)
        //change text in btn
        $('#edit-name-btn')[0].innerText = 'done';
        editingName = true;
    }else{
        //get input and change username variable
        const newName = $('#new-name').val();

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

        fetch(request).then((response) => {
            return response.json();
          }).then(function(res){
            if (res.notice === null){          
                $('#name-section form').remove();      
                load_info($('#name-section'), newName, "username");
                $('#edit-name-btn')[0].innerText = 'edit';
                editingName = false
                alert('Username changed successfully')
            } else {
                alert(res.notice)                  
            }
          })        
    }
   
})

$('#edit-email-btn').click(function () {
    if(!editingEmail){
        let email = $('#email')[0].innerText;
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

        fetch(request).then((response) => {
            return response.json();
          }).then(function(res){
            if (res.notice === null){          
                $('#email-section form').remove();      
                load_info($('#email-section'), newEmail, "email");
                $('#edit-email-btn')[0].innerText = 'edit';
                editingEmail = false
                alert('Email changed Successfully')
            } else {
                alert(res.notice)                  
            }
          })      
    }
})


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

        fetch(request).then((response) => {
            return response.json();
          }).then(function(res){
            if (res.notice === null){          
                $('#password-section form').remove();
                $('#password-section').append($('<h2 id="password">******</h2>'));
                $('#edit-pw-btn')[0].innerText = 'edit';
                editingPW = false;
                alert('Password changed successfully')
            } else {
                alert(res.notice)                  
            }
          })      
    }
})

$('#logout-section').click(function(){
    redirectToHomePage();
})

function redirectToHomePage(){
    sessionStorage.setItem('user', null);
    sessionStorage.setItem('admin', null);
    window.location = '../../index.html';
}

function getUserName(){
    const url = '/views/setting/setting.html/getUsername';
    const data = {userid: sessionStorage.getItem('user')};    
    const request = new Request(url, {
        method: 'post', 
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });

    fetch(request).then((response) => {
        return response.json();
      }).then(function(res){
        load_info($('#name-section'), res.username, "username");
      })
}

function getEmail(){
    const url = '/views/setting/setting.html/getEmail';
    const data = {userid: sessionStorage.getItem('user')};
    const request = new Request(url, {
        method: 'post', 
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    fetch(request).then((response) => {
        return response.json();
      }).then(function(res){
        load_info($('#email-section'), res.email, "email");
      })
}

function load_info(Ele, value, id){
    const valueEle = '<h2 id=' + id + '>' + value + '</h2>';
    Ele.append(valueEle);
} 
