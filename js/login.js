const auth = firebase.auth();

// EVENTO DE LOGIN DE UN USUARIO
const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    const email = loginForm['email'];
    const password = loginForm['password'];

    const userCredential = await auth.signInWithEmailAndPassword(email.value, password.value);


    console.log(userCredential);
    loginForm.reset();
    email.focus();
})