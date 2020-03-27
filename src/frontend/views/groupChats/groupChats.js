// const socket = io.connect()

// variables
const courseColors = {
    CSC309: "rgb(0, 75, 0)",
    CSC301: "rgb(255, 107, 0)",
    MAT235: "rgb(255, 192, 0)",
    INI318: "rgb(187, 0, 0)", 
    STA247: "rgb(0, 174, 17)"
};
const tempColor = "rgb(255, 192, 0)";
const myID = 'Elisa'
const myRealID = '5e77884b67878059494966a2'
const currUserID = '5e7d5a1935577101064fa228'
const groupChats = [
    {
        id:1,
        groupName: 'INI318',
        isBlocked: false,
        messages: [['hi', 'A'], //should store user id
                  ['this is INI318 group chat', 'B'],
                  ['Lorem ipsum dolor sit amet, conslentesque ut mas, consectetur adipiscing elit. Pellentesque ut mas, consectetur adipiscing elit. Pellentesque ut mas', 'x'],
                  ['this is INI318 group chat', 'B'],
                  ['this is INI318 group chat', 'B'],
                ]
    },
    {
        id:2,
        groupName: 'MAT235',
        isBlocked: false,
        messages: [['hi', 'A'], 
                  ['this is MAT235 group chat', 'B'],
                  ['Lorem ipsum dolor sit amet, consectetur adipis. Pellentesque ut mas, consectetur adipiscing elit. Pellentesque ut mas', 'x'],
                  ['this is MAT235 group chat', 'user'],
                  ['this is MAT235 group chat', 'B'],
                  ['this is MAT235 group chat', 'x'],
                  ['this is MAT235 group chat', 'A']
                
                ]
    },
    {
        id:3,
        groupName: 'STA247',
        isBlocked: true,
        messages: [['hi', 'A'], 
                  ['this is sta247 group chat', 'B']]
    }
]

const reports = [];
const profileImg = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'

let localGroups = [];//["2", "csc108", false]
const courseIDIndex = 0;
const courseCodeIndex = 1;
const courseMutedIndex = 2;

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
    console.log("getCurrUser called")
    // the URL for the request
    const url = '/views/groupChats/groupChats.html/user/' + currUserID;

    // Since this is a GET request, simply call fetch on the URL
    fetch(url)
    .then((res) => { 
        if (res.status === 200) {
            // return a promise that resolves with the JSON body
           return res.json()
       } else {
            alert('Could not get groupChats')
       }                
    })
    .then((json) => {  // the resolved promise with the JSON body
        const courses = json.courses
        courses.map((course) => {
            const groupChatEle = $('<div class="groupChat card-styling chat-style" id=' + course.courseID + '><h2>' + course.courseCode + '</h2></div>');
            const topBorderStyle = "20px solid " + tempColor;
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
    console.log(courseID)

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
        console.log(json)
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
}


//send message functionality
$(document).on('click', '#sendButton', function(){

    const msgToSend = $('#msgInput').val();
    const courseCode = $('#courseNameContainer')[0].firstChild.innerText;
    const courseID = findCourseID(courseCode)

    const profile = '<div class="userMe">' + profileImg + '<p>' + myID + '</p></div>';
    const msgContent = '<div class="myMsgContent"><p class="msgText">' + msgToSend + '</p></div>';
    const msgEle = '<div class="msg">' + profile + msgContent + '</div>';
   
    localGroups.map(course => {
        if(course[courseCodeIndex] === courseCode){
            if(course[courseMutedIndex]){
                alert("You are muted due to one of your previous messages contained inappropiate content!")
                
            }else{
                socket.emit('send message', {ID: "5", text: msgToSend, userID: myRealID, courseID: courseID, reported: false});
                //group.messages.push([msgToSend, myID]);
                $('#msgsContainer').append(msgEle);
            }
            
        }
    })
    const elem = document.getElementById('msgsContainer');
    elem.scrollTop = elem.scrollHeight;
    const textInput = document.getElementById('msgInput');
    textInput.value = '';
})




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




    // reports.push({user: userName, reportedMsg: message})


    //save to admin 

    //save to course
} )

//socketio
//receiving incoming messages 
socket.on('new message', data => {
    console.log(data)
    if(data.userID === myID){
        return
    }
    console.log(data)
    const msgReceived = data.text;
    const userID = data.userID;
    const profile = '<div class="user">' + profileImg + '<p>' + userID + '</p></div>';
    const msgContent = '<div class="MsgContent"><p class="msgText">' + msgReceived + '</p></div>';
    const msgEle = '<div class="msg">' + profile + msgContent + '</div>';
    const groupToFindID = data.groupID
    groupChats.map((group) => {
        if(group.id === groupToFindID){
                
                group.messages.push([msgReceived, userID]);
                $('#msgsContainer').append(msgEle);
            
        }
    })
    const elem = document.getElementById('msgsContainer');
    elem.scrollTop = elem.scrollHeight;
})