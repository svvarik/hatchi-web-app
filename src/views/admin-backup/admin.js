//variables
const students = [{
            id: 1,
            userName: "user",
            email: "user@user.com",
            pw: "user",
            courses: [{
                    courseName: 'CSC309',
                    isMuted: false
                },
                {
                    courseName: "BIO220",
                    isMuted: true
                },
                {
                    courseName: "MAT257",
                    isMuted: false
                }
            ]
        },
        {
            id: 2,
            userName: "user2",
            email: "user2@user.com",
            pw: "user2",
            courses: [{
                    courseName: "CSC309",
                    isMuted: false
                },
                {
                    courseName: "BIO220",
                    isMuted: false
                },
                {
                    courseName: "MAT257",
                    isMuted: false
                }
            ]
        }
    ]
    //display all the students
students.map((student) => {
    const tableEle = $('table')
    const trEle = '<tr id=' + student.id + '><td class="user-name">' + student.userName +
        '</td><td class="user-email">' + student.email + '</td><td>' +
        getCoursesEle(student) + '</td><td><ul>' +
        '<li><input class="new-name" type="text" placeholder="New Name"><button class="edit-btn save-name-btn">Save</button></li>' +
        '<li><input class="new-email" type="text" placeholder="New Email"><button class="edit-btn save-email-btn">Save</button></li>' +
        '<li><input class="new-pw" type="text" placeholder="New Password"><button class="edit-btn save-pw-btn">Save</button></li>' +
        '</ul></td></tr>'
    tableEle.append(trEle)
})

function getCoursesEle(student) {
    let result = '<ul>'
    student.courses.map(course => {
        const muteBtnText = (course.isMuted ? "unmute" : "mute")
        const ele = '<li>' + course.courseName + '<button class="mute">' + muteBtnText + '</button></li>';
        result += ele;
    })
    result += '</ul>'
    return result
}


$(document).on('click', '.mute', function(e) {
    //find the student
    const id = $(e.target).parent().parent().parent().parent().attr('id')
    const len = (e.target.innerText == 'mute') ? 4 : 6
    const innerText = $(e.target).parent()[0].innerText
    const courseName = innerText.slice(0, innerText.length - len)
    const course = findCourse(id, courseName)
    const btnText = (course.isMuted) ? "mute" : "unmute"
    course.isMuted = !course.isMuted;
    e.target.innerText = btnText
})

function findCourse(id, courseName) {
    const student = students.filter(student => student.id == id)[0];
    return student.courses.filter(course => course.courseName == courseName)[0]
}

$(document).on('click', '.edit-btn', function(e) {
    if ($(e.target).hasClass('save-name-btn')) {
        const newName = $(e.target).parent().find('.new-name').val()
        $(e.target).parent().find('.new-name').val("")
        const studentID = $(e.target).parent().parent().parent().parent().attr('id')
        const student = findStudent(studentID)
        student.userName = newName;
        $(e.target).parent().parent().parent().parent().find('.user-name')[0].innerText = newName

    } else if ($(e.target).hasClass('save-email-btn')) {
        const newEmail = $(e.target).parent().find('.new-email').val()
        $(e.target).parent().find('.new-email').val("")
        const studentID = $(e.target).parent().parent().parent().parent().attr('id')
        const student = findStudent(studentID)
        student.email = newEmail;
        $(e.target).parent().parent().parent().parent().find('.user-email')[0].innerText = newEmail
    } else {
        const newPW = $(e.target).parent().find('.new-pw').val()
        $(e.target).parent().find('.new-pw').val("")
        const studentID = $(e.target).parent().parent().parent().parent().attr('id')
        const student = findStudent(studentID)
        student.pw = newPW;
    }
})

function findStudent(id) {
    return students.filter(student => student.id == id)[0]
}