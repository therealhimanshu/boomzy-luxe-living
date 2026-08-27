document.querySelectorAll(".menu-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const nav = button.closest(".nav");
    const isOpen = nav.classList.toggle("nav-open");
    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  });
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    const nav = link.closest(".nav");
    const button = nav.querySelector(".menu-toggle");
    nav.classList.remove("nav-open");
    if (button) {
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Open navigation menu");
    }
  });
});

const products = {
  curtains: {
    title: "Curtains & Drapes",
    label: "Curtains and drapes",
    image: "assets/brochure/curtains-luxe-card.webp",
    detail: "assets/brochure/curtains-luxe-detail.webp",
    lead:
      "A curated showcase of exceptional design and craftsmanship, selected for trade buyers who need elegant finishes across premium projects.",
  },
  blinds: {
    title: "Blinds",
    label: "Blinds",
    image: "assets/brochure/venetian-blinds-card.webp",
    detail: "assets/brochure/venetian-blinds-detail.webp",
    lead:
      "Elegant Venetian blinds with crisp horizontal slats, precise light control, and a refined finish for residential, commercial, and showroom interiors.",
  },
  upholstery: {
    title: "Upholstery",
    label: "Upholstery",
    image: "assets/brochure/upholstery-sofa-card.webp",
    detail: "assets/brochure/upholstery-sofa-detail.webp",
    lead:
      "Sofa-led upholstery in warm, tactile fabrics chosen for comfort, durability, and sophistication across premium project interiors.",
  },
  wallpapers: {
    title: "Wallpapers",
    label: "Wallpapers",
    image: "assets/brochure/wallpapers-card.webp",
    detail: "assets/brochure/wallpapers-detail.webp",
    lead:
      "Decorative surfaces and statement patterns that give rooms individuality, depth, and a finished premium character.",
  },
  flooring: {
    title: "Wooden Flooring",
    label: "Wooden flooring",
    image: "assets/brochure/flooring-card.webp",
    detail: "assets/brochure/flooring-detail.webp",
    lead:
      "Elegant floor finishes for warm, long-lasting interiors and project installations across homes, retail, and hospitality.",
  },
};

const params = new URLSearchParams(window.location.search);
const categoryFromUrl = params.get("category");
const productFromUrl = params.get("product");

const setProductPage = (key) => {
  const product = products[key] || products.curtains;
  const title = document.querySelector("#productTitle");
  const lead = document.querySelector("#productLead");
  const heroImage = document.querySelector("#productImage");
  const detailImage = document.querySelector("#detailImage");
  const enquireLink = document.querySelector("#enquireLink");

  if (!title) return;

  title.textContent = product.title;
  lead.textContent = product.lead;
  heroImage.src = product.image;
  heroImage.alt = `${product.title} product image`;
  detailImage.src = product.detail;
  detailImage.alt = `${product.title} detail image`;
  enquireLink.href = `enquire.html?product=${encodeURIComponent(product.label)}`;
};

const categorySelect = document.querySelector("#categorySelect");
if (categorySelect) {
  const initial = products[categoryFromUrl] ? categoryFromUrl : "curtains";
  categorySelect.value = initial;
  setProductPage(initial);
  categorySelect.addEventListener("change", () => setProductPage(categorySelect.value));
}

const productSelect = document.querySelector("#productSelect");
if (productSelect && productFromUrl) {
  const option = Array.from(productSelect.options).find((item) => item.value === productFromUrl);
  if (option) productSelect.value = productFromUrl;
}

const enquiryForm = document.querySelector("#enquiryPageForm");
if (enquiryForm) {
  const status = document.querySelector("#enquiryStatus");
  const submitButton = enquiryForm.querySelector('button[type="submit"]');
  const defaultButtonLabel = submitButton.dataset.defaultLabel;

  const setFormState = (state, message) => {
    status.dataset.state = state;
    status.textContent = message;
  };

  enquiryForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const endpoint = enquiryForm.action;
    if (endpoint.includes("REPLACE_WITH_FORM_ID")) {
      setFormState(
        "error",
        "Form setup is pending. Add the client’s Formspree form ID in enquire.html."
      );
      return;
    }

    const formData = new FormData(enquiryForm);
    formData.set("_subject", `New Luxe Living trade enquiry - ${formData.get("product")}`);
    formData.set("Page", window.location.href);

    submitButton.disabled = true;
    submitButton.setAttribute("aria-busy", "true");
    submitButton.textContent = "Sending…";
    setFormState("sending", "Sending your enquiry securely…");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = result.errors?.map((error) => error.message).join(" ");
        throw new Error(message || "Formspree could not accept this enquiry.");
      }

      enquiryForm.reset();
      setFormState(
        "success",
        "Thank you. Your trade enquiry has been sent to Luxe Living."
      );
    } catch (error) {
      setFormState(
        "error",
        error.message || "The enquiry could not be sent. Please try again in a moment."
      );
    } finally {
      submitButton.disabled = false;
      submitButton.removeAttribute("aria-busy");
      submitButton.textContent = defaultButtonLabel;
    }
  });
}
