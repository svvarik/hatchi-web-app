//variables
const currUserID = sessionStorage.getItem('user')
console.log(currUserID)
const l = console.log


const getTasksUrl = "/tasks/user-tasks/" + currUserID
const getCoursesUrl = "/views/courses/courses.html/user/" + currUserID

const tasks = []
const courses = []
fetch(getTasksUrl).then((res) => {
    if (res.status === 200) {
        // return a promise that resolves with the JSON body
       return res.json()
   } else {
        alert('Could not get the specified group')
   }   
}).then((json) => {  // the resolved promise with the JSON body
    console.log(json);
    json.map(x => {
        tasks.push(x)
    })
    tasks.map(x => {
        displayTask(x);
    })
}).catch((error) => {
    console.log(error)
});


fetch(getCoursesUrl).then((res) => {
    if (res.status === 200) {
        // return a promise that resolves with the JSON body
       return res.json()
   } else {
        alert('Could not get the specified group')
   }   
}).then((json) => {  // the resolved promise with the JSON body
    console.log(json);
    json.courses.map(x => {
        courses.push(x)
    })
}).catch((error) => {
    console.log(error)
});

//display the tasksnpm
const tasksContainer = $('tasks-content');
function displayAllTasks(){
    while(tasks.length > 0) {
        tasks.pop();
    }
    fetch(getTasksUrl).then((res) => {
        if (res.status === 200) {
            // return a promise that resolves with the JSON body
           return res.json()
       } else {
            alert('Could not get the specified group')
       }   
    }).then((json) => {  // the resolved promise with the JSON body
        console.log(json);
        json.map(x => {
            tasks.push(x)
        })
        tasks.map(task => {
            displayTask(task);
        })
    }).catch((error) => {
        console.log(error)
    });
}

function displayTask(task){
    fetch('/tasks/task-info/'+task.course).then((res) => {
        if (res.status === 200) {
            // return a promise that resolves with the JSON body
           return res.json()
       } else {
            alert('Could not get the specified group')
       }
    }).then((data) => {
        const courseName = data.name;
        endDate = new Date(task.endDate);
        const ele = '<div class="card-styling box task-box" id=' + task._id + '>' +
                    '<div class="task-color-bar"></div>' +
                    '<div class="task-box-content">' +
                    '<h2 class="task-name">' + courseName + ": " +
                    task.title + '</h2>' +
                    '<h5 class="due-date">Due: ' + endDate.toDateString() +
                    '</h5><div><img class="edit-btn" src="edit-24px.svg" alt="edit"></div></div></div>';
        $('#add-task-box').before(ele);
    });
}

//display task detail after clicked
$(document).on('click', '.edit-btn', function (e){
    const taskID = $(e.target).parent().parent().parent().attr('id')
    console.log(taskID);
    //find the task to be displayed
    const task = findTask(taskID);
    showTaskDetail(task);
})

function courseSelector(){
    console.log(courses);
    let openTag = '<select id=select-courses>';
    console.log(courses.length);
    for(let i = 0; i < courses.length; i++) {
        openTag +=  '<option value=' + courses[i].courseID + ' id=' + courses[i].courseID+ '>' + courses[i].courseCode + ": " + courses[i].courseTitle + '</option>'
    }
    openTag += '</select>';
    return openTag;
}

function showTaskDetail(task){
    const endDate = new Date(task.endDate).toDateString()
    const detailContainer = '<div class="overlay"></div>' +   
                            '<div class="task-detail card-styling" id=' + task._id + '><div>' + 
                            '<img id="close-btn" src="close-24px.svg" alt="close"></div>' +
                            '<h1>' + task.title + '</h1>' +
                            '<h2>Due: ' + endDate + '</h2></div>';
    $('.page-content').append(detailContainer);
    const table = generateHeaderRow();
    $('.task-detail').append(table);
    task.subTasks.map(breakdown => {
        const subTaskDate = new Date(breakdown.startDate).toDateString();
        const subTaskDate1 = new Date(breakdown.endDate).toDateString();
        table.append(generateTableRow(breakdown.title, subTaskDate, subTaskDate1));
    })
    $('.task-detail').append(`<div id="check-btn-container">
                                <img id="check-btn" src="check_circle_outline-24px.svg" alt="">
                                <span class="tooltiptext">Complete</span>
                            </div>`)
}
function findTask(taskID){
    return tasks.filter(task => task._id == taskID)[0];
}

//output a table element with header row ready
function generateHeaderRow(){
    const table = $('<table></table>')[0];
    const ele = '<tr><th><h3>Breakdown</h3></th><th><h3>Start Time</h3></th><th><h3>End Time</h3></th></tr>';
    
    table.append($(ele)[0]);
    return table;
}
function generateTableRow(breakdown, sTime, eTime){
    const row = $('<tr></tr>')[0];
    row.append(generatetd(breakdown, "breakdown-td"));
    row.append(generatetd(sTime, "sTime-td"));
    row.append(generatetd(eTime, "eTime-td"));
    return row;

}
function generateInputRow(){
    const row = $('<tr></tr>')[0];
    row.append($('<td><input type="text" class="new-breakdown" /></td>')[0]);
    row.append($('<td><input type="text" class="new-start-time" /></td>')[0]);
    row.append($('<td><input type="text" class="new-end-time"/></td>')[0]);
    return row;

}
//generate <td><h3>value</td> as an element, value is a string
function generatetd(value, className){
    let valueToDisplay = value;
    if(value === null){
        valueToDisplay = "?";
    }
    return $('<td class="' + className + '"><h3 class="changable-text">' + valueToDisplay.toString() + '</h3></td>')[0];
}

//close fucntionality
$(document).on('click', '#close-btn', function (){
    removeSmallWindow();
})
//remove task functionality
$(document).on('click', '#check-btn', function (e){
    removeSmallWindow();
    const id = $(e.target).parent().parent().attr('id');
    removeTask(id);
    const boxes = $('.tasks-content').children();
    for(let i = boxes.length - 2; i >= 0; i--){
        $(boxes[i]).remove();
    }
    displayAllTasks();
})
//remove task in tasks variable, taskID is a string
function removeTask(taskID){
    for(let i = 0; i < tasks.length; i++){
        if(tasks[i].id == taskID){
            tasks.splice(i, 1);
            break;
        }
    }
}

function removeSmallWindow(){
    $('.page-content').find('.overlay').remove();
    $('.page-content').find('.task-detail').remove();
}

//add task functionality
$(document).on('click', '#add-task-box', function (){
    const addTaskContainer = '<div class="overlay"></div>' +
                            '<div class="add-task card-styling">' +
                            '<div id="close-btn-container">' + 
                            '<img id="close-add-task-btn" src="close-24px.svg" alt=""></div>' +
                            '<h1>Add Task</h1><div id="to-breakdown-btn">' + 
                            '<img src="arrow_right_alt-24px.svg" alt=""></div></div></div>';
    $('.page-content').append(addTaskContainer);
    console.log(courseSelector());
    const inputs = '<div id="add-task-inputs"><div>' +
                    '<h3>Course</h3>' + courseSelector() +
                    '</div><br><div><h3>Task Name: </h3><input type="text" id="new-task-name">' +
                    '</div><br><div><h3>Weight: </h3><input type="number" min="1" max="100" step="0.01" id="new-task-weight">' +
                    '</div><br><div><h3>Due Date: </h3><input type="date" id="new-task-due-date">' +
                    '</div><br><div><h3>Due Time: </h3><input type="time" id="new-task-due-time">' +
                    '</div></div>';
    $('.add-task h1').after(inputs);    
})
//next is clicked when adding task 
let newTask = null; 
$(document).on('click', '#to-breakdown-btn', function(){
    //get and store all useful information
    const courseId = $('#select-courses').val()
    const name = $('#new-task-name').val()
    const dueDate = $('#new-task-due-date').val()
    const dueTime= $('#new-task-due-time').val() 
    const weight = $('#new-task-weight').val()
    const dateToStore = new Date(dueDate.slice(0,4), dueDate.slice(5,7)-1, dueDate.slice(8,10), dueTime.slice(0,2), dueTime.slice(3,5))

    newTask = {
        "subTasks": [],
        "courseId": courseId,
        "title": name,
        "startDate": Date.now,
        "endDate": dateToStore,
        "weight": weight,
        "mark": 0
    }
    
    console.log(newTask);

    const reqUrl = "/tasks/user-tasks/" + currUserID;

    const request = new Request(reqUrl, {
        method: 'post', 
        body: JSON.stringify(newTask),
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
            alert('Could not add new task');
            $('.page-content').find('.overlay').remove();
            $('.page-content').find('.add-task').remove();
       }                
    })
    .then((json) => {  // the resolved promise with the JSON body
        newTaskId = json[json.length - 1]._id;
        newTask.id = newTaskId;
        console.log(newTask);
    }).catch((error) => {
        console.log(error)
    })
    
    //empty the window
    $('#add-task-inputs').empty();
    //add new inputs to window
    const inputs = '<div><h3>Subtask Name: </h3><input type="text" id="new-subtask-name">' +
                    '<p>Please choose hourly blocks, thank you! </p>' +
                    '</div><br><div><h3>Start Date & Time: </h3><input type="date" id="subtask-start-date" ><input type="time" step=3600" id="subtask-start-time">' +
                    '</div><br><div><h3>End Time: </h3><input type="time" step="3600" id="subtask-end-time"></div>' +
                    '<button id="add-more-subtask-btn">Add Next Subtask</button>';
    $('.add-task h1')[0].innerText = "Break Down to Subtasks";
    $('#add-task-inputs').append(inputs); 
    //change btn
    $('#to-breakdown-btn').attr('id', "finish-add-btn")
})
//after clicking next button on break down page
$(document).on('click', '#finish-add-btn', function(){
    //get and store all useful information
    const breakdownName = $('#new-subtask-name').val();
    const sDate = $('#subtask-start-date').val();
    const sTime = $('#subtask-start-time').val();
    console.log(sTime);
    const eDate = sDate;
    const eTime = $('#subtask-end-time').val();
    const newSubTask = {
        title: breakdownName,
        startDate: new Date(sDate.slice(0, 4), sDate.slice(5, 7)-1, sDate.slice(8, 10), sTime),
        endDate: new Date(eDate.slice(0, 4), eDate.slice(5, 7)-1, eDate.slice(8, 10), eTime), 
        startTime: sTime,
        endTime: eTime,
        completed: false
    };

    
    // const newBreakdown = {
    //     partName: breakdownName,
    //     startTime: new Date(startDate.slice(0, 4), startDate.slice(5, 7)-1, startDate.slice(8, 10), startTime.slice(0, 2), startTime.slice(3,5)),
    //     endTime: new Date(endDate.slice(0, 4), endDate.slice(5, 7)-1, endDate.slice(8, 10), endTime.slice(0, 2), endTime.slice(3,5))
    // }

    const subReqUrl = "/tasks/user-tasks/" + currUserID + "/" + newTask.id

    const addTask = new Request(subReqUrl, {
        method: 'post', 
        body: JSON.stringify(newSubTask),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });


    fetch(addTask)
    .then((res) => { 
        if (res.status === 200) {
           return res.json()
       } else {
            alert('Could not add new subtask');
            $('.page-content').find('.overlay').remove();
            $('.page-content').find('.add-task').remove();
       }                
    })
    .then((json) => {  // the resolved promise with the JSON body
        console.log(json);
        newTask.subtasks = []
        newTask.subtasks.push(newSubTask);
        tasks.push(newTask);
    }).catch((error) => {
        console.log(error)
    })

    //remove the window [refactor]
    $('.page-content').find('.overlay').remove();
    $('.page-content').find('.add-task').remove();
    //reload the tasks [refactor]
    const boxes = $('.tasks-content').children();
    for(let i = boxes.length - 2; i >= 0; i--){
        $(boxes[i]).remove();
    }
    displayAllTasks();
})

$(document).on('click', '#add-more-subtask-btn', function(){
    //get and store all useful information
    const breakdownName = $('#new-subtask-name').val();
    const startDate = $('#subtask-start-date').val();
    const startTime = $('#subtask-start-time').val();
    const endDate = startDate;
    const endTime = $('#subtask-end-time').val();
    console.log("Start Date:" + new Date(startDate.slice(0, 4), startDate.slice(5, 7)-1, startDate.slice(8, 10), startTime.slice(0, 2), startTime.slice(3,5)))
    console.log("End Date:" + new Date(endDate.slice(0, 4), endDate.slice(5, 7)-1, endDate.slice(8, 10), endTime.slice(0, 2), endTime.slice(3,5)))

    const newSubTask = {
        title: breakdownName,
        startDate: new Date(startDate.slice(0, 4), startDate.slice(5, 7)-1, startDate.slice(8, 10), startTime.slice(0, 2), startTime.slice(3,5)),
        endDate: new Date(endDate.slice(0, 4), endDate.slice(5, 7)-1, endDate.slice(8, 10), endTime.slice(0, 2), endTime.slice(3,5)), 
        completed: false
    }

    const addTaskUrl = "/tasks/user-tasks/" + currUserID + "/" + newTask.id

    const addTask = new Request(addTaskUrl, {
        method: 'post', 
        body: JSON.stringify(newSubTask),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });


    fetch(addTask)
    .then((res) => { 
        if (res.status === 200) {
           return res.json()
       } else {
            alert('Could not add new task');
            $('.page-content').find('.overlay').remove();
            $('.page-content').find('.add-task').remove();
       }                
    })
    .then((json) => {  // the resolved promise with the JSON body
        newTask.subtasks.push(newSubTask);
    }).catch((error) => {
        console.log(error)
    })

    const inputFields = $('#add-task-inputs input');
    for(let i = 0; i < inputFields.length; i++){
        l($(inputFields[i]).val())
        $(inputFields[i]).val('');
        l($(inputFields[i]).val())
    }
})
$(document).on('click', '#close-add-task-btn', function(){
    $('.page-content').find('.overlay').remove();
    $('.page-content').find('.add-task').remove();
})