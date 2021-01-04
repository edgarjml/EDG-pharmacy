// BASE DE DATOS FIREBASE
const db = firebase.firestore();
const auth = firebase.auth();

// EVENTO DE LOGIN DE UN USUARIO
const loginForm = document.getElementById('login-form');

// VALIDAR CORREO
const getEmailUser = () => db.collection('usuarios').get();
const getEmailAdmin = () => db.collection('admin').get();

//VERIFICA ESTADO DE USUARIO
let campos = {
    usuario: false,
    admin: false
}


// EVENTO DEL FORM
loginForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    const email = loginForm['email'];
    const password = loginForm['password'];

    try {
        // REALIZA LA AUTENTICACIÓN CON FIREBASE
        const userCredential = await auth.signInWithEmailAndPassword(email.value, password.value);

        await sessionStorage.setItem('email', userCredential.user.email);

        //OBTENER DATOS PARA VALIDAR SI ES USUARIO O ADMIN
        const querySnapshotUser = await getEmailUser();
        const querySnapshotAdmin = await getEmailAdmin();

        // SI ES USUARIO REDIRECCIONA A LA PAGINA PARA USUARIO
        if (true) {
            querySnapshotUser.forEach(doc => {
                if (doc.data().email === userCredential.user.email) {
                    campos['usuario'] = true;
                    window.location.href = 'https://edg-pharmacy.herokuapp.com/html/transactions.html';
                }
            });
        }

        // SI ES ADMIN REDIRECCIONA A LA PAGINA PARA ADMIN
        if (campos.usuario === false) {
            querySnapshotAdmin.forEach(doc => {
                if (doc.data().email === userCredential.user.email) {
                    campos['admin'] = true;
                    window.location.href = 'https://edg-pharmacy.herokuapp.com/html/manager.html';
                }
            });
        }

        // PARA CREAR UN NUEVO USUARIO ADMINISTRADOR
        if (campos.usuario === false && campos.admin === false) {
            window.location.href = 'https://edg-pharmacy.herokuapp.com/html/registerAdmin.html';
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
});