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

function currency(value) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "USD" }).format(value);
}

function paintDetail(book) {
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

notifyBtn.addEventListener("click", () => {
  alert("Te notificaremos cuando el libro se libere.");
});

paintDetail(books[0]);
renderBooks();
