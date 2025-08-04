(async () => {
  const cartDrawer = document.querySelector("cart-drawer");

  if (!cartDrawer) {
    console.warn(" <cart-drawer> element not found on the page.");
    return;
  }

  console.log(" Fetching updated cart sections...");

  try {
    const response = await fetch("/cart?sections=cart-drawer,cart-icon-bubble");
    const sections = await response.json();

    console.log("Fetched sections:", sections);

    const parsedState = {
      sections,
      id: null,
    };

    cartDrawer.renderContents(parsedState);

    console.log("Cart drawer re-rendered successfully!");
  } catch (error) {
    console.error("Failed to update cart drawer:", error);
  }
})();
