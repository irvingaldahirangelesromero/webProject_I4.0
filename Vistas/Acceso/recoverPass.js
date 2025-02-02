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
                window.location.href = "../Acceso/login.html";
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

        
        try {
        // Consultar Firestore para obtener la pregunta de seguridad del usuario
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            const question = userData.securityQuestion; // Asegúrate de que la clave en Firestore sea correcta

            // Mostrar la pregunta en el formulario
            document.getElementById('QuestionSelected').textContent = question;
        } else {
            alert("No se encontró un usuario con este correo.");
            window.location.href = "recoverPass.html";
        }
    } catch (error) {
        console.error("Error al obtener la pregunta de seguridad:", error);
        alert("Hubo un problema al recuperar la pregunta de seguridad. Inténtalo de nuevo.");
    }

        
        

        btnConfirmVerification.addEventListener('click', async (event) => {
            event.preventDefault();

            const answer = document.getElementById('answer').value.trim();

            if (!answer) {
                alert("Por favor, ingresa tu respuesta.");
                return;
            }

            try {
                console.log("Consultando Firestore con los datos:");
                console.log(`Email: ${email}, Answer: ${answer}`);

                const usersRef = collection(db, "users");
                const q = query(usersRef, where("email", "==", email), where("answer", "==", answer));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    console.log("Usuario encontrado. Enviando correo de recuperación...");
                    await sendPasswordResetEmail(auth, email);
                    window.location.href = "../Acceso/login.html";
                    alert("Se ha enviado un correo de restablecimiento de contraseña.");
                } else {
                    console.warn("Usuario no encontrado o la respuesta no coincide.");
                    alert("La respuesta no coincide con la información registrada.");
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
