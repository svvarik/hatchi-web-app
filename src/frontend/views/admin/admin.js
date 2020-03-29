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
                <i class='fas fa-pencil-alt' id="edit-${index}" data-toggle="modal" data-target="#updateModal" onclick=getIndex(this.id)></i>
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

// mute-Modal body
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

function getIndex(row_id) {
    editRow = row_id;
}
// save edit information
function saveEdit(saveButton) {
    // console.log(saveButton);
    // modified value
    const newName = document.getElementById("editUName").value;
    const newEmail = document.getElementById("editEmail").value;
    const newPasswd = document.getElementById("editPw").value;

    // user modified
    const currNode = document.getElementById(editRow).parentNode;
    const mailNode = currNode.previousElementSibling.previousElementSibling;
    const nameNode = mailNode.previousElementSibling;

    if (newName != "") {
        nameNode.textContent = newName;
    }
    if (newEmail != "") {
        mailNode.textContent = newEmail;
    }
    closeUpdateModal();
}

// show/hide the notification box
function popUpNotification() {
    var pop = document.getElementById("reportMsg");
    if (pop.style.display == "none") {
        pop.style.display = "block";
    } else {
        pop.style.display = "none";
    }
}