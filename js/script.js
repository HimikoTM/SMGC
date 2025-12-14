document.addEventListener("DOMContentLoaded", () => {
  // Запись элементов разметки в переменные
  const steamPayButton = document.getElementById("SteamPayButton");
  const authButton = document.getElementById("AuthButton");
  const backButton = document.getElementById("BackButton");
  const regButton = document.getElementById("RegButton");
  const loginButton = document.getElementById("LoginButton");
  // Остальной код
  if (steamPayButton) {
    steamPayButton.addEventListener("click", () => {
      window.location.href = "./pages/steamPay.html";
    });
  }

  if (backButton) {
    backButton.addEventListener("click", () => {
      window.location.href = "../index.html";
    });
  }
  if (authButton) {
    authButton.addEventListener("click", () => {
      window.location.href = "./pages/auth.html";
    });
  }
  if (regButton) {
    regButton.addEventListener("click", () => {
      register();
    });
  }
  if (loginButton) {
    loginButton.addEventListener("click", () => {
      login();
    });
  }
  checkAuthStatus();
});
function logout() {
  localStorage.removeItem("isLoggedIn");
  window.location.reload();

  const logoutButton = document.getElementById("LogoutButton");
  if (logoutButton) {
    logoutButton.className =
      "d-none text-black btn-danger btn btn-lg w-75 fw-bold";
  }

  const authButton = document.getElementById("AuthButton");
  if (authButton) {
    authButton.className =
      "d-block btn-auth btn btn-lg glow-btn bi-list bi-fingerprint fw-bold";
  }
}
async function checkAuthStatus() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (isLoggedIn) {
    const authButton = document.getElementById("AuthButton");
    if (authButton) {
      authButton.className =
        "d-none btn-auth btn btn-lg glow-btn bi-list bi-fingerprint fw-bold";
    }
    const logoutButton = document.getElementById("LogoutButton");
    if (logoutButton) {
      logoutButton.className =
        "d-block btn-danger text-black btn btn-lg w-75 fw-bold";
    }
  }
}
function AuthStatus(statusCode, type, message) {
  const isLoggedIn = type === "login_success";
  if (isLoggedIn) {
    localStorage.setItem("isLoggedIn", "true");
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 2000);
  } else {
    localStorage.removeItem("isLoggedIn");
  }
  const status = document.getElementById("h2reg");
  const smilestatus = document.getElementById("iAuth");

  if (type === "register_success") {
    status.textContent = message || "Регистрация успешна";
    status.style.color = "rgba(7, 255, 7, 1)";
    status.style.textShadow = "0px 0px 30px rgba(0, 255, 0, 1)";
    smilestatus.className = "bi bi-emoji-laughing iconColor";
    smilestatus.style.color = "rgba(7, 255, 7, 1)";
    smilestatus.style.textShadow = "0px 0px 30px rgba(0, 255, 0, 1)";
    return;
  }

  if (type === "login_success") {
    status.textContent = message || "Вход выполнен";
    status.style.color = "rgba(7, 255, 7, 1)";
    status.style.textShadow = "0px 0px 30px rgba(0, 255, 0, 1)";
    smilestatus.className = "bi bi-emoji-laughing iconColor";
    smilestatus.style.color = "rgba(7, 255, 7, 1)";
    smilestatus.style.textShadow = "0px 0px 30px rgba(0, 255, 0, 1)";
    return;
  }

  if (type === "email_exists") {
    status.textContent = message || "Email уже используется!";
    status.style.color = "orange";
    status.style.textShadow = "0px 0px 30px rgba(255, 165, 0, 1)";
    smilestatus.className = "bi bi-emoji-frown iconColor";
    smilestatus.style.color = "orange";
    smilestatus.style.textShadow = "0px 0px 30px rgba(255, 165, 0, 1)";
    return;
  }

  if (type === "auth_failed") {
    status.textContent = message || "Неверный email или пароль";
    status.style.color = "orange";
    status.style.textShadow = "0px 0px 30px rgba(255, 165, 0, 1)";
    smilestatus.className = "bi bi-emoji-frown iconColor";
    smilestatus.style.color = "orange";
    smilestatus.style.textShadow = "0px 0px 30px rgba(255, 165, 0, 1)";
    return;
  }

  status.textContent = message || "Ошибка!";
  status.style.color = "red";
  status.style.textShadow = "0px 0px 30px rgba(255, 0, 0, 1)";
  smilestatus.className = "bi bi-emoji-angry iconColor";
  smilestatus.style.color = "red";
  smilestatus.style.textShadow = "0px 0px 30px rgba(255, 0, 0, 1)";
}

async function sendAuthRequest(data) {
  try {
    const resp = await fetch("../auth.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await resp.json().catch(() => ({}));
    const type = result.type || "error";
    const message = result.message || null;

    AuthStatus(resp.status, type, message);
  } catch (error) {
    console.error("Сетевая ошибка:", error);
    AuthStatus(0, "error", "Нет связи с сервером");
  }
}

async function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  sendAuthRequest({ email, password, species: "register" });
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  sendAuthRequest({ email, password, species: "login" });
}
