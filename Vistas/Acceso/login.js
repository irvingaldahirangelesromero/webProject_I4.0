import { auth } from "./firebase.js";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const btn_login = document.getElementById("btn_login");

btn_login.addEventListener("click", (e) => {
    e.preventDefault();
    const txt_email = document.querySelector("#txt_email");
    const txt_password = document.querySelector("#txt_password");

    signInWithEmailAndPassword(auth, txt_email.value, txt_password.value)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log("credenciales válidas");
            console.log(user);
            window.location.href = "products.html";
        })
        .catch((error) => {
            const errorMessage = error.message;
            console.log(errorMessage);
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