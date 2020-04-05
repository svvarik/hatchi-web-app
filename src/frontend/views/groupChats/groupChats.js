
const currUserID = sessionStorage.getItem('user')
console.log(currUserID)
if(currUserID == null){
    document.location.href="/";
    // const url = '/'
    // fetch(url)
    // .then((res)=> {
    //     if(res.status === 200){
    //         console.log(res)
    //     }else{
    //         alert('could not get to the page')
    //     }
    // })
}


// variables

const profileImg = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'

//random color generator function
function generateColor(){
    const color = "rgb(" + generateColorValue().toString() + ", " +
                        generateColorValue().toString() + ", " + 
                        generateColorValue().toString() +
            ")";
    return color;
}
function generateColorValue(){
    return Math.floor(Math.random() * 255);
}

//get the courses of the current user and display them on the page
function getUserCourses() {
    const url = '/views/groupChats/groupChats.html/user/' + currUserID;
    // Since this is a GET request, simply call fetch on the URL
    fetch(url)
    .then((res) => { 
        if (res.status === 200) {
           return res.json()
       } else {
            alert('Could not get groupChats')
       }                
    })
    .then((json) => {  // the resolved promise with the JSON body
        const courses = json.courses
        courses.map((course) => {
            const groupChatEle = $('<div class="groupChat card-styling chat-style" id=' + course.courseID + '><h2>' + course.courseCode + '</h2></div>');
            const topBorderStyle = "20px solid " + generateColor();
            groupChatEle.css("border-top", topBorderStyle);
            $('#groupChatsList').append(groupChatEle)
        })
    }).catch((error) => {
        console.log(error)
    })
}
getUserCourses()


//show chat window for clicked group chat
$(document).on('click', '.groupChat', function(){
    const courseCode = this.firstChild.innerText;
    const courseID = $(this).attr('id')

    //find course object in the database with courseID
    const url = '/views/groupChats/groupChats.html/course' + '/' + courseID;

    fetch(url)
    .then((res) => { 
        if (res.status === 200) {
            // return a promise that resolves with the JSON body
           return res.json()
       } else {
            alert('Could not get the specified group')
       }                
    })
    .then((json) => {  // the resolved promise with the JSON body
        const msgs = json.msgList
        openChatBox(courseCode, courseID, msgs)
        
    }).catch((error) => {
        console.log(error)
    })
})

function openChatBox(courseCode, courseID, msgs){

    $('#chatWindow').empty();
    const courseNameContainer = '<div class="courseNameContainer" id=' + courseID + '><h3>' + courseCode + '</h3></div>';
    $('#chatWindow').append(courseNameContainer);

    const msgContainer = '<div id="msgsContainer"></div>';
    $('#chatWindow').append(msgContainer);
    msgs.map((msg) => {
        let profile;
        let msgContent;
        if(msg.userID === currUserID){
            profile = '<div class="userMe">' + profileImg + '<p>' + msg.username + '</p></div>';
            msgContent = '<div class="myMsgContent"><p class="msgText">' + msg.text + '</p></div>';
        }else{
            profile = '<div class="user" id=' + msg.userID + '>' + profileImg + '<p>' + msg.username + '</p></div>';
            msgContent = '<div class="msgContent"><p class="msgText">' + msg.text + '</p><h3 class="report-btn">report</h3></div>';
        }
        const msgEle = '<div class="msg">' + profile + msgContent + '</div>';
        $('#msgsContainer').append(msgEle);
    })
    const sendContainer = '<div id="sendContainer"><form><input type="text" id="msgInput" /><div id="sendButton">Send</div></form></div>';
    $('#chatWindow').append(sendContainer)
    const elem = document.getElementById('msgsContainer');
    elem.scrollTop = elem.scrollHeight;
}


//send message functionality
$(document).on('click', '#sendButton', function(){

    const msgToSend = $('#msgInput').val();
    const courseID = $('.courseNameContainer').attr('id')

    const url = '/views/groupChats/groupChats.html/sendMsg';
    let data = {
        courseID: courseID,
        text: msgToSend, 
        userID: currUserID
    }
    const request = new Request(url, {
        method: 'post', 
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });

    fetch(request)
    .then((res) => { 
        if (res.status === 200) {
           return res.json()
       } else {
            alert('Could not send the message')
       }                
    })
    .then((json) => {  // the resolved promise with the JSON body
        const msg = json.msgInfo
        if(msg.muted){
            alert('You have been muted.')
        }else{
            const profile = '<div class="userMe">' + profileImg + '<p>' + msg.username + '</p></div>';
            const msgContent = '<div class="myMsgContent"><p class="msgText">' + msg.text + '</p></div>';
            const msgEle = '<div class="msg">' + profile + msgContent + '</div>';
            $('#msgsContainer').append(msgEle);
            const elem = document.getElementById('msgsContainer');
            elem.scrollTop = elem.scrollHeight;
        }
        
    }).catch((error) => {
        console.log(error)
    })

    const elem = document.getElementById('msgsContainer');
    elem.scrollTop = elem.scrollHeight;
    const textInput = document.getElementById('msgInput');
    textInput.value = '';
})

// upon receive new message
Pusher.logToConsole = false;
var pusher = new Pusher('dcccc60c3687f9c8066f', {
    cluster: 'us2',
    forceTLS: true
});
var channel = pusher.subscribe('msg');
channel.bind('send-msg', function(data) {
    if(data.userID == currUserID){
        return
    }
    groupChatEleList = $('.groupChat')
    if($('.courseNameContainer').attr('id') == data.courseID){//need to display msg
        const profile = '<div class="user">' + profileImg + '<p>' + data.username + '</p></div>';
        const msgContent = '<div class="MsgContent"><p class="msgText">' + data.text + '</p></div>';
        const msgEle = '<div class="msg">' + profile + msgContent + '</div>';
        $('#msgsContainer').append(msgEle);
        const elem = document.getElementById('msgsContainer');
        elem.scrollTop = elem.scrollHeight;
    }
});


//do not refresh the page if group chat icon in the menu is clicked 
$('#currPage').click(function( event ) {
    event.preventDefault();
})


//report functionality
$(document).on('click', '.report-btn', function(e){
    
    const userID = $(e.target).parent().parent().find('.user').attr('id')
    const message = $(e.target).parent().find('p')[0].innerText
    const courseID =$(e.target).parent().parent().parent().parent().find('.courseNameContainer').attr('id')

    // the URL for the request
    const url = '/views/groupChats/groupChats.html/report';

    // The data we are going to send in our request
    let data = {
        courseID: courseID,
        msgContent: message, 
        userID: userID
    }
    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: 'post', 
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });

    //Send the request with fetch()
    fetch(request)
    .then(function(res) {

        if (res.status === 200) {
           
           alert("Report is sent to the administrator.");
        } else {
           alert("Unable to report this message")
     
        }
    }).catch((error) => {
        console.log(error)
    })
} )
