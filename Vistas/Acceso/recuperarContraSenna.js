const passwordInput = document.getElementById('txt_password');
const confirmPasswordInput = document.getElementById('confirm-password');







document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById('header-footer').innerHTML = `
        ${await (await fetch("../../header-footer.html")).text()}
    `;
});
    

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('sign-up-form');


const validationMessages = {
    password: document.getElementById('password-validation'),
    confirmPassword: document.getElementById('confirm-password-validation'),
};


function checkPassword() {
    const password = passwordInput.value;
    const messages = [];
    if (password.length === 0) messages.push("El campo no puede quedar vacío.");
    if (password.length < 8) messages.push("Debe tener al menos 8 caracteres.");
    if (!/[!#$%&*+\-/?]/.test(password)) messages.push("Debe tener al menos un caracter especial: ! # $ % & * + - / ?");
    if (!/[A-Z]/.test(password)) messages.push("Debe contener al menos una letra mayúscula.");
    if (!/[a-z]/.test(password)) messages.push("Debe contener al menos una letra minúscula.");
    if (!/\d/.test(password)) messages.push("Debe contener al menos un número.");

    toggleValidation(passwordInput, validationMessages.password, messages);
}

function checkConfirmPassword() {
    const confirmPassword = confirmPasswordInput.value;
    const messages = [];
    if (confirmPassword.length === 0) messages.push("El campo no puede quedar vacío.");
    if (confirmPassword !== passwordInput.value) messages.push("La contraseña debe coincidir con el campo anterior.");
    toggleValidation(confirmPasswordInput, validationMessages.confirmPassword, messages);
}

    // Función que alterna los mensajes y los estilos según la validación
    function toggleValidation(inputElement, messageElement, messages) {
      if (messages.length > 0) {
        inputElement.classList.add('input-invalid');
        messageElement.style.display = 'block';
        messageElement.innerHTML = messages.map(msg => `<li>${msg}</li>`).join('');
      } else {
        inputElement.classList.remove('input-invalid');
        inputElement.classList.add('input-valid');
        messageElement.style.display = 'none';
      }
    }

    passwordInput.addEventListener('blur', checkPassword);
    confirmPasswordInput.addEventListener('blur', checkConfirmPassword);

  });