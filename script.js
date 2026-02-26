(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const navLinks = document.querySelectorAll('.nav-group a[href^="#"], .hero-actions a[href^="#"], .brand[href^="#"]');
  const menuToggle = document.querySelector(".menu-toggle");
  const navGroup = document.querySelector(".nav-group");

  if (menuToggle && navGroup) {
    menuToggle.addEventListener("click", function () {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isExpanded));
      navGroup.classList.toggle("open", !isExpanded);
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const targetId = link.getAttribute("href");
      if (!targetId || !targetId.startsWith("#")) {
        return;
      }

      if (targetId === "#") {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
        return;
      }

      const target = document.querySelector(targetId);
      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });

      if (navGroup && navGroup.classList.contains("open")) {
        navGroup.classList.remove("open");
      }

      if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  const revealItems = document.querySelectorAll(".reveal");
  if (revealItems.length > 0 && "IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  const modalButtons = document.querySelectorAll("[data-modal-target]");
  const modalCloseButtons = document.querySelectorAll("[data-modal-close]");
  const modals = document.querySelectorAll(".modal");
  let currentModal = null;

  function openModal(modal) {
    if (!modal) {
      return;
    }

    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    currentModal = modal;

    const closeBtn = modal.querySelector("[data-modal-close]");
    if (closeBtn) {
      closeBtn.focus();
    }
  }

  function closeModal(modal) {
    if (!modal) {
      return;
    }

    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    currentModal = null;
  }

  modalButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const targetId = button.getAttribute("data-modal-target");
      if (!targetId) {
        return;
      }
      const modal = document.getElementById(targetId);
      openModal(modal);
    });
  });

  modalCloseButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      closeModal(button.closest(".modal"));
    });
  });

  modals.forEach(function (modal) {
    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && currentModal) {
      closeModal(currentModal);
    }
  });

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const subjectInput = document.getElementById("subject").value.trim();
      const message = document.getElementById("message").value.trim();

      const subject = encodeURIComponent(subjectInput || "Portfolio Contact");
      const body = encodeURIComponent(
        "Name: " + name + "\n" +
        "Email: " + email + "\n\n" +
        message
      );

      window.location.href = "mailto:aitomghar26@gmail.com?subject=" + subject + "&body=" + body;
    });
  }

  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
