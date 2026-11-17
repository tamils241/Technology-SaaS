const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    primaryNav.classList.toggle("is-open", !isExpanded);
  });

  primaryNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      menuToggle.setAttribute("aria-expanded", "false");
      primaryNav.classList.remove("is-open");
    }
  });
}

document.querySelectorAll("[data-password-toggle]").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const input = toggle.closest(".password-input").querySelector("input");
    const isVisible = input.type === "text";
    input.type = isVisible ? "password" : "text";
    toggle.setAttribute("aria-label", isVisible ? "Show password" : "Hide password");
  });
});

document.querySelectorAll(".password-rules").forEach((rulesList) => {
  const password = rulesList.closest(".auth-form").querySelector('input[type="password"]');
  const updateRules = () => {
    const value = password.value;
    const checks = {
      length: value.length >= 8,
      number: /\d/.test(value),
      case: /[a-z]/.test(value) && /[A-Z]/.test(value),
      symbol: /[^A-Za-z0-9]/.test(value),
    };

    rulesList.querySelectorAll("[data-password-rule]").forEach((rule) => {
      rule.classList.toggle("is-valid", checks[rule.dataset.passwordRule]);
    });
  };

  password.addEventListener("input", updateRules);
  updateRules();
});

document.querySelectorAll("#contact-name, #signin-name").forEach((nameInput) => {
  nameInput.addEventListener("input", () => {
    nameInput.value = nameInput.value.replace(/[^A-Za-z]/g, "").slice(0, 16);
  });
});

const contactPhone = document.querySelector("#contact-phone");
if (contactPhone) {
  contactPhone.addEventListener("input", () => {
    contactPhone.value = contactPhone.value.replace(/\D/g, "").slice(0, 10);
  });
}

document.querySelectorAll("[data-demo-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (form.matches("[data-filter-table]")) return;
    const message =
      form.querySelector(".auth-message, .form-feedback") ||
      (form.nextElementSibling?.matches(".auth-message, .form-feedback")
        ? form.nextElementSibling
        : null);

    if (!message) return;

    const emailInput = form.querySelector("#contact-email, #login-email, #signin-email");
    if (emailInput) {
      const email = emailInput.value.trim();
      const validEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z][A-Za-z0-9.-]*\.[A-Za-z]{2,}$/.test(email);
      if (!validEmail) {
        alert("Please enter a valid email address (e.g. sun@gmail.com, sun123@gmail.com).");
        emailInput.focus();
        message.textContent = "";
        return;
      }
    }

    if (form.classList.contains("auth-form")) {
      const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
      const passwordInputs = form.querySelectorAll('input[type="password"]');
      for (const input of passwordInputs) {
        if (!strongPassword.test(input.value)) {
          alert("Please enter a strong password: at least 8 characters with uppercase, lowercase, a number, and a symbol.");
          input.focus();
          message.textContent = "";
          return;
        }
      }

      const password = form.querySelector("#signin-password");
      const confirmPassword = form.querySelector("#signin-confirm-password");
      if (password && confirmPassword && password.value !== confirmPassword.value) {
        alert("Passwords do not match. Please re-enter.");
        confirmPassword.focus();
        message.textContent = "";
        return;
      }

      const remember = form.querySelector("#login-remember");
      if (remember && !remember.checked) {
        alert("Please select the Remember me checkbox.");
        remember.focus();
        message.textContent = "";
        return;
      }

      const roleInputs = form.querySelectorAll('input[name="role"]');
      if (roleInputs.length && !form.querySelector('input[name="role"]:checked')) {
        alert("Please select a role.");
        roleInputs[0].focus();
        message.textContent = "";
        return;
      }
    }

    if (form.classList.contains("auth-form")) {
      const isSigninForm = form.querySelector("#signin-confirm-password");
      if (isSigninForm) {
        window.location.href = "login.html";
        return;
      }

      const role = form.querySelector('input[name="role"]:checked')?.value;
      if (role === "admin") {
        window.location.href = "admin-dashboard.html";
      } else if (role === "clients") {
        window.location.href = "clients-dashboard.html";
      } else {
        message.textContent = "Demo only. Connect an authentication service to enable sign-in.";
      }
      return;
    } else if (form.classList.contains("contact-form")) {
      message.textContent = "Thanks! Your details are ready to be sent.";
    } else if (form.closest(".newsletter")) {
      message.textContent = "Thanks for subscribing. This demo is not connected to a mailing list.";
    } else if (form.classList.contains("space-search")) {
      message.textContent = "Search is ready to connect to your booking service.";
    } else {
      message.textContent = "Thanks! Connect a service to submit this form.";
    }
  });
});

const contactFormEl = document.querySelector(".contact-form");
if (contactFormEl) {
  const contactFeedback = contactFormEl.querySelector(".form-feedback");
  const clearContactFeedback = () => {
    if (contactFeedback) contactFeedback.textContent = "";
  };

  contactFormEl.addEventListener(
    "invalid",
    () => {
      if (contactFeedback) {
        contactFeedback.textContent = "Please complete all required fields before continuing.";
      }
    },
    true
  );

  contactFormEl.addEventListener("input", clearContactFeedback);
  contactFormEl.addEventListener("change", clearContactFeedback);
}

document.querySelectorAll("[data-filter-table]").forEach((form) => {
  const table = document.querySelector(form.dataset.filterTable);
  if (!table) return;

  const rows = Array.from(table.querySelectorAll("tbody tr"));
  const emptyTarget = form.dataset.emptyTarget
    ? document.querySelector(form.dataset.emptyTarget)
    : null;
  const message = form.querySelector(".form-feedback");
  const fields = Array.from(form.querySelectorAll("input, select"));

  const filterRows = () => {
    const terms = fields
      .map((field) => field.value.trim().toLowerCase())
      .filter(Boolean);
    let visible = 0;

    rows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      const matches = terms.every((term) => text.includes(term));
      row.hidden = !matches;
      if (matches) visible += 1;
    });

    if (emptyTarget) emptyTarget.hidden = visible !== 0;
    if (message) {
      message.textContent = !terms.length
        ? ""
        : visible
          ? `Showing ${visible} of ${rows.length} rows.`
          : "No matching rows found.";
    }
  };

  fields.forEach((field) => {
    field.addEventListener("input", filterRows);
    field.addEventListener("change", filterRows);
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    filterRows();
  });
});

document.querySelectorAll("[data-job-search]").forEach((form) => {
  const keyword = form.querySelector('[name="keyword"]');
  const city = form.querySelector('[name="city"]');
  const cards = document.querySelectorAll("[data-job-list] [data-title]");
  const count = document.querySelector(".job-count");
  const emptyState = document.querySelector("[data-job-empty]");

  const filterJobs = () => {
    const query = keyword.value.trim().toLowerCase();
    const selectedCity = city.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
      const matchesKeyword = card.dataset.title.toLowerCase().includes(query);
      const matchesCity = !selectedCity || card.dataset.city.toLowerCase().includes(selectedCity);
      const isVisible = matchesKeyword && matchesCity;
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    count.textContent = `${visibleCount} open ${visibleCount === 1 ? "role" : "roles"}`;
    emptyState.hidden = visibleCount > 0;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    filterJobs();
  });
  form.addEventListener("input", filterJobs);
  form.addEventListener("change", filterJobs);
});

document.querySelectorAll("[data-explore-categories]").forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));

    if (!target) return;

    event.preventDefault();

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const header = document.querySelector(".site-header");
    const offset = (header ? header.getBoundingClientRect().height : 0) + 16;
    const top = window.scrollY + target.getBoundingClientRect().top - offset;

    window.scrollTo({
      top: Math.max(0, top),
      behavior: reduceMotion ? "auto" : "smooth",
    });

    try {
      history.replaceState(null, "", link.getAttribute("href"));
    } catch (error) {
      /* file:// or restricted contexts may block history updates */
    }

    target.classList.remove("is-flash");
    void target.offsetWidth;
    target.classList.add("is-flash");
    window.setTimeout(() => target.classList.remove("is-flash"), 1400);
  });
});

document.querySelectorAll("[data-go-back]").forEach((button) => {
  button.addEventListener("click", () => {
    if (history.length > 1) {
      history.back();
    } else {
      location.href = "index.html";
    }
  });
});

// Scroll & card reveal animations (all pages)
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const revealSelectors = [
    "main > section",
    ".site-footer",
    ".service-card",
    ".portfolio-card",
    ".benefit",
    ".solution-grid article",
    ".stats-grid > div",
    ".about-gallery img",
    ".about-gallery .gallery-note",
    ".about-gallery .dots-gallery",
    ".client-quote",
    ".workflow-copy",
    ".dashboard",
    ".job-card",
    ".news-grid article",
    ".team-grid article",
    ".category-grid a",
    ".support-service-grid a",
    ".location-grid > *",
    ".faq-list details",
    ".dash-panel",
    ".dash-stat-card",
    ".auth-card",
    ".auth-aside",
    ".contact-form",
    ".contact-info",
    ".career-reasons-content",
    ".career-reasons-image",
    ".career-feature",
    ".company-logos > div > *",
    ".launch-strip",
    ".footer-top",
    ".footer-main > *",
    ".light-footer > *",
    ".about-hero-art",
    ".about-stats > div",
    ".feature-grid article",
    ".about-promo > div",
    ".manage-layout > *",
    ".pricing-grid article",
    ".pricing-faq article",
    ".integration-section > div",
    ".client-reviews article",
    ".about-bottom-cta > *",
    ".support-stats > div",
    ".support-work > *",
    ".support-benefits > div",
    ".faq-layout > div",
    ".newsletter",
    ".light-footer-brand",
    ".light-footer-links > div"
  ].join(",");

  const elements = Array.from(document.querySelectorAll(revealSelectors)).filter(
    (el) => !el.classList.contains("no-reveal")
  );

  // Avoid double-processing and keep natural order for stagger within parents
  const seen = new Set();
  const targets = elements.filter((el) => {
    if (seen.has(el)) return false;
    seen.add(el);
    return true;
  });

  const staggerGroups = new Map();
  targets.forEach((el) => {
    el.classList.add("reveal");
    const parent = el.parentElement || document.body;
    const idx = (staggerGroups.get(parent) || 0);
    staggerGroups.set(parent, idx + 1);
    const delay = Math.min(idx * 80, 480);
    el.style.setProperty("--reveal-delay", `${delay}ms`);
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach((el) => observer.observe(el));
})();

// Count-up animation for the about section stats
(() => {
  const counters = Array.from(document.querySelectorAll("[data-count]"));
  if (!counters.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  const formatValue = (value, el, target) => {
    const suffix = el.dataset.suffix || "";

    if (el.dataset.format === "compact" && target >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M${suffix}`;
    }

    const decimals = Number(el.dataset.decimals || 0);
    return `${value.toFixed(decimals)}${suffix}`;
  };

  const animate = (el) => {
    const target = Number(el.dataset.count);
    const finalText = el.textContent.trim();
    const duration = 1500;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      if (progress >= 1) {
        el.textContent = finalText;
        return;
      }

      el.textContent = formatValue(target * eased, el, target);
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
})();

/* =========================================
   STACKLY - GLOBAL 3D CARD TILT
========================================= */

(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const desktopHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (reduceMotion || !desktopHover) return;

  const cardSelectors = [
    ".feature-item",
    ".location-grid article",
    ".support-service-grid a",
    ".team-grid article",
    ".pricing-grid article",
    ".review-grid article",
    ".about-quotes blockquote",
    ".manage-steps li",
    ".faq-item",
    ".service-card",
    ".portfolio-card",
    ".benefit",
    ".news-grid article",
    ".job-card",
    ".mini-card",
    ".calendar-card"
  ].join(",");

  document.querySelectorAll(cardSelectors).forEach((card) => {
    card.classList.add("has-3d-tilt");

    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((x - centerX) / centerX) * 5;
      const rotateX = ((centerY - y) / centerY) * 5;

      card.style.setProperty("--tilt-x", `${rotateX}deg`);
      card.style.setProperty("--tilt-y", `${rotateY}deg`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });
})();
