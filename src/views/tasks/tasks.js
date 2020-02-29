//variables
const tasks = [
    {
        id: "t1",
        courseCode: "BIO220",
        taskName: "Infectious Disease Essay",
        dueDate: new Date(2020, 2, 28, 10),
        percentPeopleDone: 0.2,
        breakdowns: [
            {partName: "brainstorm", startTime: new Date(2020, 1, 20, 9), endTime: new Date(2020, 1, 20, 11)},
            {partName: "research", startTime: new Date(2020, 1, 25, 12), endTime: new Date(2020, 1, 25, 3)},
            {partName: "draft", startTime: new Date(2020, 2, 10, 9), endTime: new Date(2020, 2, 12, 9)},
            {partName: "final version", startTime: new Date(2020, 2, 22, 20), endTime: new Date(2020, 1, 23, 20)}
        ]
    },
    {
        id: "t2",
        courseCode: "CSC309",
        taskName: "project phase 1",
        dueDate: new Date(2020, 2, 28, 10),
        percentPeopleDone: 0.9,
        breakdowns: [
            {partName: "design", startTime: new Date(2020, 1, 25, 12), endTime: new Date(2020, 1, 25, 3)},
            {partName: "implement", startTime: new Date(2020, 2, 10, 9), endTime: new Date(2020, 2, 12, 9)}
        ]
    },
    {
        id: "t3",
        courseCode: "CSC373",
        taskName: "assignment 2",
        dueDate: new Date(2020, 2, 28, 10),
        percentPeopleDone: 0.1,
        breakdowns: [
            {partName: "draft", startTime: new Date(2020, 1, 20, 9), endTime: new Date(2020, 1, 20, 11)},
            {partName: "discuss", startTime: new Date(2020, 1, 25, 12), endTime: new Date(2020, 1, 25, 3)},
            {partName: "final version", startTime: new Date(2020, 2, 22, 20), endTime: new Date(2020, 1, 23, 20)}
        ]
    }
    
]
const l = console.log
l(tasks[0].dueDate)

//display the tasks
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
                '<h2 class="task-name">' + task.courseCode + ": " +
                task.taskName + '</h2>' +
                '<h5 class="due-date">Due: ' + task.dueDate.toDateString() +
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
                            '<h2>Due: ' + task.dueDate.toDateString() + '</h2></div>';
    $('.page-content').append(detailContainer);
    const table = generateHeaderRow();
    $('.task-detail').append(table);
    
    task.breakdowns.map(breakdown => {
        table.append(generateTableRow(breakdown.partName, breakdown.startTime.toDateString(), breakdown.endTime.toDateString()));
    })
    $('.task-detail').append('<div id="check-btn-container"><img id="check-btn" src="check_circle_outline-24px.svg" alt=""></div>')
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
    row.append($('<td><input type="text" class="new-mark"/></td>')[0]);
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