// Hard Coded Colour Palette, would require server calls dependent on user settings
const courseColors = {
    CSC309: "rgb(0, 75, 0)",
    CSC301: "rgb(255, 107, 0)",
    MAT235: "rgb(255, 192, 0)",
    INI318: "rgb(187, 0, 0)", 
    STA247: "rgb(0, 174, 17)"
};

window.onload = () => { 
    const url = 'views/tasks/tasks.html/tasks' + currUserID;
    fetch(url).then((res) => {
        const tasks = JSON.parse(res);
        console.log(tasks);
    })
}

// Calendar Event Objects (Hard Coded Event Data) 
const calEventInfo1 = {
    id: 0,
    mainTask: "Essay on Effects of Obesity", 
    name: "Brainstorm",
    course: "INI318", 
    date: new Date("March 3, 2020 12:00"),
    endDate: new Date("March 3, 2020 13:00")
};

const calEventInfo2 = {
    id: 1,
    mainTask: "Essay on Effects of Obesity", 
    name: "Research",
    course: "INI318", 
    date: new Date("March 4, 2020 16:00"),
    endDate: new Date("March 4, 2020 17:00")
};

const calEventInfo3 = {
    id: 2,
    mainTask: "Problem Set", 
    name: "Q1",
    course: "STA247", 
    date: new Date("March 5, 2020 16:00"),
    endDate: new Date("March 5, 2020 17:00")
};

const calEventInfo4 = {
    id: 3,
    mainTask: "Problem Set", 
    name: "Q2",
    course: "STA247", 
    date: new Date("March 6, 2020 12:00"),
    endDate: new Date("March 6, 2020 13:00")
};

const calEvents = [calEventInfo1, calEventInfo2, calEventInfo3, calEventInfo4];

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

function populateDayView(listOfEvents){
    const today = new Date();
    listOfEvents.forEach(calEvent => {
        if(calEvent.date.getDate() == today.getDate()){
            const timeSlotId = convertDateToDayId(calEvent.date);
            const timeSlot = document.getElementById(timeSlotId);
            const calEventDisplay = document.createElement("div");
            const displayName = document.createElement("h5");
            displayName.id = calEvent.id
            displayName.appendChild(document.createTextNode(calEvent.mainTask + ": " + calEvent.name));
            calEventDisplay.style.background = courseColors[calEvent.course];
            calEventDisplay.appendChild(displayName);
            calEventDisplay.classList.add("cal-event");
            calEventDisplay.id = calEvent.id;
            timeSlot.appendChild(calEventDisplay);
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
            calEventDisplay.style.background = courseColors[calEvent.course];
            calEventDisplay.appendChild(displayName);
            calEventDisplay.classList.add("cal-event");
            calEventDisplay.classList.add("week-cal-event");
            calEventDisplay.id = calEvent.id;
            timeSlot.appendChild(calEventDisplay);
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
            dateDisplay.style.background = courseColors[calEvent.course];
            dateSlot.appendChild(dateDisplay);
        }
    })
}

function convertDateToDayId(date){
    return date.getFullYear() + "-"+date.getMonth() + "-" + date.getDate() + "-" + date.getHours();
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

document.querySelectorAll("button.calendar-button").forEach (button => {
    button.addEventListener('click', selectButton);
})

window.addEventListener("load", () => {
    const calTitle = document.getElementById("calTitle"); 
    calTitle.innerHTML = '';
    calTitle.appendChild(document.createTextNode(formatCalTitle(new Date())));
    layoutDay(new Date());
    document.getElementById("dayView").classList.add("selected-button");
})