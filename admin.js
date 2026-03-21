const API_URL = "https://script.google.com/macros/s/AKfycbzhe6bsdrRcOb14t719yys-enjuVT7J_i_4HGLan9uDZW31sBHBH9e0bv9NpRC6lZyVyg/exec";
let datos = [];

function login() {
  if (user.value === "admin" && pass.value === "12345") {
    loginBox.style.display = "none";
    panel.style.display = "block";
    cargar();
  } else {
    alert("Credenciales incorrectas");
  }
}

async function cargar() {
  const res = await fetch(API_URL + "?action=get");
  datos = await res.json();
  render(datos);
}

function render(data) {
  tabla.innerHTML = "";

  data.forEach(d => {
    tabla.innerHTML += `
      <tr>
        <td>${d.Nombres}</td>
        <td>${d.Apellidos}</td>
        <td>${d.Cédula}</td>
        <td>${d.Teléfono}</td>
        <td><button onclick="eliminar('${d.ID}')">Eliminar</button></td>
      </tr>
    `;
  });
}

async function eliminar(id) {
  if (!confirm("¿Eliminar registro?")) return;

  await fetch(API_URL + "?action=delete", {
    method: "POST",
    body: JSON.stringify({ id })
  });

  cargar();
}

function filtrar() {
  const texto = buscar.value.toLowerCase();

  const filtrados = datos.filter(d =>
    d.Nombres.toLowerCase().includes(texto) ||
    d.Apellidos.toLowerCase().includes(texto) ||
    d.Cédula.toLowerCase().includes(texto)
  );

  render(filtrados);
}

function descargar() {
  let csv = "Nombres,Apellidos,Cedula,Telefono\n";

  datos.forEach(d => {
    csv += `${d.Nombres},${d.Apellidos},${d.Cédula},${d.Teléfono}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "inscritos.csv";
  a.click();
}
