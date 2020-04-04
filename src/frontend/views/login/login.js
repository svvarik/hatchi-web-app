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

const signupSuccessfully = document.querySelector("#signupSuccessfully");
const error = document.querySelector("#errorNotice");
function clearAllNotices() {
  error.style.display = "none";
  signupSuccessfully.style.display = "none";
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
    bar.style.x = '50%';
    lForm.style.display = "none";
    sForm.style.display = "block";
    signup = true;
  } else{
    bar.style.x = '0%';
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
  console.log('Log In Submit');
  
  e.preventDefault();
  clearAllNotices();

  // get the input values
  const lusername = document.querySelector("#lusername").value;
  const lpassword = document.querySelector("#lpassword").value;
  
  const url = '/views/login/login.html/login';
  const data = {
    username: lusername,
    password: lpassword
  }
  const request = new Request(url, {
    method: 'post',
    body: JSON.stringify(data),
    headers:{
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  });
  fetch(request).then((response) => {
    return response.json();
  }).then((res)=> {
    if (res.notice === null){
      sessionStorage.setItem('user', res.userid);
      sessionStorage.setItem('admin', res.admin);
      if (res.admin === false){
        window.location = '../dashboard/dashboard.html';
      } else {
        window.location = '../admin/admin.html';
      }
    } else {
      errorNotice(res.notice);
    }
  })
}

function signupSubmit(e){
  e.preventDefault();
  clearAllNotices();
  const susername = document.querySelector("#susername").value;
  const semail = document.querySelector("#email").value;
  const spassword = document.querySelector("#spassword").value;

  const url = '/views/login/login.html/signup';
  const data = {
    username: susername,
    email: semail,
    password: spassword
  }
  const request = new Request(url, {
    method: 'post',
    body: JSON.stringify(data),
    headers:{
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  });
  // fetch(request).then(function(res) {
  //   console.log(res);
    
    //  if(res.status === 200){
    //    if (res.notice === null){
    //      signupSuccessfully.style.display = "block";
    //      sForm.style.display = "none";
    //    } else {
    //      errorNotice(res.notice);
    //    }
    //  } 
  // }).catch((error) => {
  //   console.log(error);
  // })
  fetch(request).then((response) => {
    return response.json();
  }).then((res)=> {
    console.log(res.status);
      if (res.notice === null){
        signupSuccessfully.style.display = "block";
        sForm.style.display = "none";
      } else {
        errorNotice(res.notice);
      }
    })
}


function errorNotice(errorMessage){
  const notice = document.getElementById('errorNotice');
  switch (errorMessage){
    case 'USERNAME_OCCUPIED':
      notice.firstChild.textContent = "Username Occupied, Please Choose Another One.";
      break;
    case "WRONG_PASSWORD":
      notice.firstChild.textContent = 'Password Does Not Match, Please Check Your Password.';
      break;
    case "ACCT_NOT_EXISTS":
      notice.firstChild.textContent = "Account Not Exists, Please Check Your Username.";
      break;
  }
  notice.style.display = "block";
}
