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

const users = [{
        username: "Yun1",
        email: "yun@mail.com",
        password: "yun1",
        course: course1
    },
    {
        username: "Yun2",
        email: "yun2@mail.com",
        password: "yun2",
        course: course2
    },
    {
        username: "Yun3",
        email: "yun3@mail.com",
        password: "yun3",
        course: course3
    }
];


// initialize table body
const body = users.map(u =>
    `<tr id=this.rowIndex>
        <td>${u.username }</td>
        <td>${u.email}</td>
        <td>
            <i id="${u.username}" onclick="allCourses(this.id)" class = "el-icon-notebook-1" data-toggle = "modal" data-target="#muteModal"></i>
        </td>
        <td>
            <i id="edit+${u.username}" class="el-icon-edit" data-toggle="modal" data-target="#editModal"></i>
        </td>
        <td>
            <i id="delete" onclick = "del(this)" class = "el-icon-delete" data-toggle = "modal" data-target="deleteModal"></i>
        </td>
    </tr>`);

body.forEach(element => {
    document.querySelector("#tableBody").innerHTML += element;
});

// delete a user
function del(row) {
    var i = row.parentNode.parentNode;
    i.parentNode.removeChild(i);
}

// initial muteCourses modal
function allCourses(username) {
    let body = "";
    for (u of users) {
        if (u.username === username) {
            for (c of u.course) {
                if (c.mute) {
                    body += `<p> ${c.course} 
                                <i id="${username}${c.course}" class="el-icon-turn-off-microphone" onclick="changeStatus('${username}', '${c.course}')">
                                </i>
                            </p>`;
                } else if (!c.mute) {
                    body += `<p> ${c.course} 
                                <i id="${username}${c.course}" class="el-icon-microphone" alt="nMute" onclick="changeStatus('${username}', '${c.course}')">
                                </i>
                            </p>`;
                }
            }
            document.getElementById("courseBody").innerHTML = body;
        }
    }
}

function changeStatus(username, course) {
    // change status in user
    let status;
    for (u of users) {
        if (u.username === username) {
            for (c of u.course) {
                if (c.course = course) {
                    c.mute = !c.mute;
                    status = c.mute;
                    break;
                }
            }
            break;
        }
    }

    // change image
    let x = document.getElementById(`${username}${c.course}`);
    console.log(x.src)
    if (c.mute) {
        x.alt = "Mute";
        x.className = "el-icon-turn-off-microphone";
    } else {
        x.alt = "nMute";
        x.className = "el-icon-microphone";
    }
}

// edit user's information
function saveEdit(e) {
    // this.id <=> e
    console.log(e);
    console.log("!!!!!!!!!!!!!!!!!!")
        // modified value
    const newName = document.getElementById("username").value;
    const newEmail = document.getElementById("email").value;
    const newPasswd = document.getElementById("pw").value;
    const body = document.getElementById("tableBody");


    const changeHeader = e.parentNode.parentNode.children[0].innerText;
    let row;
    for (let i = 0; i <= body.childNodes.length; i++) {
        console.log(body.childNodes[i].children.textContent);
        console.log(changeHeader);
        if (body.childNodes[i].children.textContent == changeHeader)
            console.log(r);
    }

    const changeInfo = e.parentNode.parentNode.children[1]
}