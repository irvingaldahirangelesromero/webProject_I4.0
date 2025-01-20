document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById('header-footer').innerHTML = await (await fetch("../../header-footer.html")).text();
    const contentForms = document.getElementById('content-forms');
    
    async function loadEmailVerificationForm() { //cargar formulario default
        contentForms.innerHTML = await (await fetch("frmEmailVerification.html")).text();
        // Asignar eventos después de que el contenido se cargue
        const btnSecondMethod = document.getElementById('btnSecondMethod');
        const btnConfirmVerification = document.getElementById('btnConfirmVerification');

        btnSecondMethod.addEventListener('click', async (event) => {
            event.preventDefault();
            await loadSecurityQuestionsForm(); // Cargar el formulario de preguntas de seguridad
        });
        btnConfirmVerification.addEventListener('click', async (event) => {
            event.preventDefault();
            await loadVerificationCodeForm(); // Para acceder con codifo de verificación
        });
    }
    
    async function loadSecurityQuestionsForm() {   // Cargar el formulario de preguntas de seguridad
        contentForms.innerHTML = await (await fetch("frmSecurityQuestions.html")).text();
    }
    
    async function loadVerificationCodeForm() {   // Cargar el formulario de preguntas de seguridad
        contentForms.innerHTML = await (await fetch("frmCodeVerification.html")).text();
    }
    // Inicializar la carga del primer formulario
    await loadVerificationCodeForm();
    await loadEmailVerificationForm();
});