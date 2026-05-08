const STORAGE_KEY = "biblioapp_books";
const defaultBooks = [
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

const books = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || [...defaultBooks];
localStorage.setItem(STORAGE_KEY, JSON.stringify(books));

const adminForm = document.getElementById("adminForm");
const adminDeleteForm = document.getElementById("adminDeleteForm");
const adminBookSelect = document.getElementById("adminBookSelect");
const adminFeedback = document.getElementById("adminFeedback");

function saveBooks() { localStorage.setItem(STORAGE_KEY, JSON.stringify(books)); }
function showAdminFeedback(message, type = "success") {
  adminFeedback.className = `alert alert-${type} mt-3 mb-0`;
  adminFeedback.textContent = message;
  adminFeedback.classList.remove("d-none");
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

adminForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(adminForm);
  const nextId = books.length ? Math.max(...books.map((book) => book.id)) + 1 : 1;
  books.push({
    id: nextId,
    title: String(formData.get("title") || "").trim(),
    author: String(formData.get("author") || "").trim(),
    category: String(formData.get("category") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    purchasePrice: Number(formData.get("purchasePrice")),
    rentalPrice: Number(formData.get("rentalPrice")),
    rentalDays: Number(formData.get("rentalDays")),
    isAvailable: true,
    availableDate: null,
    image: String(formData.get("image") || "").trim() || "https://placehold.co/600x800?text=Nuevo+Libro"
  });
  saveBooks();
  adminForm.reset();
  updateAdminBookOptions();
  showAdminFeedback("Libro dado de alta correctamente.");
});

adminDeleteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const idToDelete = Number(adminBookSelect.value);
  const idx = books.findIndex((book) => book.id === idToDelete);
  if (idx === -1) return showAdminFeedback("No se encontró el libro a dar de baja.", "warning");
  const [removedBook] = books.splice(idx, 1);
  saveBooks();
  updateAdminBookOptions();
  showAdminFeedback(`Libro dado de baja: ${removedBook.title}.`, "info");
});

updateAdminBookOptions();
