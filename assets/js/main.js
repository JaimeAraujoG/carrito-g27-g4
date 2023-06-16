//* URL base
const baseUrl = "https://ecommercebackend.fundamentos-29.repl.co/";
//* Dibujar productos en la web
const productsList = document.querySelector("#products-container");

//* Mostrar y ocultar carrito
const navToggle = document.querySelector(".nav__buttom--toggle");
const navCar = document.querySelector(".nav__car");
//* Carrito de compras
const car = document.querySelector("#car");
const carList = document.querySelector("#car__list");
//* Vaciar carrito
const emptyCarButton = document.querySelector("#empty-car");
//* Total
const totalElement = document.querySelector("#total");

//* Array carrito
let carProducts = [];

navToggle.addEventListener("click", () => {
  navCar.classList.toggle("nav__car--visible");
});

//* Crear una función con los escuchadores para que se ejecute antes que todo el código
eventListenerLoader();
function eventListenerLoader() {
  //* Cuando se presione el botón "Add to car"
  productsList.addEventListener("click", addProduct);
  //* Cuando se presione el botón "Delete"
  carList.addEventListener("click", deleteProduct);
  //* Cuando se haga clic en el botón "Empty"
  emptyCarButton.addEventListener("click", emptyCar);
}

//* Hacer petición a la API de productos
//* 1. Crear una función con la petición:
function getProducts() {
  axios
    .get(baseUrl)
    .then((response) => {
      const products = response.data;
      printProducts(products);
    })
    .catch((error) => {
      console.log(error);
    });
}
getProducts();

//* 2. Renderizar los productos capturados de la API en mi HTML.
function printProducts(products) {
  let html = "";
  for (let product of products) {
    html += `
      <div class="products__element">
          <img src="${product.image}" alt="product_img" class="products__img">
          <p class="products__name">${product.name}</p>
      
          <div class="products__div">
              <p class="products__price">USD ${product.price.toFixed(2)}</p>
          </div>
          <div class="products__div">
              <button data-id="${product.id}" class="products__button add_car">
                  Add to car
              </button>
              <button class="button_details">
              Deltails
              </button>
          </div>
      </div>
  `;
  }
  productsList.innerHTML = html;
}

//! Agregar los productos al carrito 
//* 1. Capturar la información del producto al que se le hace clic. 
function addProduct(event) {
  if (event.target.classList.contains("add_car")) {
    const product = event.target.parentElement.parentElement;
    carProductsElements(product);
    updateTotal();
    toggleEmptyButton();
    showProductSelectionAlert(); // Agregar esta línea para mostrar la alerta de selección de productos
  }
}

//* 2. Transformar la información HTML a un array de objetos.
//* 3. Validar si el elemento seleccionado ya se encuentra dentro del array del carrito (carProducts). Si existe, incrementar la cantidad en lugar de agregar un nuevo producto.

function carProductsElements(product) {
  const infoProduct = {
    id: product.querySelector("button").getAttribute("data-id"),
    image: product.querySelector("img").src,
    name: product.querySelector("p").textContent,
    price: product.querySelector(".products__div p").textContent,
    quantity: 1
  };

  if (carProducts.some((product) => product.id === infoProduct.id)) {
    const productIncrement = carProducts.map((product) => {
      if (product.id === infoProduct.id) {
        product.quantity++;
        return product;
      } else {
        return product;
      }
    });
    carProducts = [...productIncrement];

    // Cambiar el icono del botón de carrito al seleccionar productos
    const cartIcon = document.querySelector(".fa-cart-shopping");
    cartIcon.classList.remove("fa-cart-shopping");
    cartIcon.classList.add("fa-cart-plus");
  } else {
    carProducts = [...carProducts, infoProduct];
  }
  carElementsHTML();
}

function carElementsHTML() {
  let carHTML = "";
  for (let product of carProducts) {
    carHTML += `
      <div class="car__product">
          <div class="car__product__image">
              <img src="${product.image}">
          </div>
          <div class="car__product__description">
              <p>${product.name}</p>
              <p id="price-${product.id}">Precio: ${product.price}</p>
              <div class="car__product__quantity">
                  <button class="quantity__button decrease" data-id="${product.id}">
                      -
                  </button>
                  <p>Cantidad: ${product.quantity}</p>
                  <button class="quantity__button increase" data-id="${product.id}">
                      +
                  </button>
              </div>
          </div>
          <div class="car__product__button">
              <button class="delete__product" data-id="${product.id}">
                  Delete
              </button>
          </div>
      </div>
      <hr>
    `;
  }
  carList.innerHTML = carHTML;

}



//* Eliminar productos del carrito

function deleteProduct(event) {
  if (event.target.classList.contains("delete__product")) {
    const productId = event.target.getAttribute("data-id");
    carProducts = carProducts.filter((product) => product.id != productId);
    carElementsHTML();
    updateTotal(); // Actualizar el total después de eliminar un producto del carrito
    toggleEmptyButton(); // Mostrar u ocultar el botón "Empty" según los productos en el carrito
  }
}

//* Incrementar o decrementar la cantidad de productos en el carrito

carList.addEventListener("click", (event) => {
  if (event.target.classList.contains("quantity__button")) {
    const productId = event.target.getAttribute("data-id");
    const action = event.target.classList.contains("increase") ? "increase" : "decrease";
    updateProductQuantity(productId, action);
    updateTotal(); 
  }
});

function updateProductQuantity(productId, action) {
  for (let product of carProducts) {
    if (product.id === productId) {
      if (action === "increase") {
        product.quantity++;
      } else {
        if (product.quantity > 1) {
          product.quantity--;
        }
      }
      break;
    }
  }
  carElementsHTML();
}

//* Actualizar el precio total

function updateTotal() {
  let total = 0;
  for (let product of carProducts) {
    const quantity = product.quantity;
    const price = parseFloat(product.price.replace("USD ", ""));
    const totalPrice = price * quantity;
    total += totalPrice;
  }
  totalElement.textContent = `Total: USD ${total.toFixed(2)}`;
  const totalPriceElement = document.getElementById("totalPrice");
  totalPriceElement.textContent = `Total: USD ${total.toFixed(2)}`;
}

//* Vaciar carrito
function emptyCar() {
  carProducts = [];
  carElementsHTML();
  updateTotal(); 
  toggleEmptyButton(); 

  //* Cambiar el icono del botón de carrito al vaciar el carrito
  const cartIcon = document.querySelector(".fa-cart-plus");
  cartIcon.classList.remove("fa-cart-plus");
  cartIcon.classList.add("fa-cart-shopping");
}

//* Mostrar u ocultar el botón "Empty" según los productos en el carrito
function toggleEmptyButton() {
  if (carProducts.length === 0) {
    emptyCarButton.classList.add("hidden");
  } else {
    emptyCarButton.classList.remove("hidden");
  }
}


