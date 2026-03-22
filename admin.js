const API_URL = "https://script.google.com/macros/s/AKfycbw3JfI8-lOMVY-thW-pDv_XV76JwClahT5kcxen5UKXQ1PNMTgu253LGkbyuOkpOBsDbQ/exec";
let datos = [];

// 🔐 CONTROL DE ACCESO AL CARGAR
window.addEventListener("DOMContentLoaded", () => {
  const auth = sessionStorage.getItem("adminAuth");

  if (auth === "true") {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("panel").style.display = "block";
    cargar();
  } else {
    document.getElementById("loginBox").style.display = "block";
    document.getElementById("panel").style.display = "none";
  }
});

// 🔑 LOGIN
function login() {
  const usuario = document.getElementById("user").value;
  const clave = document.getElementById("pass").value;

  if (usuario === "admin" && clave === "12345") {
    sessionStorage.setItem("adminAuth", "true");

    document.getElementById("loginBox").style.display = "none";
    document.getElementById("panel").style.display = "block";

    cargar();
  } else {
    alert("Credenciales incorrectas");
  }
}

// 🚪 LOGOUT
function logout() {
  sessionStorage.removeItem("adminAuth");
  window.location.href = "index.html";
}

// 📥 CARGAR DATOS
async function cargar() {
  const res = await fetch(API_URL + "?action=get");
  datos = await res.json();
  render(datos);
}

// 🎨 RENDER TABLA
function render(data) {
  const tabla = document.getElementById("tabla");
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

// ❌ ELIMINAR
async function eliminar(id) {
  if (!confirm("¿Eliminar registro?")) return;

  await fetch(API_URL + "?action=delete", {
    method: "POST",
    body: JSON.stringify({ id })
  });

  cargar();
}

// 🔍 FILTRAR
function filtrar() {
  const texto = document.getElementById("buscar").value.toLowerCase();

  const filtrados = datos.filter(d =>
    d.Nombres.toLowerCase().includes(texto) ||
    d.Apellidos.toLowerCase().includes(texto) ||
    d.Cédula.toLowerCase().includes(texto)
  );

  render(filtrados);
}

// 📥 DESCARGAR CSV
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
