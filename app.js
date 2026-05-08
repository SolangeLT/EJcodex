const books = [
  {
    id: 1,
    title: "Cien años de soledad",
    author: "Gabriel García Márquez",
    category: "novela",
    description: "Una obra maestra del realismo mágico en Macondo.",
    purchasePrice: 24.99,
    rentalPrice: 5.99,
    rentalDays: 7,
    isAvailable: true,
    availableDate: null,
    image: "https://placehold.co/600x800?text=Cien+años"
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "programacion",
    description: "Buenas prácticas para escribir código limpio.",
    purchasePrice: 34.99,
    rentalPrice: 8.99,
    rentalDays: 10,
    isAvailable: false,
    availableDate: "2026-05-20",
    image: "https://placehold.co/600x800?text=Clean+Code"
  },
  {
    id: 3,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    category: "historia",
    description: "Breve historia de la humanidad y su evolución.",
    purchasePrice: 27.5,
    rentalPrice: 6.5,
    rentalDays: 7,
    isAvailable: true,
    availableDate: null,
    image: "https://placehold.co/600x800?text=Sapiens"
  }
];

const booksGrid = document.getElementById("booksGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const availabilityFilter = document.getElementById("availabilityFilter");
const emptyState = document.getElementById("emptyState");
const loader = document.getElementById("loader");

const detailTitle = document.getElementById("detailTitle");
const detailAuthor = document.getElementById("detailAuthor");
const detailDescription = document.getElementById("detailDescription");
const detailPurchase = document.getElementById("detailPurchase");
const detailRental = document.getElementById("detailRental");
const detailBadge = document.getElementById("detailBadge");
const releaseDate = document.getElementById("releaseDate");
const detailImage = document.getElementById("detailImage");
const buyBtn = document.getElementById("buyBtn");
const rentBtn = document.getElementById("rentBtn");
const notifyBtn = document.getElementById("notifyBtn");
const themeToggle = document.getElementById("themeToggle");

const adminForm = document.getElementById("adminForm");
const adminDeleteForm = document.getElementById("adminDeleteForm");
const adminBookSelect = document.getElementById("adminBookSelect");
const adminFeedback = document.getElementById("adminFeedback");

let selectedBookId = books[0]?.id ?? null;

function applyTheme(theme) {
  const mode = theme === "dark" ? "dark" : "light";
  document.body.setAttribute("data-bs-theme", mode);
  themeToggle.textContent = mode === "dark" ? "☀️ Modo claro" : "🌙 Modo oscuro";
}

function initTheme() {
  const storedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(storedTheme || (prefersDark ? "dark" : "light"));
}

function currency(value) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "USD" }).format(value);
}

function paintDetail(book) {
  if (!book) {
    detailTitle.textContent = "Sin libros disponibles";
    detailAuthor.textContent = "";
    detailDescription.textContent = "Agrega un libro desde el Gestor para verlo aquí.";
    detailPurchase.textContent = "—";
    detailRental.textContent = "—";
    detailImage.src = "https://placehold.co/600x800?text=Sin+libros";
    detailBadge.className = "badge text-bg-secondary mb-2";
    detailBadge.textContent = "Sin catálogo";
    releaseDate.classList.add("d-none");
    notifyBtn.classList.add("d-none");
    buyBtn.disabled = true;
    rentBtn.disabled = true;
    return;
  }

  detailTitle.textContent = book.title;
  detailAuthor.textContent = `Autor: ${book.author}`;
  detailDescription.textContent = book.description;
  detailPurchase.textContent = currency(book.purchasePrice);
  detailRental.textContent = `${currency(book.rentalPrice)} / ${book.rentalDays} días`;
  detailImage.src = book.image;

  if (book.isAvailable) {
    detailBadge.className = "badge text-bg-success mb-2";
    detailBadge.textContent = "Disponible";
    releaseDate.classList.add("d-none");
    notifyBtn.classList.add("d-none");
    buyBtn.disabled = false;
    rentBtn.disabled = false;
  } else {
    detailBadge.className = "badge text-bg-warning mb-2";
    detailBadge.textContent = "Rentado";
    releaseDate.classList.remove("d-none");
    releaseDate.textContent = `Disponible a partir del: ${book.availableDate}`;
    notifyBtn.classList.remove("d-none");
    buyBtn.disabled = false;
    rentBtn.disabled = true;
  }
}

function createCard(book) {
  const col = document.createElement("div");
  col.className = "col-sm-6 col-lg-4 book-card";

  col.innerHTML = `
    <div class="card shadow-sm h-100">
      <img src="${book.image}" class="card-img-top" alt="Portada de ${book.title}" />
      <div class="card-body d-flex flex-column">
        <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
          <h3 class="h6 mb-0">${book.title}</h3>
          <span class="badge ${book.isAvailable ? "text-bg-success" : "text-bg-warning"}">
            ${book.isAvailable ? "Disponible" : "Rentado"}
          </span>
        </div>
        <p class="text-muted mb-2">${book.author}</p>
        <p class="small mb-3">Compra: <strong>${currency(book.purchasePrice)}</strong></p>
        <p class="small mb-3">Renta: <strong>${currency(book.rentalPrice)}</strong> / ${book.rentalDays} días</p>
        ${book.isAvailable ? "" : `<p class=\"small text-danger\">Se libera: ${book.availableDate}</p>`}
        <div class="mt-auto d-flex gap-2">
          <button class="btn btn-sm btn-primary flex-fill">Comprar</button>
          <button class="btn btn-sm btn-outline-primary flex-fill" ${book.isAvailable ? "" : "disabled"}>Rentar</button>
        </div>
      </div>
    </div>
  `;

  col.addEventListener("click", () => {
    selectedBookId = book.id;
    paintDetail(book);
    document.getElementById("detalle").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  return col;
}

function filterBooks() {
  const term = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const availability = availabilityFilter.value;

  return books.filter((book) => {
    const matchesTerm =
      !term || book.title.toLowerCase().includes(term) || book.author.toLowerCase().includes(term);
    const matchesCategory = category === "all" || book.category === category;
    const matchesAvailability =
      availability === "all" ||
      (availability === "available" && book.isAvailable) ||
      (availability === "rented" && !book.isAvailable);

    return matchesTerm && matchesCategory && matchesAvailability;
  });
}

function updateAdminBookOptions() {
  adminBookSelect.innerHTML = "";

  if (!books.length) {
    adminBookSelect.innerHTML = '<option value="">No hay libros para dar de baja</option>';
    adminBookSelect.disabled = true;
    return;
  }

  adminBookSelect.disabled = false;

  books.forEach((book) => {
    const option = document.createElement("option");
    option.value = String(book.id);
    option.textContent = `${book.title} — ${book.author}`;
    adminBookSelect.appendChild(option);
  });
}

function syncSelectedBookAfterMutations() {
  if (!books.length) {
    selectedBookId = null;
    paintDetail(null);
    return;
  }

  const stillExists = books.some((book) => book.id === selectedBookId);

  if (!stillExists) {
    selectedBookId = books[0].id;
  }

  const selectedBook = books.find((book) => book.id === selectedBookId);
  paintDetail(selectedBook);
}

function showAdminFeedback(message, type = "success") {
  adminFeedback.className = `alert alert-${type} mt-3 mb-0`;
  adminFeedback.textContent = message;
  adminFeedback.classList.remove("d-none");
}

function renderBooks() {
  loader.classList.remove("d-none");

  setTimeout(() => {
    const results = filterBooks();
    booksGrid.innerHTML = "";

    if (!results.length) {
      emptyState.classList.remove("d-none");
    } else {
      emptyState.classList.add("d-none");
      results.forEach((book) => booksGrid.appendChild(createCard(book)));
    }

    loader.classList.add("d-none");
  }, 200);
}

searchInput.addEventListener("input", renderBooks);
categoryFilter.addEventListener("change", renderBooks);
availabilityFilter.addEventListener("change", renderBooks);

adminForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(adminForm);
  const title = String(formData.get("title") || "").trim();
  const author = String(formData.get("author") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const purchasePrice = Number(formData.get("purchasePrice"));
  const rentalPrice = Number(formData.get("rentalPrice"));
  const rentalDays = Number(formData.get("rentalDays"));
  const description = String(formData.get("description") || "").trim();
  const image = String(formData.get("image") || "").trim() || "https://placehold.co/600x800?text=Nuevo+Libro";

  const nextId = books.length ? Math.max(...books.map((book) => book.id)) + 1 : 1;

  books.push({
    id: nextId,
    title,
    author,
    category,
    description,
    purchasePrice,
    rentalPrice,
    rentalDays,
    isAvailable: true,
    availableDate: null,
    image
  });

  selectedBookId = nextId;

  adminForm.reset();
  updateAdminBookOptions();
  renderBooks();
  syncSelectedBookAfterMutations();
  showAdminFeedback("Libro dado de alta correctamente.");
});

adminDeleteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const idToDelete = Number(adminBookSelect.value);
  const bookIndex = books.findIndex((book) => book.id === idToDelete);

  if (bookIndex === -1) {
    showAdminFeedback("No se encontró el libro a dar de baja.", "warning");
    return;
  }

  const [removedBook] = books.splice(bookIndex, 1);
  updateAdminBookOptions();
  renderBooks();
  syncSelectedBookAfterMutations();
  showAdminFeedback(`Libro dado de baja: ${removedBook.title}.`, "info");
});

notifyBtn.addEventListener("click", () => {
  alert("Te notificaremos cuando el libro se libere.");
});

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  localStorage.setItem("theme", nextTheme);
});

initTheme();
updateAdminBookOptions();
syncSelectedBookAfterMutations();
renderBooks();
