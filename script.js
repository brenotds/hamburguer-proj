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
            <button class="remove-from-cart-btn" data-name="${item.name}">
               Remove
            </button>
        </div>    
    </div>
    `;

    total += item.price * item.quantity;
    cartItemsContainer.appendChild(cartEl);
  });

  cartTotal.textContent = total.toLocaleString("en", { style: "currency", currency: "GBP" });

  cartCounter.innerHTML = cart.length;
}

cartItemsContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-from-cart-btn")) {
    const name = e.target.getAttribute("data-name");
    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }
    cart.splice(index, 1);
    updateCartModal();
  }
}

addressInput.addEventListener("input", function (e) {
  let inputValue = e.target.value;

  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden");
  }
});

checkoutBtn.addEventListener("click", function () {
  const isOpen = openTime();
  if (!isOpen) {
    Toastify({
      text: "Ops, restaurant is closed!",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ef4444",
      },
    }).showToast();
    return;
  }

  if (cart.length === 0) return;
  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }

  const cartItems = cart
    .map((item) => {
      return `${item.name} qnt:(${item.quantity}) £ ${item.price} | `;
    })
    .join("");

  const message = encodeURIComponent(cartItems);
  const phone = "123456";

  window.open(`https://wa.me/${phone}?text=${message} address: ${addressInput.value}`, "_blank");

  cart = [];
  updateCartModal();
});

function openTime() {
  const data = new Date();
  const hour = data.getHours();
  return hour >= 18 && hour < 22;
}

const spanItem = document.getElementById("date-span");
const isOpen = openTime();

if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600");
} else {
  spanItem.classList.remove("bg-green-600");
  spanItem.classList.add("bg-red-500");
}
