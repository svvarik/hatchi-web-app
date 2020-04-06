const log = console.log;

// redirect to login page if admin is sign out
if(sessionStorage.getItem('admin') == 'null'){
    window.location.href = "/views/login/login.html"
}
// -------------------------- User table ----------------------------
var dataDisplay;
$.ajax({
    type: "GET",
    url: "/userInfo",
    async: false,
    success: function (data, status) {
        if (data) {
            console.log(data);
            dataDisplay = data;
        }
    }
})
console.log(`dataDisplay: ${dataDisplay}`)

let html = ""
USERS = dataDisplay
for (const index in USERS) {
    html += `<tr id=${index}> 
            <td>${USERS[index].username}</td>
            <td>${USERS[index].email}</td>
            <td>
                <i class='fas fa-comment-slash' id="courses-${index}" data-toggle="modal" data-target="#muteModal" onclick=muteBody(this.id)></i>
            </td>
            <td>
                <i class='fas fa-pencil-alt' id="edit-${index}" data-toggle="modal" data-target="#updateModal" onclick=editModal(this.id)></i>
            </td>
            <td>
                <i class='fas fa-trash-alt' id="delete-${index}" data-toggle="modal" data-target="#deleteModal" onclick=confirmDelete(this)>
            </td>
        </tr>`
}
document.getElementById("mainTB").innerHTML = html;
popUpNotification()

// -------------------------- /User table ----------------------------


// -------------------------- [closing modal] ----------------------------
function closeDeleteModal() {
    $('#deleteModal').modal('hide');
}
// -------------------------- /closing modal ----------------------------


// -------------------------- [Mute Modal] ----------------------------

// muteID = course-0, course-1.....
function muteBody(rowIndex) {
    console.log("muteBoday()")
    console.log(rowIndex);
    let body = "";
    const index = rowIndex.split("-")[1];
    const username = USERS[index].username;
    for (u of USERS) {
        if (u.username === username) {
            for (crs of u.groups) {
                console.log(crs)
                var crName, mute;
                crName = crs['key']
                mute = crs['value']
                if (mute) {
                    body += `<p> ${crName}
                                <i id="${username}-${crName}" class="fas fa-microphone-slash" onclick="changeIcon('${username}', '${crName}')">
                                </i>
                            </p>`;
                } else if (!mute) {
                    body += `<p> ${crName}
                                <i id="${username}-${crName}" class="fas fa-microphone-alt" alt="nMute" onclick="changeIcon('${username}', '${crName}')">
                                </i>
                            </p>`;
                }
            }
            document.getElementById("courseInfo").innerHTML = body;
        }
    }
}

// change the status of users in their group chat
function changeStatus(modal) {
    log("changeStatus")
    // get array of course data in the form ['csc108','true','csc309','false']
    var icons = document.getElementById('courseInfo').getElementsByTagName('i')
    log(icons)
    // if the user enrolled in courses
    if (icons.length != 0) {
        const courseCode = [];
        var username = icons[0].id.split('-')[0];

        // get the course code and it's status
        for (const i of icons) {
            var status;
            const course = i.id.split('-')[1]
            // course is not mute
            if (i.className == "fas fa-microphone-alt") {
                status = 'false';
            } else { // course is mute
                status = 'true';
            }
            courseCode.push(course)
            courseCode.push(status)
        }
        // send and get data from backend
        $.ajax({
            type: "POST",
            url: "/changeStatus",
            async: false,
            contentType: "application/json",
            data: JSON.stringify({ "username": `${username}`, "courseCode": `${courseCode}` }),
            traditional: true,
            success: function (data, status) {
                if (status == "success") {
                    console.log(`ussfully change ${courseCode} of ${username}`)
                    $('#muteModal').modal('hide');
                    log(icons[0].id)
                    location.reload(true);
                }
            },
            error: function (e) {
                console.log(e);
            }
        })
    } else {
        $('#muteModal').modal('hide');
    }
}

function changeIcon(uName, cName) {
    let icon = document.getElementById(`${uName}-${cName}`);
    if (icon.className == "fas fa-microphone-slash") {
        icon.alt = "nMute";
        icon.className = "fas fa-microphone-alt";
    } else {
        icon.alt = "Mute";
        icon.className = "fas fa-microphone-slash";
    }
}

// -------------------------- /Mute Modal ----------------------------


// -------------------------- [Edit Modal] ----------------------------
var editRow;

function editModal(row_id) {
    editRow = row_id;
    log(editRow)
}
// save edit information
function saveEdit(saveButton) {
    // console.log(saveButton);
    // modified value
    var newName = document.getElementById("editUName").value;
    var newEmail = document.getElementById("editEmail").value;
    // var newPasswd = document.getElementById("editPw").value;

    // user modified
    const currNode = document.getElementById(editRow).parentNode;
    log(currNode)
    const mailNode = currNode.previousElementSibling.previousElementSibling;
    log(mailNode)
    const nameNode = mailNode.previousElementSibling;
    log(nameNode)

    const username = nameNode.textContent
    const email = mailNode.textContent

    if (newName == "") {
        newName = username;
    }
    if (newEmail == "") {
        newEmail = email;
    }
    log("username:" + username)
    log("new name:" + newName)
    log("new email:" + newEmail)

    $.ajax({
        type: "POST",
        url: "/updateUserInfo",
        async: false,
        contentType: "application/json",
        data: JSON.stringify({ "username": `${username}`, "newName": `${newName}`, "newEmail": `${newEmail}`, }),
        success: function (data, status) {
            if (status == "success") {
                location.reload(true);
            }
        },
        error: function (e) {
            console.log(e);
        }
    })
}


// -------------------------- /Edit Modal ----------------------------


// -------------------------- [Notification] ----------------------------
// show/hide the notification box
function popUpNotification() {
    var reportMsg = [];
    $.ajax({
        type: "GET",
        url: "/reportMessage",
        async: false,
        success: function (data, status) {
            if (status=="success") {
                // data: list of message {username, groupCode, msg}
                log(data)
                reportMsg = data;
            }
        }
    })
    // reportMsg = [
    //     { username: 'user1', groupCode: 'csc309', msg: 'hahahaha' },
    //     { username: 'user2', groupCode: 'csc209', msg: '???' }
    // ]

    // shake the icon
    var classname;
    if (reportMsg.length != 0) {
        classname = 'far fa-bell shake'
    } else {
        var classname = 'far fa-bell'
    }
    document.getElementById("noteIcon").className = classname
    log(document.getElementById("noteIcon").className)

    const pop = document.getElementById("message");
    var html = ``
    var index=0;
    for (const m of reportMsg) {
        html += `<tr id="msg-${index}">
                    <td>${m.username}</td>
                    <td>${m.groupCode}</td>
                    <td>${m.msg}</td>
                    <td><span type="button" onclick="deleteMsg('${m.username}', '${m.groupCode}', '${m.msg}')">&#10003</span><td>
                </tr>`
    }
    pop.innerHTML = html

    const modal = document.getElementById('reportMsg');
    if (modal.style.display == "none") {
        modal.style.display = "block";
    } else {
        modal.style.display = "none";
    }
}

function deleteMsg(username, groupCode, msg){
    $.ajax({
        type: "POST",
        url: "/deleteMsg",
        async: false,
        contentType: "application/json",
        data: JSON.stringify({ "username": `${username}`, "groupCode": `${groupCode}`, "msg": `${msg}` }),
        success: function (data, status) {
            if (status =="success") {
                location.reload(true)
                document.getElementById("reportMsg").style.display == "block"
            }
        }
    })
    // $(btn).closest("tr").remove();
}

// -------------------------- /Notification ----------------------------


// -------------------------- [Delete modal] ----------------------------
// confirm delete
function confirmDelete(icon) {
    var txt;
    const row = icon.parentNode.parentNode;
    const username = row.getElementsByTagName("td")[0].textContent
    if (confirm(`Do you want to delete user ${username}?`)) {
        // const currNode = document.getElementById(del).parentNode;
        // const mailNode = currNode.previousElementSibling.previousElementSibling;
        // const nameNode = mailNode.previousElementSibling;
        // closeDeleteModal();

        $.ajax({
            type: "POST",
            url: "/deleteUser",
            async: false,
            contentType: "application/json",
            data: JSON.stringify({ "username": `${username}` }),
            success: function (data, status) {
                if (status == "success") {
                    location.reload(true);
                    // closeDeleteModal();
                }
            },
            error: function (e) {
                console.log(e);
            }
        })
        txt = `you delete user ${username}`;
    } else {
        txt = "You pressed Cancel!";
    }
    log(txt)
}


// -------------------------- /Delete modal ----------------------------

$("#signOut").click(function(){
    sessionStorage.setItem('admin', null);
})