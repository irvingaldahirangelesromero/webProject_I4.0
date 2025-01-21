import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const btnRegistrar = document.getElementById("btn_registrar");
const togglePasswordButtons = document.querySelectorAll(".toggle-password");

togglePasswordButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetInput = document.getElementById(button.dataset.target);
    const isPassword = targetInput.type === "password";
    targetInput.type = isPassword ? "text" : "password";
    button.textContent = isPassword ? "🙈" : "👁";
  });
});

btnRegistrar.addEventListener("click", (e) => {
  e.preventDefault();

  const name = document.querySelector("#name_usr").value.trim();
  const email = document.querySelector("#txt_email").value.trim();
  const password = document.querySelector("#txt_password").value;
  const confirmPassword = document.querySelector("#confirm-password").value;

  // Validar campos vacíos
  if (!name || !email || !password || !confirmPassword) {
    alert("Por favor, complete todos los campos.");
    return;
  }
  
  // Validar el nombre
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    alert("El nombre solo debe contener letras y espacios.");
    return;
  }

  // Validar la contraseña
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_=])[A-Za-z\d@$!%*?&_=]{8,16}$/;
  if (!passwordRegex.test(password)) {
    alert(
      "La contraseña debe tener entre 8 y 16 caracteres, al menos una letra minúscula, una letra mayúscula, un número y un carácter especial."
    );
    return;
  }

  // Validar confirmación de contraseña
  if (password !== confirmPassword) {
    alert("Las contraseñas no son iguales.");
    return;
  }

  // Registro en Firebase
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      alert("Usuario registrado con éxito.");
    })
    .catch((error) => {
      if (error.code === "auth/email-already-in-use") {
        alert("El correo electrónico ya está registrado.");
      } else {
        console.error(error.message);
        alert("Hubo un error al registrar al usuario.");
      }
    });
});
