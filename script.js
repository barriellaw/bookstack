// Firebase Config - Replace with yours
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// DOM Elements
const loginForm = document.getElementById("login-form");
const emailField = document.getElementById("email");
const passwordField = document.getElementById("password");
const errorMessage = document.getElementById("error-message");
const resetBtn = document.getElementById("reset-password");
const logoutBtn = document.getElementById("logout-btn");

const loginBox = document.getElementById("login-form");
const loggedInBox = document.getElementById("logged-in-box");

// Auth State
auth.onAuthStateChanged(user => {
  if (user) {
    showLoggedIn();
    startInactivityTimer();
  } else {
    showLoginForm();
  }
});

// Login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = emailField.value.trim();
  const password = passwordField.value.trim();

  try {
    await auth.signInWithEmailAndPassword(email, password);
    errorMessage.textContent = "";
  } catch (error) {
    errorMessage.textContent = error.message;
  }
});

// Password Reset
resetBtn.addEventListener("click", async () => {
  const email = emailField.value.trim();
  if (!email) {
    errorMessage.textContent = "Please enter your email first.";
    return;
  }

  try {
    await auth.sendPasswordResetEmail(email);
    errorMessage.style.color = "green";
    errorMessage.textContent = "Password reset email sent!";
  } catch (error) {
    errorMessage.style.color = "red";
    errorMessage.textContent = error.message;
  }
});

// Logout
logoutBtn.addEventListener("click", async () => {
  await auth.signOut();
  window.location.href = "/";
});

// Inactivity timer
let inactivityTimeout;
const INACTIVITY_LIMIT_MINUTES = 15;

function startInactivityTimer() {
  resetInactivityTimer();
  ['mousemove', 'keydown', 'scroll', 'touchstart'].forEach(evt =>
    window.addEventListener(evt, resetInactivityTimer)
  );
}

function resetInactivityTimer() {
  clearTimeout(inactivityTimeout);
  inactivityTimeout = setTimeout(() => {
    auth.signOut().then(() => {
      alert("Logged out due to inactivity.");
      window.location.href = "/";
    });
  }, INACTIVITY_LIMIT_MINUTES * 60 * 1000);
}

// UI States
function showLoggedIn() {
  loginBox.classList.add("hidden");
  loggedInBox.classList.remove("hidden");
}

function showLoginForm() {
  loginBox.classList.remove("hidden");
  loggedInBox.classList.add("hidden");
}
