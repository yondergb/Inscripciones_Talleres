const API_URL = "https://script.google.com/macros/s/AKfycbyN7qsAwT_CwOG2JoSAf5F-7mJk7-xRVqfQ5E957uNZM0IO9RGUxrC3OZw4uOVQ0TSrJA/exec";
const MAX_CUPOS = 15;

const form = document.getElementById("formulario");
const contador = document.getElementById("contador");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    nombres: nombres.value,
    apellidos: apellidos.value,
    cedula: cedula.value,
    telefono: telefono.value,
    fechaNacimiento: fechaNacimiento.value
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
  actualizar();
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