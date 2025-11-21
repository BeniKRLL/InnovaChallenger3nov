const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggle-btn");
const container = document.querySelector(".container");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("closed");
  container.classList.toggle("full");
});
