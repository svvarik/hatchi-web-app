const profiles  = [
  {
    username: "user",
    password: "user",
    authorization: "user",
    email: "user1@hachi.com"
  },
  {
    username: "user2",
    password: "user2",
    authorization: "user",
    email: "user2@hachi.com"
  },
  {
    username: "user3",
    password: "user3",
    authorization: "user",
    email: "user3@hachi.com"
  },
  {
    username: "admin",
    password: "admin",
    authorization: "admin",
    email: "admin@hachi.com"
  },
]

const lForm = document.getElementById("LoginForm");
const sForm = document.getElementById("SignupForm");


const wrongPassword = document.querySelector("#wrongPassword");
const accountNotExists = document.querySelector("#accountNotExists");
const signupSuccessfully = document.querySelector("#signupSuccessfully");
const usernameOccupied = document.querySelector("#usernameOccupied");
function clearAllNotices() {
  wrongPassword.style.display = "none";
  accountNotExists.style.display = "none";
  signupSuccessfully.style.display = "none";
  usernameOccupied.style.display = "none";
}


const tabBar = document.getElementById("tabBarContainer");
tabBar.addEventListener('click', switchBar);

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

let signup = false;
if (getUrlVars()['signup'] == "true"){
  switchBar();
}

function switchBar(){
  const bar = document.getElementById("ChosenTab");
  if (!signup){
    bar.style.x = 159;
    lForm.style.display = "none";
    sForm.style.display = "block";
    signup = true;
  } else{
    bar.style.x = 0;
    lForm.style.display = "block";
    sForm.style.display = "none";
    signup = false;
  }
  // console.log(signup);
  clearAllNotices();
}

lForm.addEventListener('submit', loginSubmit);
sForm.addEventListener('submit', signupSubmit);

function loginSubmit(e){
  e.preventDefault();
  clearAllNotices();
  const lusername = document.querySelector("#lusername").value;
  // console.log(username);
  const lpassword = document.querySelector("#lpassword").value;

  let foundUsername = false;
  for (let i = 0; i < profiles.length; i++){
    // console.log(profiles[i]);
    if (profiles[i].username == lusername){
      foundUsername = true;
      if (profiles[i].password == lpassword) {
        if (profiles[i].authorization == "user"){
          window.location = "../dashboard/dashboard.html";
        } else {
          window.location = "../admin/admin.html";
        }
      } else {
        // Wrong PASSWORD!!!!  TODO
        wrongPassword.style.display = "block";
      }
    }
  }
  // Account Does Not Exists!!!  TODO
  if (!foundUsername){
    accountNotExists.style.display = "block";
  }
}

function signupSubmit(e){
  e.preventDefault();
  clearAllNotices();
  const susername = document.querySelector("#susername").value;
  const semail = document.querySelector("#email").value;
  const spassword = document.querySelector("#spassword").value;
  let canRegister = true;
  for (let i = 0; i < profiles.length; i++){
    if (profiles[i].username == susername){
      canRegister = false;
    }
  }
  if (canRegister){
    profiles[profiles.length] = {
        username: susername,
        password: spassword,
        email: semail,
        authorization: "user"
    };
    //signupSuccessfully
    signupSuccessfully.style.display = "block";
    sForm.style.display = "none";
  } else {
    //Username Occupied, please Choose another one;
    usernameOccupied.style.display = "block";
  }
}
