const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

cartBtn.addEventListener("click", function () {
  updateCartModal();
  cartModal.style.display = "flex";
});

closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    cartModal.style.display = "none";
  }
});

cartModal.addEventListener("click", function (e) {
  if (e.target === cartModal) {
    cartModal.style.display = "none";
  }
});

menu.addEventListener("click", function (e) {
  let parentButton = e.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));
    addToCart(name, price);
  }
});

function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }
  updateCartModal();
}

function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartEl = document.createElement("div");
    cartEl.classList.add("flex", "justify-between", "mb-4", "flex-col", "overflow-y-auto");

    cartEl.innerHTML = `
    <div class="flex items-center justify-between ">
        <div>
            <p  class="font-medium">${item.name}</p>
            <p>Qnt: ${item.quantity}</p>
            <p class="font-medium mt-2">£${item.price.toFixed(2)}</p>
        </div>
        <div>
            <button>
               Remove
            </button>
        </div>    
    </div>
    `;

    total += item.price * item.quantity;
    cartItemsContainer.appendChild(cartEl);
  });

  cartTotal.textContent = total.toLocaleString("en", { style: "currency", currency: "GBP" });
}
