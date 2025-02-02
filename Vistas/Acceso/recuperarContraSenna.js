import { auth } from "./firebase.js";
import { confirmPasswordReset, getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const resetPasswordForm = document.getElementById("reset-password-form");
const passwordInput = document.getElementById("txt_password");
const confirmPasswordInput = document.getElementById("confirm-password");

// Obtener el código de restablecimiento de la URL
const urlParams = new URLSearchParams(window.location.search);
const oobCode = urlParams.get("oobCode");

if (!oobCode) {
  alert("Código de restablecimiento no encontrado.");
  window.location.href = "login.html";
}

resetPasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newPassword = passwordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  if (newPassword !== confirmPassword) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  try {
    await confirmPasswordReset(auth, oobCode, newPassword);
    alert("Contraseña restablecida con éxito. Redirigiendo al inicio de sesión...");
    window.location.href = "login.html";
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    alert("Hubo un problema al restablecer la contraseña. Inténtalo nuevamente.");
  }
});
