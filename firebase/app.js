// Initialize Firebase
var config = {
    apiKey: "AIzaSyBwym8F4l5GlHDMQLHyZOY3dNWKMz_hxKI",
    authDomain: "pianoboard-d97c2.firebaseapp.com",
    databaseURL: "https://pianoboard-d97c2.firebaseio.com",
    projectId: "pianoboard-d97c2",
    storageBucket: "pianoboard-d97c2.appspot.com",
    messagingSenderId: "266279955938"
};
firebase.initializeApp(config);

var auth = firebase.auth();
/**
* Handles the sign in button press.
*/
function toggleSignIn() {
    if (auth.currentUser) {
        // [START signout]
        auth.signOut();
        // [END signout]
    } else {
        document.getElementById("submit").disabled = true;
        var email = document.getElementById('email').value;
        var password = document.getElementById('pass').value;
        if (email.length < 4) {
            document.getElementById("submit").disabled = false;
            showError("email_notification", "Please enter a valid email address", 200);
            return;
        }
        if (password.length < 4) {
            document.getElementById("submit").disabled = false;
            showError("password_notification", "Please enter a valid password", 180);
            return;
        }
        // Sign in with email and pass.
        // [START authwithemail]
        auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(function() {
            auth.signInWithEmailAndPassword(email, password).then(function() {
                // sign in successful: redirect to dashboard
                console.log("success ");
                console.log(auth.currentUser.displayName);
                //window.location.href = "./dashboard";
            })
            .catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // [START_EXCLUDE]
                if (errorCode == 'auth/wrong-password') {
                    showError("password_notification", "Incorrect password", 200)
                } else {
                    showError("email_notification", "There is no user account associated with this email", 300);
                } 
                document.getElementById("submit").disabled = false;
                // [END_EXCLUDE]
            })
        });
        // [END authwithemail]
    }
}
/**
* Handles the sign up button press.
*/
function handleSignUp() {
    document.getElementById("submit").disabled = true;
    var email = document.getElementById('email').value;
    var username = document.getElementById('username').value;
    var password = document.getElementById('pass').value;
    var vpass = document.getElementById('pass2').value;
    if(password != vpass) {
        showError("confirm_password_notification", "Passwords do not match", 200);
        return;
    }
    if (!emailIsValid(email)) {
        showError("email_notification", "Invalid email address", 200);
        return;
    }
    if(!isStrong(password)) {
        showError("password_notification", "Password is too weak", 180);
        return;
    }
    if(username.length < 2) {
        showError("username_notification", "Invalid username", 160);
        return;
    }
    // Sign in with email and pass.
    // [START createwithemail]
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(function() {
        auth.createUserWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode == 'auth/weak-password') {
                showError("password_notification", "Password is too weak", 180);
            } else if(errorCode == 'auth/email-already-in-use'){
                showError("email_notification", "Email is already in use. <a href='../'>login?</a>", 250);
            }
            if(error) document.getElementById("submit").disabled = false;
            console.log(errorMessage);
            return;
            // [END_EXCLUDE]
        }).then(T => {
            // TODO make the loader a little form that has you input your fav bands and genres
            // These bands and genres will give you recommended songs and instruments and stuff
            var hold = setInterval(function() {
                var user = auth.currentUser;
                if(user) {
                    document.getElementById("header").style.cssText += "transform: translateX(1000px);";
                    document.getElementById("loader").style.cssText += "transform: translateX(800px);";
                    genrePage();
                    clearInterval(hold);
                }
            }, 10);
        })
    });
    // [END createwithemail]
}

/**
* Sends an email verification to the user.
*/
function sendEmailVerification() {
    // [START sendemailverification]
    auth.currentUser.sendEmailVerification().then(function() {
        // Email Verification sent!
        // [START_EXCLUDE]
        alert('Email Verification Sent!');
        // [END_EXCLUDE]
    });
    // [END sendemailverification]
}

function sendPasswordReset() {
    document.getElementById("submit").disabled = true;
    var email = document.getElementById('email').value;
    // [START sendpasswordemail]
    auth.sendPasswordResetEmail(email).then(function() {
        document.getElementById("header").style.cssText += "transform: translateX(1000px);";
        document.getElementById("complete").style.cssText += "transform: translateX(800px);";
        var i = 5;
        var sit = setInterval(function() {
            document.getElementById("timer").innerHTML = "redirecting to login page in " + i;
            if(i == 0) {
                window.location.href = "../";
                clearInterval(sit);
            }
            i--;
        }, 1000)
    }).catch(function(error) {
        // Handle Errors here.
        if(error) {
            document.getElementById("submit").disabled = false;
            showError("email_notification", "There is no user record corresponding to this email", 300);
        }
    });
    // [END sendpasswordemail];
}

function signOut() {
    auth.signOut().then(function() {
        window.location.href = "../";
    }).catch(function(error) {
        // An error happened.
        alert("An error occurred: " + error);
    });
}
/**
* initApp handles setting up UI event listeners and registering Firebase auth listeners:
*  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
*    out, and that is where we update the UI.
*/
var displayName;
var email;
var emailVerified;

function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    auth.onAuthStateChanged(function(user) {
        if(user) {
            // User is signed in.
            displayName = user.displayName;
            email = user.email;
            emailVerified = user.emailVerified;
            if (!emailVerified) {
                // TODO have a verified email button to enable/disable
            }
        } else {
            // the user is signed out
        }
    });
    // [END authstatelistener]
}

window.onload = function() {
    initApp();
};

var hold;
var lastError = false;;
function showError(id, message, width) {
    clearInterval(hold);
    if(lastError != false) {
        lastError.style.display = "none";
        lastError.style.opacity = 1;
    }
    var error = document.getElementById(id);
    lastError = error;
    error.innerHTML = message;
    error.style.display = "block";
    error.style.width = width + "px";
    var i = 0;
    var opacity = 1;
    var left = true;
    hold = setInterval(function() {
        error.style.opacity = opacity;
        if(i > 500) opacity -= .01;
        if(error.style.opacity < .02) {
            error.style.display = "none";
            error.style.opacity = 1;
            clearInterval(hold);
            hold = false;
            return;
        }
        if(i <= 50 && i%10 == 0) {
            if(left) {
                error.style.cssText += "transform: translatex(4px);";
                left = false;
            } else {
                error.style.cssText += "transform: translatex(-4px);";
                left = true;
            }
        }
        i++;
    }, 10);
}

/**
 * Verify that the email provided is in a correct format
 */
function emailIsValid(email) {
    var at = -1;
    var dot = -1;
    for(var i = 0; i < email.length; i++) {
        if(email.charAt(i) == '@') at = i + 1;
        if(email.charAt(i) == '.') dot = i + 1;
    }
    // if the domain or the site type is less than 2 characters, its not valid
    if((dot - at) < 2 || (email.length - dot) < 2 || at == -1 || dot == -1) return false;
    return true;
}

function isStrong(password) {
    if(password.length < 8) return false;
    var strength = 0;
    for(let i = 0; i < password.length; i++) {
        var a = password.charCodeAt(i)
        if(a < 48 || a > 57 && a < 65 || a > 90 && a < 97 || a > 122) strength += 2;
        else if(a > 47 && a < 58) strength ++;
        strength ++;
    }
    if(strength > 10) return true;
    else return false;
}

function showInfo() {
    var user = auth.currentUser;
    var sideBar = document.getElementById("info");
    var navBar = document.getElementById("welcomeUser");
    var projects = document.getElementById("projectArea");
    var profilePicture = document.getElementById("profpic");
    var j = 0;
    var wait = setInterval(function() {
        user = auth.currentUser;
        if(user) {
            // sideBar.innerHTML = user.displayName + "<br><br>" + user.email;
            navBar.innerHTML = "Welcome, " + user.displayName + "!";
            /**
             * TODO - make the sidbar a lil info/about me thingy
             * - Favorite genres
             * - Favorite bands/artists
             * - Experience
             */
            projects.innerHTML = "You haven't started any projects yet";
            //TODO display all projects as little link items

            // retrieve the users profile picture to show in the lil thingy
            var dir = "/profilePics/" + user.uid + "/profilePic";
            var child = firebase.storage().ref().child(dir);
            var i = 0;
            var hold = setInterval(function() {
                child.getDownloadURL().then(function(url) {
                    profilePicture.src = url;
                    clearInterval(hold);
                }).catch(function(error) {
                    profilePicture.src = "../images/Piano.jpg";
                });
                if(i > 10) clearInterval(hold);
                i++;
            }, 100);
            clearInterval(wait);
        } else {
            //sideBar.innerHTML = "retrieving your information..";
            navBar.innerHTML = "Welcome, user!";
            projects.innerHTML = "You're not signed in";
        }
        if(j > 1000) clearInterval(wait);
        j++
    }, 10);
}

function uploadProfilePic(event) {
    event.preventDefault();
    var profPic = document.getElementById("profpic");
    var cam = document.getElementById("cam");
    profPic.style.opacity = 1;
    cam.style.visibility = "hidden";
    let dt = event.dataTransfer;
    if(dt == null) return;
    let file = dt.files[0];
    var user = auth.currentUser;
    var dir = "/profilePics/" + user.uid + "/profilePic";
    var child = firebase.storage().ref().child(dir);
    child.put(file).then(function(snapshot) {
        console.log(snapshot);
    }).catch(function(error) {
        console.error(error);
    });
    var hold = setInterval(function() {
        child.getDownloadURL().then(function(url) {
            // Insert url into an <img> tag to "download"
            profPic.src = url;
            clearInterval(hold);
        }).catch(function(error) {/**wait*/});
    }, 10);
}

function updateProject(projectName) {
    var userId = auth.currentUser.uid;
    firebase.database().ref('users/' + userId + "/projects/" + projectName).set({
        // TODO write the project data to the database
    }, function(error) {
        if (error) {
            // The write failed...
            console.log(error);
        } else {
            // Data saved successfully!
            console.log("success");
        }
    });
}