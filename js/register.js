// BASE DE DATOS FIREBASE
const db = firebase.firestore();
const auth = firebase.auth();

// ELEMENTOS DEL DOM
const formulario = document.getElementById('register-form');
const inputs = document.querySelectorAll('#register-form input');

// EXPRESIONES REGULARES
const expresiones = {
    nombre: /^[\S][a-zA-ZÀ-ÿ]+[\s]+[a-zA-ZÀ-ÿ\s]{1,40}$/,
    cedula: /^[0-9]{10}$/,
    correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    password: /^.{4,12}$/
}

// VERIFICA LA VALIDACIÓN
const campos = {
    name: false,
    lastname: false,
    cedula: false,
    email: false,
    password: false
}

// OBJETO DE USUARIO
const newUser = new Object();

// FUNCIÓN PARA VALIDAR LOS INPUTS
const validarFormulario = (e) => {
    switch (e.target.name) {
        case "name":
            validarCampo(expresiones.nombre, e.target.value, 'name');
            break;
        case "lastname":
            validarCampo(expresiones.nombre, e.target.value, 'lastname');
            break;
        case "cedula":
            validarCampo(expresiones.cedula, e.target.value, 'cedula');
            break;
        case "email":
            validarCampo(expresiones.correo, e.target.value, 'email');
            break;
        case "password":
            validarCampo(expresiones.password, e.target.value, 'password');
            validarPassword();
            break;
        case "confirmPassword":
            validarPassword();
            break;
    }
}

// VALIDA CADA CAMPO
const validarCampo = (expresion, input, campo) => {
    if (expresion.test(input)) {
        document.querySelector(`.container-${campo} #${campo}`).classList.remove('color-input');
        document.querySelector(`#obligatorio-${campo}`).classList.remove('hidden-activo');

        campos[campo] = true;

        let value = input.trim();

        if (campo === 'name' || campo === 'lastname') {
            value = value.toUpperCase();
            newUser[campo] = value;
        } else {
            newUser[campo] = value;
        }

    } else {
        document.querySelector(`.container-${campo} #${campo}`).classList.add('color-input');
        document.querySelector(`#obligatorio-${campo}`).classList.add('hidden-activo');
        campos[campo] = false;
    }
}

// VALIDA CONTRASEÑA
const validarPassword = () => {
    const password1 = document.getElementById('password');
    const password2 = document.getElementById('confirmPassword');

    if (password1.value !== password2.value) {
        document.querySelector(`.container-confirmPassword #confirmPassword`).classList.add('color-input');
        document.querySelector(`#obligatorio-confirmPassword`).classList.add('hidden-activo');
        campos['password'] = false;
    } else {
        document.querySelector(`.container-confirmPassword #confirmPassword`).classList.remove('color-input');
        document.querySelector(`#obligatorio-confirmPassword`).classList.remove('hidden-activo');
        campos['password'] = true;
    }
}

// RECORRE TODOS LOS INPUTS Y AGREGA EVENTOS
inputs.forEach(input => {
    input.addEventListener('keyup', validarFormulario);
    input.addEventListener('blur', validarFormulario);
});

// VALIDA EXISTENCIA DE CÉDULA
let getCedula;
if (window.location.pathname === '/html/register.html') {
    getCedula = () => db.collection('usuarios').get();
} else if (window.location.pathname === '/html/registerAdmin.html') {
    getCedula = () => db.collection('admin').get();
}

// EVENTO DEL FORMULARIO
formulario.addEventListener('submit', async(e) => {
    e.preventDefault();

    const error = document.querySelector('.mensaje-error');
    const success = document.querySelector('.mensaje-success');

    // FUNCIÓN PARA MOSTRAR MENSAJES DE ERROR O EXITO AL REGISTRARSE
    const setMessageError = (type, menssage) => {
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

    // VERIFICA QUE TODOS LOS CAMPOS ESTEN CORRECTOS PARA SER GUARDADOS EN FIREBASE
    if (campos.name && campos.lastname && campos.cedula && campos.email && campos.password) {

        //OBTENER DATOS PARA VALIDAR QUE LA CÉDULA NO ESTÉ REGISTRADA MÁß DE 2 VECES
        const querySnapshot = await getCedula();
        querySnapshot.forEach(doc => {
            if (doc.data().cedula === newUser.cedula) {
                campos['cedula'] = false;
            }
        });

        if (campos.cedula) {
            try {
                // CREA UN USUARIO EN FIREBASE
                const userCredential = await auth.createUserWithEmailAndPassword(newUser.email, newUser.password);

                console.log(userCredential);

                // REGISTRA UN USUARIO
                if (window.location.pathname === '/html/register.html') {
                    await db.collection('usuarios').doc().set(newUser);
                } else if (window.location.pathname === '/html/registerAdmin.html') {
                    await db.collection('admin').doc().set(newUser);
                }

                setMessageError('success', null);

                formulario.reset();
                document.getElementById('name').focus();

            } catch (err) {
                setMessageError('error', 'El correo ya está registrado');
            }
        } else {
            setMessageError('error', 'El número de cédula ya está registrado');
        }
    } else {
        setMessageError('error', 'Por favor rellena el formulario correctamente');
    }
});