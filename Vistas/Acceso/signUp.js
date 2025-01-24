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

// Validaciones
function validateForm() {
  const email = signUpForm["txt_email"].value.trim();
  const password = signUpForm["txt_password"].value.trim();
  const confirmPassword = signUpForm["confirm-password"].value.trim();
  const phone = signUpForm["phone"].value.trim();
  const question = signUpForm["question"].value.trim();
  const answer = signUpForm["answer"].value.trim();

  if (password.length < 6) {
    alert("La contraseña debe tener al menos 6 caracteres.");
    return false;
  }

  if (password !== confirmPassword) {
    alert("Las contraseñas no coinciden.");
    return false;
  }

  if (!email.includes("@")) {
    alert("Por favor, introduce un correo electrónico válido.");
    return false;
  }

  if (isNaN(phone) || phone.length < 8) {
    alert("El número telefónico debe contener al menos 8 dígitos y solo números.");
    return false;
  }

  if (!question) {
    alert("Selecciona una pregunta secreta.");
    return false;
  }

  if (!answer.trim()) {
    alert("La respuesta secreta no puede estar vacía.");
    return false;
  }

  return true;
}

// Manejo de usuarios en Firestore
window.addEventListener("DOMContentLoaded", async () => {
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
});

// Guardar o actualizar usuario
signUpForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  const name = signUpForm["name_usr"].value.trim();
  const email = signUpForm["txt_email"].value.trim();
  const password = signUpForm["txt_password"].value.trim();
  const phone = signUpForm["phone"].value.trim();
  const question = signUpForm["question"].value.trim();
  const answer = signUpForm["answer"].value.trim();

  try {
    if (!editStatus) {
      // Registro en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar en Firestore
      await saveUser(name, email, phone, question, answer);
      alert("Usuario registrado exitosamente.");
    } else {
      await updateUser(id, { name, email, phone, question, answer });
      alert("Usuario actualizado en Firestore.");
      editStatus = false;
      id = "";
      btnRegistrar.innerText = "Registrarse";
    }

    signUpForm.reset();
  } catch (error) {
    console.error("Error al registrar o guardar usuario:", error);
    alert("Este correo ya esta registrado, Por favor ingrese uno nuevo.");
  }
});
