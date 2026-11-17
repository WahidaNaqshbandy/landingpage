// =========================
// WAHIDA PORTFOLIO INTERACTIONS
// Vanilla JavaScript
// =========================

const menuToggle = document.querySelector("#menuToggle");
const navLinks = document.querySelector("#navLinks");
const navItems = document.querySelectorAll(".nav-link");
const themeToggle = document.querySelector("#themeToggle");
const themeIcon = document.querySelector(".theme-icon");
const contactForm = document.querySelector("#contactForm");
const formFeedback = document.querySelector("#formFeedback");
const modal = document.querySelector("#projectModal");
const modalClose = document.querySelector("#modalClose");

// 1. Mobile navigation: open/close the menu and close it after choosing a link.
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
  navLinks.classList.toggle("is-open", !isOpen);
});

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navItems.forEach((link) => link.classList.remove("active"));
    item.classList.add("active");
  });
});

// 2. Dark/light mode: remember the selected theme in localStorage.
const savedTheme = localStorage.getItem("wahida-theme");
if (savedTheme === "light") {
  document.body.classList.add("light-theme");
  themeIcon.textContent = "☾";
  themeToggle.setAttribute("aria-label", "Switch to dark mode");
}

themeToggle.addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light-theme");
  themeIcon.textContent = isLight ? "☾" : "☼";
  themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
  localStorage.setItem("wahida-theme", isLight ? "light" : "dark");
});

// 3. Project filters: show only projects matching the selected category.
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;
    filterButtons.forEach((filter) => filter.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach((card) => {
      const shouldShow = selectedFilter === "all" || card.dataset.category === selectedFilter;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

// 4. Project detail modal: update the modal with the selected project's content.
const projectDetails = {
  lumina: {
    eyebrow: "FRONT-END · CONCEPT",
    title: "Lumina Digital Library",
    description: "A digital library concept designed around a calm reading experience. The idea explores book discovery, visual storytelling and an inviting online reading space.",
    tags: ["HTML", "CSS", "JavaScript", "Responsive UI"]
  },
  portfolio: {
    eyebrow: "WEB DESIGN · PERSONAL BRAND",
    title: "Personal Portfolio",
    description: "A personal website concept for presenting skills, selected work and a learning journey in a clear and memorable way.",
    tags: ["UI Design", "Responsive Design", "Personal Branding"]
  },
  playground: {
    eyebrow: "FRONT-END · PRACTICE",
    title: "Interface Playground",
    description: "A practice space for experimenting with cards, navigation patterns, dashboards and small interactive interface components.",
    tags: ["DOM", "CSS Grid", "Flexbox", "JavaScript"]
  }
};

const modalEyebrow = document.querySelector("#modalEyebrow");
const modalTitle = document.querySelector("#modalTitle");
const modalDescription = document.querySelector("#modalDescription");
const modalTags = document.querySelector("#modalTags");

document.querySelectorAll(".project-open").forEach((button) => {
  button.addEventListener("click", () => {
    const project = projectDetails[button.dataset.project];
    if (!project) return;

    modalEyebrow.textContent = project.eyebrow;
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;
    modalTags.innerHTML = project.tags.map((tag) => `<span>${tag}</span>`).join("");
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modalClose.focus();
  });
});

function closeProjectModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

modalClose.addEventListener("click", closeProjectModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeProjectModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeProjectModal();
  }
});

// 5. Contact form validation: check required fields and show helpful messages.
// This demo validates the form in the browser; it does not send email to a server.
const fields = {
  name: document.querySelector("#name"),
  email: document.querySelector("#email"),
  message: document.querySelector("#message")
};

const errors = {
  name: document.querySelector("#nameError"),
  email: document.querySelector("#emailError"),
  message: document.querySelector("#messageError")
};

function showFieldError(fieldName, message) {
  errors[fieldName].textContent = message;
  fields[fieldName].classList.toggle("input-invalid", Boolean(message));
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

Object.keys(fields).forEach((fieldName) => {
  fields[fieldName].addEventListener("input", () => {
    showFieldError(fieldName, "");
    formFeedback.textContent = "";
  });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let isValid = true;

  const nameValue = fields.name.value.trim();
  const emailValue = fields.email.value.trim();
  const messageValue = fields.message.value.trim();

  if (nameValue.length < 2) {
    showFieldError("name", "Please enter at least 2 characters.");
    isValid = false;
  } else {
    showFieldError("name", "");
  }

  if (!isValidEmail(emailValue)) {
    showFieldError("email", "Please enter a valid email address.");
    isValid = false;
  } else {
    showFieldError("email", "");
  }

  if (messageValue.length < 10) {
    showFieldError("message", "Your message should be at least 10 characters.");
    isValid = false;
  } else {
    showFieldError("message", "");
  }

  if (isValid) {
    formFeedback.textContent = "Looks good! This demo form is validated, but it is not connected to an email service yet.";
    contactForm.reset();
  } else {
    formFeedback.textContent = "Please check the highlighted fields.";
  }
});

// Small details: current year and a rotating role line.
document.querySelector("#year").textContent = new Date().getFullYear();

const roles = ["beautiful websites.", "thoughtful interfaces.", "responsive experiences."];
const roleText = document.querySelector("#roleText");
let roleIndex = 0;
setInterval(() => {
  roleIndex = (roleIndex + 1) % roles.length;
  roleText.style.opacity = "0";
  setTimeout(() => {
    roleText.textContent = roles[roleIndex];
    roleText.style.opacity = "1";
  }, 220);
}, 2800);
roleText.style.transition = "opacity .22s";
