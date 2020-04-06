//import { isMainThread } from "worker_threads";
const currUserID = sessionStorage.getItem('user')
console.log(currUserID)
if(currUserID == null){
    document.location.href="/";
    // const url = '/'
    // fetch(url)
    // .then((res)=> {
    //     if(res.status === 200){
    //         console.log(res)
    //     }else{
    //         alert('could not get to the page')
    //     }
    // })
}



//variables
var courses = [
    {
        courseCode: "CSC309",
        courseName: "Web Development",
        assessments: [
            { assessment: "A1", weight: 5, mark: 90 },
            { assessment: "A2", weight: 5, mark: 85 },
            { assessment: "midterm", weight: 10, mark: null }
        ]

    },
    {
        courseCode: "INI318",
        courseName: "Writing & Rhetoric of Health",
        assessments: [
            { assessment: "essay1", weight: 15, mark: 60 },
            { assessment: "A1", weight: null, mark: 85 },
            { assessment: "midterm", weight: 5, mark: null }
        ]

    },
    {
        courseCode: "CSC301",
        courseName: "Introduction to Software Engineering",
        assessments: [
            { assessment: "A1", weight: 5, mark: 90 },
            { assessment: "A2", weight: 5, mark: 85 },
            { assessment: "midterm", weight: 20, mark: 74 }
        ]

    }
]
const log = console.log

// server call to get all courses information
// const userID = sessionStorage.getItem("user")

// $.ajax({
//     type: "GET",
//     url: "/courseInfo",
//     async: false,
//     data: JSON.stringify({"userID": `${userID}`}),
//     success: function (data, status) {
//         if (status == "success") {
//             console.log(data);
//             courses = data;
//         }
//     }
// })
// console.log(`courses: ${courses}`)

//get all courses
//get the courses of the current user and display them on the page
function getUserCourses() {
    const url = '/views/courses/courses.html/user/' + currUserID;

    // Since this is a GET request, simply call fetch on the URL
    fetch(url)
    .then((res) => { 
        console.log(url);
        if (res.status === 200) {
           return res.json()
       } else {
            alert('Could not get courses')
       }                
    })
    .then((json) => {  // the resolved promise with the JSON body
        const courses = json.courses
        console.log(courses)
        courses.map((course) => {
            displayCourse(course);
        })
    }).catch((error) => {
        console.log(error)
    })
}
getUserCourses()

//display a course
const coursesContainer = $('#courses-container')[0];
function displayCourse(course) {
    const ele = $(
        `<div class="course-container card-styling" id='${course.courseID}'>
            <h2> ${course.courseCode} : ${course.courseTitle} </h2>
            <div class="triangle-down"></div>
        </div>`)[0];
    coursesContainer.append(ele);
}
//expand the course after triangle is clicked
//$('.triangle-down').click(function (e)
$(document).on('click', '.triangle-down', function (e) {
    const courseContainer = $(e.target).parent()[0];
    const courseID = $(e.target).parent().attr('id');
    log(courseID)
    e.target.remove()
    //add the table
    const table = generateHeaderRow();
    courseContainer.append(table);
    const btn = $('<button class="add-assess-btn">add assessment</button>')[0];
    courseContainer.append(btn)

    $.ajax({
        type: "GET",
        url: "/displayAssessments/"+currUserID,
        async: false,
        contentType: "application/json",
        data: JSON.stringify({ "userID": `${currUserID}`, "courseID": `${courseID}` }),
        traditional: true,
        success: function (data, status) {
            if (status == "success") {
                courses = data
                log(courses)
            }
        },
        error: function (e) {
            console.log(`Error Displaying Assessments: ${e}`);
        }
    })


    const course = courses.filter(course => course.courseID == courseID)[0];
    course.assessments.map((item) => {
        table.append(generateTableRow(item.assessment, item.weight, item.mark))
    })
    table.append(generateInputRow());

    const mark = estimateFinalMark(course);
    const markContainer = $('<div class="final-mark-container"><h3>Estimated Final Mark: </h3><h3 class="mark">' + mark + '</h3></div>')[0];
    courseContainer.append(markContainer);
    courseContainer.append($('<div class="triangle-up"></div>')[0]);


})

//add assessment after button is clicked 
$(document).on('click', '.add-assess-btn', function (e) {
    const table = $($($(e.target).parent()[0]).children()[1])[0];    
    const tableRowList = $($($($(e.target).parent()[0]).children()[1])[0]).children();
    const newAssessment = $(tableRowList.find(".new-assessment")[0]).val();    
    const newWeight = $(tableRowList.find(".new-weight")[0]).val();    
    const newMark = $(tableRowList.find(".new-mark")[0]).val();
    const row = generateTableRow(newAssessment == "" ? null : newAssessment,
        (newWeight.toString() == "") ? null : newWeight,
        (newMark.toString() == "") ? null : newMark);

    $(table).children()[$(table).children().length - 1].before(row);
    
    //modify variable
    const courseCode = $(e.target).parent().attr('id');

    const course = courses.filter(course => course.courseCode == courseCode)[0];
    course.assessments.push({
        assessment: newAssessment == "" ? null : newWeight,
        weight: newWeight == "" ? null : newWeight,
        mark: newMark == "" ? null : newMark
    })
    //update eatimate final mark
    $($(e.target).parent().find('.mark')[0])[0].innerText = estimateFinalMark(course);
    //empty the input values
    tableRowList.find('input').toArray().map(input => {
        $(input).val("")
    })

})

//output a table element with header row ready
function generateHeaderRow() {
    const table = $('<table></table>')[0];
    const ele = `<tr>
                    <th>
                        <h3>Assessment</h3>
                    </th>
                    <th>
                        <h3>Weight (%)</h3>
                    </th>
                    <th>
                        <h3>Mark (%)</h3>
                    </th>
                </tr>`;

    table.append($(ele)[0]);
    return table;
}

function generateTableRow(assessment, weight, mark) {
    const row = $('<tr></tr>')[0];
    row.append(generatetd(assessment, "assessment-td"));
    row.append(generatetd(weight, "weight-td"));
    row.append(generatetd(mark, "mark-td"));
    return row;

}

function generateInputRow() {
    const row = $('<tr></tr>')[0];
    row.append($('<td><input type="text" class="new-assessment" placeholder="assessment name"/></td>')[0]);
    row.append($('<td><input type="text" class="new-weight" placeholder="leave blank if not sure"/></td>')[0]);
    row.append($('<td><input type="text" class="new-mark" placeholder="leave blank if not sure"/></td>')[0]);
    return row;

}
//generate <td><h3>value</td> as an element, value is a string
function generatetd(value, className) {
    let valueToDisplay = value;
    if (value === null) {
        valueToDisplay = "?";
    }
    return $('<td class="' + className + '"><h3 class="changable-text">' + valueToDisplay.toString() + '</h3></td>')[0];
}
//calculate the estimate mark for a course, return a mark as a string 
function estimateFinalMark(course) {
    const validAssessments = course.assessments.filter(a => (a.weight != null && a.mark != null));
    if (validAssessments.length === 0) {
        return "?";
    }
    let totalWeight = validAssessments.reduce((acc, a) => {
        acc += parseFloat(a.weight);
        return acc
    }, 0);
    let finalMark = 0;
    validAssessments.map((a) => {
        finalMark += parseFloat(a.weight) / totalWeight * parseFloat(a.mark);
    })
    return Math.round(finalMark).toString();
}
//
//collapse the container after up triangle is clicked
$(document).on('click', '.triangle-up', function (e) {
    const courseContainer = $(e.target).parent()[0];
    //remove the last 3 elements: table, estimated mark, up triangle
    for (let i = $(courseContainer).children().length - 1; i > 0; i--) {
        $(courseContainer).children()[i].remove();
    }
    courseContainer.append($('<div class="triangle-down"></div>')[0]);
})

//modify weight and mark
$(document).on('click', '.changable-text', function (e) {
    const tdEle = $($($(e.target)[0]).parent()[0]);
    tdEle.empty();
    const inputEle = $('<input type="text" class="changable-input"/> <button class="done-btn">done</button>');
    tdEle.append(inputEle)
})

$(document).on('click', '.done-btn', function (e) {
    let result = null;
    for (let i = 0; i < $(e.target).parent().parent().parent().children().length; i++) {
        const list = $($(e.target).parent().parent().parent().children()[i]).find($($(e.target).parent()));
        if (list.length != 0) {
            result = i;
        }
    }
    const assessmentIndex = result - 1;

    const courseCode = $($(e.target)[0]).parent().parent().parent().parent().attr('id');
    const className = $($(e.target).parent()[0]).attr('class');
    const newValue = $(e.target).parent().find('.changable-input').val();
    const valueToStore = newValue == "" ? null : newValue.toString();
    const valueToDisplay = newValue == "" ? "?" : newValue.toString();
    const td = $(e.target).parent()
    td.empty();

    td.append($('<h3 class="changable-text">' + valueToDisplay + '</h3>'));

    const course = courses.filter(course => course.courseCode == courseCode)[0];
    if (className == "assessment-td") {
        course.assessments[assessmentIndex].assessment = valueToStore;
    } else if (className == "weight-td") {
        course.assessments[assessmentIndex].weight = valueToStore;
    }
    else {
        course.assessments[assessmentIndex].mark = valueToStore;
    }

    //update mark
    td.parent().parent().parent().find('.mark')[0].innerText = estimateFinalMark(course);


});



//display the add course form after clicking +
$(document).on('click', '#add-course-container img', function (e) {
    const addCourseContainer = $('#add-course-container');
    addCourseContainer.empty();
    //add form 
    const form = $(`<form>
                        <div>
                            <h3>Course Code: </h3>
                            <input type="text" id="course-code" />
                        </div><br>
                        <div>
                            <h3>Course Title: </h3>
                            <input type="text" id="course-title" />
                        </div><br>
                        <button id="add-course-btn">Add Course</button>
                    </form>`);
    addCourseContainer.append(form)
})
//add course to the course list
$(document).on('click', '#add-course-btn', function (e) {
    e.preventDefault()
    const code = $('#course-code').val();
    const name = $('#course-title').val();

    const url = '/views/courses/courses.html/addCourse';
    let data = {
        userID: currUserID,
        courseCode: code,
        courseName: name
    }
    const request = new Request(url, {
        method: 'post', 
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });

    fetch(request)
    .then((res) => { 
        if (res.status === 200) {
           return res.json()
       } else {
            alert('Could not add the course')
       }                
    })
    .then((json) => {  // the resolved promise with the JSON body
        console.log(json)
        //display course
        const courseToAdd = {
            courseID: json.courseID,
            courseCode: code,
            courseTitle: name
        }
        displayCourse(courseToAdd);
        //change add course section back 
        $('#add-course-container form')[0].remove()
        $('#add-course-container').append($('<img src="add-24px.svg" alt="+">'))

    }).catch((error) => {
        console.log(error)
    })


})