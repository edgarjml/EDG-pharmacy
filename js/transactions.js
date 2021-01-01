// BASE DE DATOS FIREBASE
const db = firebase.firestore();
const auth = firebase.auth();

window.addEventListener('DOMContentLoaded', async(e) => {
    let emailLogin = sessionStorage.getItem('email');
    console.log(emailLogin);

    const getUser = () => db.collection('usuarios').get();
    const querySnapshotUser = await getUser();

    querySnapshotUser.forEach(doc => {
        if (doc.data().email === emailLogin) {
            console.log(doc.data())

            let nombreCompleto = `${doc.data().name} ${doc.data().lastname}`;

            let cedulaUser = doc.data().cedula;

            document.getElementById('namesUser').textContent = nombreCompleto;

            document.getElementById('idetification').textContent = cedulaUser;
        }
    })
})