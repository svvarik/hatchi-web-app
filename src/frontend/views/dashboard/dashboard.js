// Hard Coded Colour Palette, would require server calls dependent on user settings
const courseColors = {
    CSC309: "rgb(0, 75, 0)",
    CSC301: "rgb(255, 107, 0)",
    MAT235: "rgb(255, 192, 0)",
    INI318: "rgb(187, 0, 0)", 
    STA247: "rgb(0, 174, 17)"
};

const currUserID = sessionStorage.getItem('user')
console.log(currUserID);


const getTasksUrl = '/tasks/course-tasks/' + currUserID

const calEvents = []

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
        const courseTitle = x.courseTitle;
        x.tasks.map(task => {
            const mainTitle = task.title;
            task.subTasks.map(subTask => {
                newSubTask = {}
                newSubTask.course = courseTitle;
                newSubTask.mainTask = mainTitle;
                newSubTask.name = subTask.title;
                if(subTask.startTime){
                    newSubTask.startTime = subTask.startTime;
                }
                newSubTask.date = new Date(subTask.startDate);
                newSubTask.endDate = new Date(subTask.endDate);
                newSubTask.id = subTask._id
                calEvents.push(newSubTask);
            })
        })
    })
    layoutMonth(new Date());
    displayNotifications();
}).catch((error) => {
    console.log(error)
});


// Calendar Event Objects (Hard Coded Event Data) 
// const calEventInfo1 = {
//     id: 0,
//     mainTask: "Essay on Effects of Obesity", 
//     name: "Brainstorm",
//     course: "INI318", 
//     date: new Date("March 3, 2020 12:00"),
//     endDate: new Date("March 3, 2020 14:00")
// };

// const calEventInfo2 = {
//     id: 1,
//     mainTask: "Essay on Effects of Obesity", 
//     name: "Research",
//     course: "INI318", 
//     date: new Date("April 5, 2020 8:00"),
//     endDate: new Date("April 5, 2020 10:00")
// };

// const calEventInfo3 = {
//     id: 2,
//     mainTask: "Problem Set", 
//     name: "Q1",
//     course: "STA247", 
//     date: new Date("March 5, 2020 16:00"),
//     endDate: new Date("March 5, 2020 17:00")
// };

// const calEventInfo4 = {
//     id: 3,
//     mainTask: "Problem Set", 
//     name: "Q2",
//     course: "STA247", 
//     date: new Date("March 6, 2020 12:00"),
//     endDate: new Date("March 6, 2020 13:00")
// };

// const calEvents = [calEventInfo2];

// Useful Date Constants 
const daysOfWeek = {
    0: "Sun",
    1: "Mon",
    2: "Tue",
    3: "Wed", 
    4: "Thur", 
    5: "Fri",
    6: "Sat"
}

const months = {
    0: "January", 
    1: "February", 
    2: "March", 
    3: "April", 
    4: "May", 
    5: "June", 
    6: "July", 
    7: "August", 
    8: "September", 
    9: "October", 
    10: "November", 
    11: "December"
}


// Constantly modified DOM elements
const calendarDisplay = document.getElementById("calendarBox");
const test = document.getElementById("render-cal")
const buttons = document.querySelectorAll("button.calendar-button")



function layoutDay(date){
    calendarDisplay.innerHTML = '';
    for(let i = 8; i < 25; i++){
        // Cal row 
        const calRow = document.createElement("div");
        calRow.classList.add("calendar-row");
        // Time stamp box 
        const timeStamp = document.createElement("div");
        timeStamp.classList.add("time-stamp")
        calRow.appendChild(timeStamp);
        // Time space slot 
        const timeSpace = document.createElement("div");
        timeSpace.classList.add("time-space");
        timeSpace.id = formatDateId(date, i);
        calRow.appendChild(timeSpace);
        // Label 
        const timeLabel = document.createElement("h6");
        timeLabel.appendChild(document.createTextNode(i+":00"));
        timeStamp.appendChild(timeLabel);
        calendarDisplay.appendChild(calRow);
    }
    populateDayView(calEvents);
    document.querySelectorAll("div.cal-event").forEach (calEvent => {
        calEvent.addEventListener('click', displayEventInfo);
    })
}

function layoutWeek(date){
    calendarDisplay.innerHTML = '';
    // Add the time labels
    const newTimeColumn = createWeekTimesCol(8, 16);
    calendarDisplay.appendChild(newTimeColumn);
    // For loop to generate seven days based on current date
    let startDate = date;
    for(i = 0; i < 7; i++){
        const newDayColumn = createDayCol(startDate, 8, 16);
        startDate.setDate(startDate.getDate()+1)
        calendarDisplay.appendChild(newDayColumn);
    }
    populateWeekView(calEvents);
    document.querySelectorAll("div.cal-event").forEach (calEvent => {
        calEvent.addEventListener('click', displayEventInfo);
    })
}


function createDayCol(date, startTime, numSlots){
    // Column for day
    const newDayColumn = document.createElement("div");
    newDayColumn.classList.add("calendar-column-day");
    // Day label
    const dayLabel = document.createElement("h3");
    dayLabel.appendChild(document.createTextNode(daysOfWeek[date.getDay()]));
    dayLabel.classList.add("day-label");
    newDayColumn.appendChild(dayLabel);
    // Append number of time slots to column
    for(let i = startTime; i < (numSlots+startTime+1); i++){
        const dayTimeBlock = document.createElement("div");
        dayTimeBlock.classList.add("day-time-block");
        dayTimeBlock.id = formatDateId(date, i)
        newDayColumn.appendChild(dayTimeBlock);
    }
    return newDayColumn;
}


function createWeekTimesCol(startTime, numSlots){
    // Column for time labels
    const newTimeColumn = document.createElement("div");
    newTimeColumn.classList.add("calendar-column-label");
    // First blank slot
    const placeHolder = document.createElement("div");
    placeHolder.classList.add("time-label-block");
    placeHolder.id = "#placeHolder"
    newTimeColumn.appendChild(placeHolder);
    for(let i = startTime; i < (numSlots+startTime+1); i++){
        const timeLabel = document.createElement("div");
        timeLabel.classList.add("time-label-block");
        const label = document.createElement("h6");
        timeLabel.appendChild(label.appendChild(document.createTextNode(i + ":00")))
        newTimeColumn.appendChild(timeLabel);
    }
    return newTimeColumn;
}

function formatCalTitle(date){
    return months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
}

function formatDateId(date, time){
    return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + "-" + time;
}

function formatMonthSlotId(date, i) {
    return date.getFullYear() + "-" + date.getMonth() + "-" + i
}


function selectButton(e) { 
    console.log(e);
    buttons.forEach( button =>{
        button.classList = "";
        button.classList.add("calendar-button")}
    )
    e.target.classList.add("selected-button");
    switch(e.target.id){
        case "dayView":
            layoutDay(new Date());
            break;
        case "weekView":
            layoutWeek(new Date());
            break;
        case "monthView":
            layoutMonth(new Date());
            break;
        default: 
            layoutDay(new Date());
            break;
    }
}

function layoutMonth(){
    calendarDisplay.innerHTML = '';
    const monthLabels = createMonthLabels();
    const dateBoxes = createDateRows(new Date());
    calendarDisplay.appendChild(monthLabels);
    calendarDisplay.appendChild(dateBoxes);
    populateMonthView(calEvents);
    document.querySelectorAll("div.month-event").forEach (calEvent => {
        calEvent.addEventListener('click', displayEventInfo);
    })
}

function createMonthLabels(){
    const labelRow = document.createElement("div");
    labelRow.classList.add("month-day-labels");
    for(let i = 0; i < 7; i ++){
        const newLabel = document.createElement("div");
        newLabel.classList.add("month-day-indv-label");
        const day = daysOfWeek[i];
        const hElem = document.createElement("h3");
        hElem.appendChild(document.createTextNode(day));
        newLabel.appendChild(hElem);
        labelRow.appendChild(newLabel);
    }
    return labelRow;
}

function createDateRows(date){
    const dateBoxes = document.createElement("div");
    dateBoxes.classList.add("month-day-slots");
    // Returns which day of week month starts on
    const firstDay = returnFirstDay(date);
    const numDays = returnLastDay(date);
    for (let i = 0; i < firstDay; i++){
        const dateSlot = document.createElement("div");
        dateSlot.classList.add("month-day-indv-slot");
        dateBoxes.appendChild(dateSlot);
    }
    for (let i = 1; i <= numDays; i++){
        const dateSlot = document.createElement("div");
        dateSlot.classList.add("month-day-indv-slot");
        const boxLabel = document.createElement("h6");
        boxLabel.appendChild(document.createTextNode(i));
        dateSlot.append(boxLabel);
        dateSlot.id = formatMonthSlotId(date, i)
        dateBoxes.appendChild(dateSlot);
    }
    return dateBoxes;
}

function returnFirstDay(date){
    const firstDay = new Date(months[date.getMonth()] + " 1, " + date.getFullYear());
    return firstDay.getDay();
}

function returnLastDay(date){
  const lastDay = new Date(months[date.getMonth()+1] + " 1, " + date.getFullYear());
  lastDay.setDate(lastDay.getDate()-1)
  return lastDay.getDate();
}

function incrementTimeSlot(timeslot) { 
    const parts = timeslot.split('-')
    const increment = parseInt(parts[parts.length-1]) + 1
    parts[parts.length-1] = increment
    const timeSlot = parts.join("-");
    return timeSlot;
}

function calculateDuration(calEvent) { 
    const duration = calEvent.endDate.getHours() - calEvent.date.getHours();
    return duration;
}

function populateDayView(listOfEvents){
    const today = new Date();
    listOfEvents.forEach(calEvent => {
        if(calEvent.date.getDate() == today.getDate()){
            const timeSlotId = convertDateToDayId(calEvent);
            console.log(timeSlotId);
            const timeSlot = document.getElementById(timeSlotId);
            const calEventDisplay = document.createElement("div");
            const displayName = document.createElement("h5");
            displayName.id = calEvent.id
            displayName.appendChild(document.createTextNode(calEvent.mainTask + ": " + calEvent.name));
            calEventDisplay.style.background = 'CSC309: "rgb(0, 75, 0)';
            calEventDisplay.appendChild(displayName);
            calEventDisplay.classList.add("cal-event");
            calEventDisplay.id = calEvent.id;
            const duration = calculateDuration(calEvent);
            timeSlot.appendChild(calEventDisplay);
            for(let i = 0; i < duration - 1; i ++) { 
                const newTimeSlotId = incrementTimeSlot(timeSlotId);
                const newTimeSlot = document.getElementById(newTimeSlotId);
                newTimeSlot.style.background = 'CSC309: "rgb(0, 75, 0)';;
                newTimeSlot.classList.add('cal-event');
            }
        }
    })
}

function populateWeekView(listOfEvents) {
    const thisWeek = new Date().getDate();
    listOfEvents.forEach(calEvent => {
        if(calEvent.date.getDate() - thisWeek < 7) {
            const timeSlotId = convertDateToDayId(calEvent.date);
            const timeSlot = document.getElementById(timeSlotId);
            const calEventDisplay = document.createElement("div");
            const displayName = document.createElement("h5");
            displayName.classList.add("week-day-text")
            displayName.id = calEvent.id
            displayName.appendChild(document.createTextNode(calEvent.mainTask + ": " + calEvent.name));
            calEventDisplay.style.background = 'CSC309: "rgb(0, 75, 0)';;
            calEventDisplay.appendChild(displayName);
            calEventDisplay.classList.add("cal-event");
            calEventDisplay.classList.add("week-cal-event");
            calEventDisplay.id = calEvent.id;
            const duration = calculateDuration(calEvent);
            console.log(duration);
            timeSlot.appendChild(calEventDisplay);
            for(let i = 0; i < duration - 1; i ++) { 
                const newTimeSlotId = incrementTimeSlot(timeSlotId);
                const newTimeSlot = document.getElementById(newTimeSlotId);
                newTimeSlot.style.background = 'CSC309: "rgb(0, 75, 0)';;
            }
        }
    })
}

function populateMonthView(listOfEvents) {
    const thisMonth = new Date().getMonth();
    listOfEvents.forEach(calEvent => {
        if(calEvent.date.getMonth() == thisMonth) {
            const dateSlotId = convertDateToMonthId(calEvent.date);
            const dateSlot = document.getElementById(dateSlotId);
            const dateDisplay = document.createElement("div");
            dateDisplay.id = calEvent.id;
            dateDisplay.classList.add("month-event");
            // dateDisplay.style.background = 'CSC309: "rgb(0, 75, 0)';
            dateSlot.appendChild(dateDisplay);
        }
    })
}

function convertDateToDayId(calEvent){
    if(calEvent.startTime){
    const newArray = calEvent.startTime.split(":");
    return calEvent.date.getFullYear() + "-" +calEvent.date.getMonth() + "-" + calEvent.date.getDate() + "-" + newArray[0];
    } else {
        return calEvent.date.getFullYear() + "-" +calEvent.date.getMonth() + "-" + calEvent.date.getDate() + "-" + calEvent.date.getHours();
    }
}

function convertDateToMonthId(date){
    return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
}

function formatReadableDuration(startDate, endDate){
    return startDate.getHours() + ":00 - " + endDate.getHours() + ":00"
}

function formatReadableDate(date){
    return months[date.getMonth()] + " " + date.getDate() + " , " + date.getFullYear();
}

function displayEventInfo(e){
    console.log("TEST");
    const eventInfo = document.getElementById("calEventDisplay");
    eventInfo.innerHTML = '';
    // Get id of event and find JS item
    const calEventInfo = calEvents.find(x => x.id == e.target.id)
    // Create a new info element
    const eventInfoDisplay = document.createElement("div");
    eventInfoDisplay.id = "eventInfo";
    // Main Task
    const mainTask = document.createElement("h2")
    mainTask.appendChild(document.createTextNode(calEventInfo.mainTask));
    // Sub Task name
    const name = document.createElement("h3")
    name.appendChild(document.createTextNode(calEventInfo.name));
    // Course Name
    const course = document.createElement("h3")
    course.appendChild(document.createTextNode(calEventInfo.course));
    // Start Date
    const startDate = document.createElement("h4")
    startDate.appendChild(document.createTextNode(formatReadableDate(calEventInfo.date)));
    // Start / End Time
    const startEndTime = document.createElement("h4")
    startEndTime.appendChild(document.createTextNode(formatReadableDuration(calEventInfo.date, calEventInfo.endDate)));
    // Append all elements to DOM 
    eventInfoDisplay.appendChild(mainTask);
    eventInfoDisplay.appendChild(name);
    eventInfoDisplay.appendChild(course);
    eventInfoDisplay.appendChild(startDate);
    eventInfoDisplay.appendChild(startEndTime);
    eventInfoDisplay.classList.add("cal-event-info")
    eventInfo.appendChild(eventInfoDisplay);
}

function displayNotifications(){
    const numEvents = calEvents.length;
    const notif = document.getElementById("notifications");
    if(numEvents < 5) {
        const notifEasy = document.createElement("p");
        notifEasy.appendChild(document.createTextNode("You have " + numEvents + " this month. " + "Looking like a easy ride for a while!"));
        notif.appendChild(notifEasy);
    } else {
        const notifBusy = document.createElement("p");
        notifBusy.appendChild(document.createTextNode("You have " + numEvents + " tasks this month. " + "Looking like things are busy!"));
        notif.appendChild(notifBusy);
    }
}

document.querySelectorAll("button.calendar-button").forEach (button => {
    button.addEventListener('click', selectButton);
})

window.addEventListener("load", () => {
    const calTitle = document.getElementById("calTitle"); 
    calTitle.innerHTML = '';
    calTitle.appendChild(document.createTextNode(formatCalTitle(new Date())));
    // document.getElementById("monthView").classList.add("selected-button");
})