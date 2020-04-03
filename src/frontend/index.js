const slideShowing = [
  {
    image: "images/1-addCourse.png",
    description: "Simply add your course into the Course List by entering course code."
  },
  {
    image: "images/2-courseList.png",
    description: "Let all of your current courses be well-organized, and easy accessed."
  },
  {
    image: "images/3-gradeCalculator.png",
    description: "Input the marking scheme and grades of the course, see how well you were doing!"
  },
  {
    image: "images/4-chatRoom.png",
    description: "Talk with your class mates to share ideas, discuss questions, and make friends!"
  },
  {
    image: "images/5-addTask.png",
    description: "Add your tasks and assignments into your TODO LIST."
  },
  {
    image: "images/6-taskSplitted.png",
    description: "Split the tasks into steps for schedule your time better."
  },
  {
    image: "images/7-dashboard.png",
    description: "Everything will be displayed on your Dashboard."
  },
]


const img = document.querySelector("#slide");
const descript = document.querySelector("#description");
setTimeout(switchPage, 5000, 0);

function switchPage(i){
  const j = (i + 1) % slideShowing.length;
  img.src = slideShowing[j].image;
  descript.textContent = slideShowing[j].description;
  setTimeout(switchPage, 5000, j);
}
