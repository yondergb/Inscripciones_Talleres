const API_URL = "https://script.google.com/macros/s/AKfycbw3JfI8-lOMVY-thW-pDv_XV76JwClahT5kcxen5UKXQ1PNMTgu253LGkbyuOkpOBsDbQ/exec";
const MAX_CUPOS = 15;

const form = document.getElementById("formulario");
const contador = document.getElementById("contador");
const mensaje = document.getElementById("mensaje");

const nombresInput = document.getElementById("nombres");
const apellidosInput = document.getElementById("apellidos");
const cedulaInput = document.getElementById("cedula");
const telefonoInput = document.getElementById("telefono");
const fechaInput = document.getElementById("fechaNacimiento");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const boton = document.getElementById('inscribirse');
  boton.style.display = 'none';

  try {
    const data = {
      nombres: nombresInput.value.trim(),
      apellidos: apellidosInput.value.trim(),
      cedula: cedulaInput.value.trim(),
      telefono: telefonoInput.value.trim(),
      fechaNacimiento: fechaInput.value
    };

    const inscritos = await obtener();

    if (inscritos.length >= MAX_CUPOS) {
      mensaje.innerText = "No hay cupos disponibles";
      return;
    }

    await fetch(API_URL + "?action=add", {
      method: "POST",
      body: JSON.stringify(data)
    });

    Swal.fire({
      title: "¡Exito!?",
      text: "¡Inscripción exitosa!",
      icon: "success"
    });

    const boton = document.getElementById('inscribirse');
    boton.style.display = 'block';

    form.reset();
    actualizar();

  } catch (error) {
    mensaje.innerText = "Error al registrar";
  }
});

async function obtener() {
  const res = await fetch(API_URL + "?action=get");
  return await res.json();
}

async function actualizar() {
  const inscritos = await obtener();
  const disponibles = MAX_CUPOS - inscritos.length;

  contador.innerText = `Cupos disponibles: ${disponibles} / ${MAX_CUPOS}`;

  if (disponibles <= 0) {
    form.style.display = "none";
    mensaje.innerText = "No hay cupos disponibles";
  }
}

actualizar();