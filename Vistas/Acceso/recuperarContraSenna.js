import { auth } from "./firebase.js";
import { confirmPasswordReset } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Obtener elementos del DOM
const resetPasswordForm = document.getElementById("reset-password-form");
const passwordInput = document.getElementById("txt_password");
const confirmPasswordInput = document.getElementById("confirm-password");

// Obtener el código de restablecimiento de la URL
const urlParams = new URLSearchParams(window.location.search);
const oobCode = urlParams.get("oobCode");

// Validar si el código está presente
if (!oobCode) {
  alert("Código de restablecimiento no encontrado. Intenta nuevamente desde el enlace enviado a tu correo.");
  window.location.href = "login.html";
}

// Agregar manejador al formulario
resetPasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newPassword = passwordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  // Validación de contraseñas
  if (newPassword !== confirmPassword) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  try {
    // Llamada a la API de Firebase para restablecer la contraseña
    await confirmPasswordReset(auth, oobCode, newPassword);
    alert("Contraseña restablecida con éxito. Redirigiendo al inicio de sesión...");
    window.location.href = "login.html";
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    alert("Hubo un problema al restablecer la contraseña. Inténtalo nuevamente.");
  }
});
