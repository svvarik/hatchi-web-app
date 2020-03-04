// variables
const courseColors = {
    CSC309: "rgb(0, 75, 0)",
    CSC301: "rgb(255, 107, 0)",
    MAT235: "rgb(255, 192, 0)",
    INI318: "rgb(187, 0, 0)", 
    STA247: "rgb(0, 174, 17)"
};

const myID = 'user'
const groupChats = [
    {
        id:1,
        groupName: 'INI318',
        isBlocked: false,
        messages: [['hi', 'A'], 
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
//List all the groupchats (this info should get from the database)
groupChats.map((groupChat) => {
    const groupChatEle = $('<div class="groupChat card-styling chat-style"><h2>' + groupChat.groupName + '</h2></div>');
    const topBorderStyle = "20px solid " + courseColors[groupChat.groupName];
    groupChatEle.css("border-top", topBorderStyle);
    $('#groupChatsList').append(groupChatEle)
})

//show chat window for clicked group chat
$('.groupChat').click(function(){
    const group = findgroup(this.firstChild.innerText)
    
    $('#chatWindow').empty();
    const courseNameContainer = '<div id="courseNameContainer"><h3>' + group.groupName + '</h3></div>';
    $('#chatWindow').append(courseNameContainer);

    const msgContainer = '<div id="msgsContainer"></div>';
    $('#chatWindow').append(msgContainer);
    group.messages.map((msg) => {
        let profile;
        let msgContent;
        if(msg[1] === myID){
            profile = '<div class="userMe">' + profileImg + '<p>' + msg[1] + '</p></div>';
            msgContent = '<div class="myMsgContent"><p class="msgText">' + msg[0] + '</p></div>';

        }else{
            profile = '<div class="user">' + profileImg + '<p>' + msg[1] + '</p></div>';
            msgContent = '<div class="msgContent"><p class="msgText">' + msg[0] + '</p><h3 class="report-btn">report</h3></div>';

        }
        const msgEle = '<div class="msg">' + profile + msgContent + '</div>';
        $('#msgsContainer').append(msgEle);

    })

    const sendContainer = '<div id="sendContainer"><form><input type="text" id="msgInput" /><div id="sendButton">Send</div></form></div>';
    $('#chatWindow').append(sendContainer)
})
//helper function for above function
function findgroup(groupChatName){
    let groupToReturn = null;
    groupChats.map((group) => {
        if(group.groupName === groupChatName){
            groupToReturn = group;
        }
    })
    return groupToReturn;
}
//send message functionality
$(document).on('click', '#sendButton', function(){

    const msgToSend = $('#msgInput').val();
    const profile = '<div class="userMe">' + profileImg + '<p>' + myID + '</p></div>';
    const msgContent = '<div class="myMsgContent"><p class="msgText">' + msgToSend + '</p></div>';
    const msgEle = '<div class="msg">' + profile + msgContent + '</div>';
    const courseName = $('#courseNameContainer')[0].firstChild.innerText;
    groupChats.map((group) => {
        if(group.groupName === courseName){
            if(group.isBlocked){
                alert("You are muted due to one of your previous messages contained inappropiate content!")
                
            }else{
                group.messages.push([msgToSend, myID]);
                $('#msgsContainer').append(msgEle);
            }
            
        }
    })
    var elem = document.getElementById('msgsContainer');
    elem.scrollTop = elem.scrollHeight;
})
//helper fucntion for the above function
function addMsgToChat(courseName, msg){
    groupChats.map((group) => {
        if(group.groupName === courseName){
            if(group.isBlocked){
                alert("You are muted due to your previous message contained inappropiate content ")
                
            }else{
                group.messages.push([msg, myID])
            }
            
        }
    })
}
//do not refresh the page if group chat icon in the menu is clicked 
$('#currPage').click(function( event ) {
    event.preventDefault();
})
//report functionality
$(document).on('click', '.report-btn', function(e){
    alert("Report is sent to the administrator.");
    const userName = $(e.target).parent().parent().find('.user p')[0].innerText;
    const message = $(e.target).parent().find('p')[0].innerText
    reports.push({user: userName, reportedMsg: message})
} )