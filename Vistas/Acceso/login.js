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

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();

  const txtEmail = document.querySelector("#txt_email");
  const txtPassword = document.querySelector("#txt_password");
  const email = txtEmail.value.trim();
  const password = txtPassword.value;

  // Validación de campos vacíos
  if (!email || !password) {
    alert("Por favor, complete todos los campos.");
    return;
  }

  // Validación de formato del correo
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Por favor, ingrese un correo electrónico válido.");
    return;
  }

  // Intentar iniciar sesión
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      alert("Inicio de sesión exitoso.");
      window.location.href = "products.html";
    })
    .catch((error) => {
      alert("Correo o contraseña incorrectos. Por favor, inténtelo nuevamente.");
      txtEmail.value = ""; // Limpiar campos
      txtPassword.value = "";
    });
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