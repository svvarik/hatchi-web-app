// initial list of user
const course1 = [{
        course: "CSC309",
        mute: true
    },
    {
        course: "STA302",
        mute: true
    },
    {
        course: "MAT344",
        mute: false
    },
    {
        course: "MAT315",
        mute: false
    }
]

const course2 = [{
        course: "CSC309",
        mute: false
    },
    {
        course: "INI318",
        mute: false
    },
    {
        course: "CSC373",
        mute: false
    },
    {
        course: "CSC301",
        mute: false
    }
]

const course3 = [{
        course: "CSC309",
        mute: false
    },
    {
        course: "STA247",
        mute: false
    },
    {
        course: "CSC311",
        mute: false
    }
]

const USERS = [{
        username: "Yun1",
        email: "yun@mail.com",
        password: "yun1",
        groups: course1
    },
    {
        username: "Yun2",
        email: "yun2@mail.com",
        password: "yun2",
        groups: course2
    },
    {
        username: "Yun3",
        email: "yun3@mail.com",
        password: "yun3",
        groups: course3
    }
];


// initialize table body
let html = ""
for (const index in USERS) {
    html += `<tr id=${index}> 
                <td>${USERS[index].username}</td>
                <td>${USERS[index].email}</td>
                <td>
                    <img class="groupIcon" id="courses-${index}" src=group.svg data-toggle="modal" data-target="#muteModal" onclick=muteBody(this.id)>
                </td>
                <td>
                    <img class="editIcon" id="edit-${index}" src=pencil.svg data-toggle="modal" data-target="#updateModal" onclick=getIndex(this.id)>
                </td>
                <td>
                    <img class="delIcon" id="delete-${index}" src=trash.svg data-toggle="modal" data-target="#deleteModal" onclick=confirmDelete(this)>
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
            for (c of u.groups) {
                if (c.mute) {
                    body += `<p> ${c.course}
                                <i id="${username}-${c.course}" class="el-icon-turn-off-microphone" onclick="changeStatus('${username}', '${c.course}')">
                                </i>
                            </p>`;
                } else if (!c.mute) {
                    body += `<p> ${c.course}
                                <i id="${username}-${c.course}" class="el-icon-microphone" alt="nMute" onclick="changeStatus('${username}', '${c.course}')">
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
function changeStatus(uname, cname) {
    console.log("changeStatus(" + uname + ", " + cname + ")");
    for (u of USERS) {
        if (u.username === uname) {
            for (c of u.groups) {
                if (c.course == cname) {
                    c.mute = !c.mute;
                    break;
                }
            }
            break;
        }
    }

    // change image
    let x = document.getElementById(`${uname}-${cname}`);
    console.log(x);
    console.log(x.className);
    if (c.mute) {
        x.alt = "Mute";
        x.className = "el-icon-turn-off-microphone";
    } else {
        x.alt = "nMute";
        x.className = "el-icon-microphone";
    }
}

var editRow;

function getIndex(row_id) {
    editRow = row_id;
}
// save edit information
function saveEdit(saveButton) {
    console.log(saveButton);
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