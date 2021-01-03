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
const getTurnos = () => db.collection('turnos').get();
const getTurno = (id) => db.collection('turnos').doc(id).get();
const onGetTurno = (cb) => db.collection('turnos').onSnapshot(cb);
const updateTurno = (id, updateTurno) => db.collection('turnos').doc(id).update(updateTurno);
const deleteTurno = (id) => db.collection('turnos').doc(id).delete();

// FUNCIÓN PARA MOSTRAR MENSAJES DE ERROR O EXITO AL REGISTRARSE
const error = document.querySelector('.mensaje-error');
const eliminar = document.querySelector('.mensaje-delete');
const success = document.querySelector('.mensaje-success');
const modificar = document.querySelector('.mensaje-modificar');
const setMessage = (type, menssage) => {
    switch (type) {
        case 'error':
            error.innerHTML = `<i class="fas fa-exclamation-triangle"></i><b> Error:</b> ${menssage}`;
            // MUESTRA MENSAJE DE ERROR
            error.classList.add('mensaje-error-activo')
                // LUEGO DE 3sg DESAPARECE
            setTimeout(() => {
                error.classList.remove('mensaje-error-activo')
            }, 3000);
            break;
        case 'delete':
            // MUESTRA MENSAJE DE ERROR
            eliminar.classList.add('mensaje-delete-activo')

            // LUEGO DE 3sg DESAPARECE
            setTimeout(() => {
                eliminar.classList.remove('mensaje-delete-activo')
            }, 3000);
            break;
        case 'acepta':
            // MUESTRA MENSAJE EXITOSO
            success.classList.add('mensaje-success-activo')
                // LUEGO DE 3sg DESAPARECE
            setTimeout(() => {
                success.classList.remove('mensaje-success-activo')
            }, 3000);
            break;
        case 'modifica':
            // MUESTRA MENSAJE EXITOSO
            modificar.classList.add('mensaje-modificar-activo')
                // LUEGO DE 3sg DESAPARECE
            setTimeout(() => {
                modificar.classList.remove('mensaje-modificar-activo')
            }, 3000);
            break;

    }
}

// CREA LOS ITEMS DE TURNOS EN EL DOM
const getItem = (docs) => {
    let doc = docs.data();
    let docId = docs.id;

    let date = doc.dateTurno.split('/');
    let fecha = `${date[2]}-${date[1]}-${date[0]}`;
    // let hour = doc.hourTurno.split();

    let service = doc.service.charAt(0).toUpperCase() + doc.service.slice(1);

    let estado;
    if (doc.estado) {
        estado = 'Atendido';

    } else {
        estado = 'Pendiente';
    }

    const div = document.createElement('DIV');
    div.classList.add('table-admin', 'table-items');
    div.innerHTML = `
        <input type="date" class="fechaTuro" data-id="${docId}" value="${fecha}">
        <input type="time" class="horaTurno" data-id="${docId}" value="${doc.hourTurno}">
        <h2>${doc.cedula}</h2>
        <h2>${doc.nameComplete}</h2>
        <h2>${doc.id}</h2>
        <h2>${service}</h2>
        <h2>${estado}</h2>
        <div class="btn-admin">
            <button class="btn-accept">
            <i class="fas fa-check-circle btn-admin-accept" data-id="${docId}"></i>
            </button>
            <button class="btn-modify">
            <i class="fas fa-exchange-alt btn-admin-modify" data-id="${docId}"></i>
            </button>
            <button class="btn-delete">
            <i class="fas fa-trash-alt btn-admin-delete" data-id="${docId}"></i>
            </button>
        </div>
        `;

    table.appendChild(div);

    //FUNCIÓN DE LOS BOTONES ACCEPTAR - MODIFICAR - ELIMINAR
    aceptarTurno();
    modificaTurno();
    eliminaTurno();
}

// ACEPTA UN TURNO
const aceptarTurno = () => {
    const btnsAccept = document.querySelectorAll('.btn-admin-accept');
    btnsAccept.forEach(btn => {
        btn.addEventListener('click', async(e) => {
            console.log(e.target.dataset.id);
            try {
                let turno = await getTurno(e.target.dataset.id);
                let newTurno = turno.data();

                // CAMBIA EL ESTADO DEL TURNO
                newTurno.estado = true;

                await updateTurno(e.target.dataset.id, newTurno);
                setMessage('acepta', null);
            } catch (error) {
                setMessage('error', 'Ocurrió un problema al modificar');
            }
        });
    });
}

// MODIFICA UN TURNO
const modificaTurno = () => {
    const btnsModify = document.querySelectorAll('.btn-admin-modify');
    const fechas = document.querySelectorAll('.fechaTuro');
    const horas = document.querySelectorAll('.horaTurno');
    btnsModify.forEach(btn => {
        btn.addEventListener('click', async(e) => {
            try {
                let turno = await getTurno(e.target.dataset.id);
                let newTurno = turno.data();

                fechas.forEach(fecha => {
                    if (fecha.dataset.id === e.target.dataset.id) {
                        console.log(fecha.value);
                        let date = fecha.value.split('-');
                        let newFecha = `${date[2]}/${date[1]}/${date[0]}`;

                        newTurno.dateTurno = newFecha;
                    }
                });

                horas.forEach(hora => {
                    if (hora.dataset.id === e.target.dataset.id) {
                        console.log(hora.value);

                        newTurno.hourTurno = hora.value;
                    }
                });

                await updateTurno(e.target.dataset.id, newTurno);
                setMessage('modifica', null);
            } catch (error) {
                setMessage('error', 'Ocurrió un problema al modificar');
            }
        });
    });
}

// ELIMINA UN TURNO
const eliminaTurno = () => {
    const btnsDelete = document.querySelectorAll('.btn-admin-delete');
    btnsDelete.forEach(btn => {
        btn.addEventListener('click', async(e) => {
            try {
                let del = await deleteTurno(e.target.dataset.id);
                console.log(del)
                setMessage('delete', null);
            } catch (error) {
                setMessage('error', 'Ocurrió un problema al eliminar');
            }
        });
    });
}

// EVENTO AL CARGAR LA PÁGINA
window.addEventListener('DOMContentLoaded', async(e) => {
    onGetTurno(querySnapshotTurno => {
        table.innerHTML = '';
        querySnapshotTurno.forEach(doc => {
            if (!doc.data().estado) {
                getItem(doc);
            }
        });
    });
});


// EVENTO PARA LA BÚSQUEDA
btnBuscar.addEventListener('click', async(e) => {
    e.preventDefault();

    loader.removeAttribute('style');

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
        let horaDesde = `${hourD[0]}:${hourD[1]}`;
        let horaHasta = `${hourH[0]}:${hourH[1]}`;

        //INSERTA LOS ITEMS DE TURNOS CONSULTADOS
        onGetTurno(querySnapshotTurno => {
            table.innerHTML = '';
            let nullRegistro = true;
            querySnapshotTurno.forEach(doc => {
                if ((doc.data().dateTurno >= fechaDesde && doc.data().hourTurno >= horaDesde) && (doc.data().dateTurno <= fechaHasta && doc.data().hourTurno <= horaHasta)) {
                    nullRegistro = false;

                    setTimeout(() => {
                        getItem(doc);
                    }, 1000);

                }
            });
            if (nullRegistro) {
                setTimeout(() => {
                    setMessage('error', 'No se encontraron registros en ese rango de fechas');
                }, 1000);
            }
        });
    } else {
        setTimeout(() => {
            setMessage('error', 'Debe seleccionar los campos de búsqueda');
        }, 1000);
    }
});

// LIMPIAR LA BUSQUEDA
btnLimpiar.addEventListener('click', (e) => {
    e.preventDefault();
    const form = document.querySelector('.container-busqueda');
    form.reset();
    onGetTurno(querySnapshotTurno => {
        table.innerHTML = '';
        querySnapshotTurno.forEach(doc => {
            if (!doc.data().estado) {
                getItem(doc);
            }
        });
    });
});