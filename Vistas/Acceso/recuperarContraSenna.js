import { auth } from "./firebase.js";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("txt_password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const passwordValidationList = document.getElementById("password-validation");
  const confirmPasswordValidationList = document.getElementById("confirm-password-validation");
  const submitButton = document.getElementById("btn_registrar");

  function validatePassword() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_=#])[A-Za-z\d@$!%*?&_=#]{8,16}$/;
    
    let isValid = passwordRegex.test(password);
    passwordValidationList.style.display = isValid ? "none" : "block";
    confirmPasswordValidationList.style.display = password === confirmPassword && password ? "none" : "block";
    
    submitButton.disabled = !(isValid && password === confirmPassword);
  }

  passwordInput.addEventListener("input", validatePassword);
  confirmPasswordInput.addEventListener("input", validatePassword);

  document.getElementById("sign-up-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    const newPassword = passwordInput.value;
    
    if (!user) {
      alert("No hay usuario autenticado.");
      return;
    }

    try {
      await updatePassword(user, newPassword);
      alert("Contraseña actualizada con éxito.");
      window.location.href = "../Cliente/products.html";
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
      alert("Hubo un error al actualizar la contraseña. Inténtalo de nuevo.");
    }
  });
});
