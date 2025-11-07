function irPara(pagina) {
  window.location.href = pagina;
}

function toggleMenu() {
  const sidebar = document.getElementById("sidebar");
  const container = document.querySelector(".container");
  sidebar.classList.toggle("closed");
  container.classList.toggle("full");
}

function abrirLink() {
  window.open("https://www.youtube.com", "_blank");
}
