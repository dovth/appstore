const appListEl = document.getElementById("app-list");
const searchInput = document.getElementById("search-input");
const toggleDark = document.getElementById("toggle-dark");
const allBtn = document.getElementById("all-btn");
const iosBtn = document.getElementById("ios-btn");
const androidBtn = document.getElementById("android-btn");

let apps = [];
let currentFilter = "all";
let darkMode = localStorage.getItem("darkMode") === "true";

if (darkMode) document.body.classList.add("dark");

fetch("apps.json")
  .then(res => res.json())
  .then(data => {
    apps = data;
    renderApps(apps);
  });

function getIcon(app) {
  if (app.icon) return app.icon;
  // fallback: dùng icon mặc định hoặc favicon từ tên app
  const name = app.name.toLowerCase().replace(/\s+/g, "");
  return `https://api.faviconkit.com/${name}.com/144`;
}

function renderApps(list) {
  appListEl.innerHTML = "";
  list.forEach(app => {
    const card = document.createElement("div");
    card.className = "app-card";
    card.innerHTML = `
      <div class="app-header">
        <img src="${getIcon(app)}" onerror="this.src='https://cdn-icons-png.flaticon.com/512/1828/1828640.png'" alt="icon" />
        <h2>${app.name}</h2>
      </div>
      <div class="meta">${app.platform} • ${app.version} • ${app.size}</div>
      <p>${app.description}</p>
      <div class="actions">
        ${app.installLink ? `<a href="${app.installLink}">Cài đặt / Tải về</a>` : ""}
      </div>
    `;
    appListEl.appendChild(card);
  });
}

function filterApps() {
  const searchTerm = searchInput.value.toLowerCase();
  let filtered = apps.filter(app =>
    app.name.toLowerCase().includes(searchTerm)
  );
  if (currentFilter !== "all") {
    filtered = filtered.filter(app => app.platform.toLowerCase() === currentFilter);
  }
  renderApps(filtered);
}

searchInput.addEventListener("input", filterApps);

toggleDark.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
});

allBtn.addEventListener("click", () => setFilter("all"));
iosBtn.addEventListener("click", () => setFilter("ios"));
androidBtn.addEventListener("click", () => setFilter("android"));

function setFilter(type) {
  currentFilter = type;
  document.querySelectorAll("nav button").forEach(btn => btn.classList.remove("active"));
  if (type === "ios") iosBtn.classList.add("active");
  else if (type === "android") androidBtn.classList.add("active");
  else allBtn.classList.add("active");
  filterApps();
}
