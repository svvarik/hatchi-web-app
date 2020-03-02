// Hard Coded Colour Palette
const courseColors = {
    CSC309: "rgba(0, 75, 0, 0.6)",
    CSC301: "rgba(255, 107, 0, 0.6)",
    MAT235: "rgba(255, 192, 0, 0.6)",
    INI318: "rgba(187, 0, 0, 0.6)", 
    STA247: "rgba(0, 174, 17, 0.6)"
};

// Calendar Object (Hard Coded Event Data) 
const calEventInfo1 = {
    id: 0,
    mainTask: "Essay on Effects of Obesity", 
    name: "Brainstorm",
    date: "March 1, 2020", 
    startTime: 12,
    endTime: 13,
    course: "INI318", 
};

const calEventInfo2 = {
    id: 1,
    mainTask: "Essay on Effects of Obesity", 
    name: "Research",
    date: "March 1, 2020", 
    startTime: 15,
    endTime: 16,
    course: "INI318", 
};

const dueDate1 = {
    id: 2,
    date: "March 1, 2020",
    name: "Essay on Effects of Obesity",
    course: "INI318", 
    time: 12
}


const dueDates = [dueDate1]
const calEvents = [calEventInfo1, calEventInfo2];

// Add Event object to screen based on start time
function appendCalendarEvent(calEventInfo){

    // Get the correct time slot
    const timeSlot = document.getElementById(calEventInfo.startTime + ":00");

    // Create a new element and get info 
    const calEventDisplay = document.createElement("div");
    const displayName = document.createElement("h5");
    displayName.setAttribute("id", calEventInfo.id)
    displayName.appendChild(document.createTextNode(calEventInfo.mainTask + ": " + calEventInfo.name));
    const course = calEventInfo.course
    calEventDisplay.style.background = courseColors[course];
    calEventDisplay.appendChild(displayName);
    calEventDisplay.classList.add("cal-event");

    // Add unique ID to object so we can access the variable in JS
    calEventDisplay.id = calEventInfo.id;
    
    // Add new element to the correct time slot
    timeSlot.appendChild(calEventDisplay);
}

function appendDueDate(dueDate){
    // select the correct time slot
    const timeSlot = document.getElementById(dueDate.time + ":00");

    // Create a new element and add the proper id
    const dueDateLine = document.createElement("div");
    dueDateLine.id = dueDate.id;
    dueDateLine.classList.add("due-date");
    dueDateLine.style.background = courseColors[dueDate.course];
    timeSlot.append(dueDateLine);
}

// 
function displayEventInfo(e){

    // Select the display box 
    const eventInfo = document.getElementById("calEventDisplay");
    // Remove No Event Label
    eventInfo.innerHTML = '';
    // const noEventAlert = document.getElementById("noEventAlert");
    // if (noEventAlert) {
    //     eventInfo.removeChild(noEventAlert);
    // }
    // if (document.getElementById("eventInfo")){
    //     eventInfo.removeChild(document.getElementById("eventInfo"))
    // }
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
    startDate.appendChild(document.createTextNode(calEventInfo.date));
    // Start / End Time
    const startEndTime = document.createElement("h4")
    startEndTime.appendChild(document.createTextNode(calEventInfo.startTime + ":00" + " - " + calEventInfo.endTime + ":00"));
    // Append all elements to DOM 
    eventInfoDisplay.appendChild(mainTask);
    eventInfoDisplay.appendChild(name);
    eventInfoDisplay.appendChild(course);
    eventInfoDisplay.appendChild(startDate);
    eventInfoDisplay.appendChild(startEndTime);
    eventInfoDisplay.classList.add("cal-event-info")
    eventInfo.appendChild(eventInfoDisplay);
}

function displayDueDateInfo(e) { 
    // get due date variable
    const dueDateInfo = dueDates.find(x => x.id == e.target.id)
    // retrieve event display box 
    const eventInfo = document.getElementById("calEventDisplay");
    eventInfo.innerHTML = '';

    const eventInfoDisplay = document.createElement("div");
    eventInfoDisplay.id = "eventInfo";
    // Main Task
    const name = document.createElement("h2")
    name.appendChild(document.createTextNode(dueDateInfo.name));
    // Course
    const course = document.createElement("h3")
    course.appendChild(document.createTextNode(calEventInfo.course));
     // Due Date
     const dueDate = document.createElement("h3")
     dueDate.appendChild(document.createTextNode(dueDateInfo.date));
    // Due Time
    const dueTime = document.createElement("h3")
    dueTime.appendChild(document.createTextNode(dueDateInfo.time + ":00"));
    // Append all elements to DOM 
    eventInfoDisplay.appendChild(name);
    eventInfoDisplay.appendChild(course);
    eventInfoDisplay.appendChild(dueDate);
    eventInfoDisplay.appendChild(dueTime);
    eventInfoDisplay.classList.add("cal-event-info")
    eventInfo.appendChild(eventInfoDisplay);
}

appendCalendarEvent(calEventInfo1);
appendCalendarEvent(calEventInfo2);
appendDueDate(dueDate1);



// add listeners to all calendar events
document.querySelectorAll("div.cal-event").forEach (calEvent => {
    calEvent.addEventListener('click', displayEventInfo)
})

document.querySelectorAll("div.due-date").forEach (calEvent =>{
    calEvent.addEventListener('click', displayDueDateInfo)
})



 