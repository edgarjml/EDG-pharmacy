// BASE DE DATOS FIREBASE
const dba = firebase.firestore();
const authr = firebase.auth();

window.addEventListener('load', () => {

})

window.addEventListener('DOMContentLoaded', async(e) => {
    const loader = document.getElementById('contenedor-carga');
    setTimeout(() => {
        loader.style.visibility = 'hidden';
        loader.style.opacity = '0';

    }, 1500);
    const rutaActual = window.location.pathname;
    console.log(rutaActual);

    const emailSesion = sessionStorage.getItem('email');
    console.log(emailSesion);

    const rutas = {
        index: '/index.html',
        login: '/html/login.html',
        register: '/html/register.html',
        registerAdmin: '/html/registerAdmin.html',
        transactions: '/html/transactions.html',
        search: '/html/search.html',
        manager: '/html/manager.html',
        about: '/html/aboutUs.html'
    }

    if (emailSesion === null && (rutaActual === rutas.transactions || rutaActual === rutas.registerAdmin || rutaActual === rutas.manager || rutaActual === rutas.search)) {

        window.location.href = 'https://edg-pharmacy.herokuapp.com/html/login.html';

    } else if (emailSesion !== null) {

        const getEmailUser = () => dba.collection('usuarios').get();
        const getEmailAdmin = () => dba.collection('admin').get();

        const querySnapshotUser = await getEmailUser();
        const querySnapshotAdmin = await getEmailAdmin();

        let users = {
            usuario: false,
            admin: false
        }

        querySnapshotUser.forEach(doc => {
            if (doc.data().email === emailSesion) {
                users.usuario = true;
            }
        });

        querySnapshotAdmin.forEach(doc => {
            if (doc.data().email === emailSesion) {
                users.admin = true;
            }
        });

        console.log(users.usuario);
        console.log(users.admin);

        if (users.usuario === true && (rutaActual === rutas.registerAdmin || rutaActual === rutas.manager || rutaActual === rutas.login || rutaActual === rutas.register)) {
            window.location.href = 'https://edg-pharmacy.herokuapp.com/html/transactions.html';
        } else if (users.admin === true && (rutaActual === rutas.transactions || rutaActual === rutas.search || rutaActual === rutas.login || rutaActual === rutas.register)) {
            window.location.href = 'https://edg-pharmacy.herokuapp.com/html/manager.html';
        } else if (users.usuario === false && users.admin === false && (rutaActual === rutas.transactions || rutaActual === rutas.search || rutaActual === rutas.manager || rutaActual === rutas.login || rutaActual === rutas.register || rutaActual === rutas.index)) {
            window.location.href = 'https://edg-pharmacy.herokuapp.com/html/registerAdmin.html';
        }
    }
});

const btnLogout = document.getElementById('btn-logout');

btnLogout.addEventListener('click', (e) => {
    e.preventDefault();

    sessionStorage.removeItem('email');
    sessionStorage.removeItem('cedula');

    window.location.href = 'https://edg-pharmacy.herokuapp.com/html/login.html';
});