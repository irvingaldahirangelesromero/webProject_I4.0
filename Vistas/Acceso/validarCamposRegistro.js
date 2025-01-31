// Obtener todos los elementos de entrada y validaciones
const nameInput = document.getElementById('name_usr');
const emailInput = document.getElementById('txt_email');
const phoneInput = document.getElementById('phone');
const questionSelect = document.getElementById('question');
const answerInput = document.getElementById('answer');
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
      name: document.getElementById('name-validation'),
      email: document.getElementById('email-validation'),
      phone: document.getElementById('phone-validation'),
      question: document.getElementById('question-validation'),
      answer: document.getElementById('answer-validation'),
      password: document.getElementById('password-validation'),
      confirmPassword: document.getElementById('confirm-password-validation'),
    };

    // Función para comprobar las validaciones de cada campo
    function checkName() {
      const name = nameInput.value;
      const messages = [];
      if (name.length === 0) messages.push("El campo no puede quedar vacío.");
      if (/\d/.test(name)) messages.push("El nombre no debe contener números.");
      if (/[^a-zA-Z\s]/.test(name)) messages.push("El nombre no debe contener símbolos.");
      if (name.length > 60) messages.push("El nombre no debe exceder los 60 caracteres.");

      toggleValidation(nameInput, validationMessages.name, messages);
    }

    function checkEmail() {
      const email = emailInput.value;
      const messages = [];
      if (email.length === 0) messages.push("El campo no puede quedar vacío.");
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(email)) messages.push("El formato correcto debe ser ejemploo@correo.com");

      toggleValidation(emailInput, validationMessages.email, messages);
    }

    function checkPhone() {
      const phone = phoneInput.value;
      const messages = [];
      if (phone.length === 0) messages.push("El campo no puede quedar vacío.");
      if (/[a-zA-Z]/.test(phone)) messages.push("El número no debe contener letras.");
      if (phone.length > 10 || phone.length < 10) messages.push("El número debe contener 10 caracteres.");
      const phonePattern = /^\+?\d+$/;
      if (!phonePattern.test(phone)) messages.push("El número solo puede contener un símbolo '+' al inicio.");

      toggleValidation(phoneInput, validationMessages.phone, messages);
    }

    function checkQuestion() {
      const question = questionSelect.value;
      const messages = [];
      if (!question) messages.push("Debe seleccionar una opción válida.");

      toggleValidation(questionSelect, validationMessages.question, messages);
    }

    function checkAnswer() {
      const answer = answerInput.value;
      const selectedQuestion = questionSelect.value;
      const messages = [];

      // Si la pregunta es "Nombre de tu primera mascota" o "Cuál es tu comida favorita", se validan las condiciones adicionales
      if (selectedQuestion === "pet" || selectedQuestion === "food") {
        if (answer.length === 0) messages.push("El campo no puede quedar vacío.");
        if (/\d/.test(answer)) messages.push("El nombre no debe contener números.");
        if (/[^a-zA-Z\s]/.test(answer)) messages.push("El nombre no debe contener símbolos.");
        if (answer.length > 60) messages.push("El nombre no debe exceder los 60 caracteres.");
      } else {
        // Solo se valida que el campo no quede vacío para otras preguntas
        if (answer.length === 0) messages.push("El campo no puede quedar vacío.");
      }

      toggleValidation(answerInput, validationMessages.answer, messages);
    }

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

    // Agregar event listeners para validar en tiempo real
    nameInput.addEventListener('blur', checkName);
    emailInput.addEventListener('blur', checkEmail);
    phoneInput.addEventListener('blur', checkPhone);
    questionSelect.addEventListener('change', checkQuestion);
    answerInput.addEventListener('blur', checkAnswer);
    passwordInput.addEventListener('blur', checkPassword);
    confirmPasswordInput.addEventListener('blur', checkConfirmPassword);

    // Función para habilitar el botón de envío solo si todos los campos son válidos
    form.addEventListener('input', function () {
      const isValid = [...form.querySelectorAll('input, select')].every(input => input.classList.contains('input-valid'));
      document.getElementById('btn_registrar').disabled = !isValid;
    });
  });