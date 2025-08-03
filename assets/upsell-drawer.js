class CartUpsellSlider extends HTMLElement {
  constructor() {
    super();
    this.initSlider();
    this.initAddToCartButtons();
  }

  initSlider() {
    if (this.sliderInitialized) return;

    const swiperEl = this.querySelector(".swiper");
    if (swiperEl) {
      new Swiper(swiperEl, {
        slidesPerView: 1,
        spaceBetween: 16,
        navigation: {
          nextEl: this.querySelector(".swiper-button-next"),
          prevEl: this.querySelector(".swiper-button-prev"),
        },
      });

      this.sliderInitialized = true;
    }
  }

  initAddToCartButtons() {
    this.querySelectorAll(".upsell-add-to-cart").forEach((button) => {
      button.addEventListener("click", () => {
        const variantId = button.dataset.variantId;

        if (!variantId) return;

        button.disabled = true;
        button.textContent = "Adding...";

        fetch("/cart/add.js", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: variantId, quantity: 1 }),
        })
          .then((res) => res.json())
          .then(() => {
            return fetch("/?sections=cart-drawer");
          })
          .then((res) => res.json())
          .then((data) => {
            const html = new DOMParser().parseFromString(
              data["cart-drawer"],
              "text/html"
            );
            const newDrawer = html.querySelector("#CartDrawer");
            const oldDrawer = document.querySelector("#CartDrawer");
            if (newDrawer && oldDrawer) {
              oldDrawer.innerHTML = newDrawer.innerHTML;
              window.initCartUpsellSlider?.();
            }
          })
          .catch(console.error)
          .finally(() => {
            button.disabled = false;
            button.textContent = "Add to cart";
          });
      });
    });
  }
}

customElements.define("cart-upsell-slider", CartUpsellSlider);
