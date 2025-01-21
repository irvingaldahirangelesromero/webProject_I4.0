import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js"; // Importar funciones de Firebase Auth

import { auth } from "./firebase.js";

// const auth = getAuth(); // Inicializa Firebase Auth
            
document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById('header-footer').innerHTML = await (await fetch("../../header-footer.html")).text();
    const contentForms = document.getElementById('content-forms');
    

    async function loadEmailVerificationForm() { //cargar formulario default
        contentForms.innerHTML = await (await fetch("frmEmailVerification.html")).text();
        // Asignar eventos después de que el contenido se cargue
        const btnSecondMethod = document.getElementById('btnSecondMethod');
        const btnSendEmailVerification = document.getElementById('btnConfirmVerification');


        btnSecondMethod.addEventListener('click', async (event) => {
            event.preventDefault();
            await loadSecurityQuestionsForm(); // Cargar el formulario de preguntas de seguridad
        });


        btnSendEmailVerification.addEventListener('click', async (event) => {
            event.preventDefault();            
            const email = document.getElementById('usr_email').value;
            if (!email) {
                alert("Por favor, selecciona una dirección de correo electrónico.");
                return;
            }            
            
            try {
                await sendPasswordResetEmail(auth, email);
                alert("Se ha enviado un correo de verificación a la dirección proporcionada.");
            
                //SOLO SI SE VERIFICO DESDE EL CORREO
                // await loadEmailVerification(); // Para acceder con codifo de verificación
            } catch (error) {
                const errorCode = error.code;
                const errorMessage = error.message;

                switch (error.code) {
                    case 'auth/invalid-email':
                        alert("El correo proporcionado no es válido.");
                        break;
                    case 'auth/user-not-found':
                        alert("No existe una cuenta asociada a este correo.");
                        break;
                    case 'auth/missing-email':
                        alert("No se ha proporcionado un correo electrónico. Por favor, ingresa uno.");
                        break; 
                    case 'auth/timeout':
                        alert("La solicitud tardó demasiado tiempo. Por favor, inténtalo de nuevo.");
                        break;
                    default:
                        alert(`Error: ${errorCode}: ${errorMessage}`);
                }
            }
        });
    }
    


    async function loadSecurityQuestionsForm() {   // Cargar el formulario de preguntas de seguridad
        contentForms.innerHTML = await (await fetch("frmSecurityQuestions.html")).text();
    }
    

    async function loadEmailVerification() {   // Enviar códrreo de verificación
        contentForms.innerHTML = await (await fetch("frmPassRestore.html")).text();
    }

    // Inicializar la carga del primer formulario
    await loadEmailVerification();
    await loadEmailVerificationForm();
});