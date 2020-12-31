const auth = firebase.auth();

// EVENTO DE LOGIN DE UN USUARIO
const loginForm = document.getElementById('login-form');

// VALIDAR CORREO
const getEmailUser = () => db.collection('usuarios').get();
const getEmailAdmin = () => db.collection('admin').get();

loginForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    const email = loginForm['email'];
    const password = loginForm['password'];

    try {
        // REALIZA LA AUTENTICACIÓN CON FIREBASE
        const userCredential = await auth.signInWithEmailAndPassword(email.value, password.value);

        //OBTENER DATOS PARA VALIDAR QUE LA CÉDULA NO ESTÉ REGISTRADA MÁß DE 2 VECES
        const querySnapshot = await getEmailUser();
        querySnapshot.forEach(doc => {
            if (doc.data().cedula === newUser.cedula) {
                campos['cedula'] = false;
            }
        });

        if (userCredential.user.email) {

        }

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