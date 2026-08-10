(function () {
  var routes = new Set(["/", "/about", "/news", "/contact"]);

  document.addEventListener("click", function (event) {
    var target = event.target;
    var link = target instanceof Element ? target.closest("a[href]") : null;
    if (!link || link.target === "_blank" || event.defaultPrevented) return;

    var url = new URL(link.href, window.location.href);
    var path = url.pathname.replace(/\/$/, "") || "/";
    if (url.origin !== window.location.origin || !routes.has(path)) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.href = path + url.search + url.hash;
  }, true);

  document.addEventListener("submit", async function (event) {
    var form = event.target;
    if (!(form instanceof HTMLFormElement) || !form.classList.contains("message-form")) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    var ar = document.documentElement.lang !== "en";
    var button = form.querySelector('button[type="submit"]');
    var status = form.querySelector(".message-form__status");
    var data = new FormData(form);

    if (data.get("website")) {
      form.reset();
      return;
    }

    data.delete("website");
    data.append("access_key", "0f4772a2-9edf-4241-ac22-7cbf39bbed85");
    data.append("from_name", "LAWYER MAHMOOD ALDOLA ALHAMDANI Website");

    if (button) {
      button.disabled = true;
      button.textContent = ar ? "جارٍ الإرسال..." : "Sending...";
    }
    if (status) {
      status.className = "message-form__status message-form__status--sending";
      status.textContent = "";
    }

    try {
      var response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      });
      var result = await response.json();
      if (!response.ok || !result.success) throw new Error("Delivery failed");

      form.reset();
      if (status) {
        status.className = "message-form__status message-form__status--success";
        status.textContent = ar
          ? "تم إرسال رسالتك بنجاح. شكراً لتواصلك معنا."
          : "Your message was sent successfully. Thank you for contacting us.";
      }
    } catch (error) {
      if (status) {
        status.className = "message-form__status message-form__status--error";
        status.textContent = ar
          ? "تعذر إرسال الرسالة حالياً. يرجى المحاولة مرة أخرى بعد قليل."
          : "The message could not be sent. Please try again shortly.";
      }
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = ar ? "إرسال الرسالة ←" : "Send Message ←";
      }
    }
  }, true);
})();

