const API_URL = "PEGA_AQUI_TU_URL";
const MAX_CUPOS = 15;

// Referencias a elementos
const form = document.getElementById("formulario");
const contador = document.getElementById("contador");
const mensaje = document.getElementById("mensaje");

const nombresInput = document.getElementById("nombres");
const apellidosInput = document.getElementById("apellidos");
const cedulaInput = document.getElementById("cedula");
const telefonoInput = document.getElementById("telefono");
const fechaInput = document.getElementById("fechaNacimiento");

// Evento submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();

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

    mensaje.innerText = "Inscripción exitosa";
    form.reset();

    await actualizar();

  } catch (error) {
    console.error("Error:", error);
    mensaje.innerText = "Error al registrar";
  }
});

// Obtener datos
async function obtener() {
  const res = await fetch(API_URL + "?action=get");
  return await res.json();
}

// Actualizar contador
async function actualizar() {
  try {
    const inscritos = await obtener();
    const disponibles = MAX_CUPOS - inscritos.length;

    contador.innerText = `Cupos disponibles: ${disponibles} / ${MAX_CUPOS}`;

    if (disponibles <= 0) {
      form.style.display = "none";
      mensaje.innerText = "No hay cupos disponibles";
    }

  } catch (error) {
    console.error("Error al cargar contador:", error);
    contador.innerText = "Error al cargar datos";
  }
}

// Ejecutar al cargar
actualizar();
