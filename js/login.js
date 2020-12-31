const auth = firebase.auth();

// EVENTO DE LOGIN DE UN USUARIO
const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    const email = loginForm['email'];
    const password = loginForm['password'];

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email.value, password.value);

        console.log(userCredential);
    } catch (err) {
        console.log(err);
        loginForm.reset();
        email.focus();

        const error = document.querySelector('.mensaje-error');

        // MUESTRA MENSAJE DE ERROR
        error.classList.add('mensaje-error-activo')

        // LUEGO DE 3sg DESAPARECE
        setTimeout(() => {
            error.classList.remove('mensaje-error-activo')
        }, 3000);
    }


})