import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const btnLogin = document.getElementById("btn_login");
const db = getFirestore(); // Inicializar Firestore

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
  const email = txtEmail.value.trim().toLowerCase(); // Convertir a minúsculas para evitar problemas
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

    // Consulta para obtener el rol del usuario desde Firestore
    const usersCollection = collection(db, "users"); // Cambia "users" por tu colección
    const q = query(usersCollection, where("email", "==", email)); // Busca el documento con el correo
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Itera sobre los documentos encontrados
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const role = userData.role; // Suponiendo que "role" contiene el rol del usuario

        if (role === "Admin") {
          alert("Inicio de sesión exitoso como Administrador.");
          window.location.href = "/Vistas/Admin/products.html";
        } else if (role === "Cliente") {
          alert("Inicio de sesión exitoso como Cliente.");
          window.location.href = "/Vistas/Cliente/products.html";
        } else {
          alert("Rol no reconocido. Contacte al administrador.");
        }
      });
    } else {
      alert("No se encontró información del usuario con este correo en Firestore.");
    }
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
