import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { onGetUsers, saveUser, deleteUser, getUser, updateUser } from "./firebaseU.js";

const btnRegistrar = document.getElementById("btn_registrar");
const togglePasswordButtons = document.querySelectorAll(".toggle-password");
const signUpForm = document.getElementById("sign-up-form");
const usersContainer = document.getElementById("users-container");

let editStatus = false;
let id = "";

// Funcionalidad para mostrar/ocultar contraseñas
togglePasswordButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetInput = document.getElementById(button.dataset.target);
    const isPassword = targetInput.type === "password";
    targetInput.type = isPassword ? "text" : "password";
    button.textContent = isPassword ? "🙈" : "👁";
  });
});


// Manejo de usuarios en Firestore
/*window.addEventListener("DOMContentLoaded", async () => {
  onGetUsers((querySnapshot) => {
    usersContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const user = doc.data();
      usersContainer.innerHTML += `
        <div class="card card-body mt-2 border-primary">
          <h3 class="h5">${user.name}</h3>
          <p><strong>Correo:</strong> ${user.email}</p>
          <p><strong>Teléfono:</strong> ${user.phone}</p>
          <p><strong>Pregunta Secreta:</strong> ${user.question}</p>
          <p><strong>Respuesta Secreta:</strong> ${user.answer}</p>
          <div class="d-flex justify-content-between">
            <button class="btn btn-danger btn-delete" data-id="${doc.id}">🗑 Eliminar</button>
            <button class="btn btn-secondary btn-edit" data-id="${doc.id}">🖉 Editar</button>
          </div>
        </div>`;
    });

    // Botones para eliminar
    usersContainer.querySelectorAll(".btn-delete").forEach((btn) =>
      btn.addEventListener("click", async ({ target: { dataset } }) => {
        try {
          await deleteUser(dataset.id);
          alert("Usuario eliminado.");
        } catch (error) {
          console.error("Error al eliminar usuario:", error);
        }
      })
    );

    // Botones para editar
    usersContainer.querySelectorAll(".btn-edit").forEach((btn) =>
      btn.addEventListener("click", async (e) => {
        try {
          const doc = await getUser(e.target.dataset.id);
          const user = doc.data();
          signUpForm["name_usr"].value = user.name;
          signUpForm["txt_email"].value = user.email;
          signUpForm["phone"].value = user.phone;
          signUpForm["question"].value = user.question;
          signUpForm["answer"].value = user.answer;

          editStatus = true;
          id = doc.id;
          btnRegistrar.innerText = "Actualizar";
        } catch (error) {
          console.error("Error al obtener usuario:", error);
        }
      })
    );
  });
});*/

function validarQueNingunCampoSeaVacio() {
  const inputs = [
    document.getElementById('name_usr'),
    document.getElementById('txt_email'),
    document.getElementById('phone'),
    document.getElementById('answer'),
    document.getElementById('txt_password'),
    document.getElementById('confirm-password')
  ];
  
  let isValid = true;
  
  inputs.forEach(input => {
    if (input.value.trim() === "") {
      input.classList.add('input-invalid');
      isValid = false;
    }
  });

  if (!isValid) alert("Todos los campos son obligatorios");
  return isValid;
}

// Guardar o actualizar usuario
signUpForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Obtener todos los valores necesarios
  const name = signUpForm["name_usr"].value.trim();
  const email = signUpForm["txt_email"].value.trim();
  const password = signUpForm["txt_password"].value.trim();
  const phone = signUpForm["phone"].value.trim();
  const question = signUpForm["question"].options[signUpForm["question"].selectedIndex].text.trim();
  const answer = signUpForm["answer"].value.trim();
  const role = "Cliente";

  // Validaciones básicas antes de verificar existencia
  if (!validarQueNingunCampoSeaVacio()) return;

  // Verificar formato de correo
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(email)) {
    alert("Formato de correo inválido");
    return;
  }

  // Verificar existencia del correo
  try {
    const correoExiste = await verificarCorreoExistente(email);
    const existenceValidation = document.getElementById('email-existence-validation');
    
    if (!correoExiste) {
      existenceValidation.style.display = 'block';
      document.getElementById('txt_email').classList.add('input-invalid');
      return;
    } else {
      existenceValidation.style.display = 'none';
    }

    // Si pasa todas las validaciones, registrar en Firebase
    if (!editStatus) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await saveUser(name, email, phone, question, answer, role);
      alert("Usuario registrado exitosamente.");
      window.location.href = "../Cliente/products.html";
    } else {
      await updateUser(id, { name, email, phone, question, answer, role });
      alert("Usuario actualizado.");
      editStatus = false;
    }
    
    signUpForm.reset();
  } catch (error) {
    console.error("Error:", error);
    if (error.code === 'auth/email-already-in-use') {
      alert("Este correo electrónico ya está registrado");
    } else {
      alert("Error al registrar: " + error.message);
    }
}});

// Validaciones en tiempo real
function addValidationListeners() {
  const inputs = [
    {
      id: "name_usr",
      validator: (value) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value.trim()),
    },
    {
      id: "txt_email",
      validator: (value) => value.includes("@") && value.includes("."),
    },
    { id: "phone", validator: (value) => value.trim().length >= 10 && value.trim().length <11 && /^\d{10}$/.test(value) },
    { id: "question", validator: (value) => value.trim().length > 0 },
    { id: "answer", validator: (value) => value.trim().length > 0 },
    {
      id: "txt_password",
      validator: (value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_=])[A-Za-z\d@$!%*?&_=]{8,16}$/.test(
          value.trim()
        ),
    },
    {
      id: "confirm-password",
      validator: (value) =>
        value === signUpForm["txt_password"].value.trim(),
    },
  ];

  inputs.forEach(({ id, validator }) => {
    const input = document.getElementById(id);
    input.addEventListener("input", () => {
      if (validator(input.value)) {
        input.classList.remove("input-invalid");
        input.classList.add("input-valid");
      } else {
        input.classList.remove("input-valid");
        input.classList.add("input-invalid");
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", addValidationListeners);

// Función para verificar si el correo existe usando AbstractAPI
async function verificarCorreoExistente(email) {
  const apiKey = "7845f473a8fe47eea2ec16c0a62ff12c";
  const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`;

  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    return datos.deliverability === "DELIVERABLE";
  } catch (error) {
    console.error("Error en verificación:", error);
    return false; // Considerar como inválido en caso de error
  }
}

// Evento blur para el campo de correo electrónico
document.getElementById("txt_email").addEventListener("blur", async () => {
  const emailInput = document.getElementById("txt_email");
  const email = emailInput.value.trim();
  const emailValidation = document.getElementById("email-validation");
  const existenceValidation = document.getElementById("email-existence-validation");

  // Resetear estados
  emailValidation.style.display = 'none';
  existenceValidation.style.display = 'none';
  emailInput.classList.remove('input-invalid', 'input-valid');

  if (!email) {
    emailValidation.style.display = 'block';
    emailInput.classList.add('input-invalid');
    return;
  }

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(email)) {
    emailValidation.style.display = 'block';
    emailInput.classList.add('input-invalid');
    return;
  }

  // Verificar existencia solo si el formato es válido
  try {
    const correoExiste = await verificarCorreoExistente(email);
    if (!correoExiste) {
      existenceValidation.style.display = 'block';
      emailInput.classList.add('input-invalid');
    } else {
      emailInput.classList.add('input-valid');
    }
  } catch (error) {
    console.error("Error en verificación:", error);
  }
});