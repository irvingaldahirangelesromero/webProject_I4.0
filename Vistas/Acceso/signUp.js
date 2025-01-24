import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const btnLogin = document.getElementById("btn_login");

// Función para alternar la visibilidad de la contraseña
document.querySelectorAll(".toggle-password").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-target");
    const input = document.getElementById(targetId);
    if (input.type === "password") {
      input.type = "text";
      btn.textContent = "🙈";
    } else {
      input.type = "password";
      btn.textContent = "👁";
    }
  });
});

// Expresión regular para validar correo
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Validar formulario de login
btnLogin.addEventListener("click", async (e) => {
  e.preventDefault();

  const txtEmail = document.querySelector("#txt_email");
  const txtPassword = document.querySelector("#txt_password");
  const email = txtEmail.value.trim();
  const password = txtPassword.value;

  // Validación de campos vacíos
  let valid = true;

  // Validación de correo electrónico
  if (!email || !emailRegex.test(email)) {
    alert("Por favor, ingrese un correo electrónico válido (debe contener '@' y un dominio).");
    txtEmail.classList.add("input-invalid");
    valid = false;
  } else {
    txtEmail.classList.remove("input-invalid");
    txtEmail.classList.add("input-valid");
  }

  // Validación de contraseña
  if (!password) {
    alert("Por favor, ingrese una contraseña.");
    txtPassword.classList.add("input-invalid");
    valid = false;
  } else {
    txtPassword.classList.remove("input-invalid");
    txtPassword.classList.add("input-valid");
  }

  // Si los campos no son válidos, detenemos el proceso
  if (!valid) {
    return;
  }

  try {
    // Intentar iniciar sesión
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    alert("Inicio de sesión exitoso.");
    window.location.href = "/Vistas/Admin/products.html";
  } catch (error) {
    // Manejo de errores de Firebase
    const errorCode = error.code;
    const errorMessage = error.message;

    if (errorCode === "auth/user-not-found" || errorCode === "auth/wrong-password") {
      alert("Correo o contraseña incorrectos. Por favor, inténtelo nuevamente.");
      txtEmail.classList.add("input-invalid");
      txtPassword.classList.add("input-invalid");
    } else {
      alert(`Error al iniciar sesión: ${errorMessage}`);
    }

    // Limpiar campos tras error
    txtEmail.value = "";
    txtPassword.value = "";
  }
});

// Cambiar el color del borde cuando el usuario comienza a escribir
document.querySelector("#txt_email").addEventListener("input", () => {
  const txtEmail = document.querySelector("#txt_email");
  if (txtEmail.value.trim() && emailRegex.test(txtEmail.value.trim())) {
    txtEmail.classList.add("input-valid");
    txtEmail.classList.remove("input-invalid");
  } else {
    txtEmail.classList.remove("input-valid");
    txtEmail.classList.add("input-invalid");
  }
});

document.querySelector("#txt_password").addEventListener("input", () => {
  const txtPassword = document.querySelector("#txt_password");
  if (txtPassword.value.trim()) {
    txtPassword.classList.add("input-valid");
    txtPassword.classList.remove("input-invalid");
  } else {
    txtPassword.classList.remove("input-valid");
    txtPassword.classList.add("input-invalid");
  }
});







// const btn_loginGoogle = document.getElementById("btn_loginGoogle");
// btn_loginGoogle.addEventListener("click", (e) => {
//     e.preventDefault();
//     const provider = new GoogleAuthProvider();
//     signInWithPopup(auth, provider)
//         .then((result) => {
//             const user = result.user;
//             document.location.href = "products.html";
//         })
//         .catch((error) => {
//             const errorMessage = error.message;
//             console.log(errorMessage);
//         });
// });

// const btn_loginFacebook = document.getElementById("btn_loginFacebook");
// btn_loginFacebook.addEventListener("click", (e) => {
//     e.preventDefault();
//     const provider = new FacebookAuthProvider();
//     signInWithPopup(auth, provider)
//         .then((result) => {
//             const user = result.user;
//             document.location.href = "products.html";
//         })
//         .catch((error) => {
//             const errorMessage = error.message;
//             console.log(errorMessage);
//         });
// });