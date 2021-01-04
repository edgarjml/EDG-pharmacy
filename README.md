<p>
  <img src="https://www.flaticon.com/svg/static/icons/svg/3349/3349593.svg" height="50" width="50" alt="Logo" />
</p> ##APLICACIÓN DE TURNOS DE FARMACIA

Aplicación de solicitud de turnos para atención o retiro de medicina de una farmacia.

Para crear un usuario administrador existe un usuario ADMIN que lo crea internamente, para ello,
logearse con estas credenciales y se accederá al registro de usuarios administradores.

**Correo:** *jadrianzc99@gmail.com* 

**Contraseña:** *jazc99* 

**Descripción:**

El usuario podrá solicitar un turno y consultar los mismos, solamente podrá solicitar un turno por tipo,
existen dos tipos de turnos, de retiro y de atención. Es decir, si ya tiene solicitado un turno de retiro no 
podrá solicitar otro hasta que el administrador acepte o elimine ese turno, de igual forma con el tipo de atención.

El administrador podrá aprobar o rechazar el turno solicitado por algún usuario, también podrá cambiar la fecha 
y hora para evitar congestionamientos en horas pico. Así como la consulta de turnos reservados por fecha y hora.

Validación de campos en registro, login y el modulo de búsqueda del administrador.

Además, existe una simulación de protección de rutas, por lo que un usuario que no esté logeado no podrá acceder a las
interfaces de cliente o administrador. Y cada usuario logeado no puede acceder a la página del otro usuario, es decir un cliente
no accede a la página del administrador y viceversa.

La aplicación está hosteada con Heroku y se puede acceder desde [Aquí](https://edg-pharmacy.herokuapp.com/)
