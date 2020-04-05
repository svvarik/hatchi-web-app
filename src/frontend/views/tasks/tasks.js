//variables
const currUserID = sessionStorage.getItem('user')
console.log(currUserID)

const getUrl = "https://fast-crag-76695.herokuapp.com/user-tasks/5e7d5a1935577101064fa228"

let tasks;

// fetch(getUrl).then((res) => {
//     tasks = JSON.parse(res)
// })
// let currID = 4;
// const l = console.log

//display the tasksnpm
const tasksContainer = $('tasks-content');
displayAllTasks();
function displayAllTasks(){
    tasks.map(task => {
        displayTask(task);
    })
}

function displayTask(task){
    const ele = '<div class="card-styling box task-box" id=' + task.id + '>' +
                '<div class="task-color-bar"></div>' +
                '<div class="task-box-content">' +
                '<h2 class="task-name">' + task.course + ": " +
                task.title + '</h2>' +
                '<h5 class="due-date">Due: ' + task.endDate.toDateString() +
                '</h5><div><img class="edit-btn" src="edit-24px.svg" alt="edit"></div></div></div>';
    $('#add-task-box').before(ele);
}

//display task detail after clicked
$(document).on('click', '.edit-btn', function (e){
    const taskID = $(e.target).parent().parent().parent().attr('id')
    //find the task to be displayed
    const task = findTask(taskID);
    showTaskDetail(task);
        
    
    l( )
    //
})
function showTaskDetail(task){
    //l(task)
    const detailContainer = '<div class="overlay"></div>' +   
                            '<div class="task-detail card-styling" id=' + task.id + '><div>' + 
                            '<img id="close-btn" src="close-24px.svg" alt="close"></div>' +
                            '<h1>' + task.taskName + '</h1>' +
                            '<h2>Due: ' + task.endDate.toDateString() + '</h2></div>';
    $('.page-content').append(detailContainer);
    const table = generateHeaderRow();
    $('.task-detail').append(table);
    l(task.subtasks)
    task.subtasks.map(breakdown => {
        table.append(generateTableRow(breakdown.title, breakdown.startDate.toDateString(), breakdown.endDate.toDateString()));
    })
    $('.task-detail').append(`<div id="check-btn-container">
                                <img id="check-btn" src="check_circle_outline-24px.svg" alt="">
                                <span class="tooltiptext">Complete</span>
                            </div>`)
}
function findTask(taskID){
    return tasks.filter(task => task.id == taskID)[0];
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
    const inputs = '<div id="add-task-inputs"><div>' +
                    '<h3>Course Code: </h3><input type="text" id="new-task-course">' +
                    '</div><br><div><h3>Task Name: </h3><input type="text" id="new-task-name">' +
                    '</div><br><div><h3>Weight: </h3><input type="number" min="1" max="5" step="0.01" id="new-task-weight">' +
                    '</div><br><div><h3>Due Date: </h3><input type="date" id="new-task-due-date">' +
                    '</div><br><div><h3>Due Time: </h3><input type="time" id="new-task-due-time">' +
                    '</div></div>';
    $('.add-task h1').after(inputs);    
})
//next is clicked when adding task 
let newTask = null; 
$(document).on('click', '#to-breakdown-btn', function(){
    //get and store all useful information
    const courseCode = $('#new-task-course').val()
    const name = $('#new-task-name').val()
    const dueDate = $('#new-task-due-date').val()
    const dueTime= $('#new-task-due-time').val()
    const weight = $('#new-task-weight').val()
    const dateToStore = new Date(dueDate.slice(0,4), dueDate.slice(5,7)-1, dueDate.slice(8,10), dueTime.slice(0,2), dueTime.slice(3,5))

    newTask = {
        "course": courseCode,
        "title": name,
        "endDate": dateToStore,
        "weight": weight,
        "mark": 0
    }

    const reqUrl = "http://127.0.0.1:5000/user-tasks/" + "5e7d5a1935577101064fa228"

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
        const newTaskId = json.taskId;
        newTask.displayId = newTaskId
    }).catch((error) => {
        console.log(error)
    })
    
    //empty the window
    $('#add-task-inputs').empty();
    //add new inputs to window
    const inputs = '<div><h3>Subtask Name: </h3><input type="text" id="new-subtask-name">' +
                    '</div><br><div><h3>Start Time: </h3><input type="date" id="subtask-start-date" ><input type="time" id="subtask-start-time">' +
                    '</div><br><div><h3>End Time: </h3><input type="date" id="subtask-end-date" ><input type="time" id="subtask-end-time"></div>' +
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
    const startDate = $('#subtask-start-date').val();
    const startTime = $('#subtask-start-time').val();
    const endDate = $('#subtask-end-date').val();
    const endTime = $('#subtask-end-time').val();
    
    const newSubTask = {
        title: breakdownName,
        startDate: new Date(startDate.slice(0, 4), startDate.slice(5, 7)-1, startDate.slice(8, 10), startTime.slice(0, 2), startTime.slice(3,5)),
        endDate: new Date(endDate.slice(0, 4), endDate.slice(5, 7)-1, endDate.slice(8, 10), endTime.slice(0, 2), endTime.slice(3,5))
    }
    
    // const newBreakdown = {
    //     partName: breakdownName,
    //     startTime: new Date(startDate.slice(0, 4), startDate.slice(5, 7)-1, startDate.slice(8, 10), startTime.slice(0, 2), startTime.slice(3,5)),
    //     endTime: new Date(endDate.slice(0, 4), endDate.slice(5, 7)-1, endDate.slice(8, 10), endTime.slice(0, 2), endTime.slice(3,5))
    // }

    const subReqUrl = "http://127.0.0.1:5000/user-tasks/" + "5e7d5a1935577101064fa228/" + newTask.id

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
            alert('Could not add new task');
            $('.page-content').find('.overlay').remove();
            $('.page-content').find('.add-task').remove();
       }                
    })
    .then((json) => {  // the resolved promise with the JSON body
        newTask.subtasks = []
        newTask.subtasks.push(newBreakdown);
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
    const endDate = $('#subtask-end-date').val();
    const endTime = $('#subtask-end-time').val();

    const newSubTask = {
        title: breakdownName,
        startDate: new Date(startDate.slice(0, 4), startDate.slice(5, 7)-1, startDate.slice(8, 10), startTime.slice(0, 2), startTime.slice(3,5)),
        endDate: new Date(endDate.slice(0, 4), endDate.slice(5, 7)-1, endDate.slice(8, 10), endTime.slice(0, 2), endTime.slice(3,5))
    }

    const addTask = new Request(url, {
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