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
    const message = form.querySelector(".auth-message, .form-feedback");

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

document.querySelectorAll("[data-go-back]").forEach((button) => {
  button.addEventListener("click", () => {
    if (history.length > 1) {
      history.back();
    } else {
      location.href = "index.html";
    }
  });
});
