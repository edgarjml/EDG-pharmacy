// BASE DE DATOS FIREBASE
const db = firebase.firestore();

// OBTENER EL ELEMENTO DE FORMULARIO DEL DOM
const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    const name = registerForm['name'];
    const lastname = registerForm['lastname'];
    const cedula = registerForm['cedula'];
    const email = registerForm['email'];
    const password = registerForm['password'];
    const confirmPassword = registerForm['confirmPassword'];

    const newUser = {
        name: name.value,
        lastname: lastname.value,
        cedula: cedula.value,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value
    }

    await db.collection('usuarios').doc().set(newUser);
    registerForm.reset();
    name.focus();
})