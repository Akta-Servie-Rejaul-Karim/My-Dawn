class MyAccordion extends HTMLElement {
  connectedCallback() {
    this.items = this.querySelectorAll(".accordion-item");

    this.items.forEach((item) => {
      const header = item.querySelector(".accordion-header");
      const content = item.querySelector(".accordion-content");

      if (!header || !content) return;

      // Initialize
      content.style.overflow = "hidden";
      content.style.transition = "max-height 0.3s ease";

      if (item.classList.contains("active")) {
        // Open by default if already active
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        content.style.maxHeight = "0px";
      }

      header.addEventListener("click", () => this.toggleItem(item, content));
    });
  }

  toggleItem(item, content) {
    const isActive = item.classList.contains("active");

    if (this.single) {
      // Close all items first
      this.items.forEach((other) => {
        const otherContent = other.querySelector(".accordion-content");
        other.classList.remove("active");
        if (otherContent) otherContent.style.maxHeight = "0px";
      });
    }

    if (!isActive) {
      item.classList.add("active");
      content.style.maxHeight = content.scrollHeight + "px";
    } else if (!this.single) {
      item.classList.remove("active");
      content.style.maxHeight = "0px";
    }
  }

  // Attribute/property API
  get single() {
    return this.hasAttribute("single") || this._single;
  }
  set single(value) {
    if (value) {
      this._single = true;
      this.setAttribute("single", "");
    } else {
      this._single = false;
      this.removeAttribute("single");
    }
  }
}

customElements.define("my-accordion", MyAccordion);