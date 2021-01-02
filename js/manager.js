// BASE DE DATOS FIREBASE
const db = firebase.firestore();

// ELEMENTOS DEL DOM
const table = document.getElementById('table-body');
const btnBuscar = document.getElementById('btn-buscar');
const btnLimpiar = document.getElementById('btn-limpiar');
const desdeFecha = document.getElementById('desdeFecha');
const hastaFecha = document.getElementById('hastaFecha');
const desdeHora = document.getElementById('desdeHora');
const hastaHora = document.getElementById('hastaHora');
const loader = document.getElementById('contenedor-carga');

// OBTIENE LA COLECCIÓN DE TURNOS DE FIREBASE
const getTurno = () => db.collection('turnos').get();

// CREA LOS ITEMS DE TURNOS EN EL DOM
const getItem = (doc) => {
    let service = doc.service.charAt(0).toUpperCase() + doc.service.slice(1);

    const div = document.createElement('DIV');
    div.classList.add('table-admin');
    div.innerHTML = `
                <h2>${doc.dateTurno}</h2>
                <h2>${doc.hourTurno}</h2>
                <h2>${doc.cedula}</h2>
                <h2>${doc.nameComplete}</h2>
                <h2>${doc.id}</h2>
                <h2>${service}</h2>
                <div class="btn-admin">
                    <button>
                    <i class="fas fa-check-circle"></i>
                    </button>
                    <button>
                    <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
                `;
    table.appendChild(div);
}

// EVENTO AL CARGAR LA PÁGINA
window.addEventListener('DOMContentLoaded', async(e) => {
    e.preventDefault();

    const querySnapshotTurno = await getTurno();

    querySnapshotTurno.forEach(doc => {
        if (!doc.data().estado) {
            getItem(doc.data());
        }
    });
});


// EVENTO PARA LA BÚSQUEDA
btnBuscar.addEventListener('click', async(e) => {
    e.preventDefault();

    loader.removeAttribute('style');

    const querySnapshotTurno = await getTurno();

    setTimeout(() => {
        loader.style.visibility = 'hidden';
        loader.style.opacity = '0';

    }, 1000);

    if (desdeFecha.value !== '' && desdeHora.value !== '' && hastaFecha.value !== '' && hastaHora.value !== '') {
        let dateD = desdeFecha.value.split('-');
        let dateH = hastaFecha.value.split('-');
        let hourD = desdeHora.value.split(':');
        let hourH = hastaHora.value.split(':');

        let fechaDesde = `${dateD[2]}/${dateD[1]}/${dateD[0]}`;
        let fechaHasta = `${dateH[2]}/${dateH[1]}/${dateH[0]}`;
        let horaDesde = `${hourD[0]} : ${hourD[1]} : 00`;
        let horaHasta = `${hourH[0]} : ${hourH[1]} : 00`;

        //ELIMINA TODOS LOS ITEMS DE TURNOS ANTERIORES
        while (table.hasChildNodes()) {
            table.removeChild(table.firstChild);
        }

        //INSERTA LOS ITEMS DE TURNOS CONSULTADOS
        querySnapshotTurno.forEach(doc => {
            if ((doc.data().dateTurno >= fechaDesde && doc.data().hourTurno >= horaDesde) && (doc.data().dateTurno <= fechaHasta && doc.data().hourTurno <= horaHasta)) {
                setTimeout(() => {
                    getItem(doc.data());
                }, 1000);
            } else {
                // MOSTRAR MENSAJE DE QUE NO SE ENCONTRARON REGISTROS
            }
        });
    } else {
        console.log('VACCIOOO')
    }
});

// REFRESCA LA PÁGINA
btnLimpiar.addEventListener('click', (e) => {
    e.preventDefault();

    // const form = document.querySelector('.container-busqueda');
    // form.reset();

    window.location.href = 'http://127.0.0.1:5500/html/manager.html';

});