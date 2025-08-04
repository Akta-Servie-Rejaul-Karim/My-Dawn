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
        const originalText = button.textContent;
        button.textContent = "Adding...";

        fetch("/cart/add.js", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: variantId, quantity: 1 }),
        })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to add to cart");
            return res.json();
          })
          .then(() => {
            return fetch("/?sections=cart-drawer,cart-icon-bubble");
          })
          .then((res) => {
            if (!res.ok)
              throw new Error("Failed to fetch updated cart sections");
            return res.json();
          })
          .then((data) => {
            const cartDrawer = document.querySelector("cart-drawer");
            if (cartDrawer) {
              cartDrawer.renderContents({
                sections: {
                  "cart-drawer": data["cart-drawer"],
                  "cart-icon-bubble": data["cart-icon-bubble"],
                },
              });
            }
            // Optionally re-init upsell slider if needed
            window.initCartUpsellSlider?.();
          })
          .catch((error) => {
            console.error(error);
            alert("Sorry, there was a problem adding the item to your cart.");
          })
          .finally(() => {
            button.disabled = false;
            button.textContent = originalText;
          });
      });
    });
  }
}

customElements.define("cart-upsell-slider", CartUpsellSlider);
