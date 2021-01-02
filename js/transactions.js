// BASE DE DATOS FIREBASE
const db = firebase.firestore();
const auth = firebase.auth();

window.addEventListener('DOMContentLoaded', async(e) => {
    let emailLogin = sessionStorage.getItem('email');

    const getUser = () => db.collection('usuarios').get();
    const querySnapshotUser = await getUser();

    querySnapshotUser.forEach(doc => {
        if (doc.data().email === emailLogin) {
            let nombreCompleto = `${doc.data().name} ${doc.data().lastname}`;

            let cedulaUser = doc.data().cedula;

            document.getElementById('namesUser').textContent = nombreCompleto;

            document.getElementById('idetification').textContent = cedulaUser;

            sessionStorage.setItem('cedula', cedulaUser);
        }
    })
});

// GENERA EL NÚMERO DE TURNO DEL USUARIO
const generaIdTurno = async() => {
    const getTurnos = () => db.collection('turnos').get();
    const querySnapshotTurno = await getTurnos();

    let totalTurnos = querySnapshotTurno.docs.length;
    ++totalTurnos;

    return totalTurnos;
}

// FUNCIÓN PARA MOSTRAR MENSAJES DE ERROR O EXITO AL REGISTRARSE
const error = document.querySelector('.mensaje-error');
const success = document.querySelector('.mensaje-success');
const setMessage = (type, menssage) => {
    if (type === 'error') {
        error.innerHTML = `<i class="fas fa-exclamation-triangle"></i><b> Error:</b> ${menssage}`;

        // MUESTRA MENSAJE DE ERROR
        error.classList.add('mensaje-error-activo')

        // LUEGO DE 3sg DESAPARECE
        setTimeout(() => {
            error.classList.remove('mensaje-error-activo')
        }, 3000);
    } else {
        // MUESTRA MENSAJE EXITOSO
        success.classList.add('mensaje-success-activo')

        // LUEGO DE 3sg DESAPARECE
        setTimeout(() => {
            success.classList.remove('mensaje-success-activo')
        }, 3000);
    }
}

// VALIDAR SI EL USUARIO YA TIENE TURNO
const validaTurno = async(cedula, service) => {
    let turnoExist = false;
    const getTurnos = () => db.collection('turnos').get();
    const querySnapshotTurno = await getTurnos();

    switch (service) {
        case 'retiro':
            querySnapshotTurno.forEach(doc => {
                if (doc.data().cedula === cedula && doc.data().service === service && doc.data().estado === false) {
                    turnoExist = true;
                }
            });
            break;
        case 'atencion':
            querySnapshotTurno.forEach(doc => {
                if (doc.data().cedula === cedula && doc.data().service === service && doc.data().estado === false) {
                    turnoExist = true;
                }
            });
            break;
    }
    return turnoExist;
}

// EVENTO DEL  FORMULARIO
const formulario = document.getElementById('transactions-form');

formulario.addEventListener('submit', async(e) => {
    e.preventDefault();

    const nameComplete = document.getElementById('namesUser').textContent;
    const cedula = document.getElementById('idetification').textContent;
    const service = document.getElementById('service').value;
    const description = document.getElementById('description').value;

    let date = new Date();
    // Hora:Minuto
    let hour = date.getHours();
    let minute = date.getMinutes();

    //Día-Mes-Año
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    //Formatear fecha
    if (day.toString().length === 1) day = `0${day}`
    if (month.toString().length === 1) month = `0${month}`;

    //Formatear hora
    if (hour.toString().length === 1) hour = `0${hour}`;
    if (minute.toString().length === 1) minute = `0${minute}`;

    let hourTurno = `${hour}:${minute}`;
    let dateTurno = `${day}/${month}/${year}`

    const turnoExist = await validaTurno(cedula, service);

    if (!turnoExist) {
        try {
            let id = await generaIdTurno();

            let turno = {
                id,
                nameComplete,
                cedula,
                service,
                description,
                dateTurno,
                hourTurno,
                estado: false
            }

            await db.collection('turnos').doc().set(turno);
            console.log(turno);
            setMessage('success', null);

        } catch (err) {
            setMessage('error', 'Vuelva a intentarlo más tarde');
        }
    } else {
        setMessage('error', 'Usted ya tiene un turno pendiente');
    }
});