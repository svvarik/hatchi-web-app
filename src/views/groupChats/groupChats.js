// variables
const myID = 'user'
const groupChats = [
    {
        id:1,
        groupName: 'CSC309',
        color: 'rgba(187, 0, 0, 1)',
        clicked: false,
        messages: [['hi', 'A'], 
                  ['this is csc309 group chat', 'B'],
                  ['Lorem ipsum dolor sit amet, conslentesque ut mas, consectetur adipiscing elit. Pellentesque ut mas, consectetur adipiscing elit. Pellentesque ut mas', 'x'],
                  ['this is csc309 group chat', 'B'],
                  ['this is csc309 group chat', 'B'],
                ]
    },
    {
        id:2,
        groupName: 'CSC373',
        color: 'rgba(48, 39, 206, 1)',
        clicked: true,
        messages: [['hi', 'A'], 
                  ['this is csc373 group chat', 'B'],
                  ['Lorem ipsum dolor sit amet, consectetur adipis. Pellentesque ut mas, consectetur adipiscing elit. Pellentesque ut mas', 'x'],
                  ['this is csc373 group chat', 'B'],
                  ['this is csc373 group chat', 'B'],
                  ['this is csc373 group chat', 'x'],
                  ['this is csc373 group chat', 'A'],
                  ['this is csc373 group chat', 'B'],
                  ['this is csc373 group chat', 'x'],
                  ['this is csc373 group chat', 'B'],
                  ['this is csc373 group chat', 'B'],
                  ['this is csc373 group chat', 'x'],
                  ['this is csc373 group chat', 'A'],
                  ['this is csc373 group chat', 'B'],
                  ['this is csc373 group chat', 'x'],
                  ['this is csc373 group chat', 'A']
                
                ]
    },
    {
        id:3,
        groupName: 'STA248',
        color: 'rgba(255, 107, 0, 1)',
        clicked: false,
        messages: [['hi', 'A'], 
                  ['this is sta248 group chat', 'B']]
    }
]
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
    const groupChatEle = $('<div class="groupChat card-styling"><h2>' + groupChat.groupName + '</h2></div>');
    const topBorderStyle = "10px solid " + generateColor();
    console.log(topBorderStyle)
    groupChatEle.css("border-top", topBorderStyle);
    $('#groupChatsList').append(groupChatEle)
})

//show chat window for clicked group chat
$('.groupChat').click(function(){
    $('#chatWindow').empty();
    const group = findgroup(this.firstChild.innerText)
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
            msgContent = '<div class="msgContent"><p class="msgText">' + msg[0] + '</p></div>';

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
    $('#msgsContainer').append(msgEle);
    const courseName = $('#courseNameContainer')[0].firstChild.innerText;
    addMsgToChat(courseName, msgToSend);
})
//helper fucntion for the above function
function addMsgToChat(courseName, msg){
    groupChats.map((group) => {
        if(group.groupName === courseName){
            group.messages.push([msg, myID])
        }
    })
}
//do not refresh the page if group chat icon in the menu is clicked 
$('#currPage').click(function( event ) {
    event.preventDefault();
})