// BASE DE DATOS FIREBASE
const db = firebase.firestore();

const table = document.getElementById('table-body');

window.addEventListener('DOMContentLoaded', async(e) => {
    e.preventDefault();

    const cedulaSession = sessionStorage.getItem('cedula');
    const getTurno = () => db.collection('turnos').get();
    const querySnapshotTurno = await getTurno();

    querySnapshotTurno.forEach(doc => {
        if (doc.data().cedula === cedulaSession) {

            let service = doc.data().service.charAt(0).toUpperCase() + doc.data().service.slice(1);

            let estado;
            doc.data().estado ? estado = 'Atendido' : estado = 'Pendiente';

            const div = document.createElement('DIV');
            div.classList.add('table');
            div.innerHTML = `
            <h2>${doc.data().dateTurno}</h2>
            <h2>${doc.data().hourTurno}</h2>
            <h2>${doc.data().id}</h2>
            <h2>${service}</h2>
            <h2>${estado}</h2>
            `;
            table.appendChild(div);
        }
    });
});