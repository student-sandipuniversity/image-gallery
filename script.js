
const filters = document.querySelectorAll(".filter");
const items = document.querySelectorAll(".gallery-item");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");

const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let visibleItems = [];
let currentIndex = 0;
let lastFocusedElement = null;

// Filter images by category
function applyFilter(category) {
  items.forEach(item => {
    const matches =
      category === "all" ||
      item.dataset.category === category;

    item.classList.toggle("hide", !matches);
  });

  visibleItems = [...items].filter(
    item => !item.classList.contains("hide")
  );
}

// Category button navigation
filters.forEach(button => {
  button.addEventListener("click", () => {
    filters.forEach(filter =>
      filter.classList.remove("active")
    );

    button.classList.add("active");
    applyFilter(button.dataset.category);
  });
});

// Open image viewer
function openLightbox(index) {
  visibleItems = [...items].filter(
    item => !item.classList.contains("hide")
  );

  if (visibleItems.length === 0) return;

  currentIndex = index;
  lastFocusedElement = document.activeElement;

  lightbox.hidden = false;
  document.body.style.overflow = "hidden";

  showImage();
  closeBtn.focus();
}

// Display selected image
function showImage() {
  const item = visibleItems[currentIndex];
  const image = item.querySelector("img");
  const caption = item.querySelector(".caption");

  lightboxImg.src = image.src;
  lightboxImg.alt = image.alt;
  lightboxCaption.textContent = caption.textContent;
}

// Click a gallery image
items.forEach(item => {
  item.addEventListener("click", () => {
    const index = visibleItems.indexOf(item);
    if (index !== -1) openLightbox(index);
  });

  item.setAttribute("tabindex", "0");
  item.setAttribute("role", "button");

  item.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      item.click();
    }
  });
});

// Next image
nextBtn.addEventListener("click", () => {
  currentIndex =
    (currentIndex + 1) % visibleItems.length;
  showImage();
});

// Previous image
prevBtn.addEventListener("click", () => {
  currentIndex =
    (currentIndex - 1 + visibleItems.length) %
    visibleItems.length;
  showImage();
});

// Close viewer
function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = "";

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

closeBtn.addEventListener("click", closeLightbox);

// Close when clicking the dark background
lightbox.addEventListener("click", event => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

// Keyboard navigation
document.addEventListener("keydown", event => {
  if (lightbox.hidden) return;

  if (event.key === "Escape") {
    closeLightbox();
  } else if (event.key === "ArrowRight") {
    nextBtn.click();
  } else if (event.key === "ArrowLeft") {
    prevBtn.click();
  }
});

// Initial gallery
applyFilter("all");
