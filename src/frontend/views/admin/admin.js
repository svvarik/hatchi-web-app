const log = console.log;
// -------------------------- User table ----------------------------
var dataDisplay;
$.ajax({
    type: "GET",
    url: "/userInfo",
    async: false,
    success: function (data, status) {
        if (true) {
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
                <i class='fas fa-trash-alt' id="delete-${index}" data-toggle="modal" data-target="#deleteModal" onclick=showDeleteModal(this)>
            </td>
        </tr>`
}
document.getElementById("mainTB").innerHTML = html;

// -------------------------- /User table ----------------------------

// -------------------------- closing modal ----------------------------
function closeDeleteModal() {
    $('#deleteModal').modal('hide');
}
// -------------------------- /closing modal ----------------------------

// -------------------------- Mute Modal ----------------------------

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
    // 页面的mute modal信息没改
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
    var newPasswd = document.getElementById("editPw").value;

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


// show/hide the notification box
function popUpNotification() {
    var pop = document.getElementById("reportMsg");
    if (pop.style.display == "none") {
        pop.style.display = "block";
    } else {
        pop.style.display = "none";
    }
}