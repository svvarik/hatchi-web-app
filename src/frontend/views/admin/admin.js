// // initial list of user
// const course1 = [{
//     course: "CSC309",
//     mute: true
// },
// {
//     course: "STA302",
//     mute: true
// },
// {
//     course: "MAT344",
//     mute: false
// },
// {
//     course: "MAT315",
//     mute: false
// }
// ]

// const course2 = [{
//     course: "CSC309",
//     mute: false
// },
// {
//     course: "INI318",
//     mute: false
// },
// {
//     course: "CSC373",
//     mute: false
// },
// {
//     course: "CSC301",
//     mute: false
// }
// ]

// const course3 = [{
//     course: "CSC309",
//     mute: false
// },
// {
//     course: "STA247",
//     mute: false
// },
// {
//     course: "CSC311",
//     mute: false
// }
// ]

// const USERS = [{
//     username: "Yun1",
//     email: "yun@mail.com",
//     password: "yun1",
//     groups: course1
// },
// {
//     username: "Yun2",
//     email: "yun2@mail.com",
//     password: "yun2",
//     groups: course2
// },
// {
//     username: "Yun3",
//     email: "yun3@mail.com",
//     password: "yun3",
//     groups: course3
// }
// ];


// -----------------------------------------------------------------
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
console.log(dataDisplay)
// -----------------------------------------------------------------


let html = ""
USERS = dataDisplay.username
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
            </td>
        </tr>`
}
document.getElementById("mainTB").innerHTML = html;

// closing modal
function closeMuteModal() {
    $('#muteModal').modal('hide');
}

function closeUpdateModal() {
    $('#updateModal').modal('hide');
}

function closeDeleteModal() {
    $('#deleteModal').modal('hide');
}

// confirm delete
function confirmDelete(row) {
    let i = row.parentNode.parentNode;
    i.parentNode.removeChild(i);
    closeDeleteModal();
}

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