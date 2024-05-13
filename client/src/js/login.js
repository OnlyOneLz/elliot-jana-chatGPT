const app = () => {
  // Query Selectors
  const loginForm = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const passwordInputContainer = document.querySelector(".input-password");
  const googleLoginBtn = document.getElementById("google-login");
  const loginTitle = document.getElementById("login-title");
  const signUpP = document.querySelector(".signup-link-p");
  const signUp = document.querySelector(".signup-link");

  // Functions

  const checkEmail = async () => {
    const validEmail = await fetchUser(emailInput.value, "password");
    const validToken = await checkAuthentication();
    if (validEmail && validToken) {
      window.location.href =
        "http://127.0.0.1:5500/client/src/html/index.html#";
    }
  };

  async function checkAuthentication() {
    const isAuthenticated = await checkTokenValidity();
    return isAuthenticated;
  }

  // API Calls

  const fetchUser = async (email, password) => {
    try {
      const response = await fetch("http://localhost:4000/user/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: passwordInput.value !== "" ? passwordInput.value : password,
        }),
      });
      const data = await response.json();
      if (response.status === 401 && passwordInput.value !== "") {
        const errorMessage = document.createElement("div");
        errorMessage.classList.add("error");
        errorMessage.innerHTML = data.message;
        passwordInput.parentElement.appendChild(errorMessage);
        setTimeout(() => {
          errorMessage.remove();
        }, 5000);
      } else if (data.cause === "email") {
        const errorMessage = document.createElement("div");
        errorMessage.classList.add("error");
        errorMessage.innerHTML = data.message;
        emailInput.parentElement.appendChild(errorMessage);
        setTimeout(() => {
          errorMessage.remove();
        }, 5000);
      } else if (data.cause === "password") {
        if (passwordInput.value === "") {
          emailInput.disabled = true;
          passwordInput.disabled = false;
          passwordInputContainer.style.display = "block";
          loginTitle.innerHTML = "Enter Password";
        }
      } else if (response.ok) {
        localStorage.setItem("token", data.token);
        passwordInput.value === "";
        return data.user;
      }
    } catch (error) {
      console.log("Failed to get user", error);
    }
  };

  async function checkTokenValidity() {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:4000/protected", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        return true;
      } else {
        localStorage.removeItem("token");
        return false;
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      return false;
    }
  }

  const startGoogleFlow = async () => {
    window.location.href = "http://localhost:4000/auth/google";
  };

  const newSignup = async () => {
    try {
      const response = await fetch("http://localhost:4000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailInput.value,
          password: passwordInput.value,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.value);
        window.location.href =
          "http://127.0.0.1:5500/client/src/html/index.html#";
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      return false;
    }
  };

  // Event Listeners
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (signUpP.classList.contains("login")) {
      newSignup();
    } else {
      checkEmail();
    }
  });

  googleLoginBtn.addEventListener("click", async function () {
    startGoogleFlow();
  });

  signUp.addEventListener("click", async function () {
    if (signUpP.classList.contains("login")) {
      signUpP.innerHTML = "Dont have an account?  ";
      signUpP.appendChild(signUp).innerHTML = "Sign up";
      signUpP.classList.remove("login");
      loginTitle.innerHTML = "Welcome back";
      passwordInputContainer.style.display = "none";
    } else {
      signUpP.innerHTML = "Already have an account with us?  ";
      signUpP.appendChild(signUp).innerHTML = "Login";
      signUpP.classList.add("login");
      passwordInput.disabled = false;
      passwordInputContainer.style.display = "block";
      loginTitle.innerHTML = "Create an account";
    }
  });
};

app();
