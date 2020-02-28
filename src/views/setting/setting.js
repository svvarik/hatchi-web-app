// variables
let userName = "user";
let email = "user@user.com";
let password = "user";
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
        userName = newName;
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
        email = newEmail;
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
        if(oldPW === password && newPW != ''){
            password = newPW;
        }else if(newPW == ''){
            alert('New password cannot be empty');
        }else{
            alert('The old password you entered is incorrect!')
        }
        $('#password-section form').remove();
        $('#password-section').append($('<h2 id="password">******</h2>'));
        //change text in btn
        $('#edit-pw-btn')[0].innerText = 'edit';
        editingPW = false;
        console.log(password)
    }
})