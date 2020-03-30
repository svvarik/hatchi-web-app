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
    console.log(rowIndex);
    let body = "";
    const index = rowIndex.split("-")[1];
    const username = USERS[index].username;
    for (u of USERS) {
        if (u.username === username) {
            for (crs of u.groups) {
                var crName, mute;
                for (ky in crs){
                    crName = ky;
                    mute = crs[ky];
                }
                if (mute) {
                    body += `<p> ${crName}
                                <i id="${username}-${crName}" class="fas fa-microphone-slash" onclick="changeStatus('${username}', '${crName}')">
                                </i>
                            </p>`;
                } else if (!mute) {
                    body += `<p> ${crName}
                                <i id="${username}-${crName}" class="fas fa-microphone-alt" alt="nMute" onclick="changeStatus('${username}', '${crName}')">
                                </i>
                            </p>`;
                }
            }
            console.log(body);
            document.getElementById("courseInfo").innerHTML = body;
        }
    }
}

// change status
function changeStatus(uName, cName) {
    // console.log("changeStatus(" + uname + ", " + cname + ")");
    for (u of USERS) {
        if (u.username === uName) {
            for (eachCourse of u.groups) {
                var crName, mute;
                for (ky in eachCourse){
                    crName = ky;
                    mute = eachCourse[ky];
                }
                if (crName == cName) {
                    eachCourse[ky] = !eachCourse[ky];
                    break;
                }
            }
            break;
        }
    }

    // change image
    let x = document.getElementById(`${uName}-${cName}`);
    console.log(x);
    console.log(x.className);
    if (mute) {
        x.alt = "Mute";
        x.className = "fas fa-microphone-slash";
    } else {
        x.alt = "nMute";
        x.className = "fas fa-microphone-alt";
    }
}

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