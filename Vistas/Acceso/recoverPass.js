import { auth } from "./firebase.js"; // Firebase Auth
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const db = getFirestore(); // Inicializar Firestore

document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById('header-footer').innerHTML = await (await fetch("../../header-footer.html")).text();
    const contentForms = document.getElementById('content-forms');

    async function loadVerificationForm() {
        contentForms.innerHTML = await (await fetch("frmEmailVerification.html")).text();

        const btnSendEmailVerification = document.getElementById('btnConfirmVerification');
        const btnSecondMethod = document.getElementById('btnSecondMethod');

        btnSendEmailVerification.addEventListener('click', async (event) => {
            event.preventDefault();
            const email = document.getElementById('usr_email').value;

            if (!email) {
                alert("Por favor, introduce un correo electrónico.");
                return;
            }

            try {
                await sendPasswordResetEmail(auth, email);
                alert("Se ha enviado un correo de restablecimiento de contraseña.");
                window.location.href = "../../index.html";
            } catch (error) {
                handleAuthError(error);
            }
        });

        btnSecondMethod.addEventListener('click', async (event) => {
            event.preventDefault();
            const email = document.getElementById('usr_email').value.trim();

            if (!email) {
                alert("Por favor, introduce un correo electrónico antes de continuar.");
                return;
            }

            // Guardar el correo en una variable para la siguiente pantalla
            sessionStorage.setItem("emailForSecurityQuestions", email);

            await loadSecurityQuestionsForm();
        });
    }

    async function loadSecurityQuestionsForm() {
        contentForms.innerHTML = await (await fetch("frmSecurityQuestions.html")).text();

        const btnConfirmVerification = document.getElementById('btnConfirmVerification');
        const email = sessionStorage.getItem("emailForSecurityQuestions"); // Recuperar el correo ingresado

        if (!email) {
            alert("No se detectó un correo electrónico válido. Por favor, regresa e ingrésalo.");
            window.location.href = "recoverPass.html";
            return;
        }

        btnConfirmVerification.addEventListener('click', async (event) => {
            event.preventDefault();

            const question = document.getElementById('securityQuestion').value;
            const answer = document.getElementById('answer').value.trim();

            if (!question || !answer) {
                alert("Por favor, completa todos los campos.");
                return;
            }

            try {
                console.log("Consultando Firestore con los datos:");
                console.log(`Email: ${email}, Question: ${question}, Answer: ${answer}`);

                const usersRef = collection(db, "users");
                const q = query(usersRef, where("email", "==", email), where("question", "==", question), where("answer", "==", answer));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    console.log("Usuario encontrado. Enviando correo de recuperación...");
                    await sendPasswordResetEmail(auth, email);
                    alert("Se ha enviado un correo de restablecimiento de contraseña.");
                    window.location.href = "../../index.html";
                } else {
                    console.warn("Usuario no encontrado o los datos no coinciden.");
                    alert("La pregunta y respuesta no coinciden con la información registrada.");
                }
            } catch (error) {
                console.error("Error al verificar las preguntas de seguridad:", error);
                alert("Hubo un error al verificar tu identidad. Inténtalo de nuevo.");
            }
        });
    }

    function handleAuthError(error) {
        const errorCode = error.code;
        const errorMessage = error.message;

        switch (errorCode) {
            case "auth/invalid-email":
                alert("El correo proporcionado no es válido.");
                break;
            case "auth/user-not-found":
                alert("No existe una cuenta asociada a este correo.");
                break;
            default:
                alert(`Error: ${errorCode}: ${errorMessage}`);
        }
    }

    await loadVerificationForm();
});
