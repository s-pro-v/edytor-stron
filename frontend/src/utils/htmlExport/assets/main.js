(function () {
  "use strict";

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (event) {
        var href = link.getAttribute("href");
        if (!href || href === "#") return;

        var target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function initContactForms() {
    document.querySelectorAll("[data-contact-form]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();

        var messageEl = form.querySelector(".form-message");
        var nameInput = form.querySelector('[name="name"]');
        var emailInput = form.querySelector('[name="email"]');
        var messageInput = form.querySelector('[name="message"]');

        if (!(nameInput instanceof HTMLInputElement)) return;
        if (!(emailInput instanceof HTMLInputElement)) return;
        if (!(messageInput instanceof HTMLTextAreaElement)) return;

        if (
          !nameInput.value.trim() ||
          !emailInput.value.trim() ||
          !messageInput.value.trim()
        ) {
          if (messageEl) {
            messageEl.hidden = false;
            messageEl.textContent = "Uzupełnij wszystkie pola formularza.";
            messageEl.className = "form-message is-error";
          }
          return;
        }

        form.reset();
        if (messageEl) {
          messageEl.hidden = false;
          messageEl.textContent =
            "Dziękujemy! Wiadomość została wysłana (podgląd — brak backendu).";
          messageEl.className = "form-message is-success";
        }
      });
    });
  }

  function initPricingButtons() {
    document
      .querySelectorAll(".mod-pricing-card button")
      .forEach(function (button) {
        button.addEventListener("click", function () {
          var card = button.closest(".mod-pricing-card");
          var planName = card && card.querySelector("h3");
          var label = planName ? planName.textContent : "plan";
          window.alert("Wybrano plan: " + label);
        });
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initSmoothScroll();
    initContactForms();
    initPricingButtons();
  });
})();
