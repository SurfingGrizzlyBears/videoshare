/**
 * Authors: Calvin Korver, Kyle McNulty, Patrick Yi
 * 
 * This handles the sign up page
 * */

"use strict";

var signUpForm = document.getElementById("signup-form");
var emailInput = document.getElementById("email-input");
var passwordInput = document.getElementById("password-input");
var confirmPasswordInput = document.getElementById("confirm-password-input");
var displayNameInput = document.getElementById("display-name-input");
var errorMessage = document.getElementById("error-message");
var bioInput = document.getElementById("bio-input");
var loading = document.querySelector(".loading");

function checks() {
    var checks = false;
    errorMessage.innerHTML = "";
    var error = document.createElement("span");
    /* Necessary input for the password input */
    if (passwordInput.value != confirmPasswordInput.value) {
        error.textContent = "Passwords do not match!";
    } else if (passwordInput.value.length < 6) {
        error.textContent = "Passwords must be at least 6 characters in length";
    } else if (displayNameInput.value.trim() == "") {
        error.textContent = "You must choose a display name!";
    } else {
        checks = true;
    }
    errorMessage.appendChild(error);
    return checks;
}


function toggleFeedback() {
    loading.classList.toggle("hidden");
}

signUpForm.addEventListener("submit", function (evt) {
    evt.preventDefault();
    if (checks()) {
        toggleFeedback();
        firebase.auth().createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
            .then(function (user) {
                /* Pushes bio information to database */
                var bioRef = firebase.database().ref("bio");
                var bioObject = {
                    email: emailInput.value,
                    bio: bioInput.value
                }
                bioRef.push(bioObject);

                /* Updates the users profile */
                user.sendEmailVerification();
                return user.updateProfile({
                    emailVerified: false,
                    displayName: displayNameInput.value,
                    // bio: "test",
                    photoURL: "https://www.gravatar.com/avatar/" +
                    md5(emailInput.value),
                });
            })
            .then(function () {
                toggleFeedback();
                window.location = "videos.html";
            })
            .catch(function (err) {
                alert(err.message);
            })
    }
    return false;
});