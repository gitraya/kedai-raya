let products = [
    {
        name: "Cilok",
        tag: "cilok",
        price: 6,
        inCart: 0
    },
    {
        name: "Batagor",
        tag: "batagor",
        price: 8,
        inCart: 0
    },    
    {
        name: "Seblak",
        tag: "seblak",
        price: 13,
        inCart: 0
    },
    {
        name: "Bakmi Pangsit",
        tag: "bakmipangsit",
        price: 10,
        inCart: 0
    },
    {
        name: "Es Cincau Hijau",
        tag: "escincauhijau",
        price: 8,
        inCart: 0
    },
    {
        name: "Es Campur",
        tag: "escampur",
        price: 11,
        inCart: 0
    },
    {
        name: "Jus Mangga",
        tag: "jusmangga",
        price: 9,
        inCart: 0
    },
    {
        name: "Teh Lemon",
        tag: "tehlemon",
        price: 7,
        inCart: 0
    }
];

function addToCart() {
    let addCart = document.querySelectorAll('.add-cart');
    for (let i = 0; i < addCart.length; i++) {
        addCart[i].addEventListener('click', () => {
            cartCounts(products[i]);
            totalCost(products[i]);
            displayCart();
            showCart();
        });
    }
}

function onLoadCartCounts() {
    let productCounts = localStorage.getItem('cartCounts');
    if (productCounts) {
        document.querySelector('.count-basket').textContent = productCounts;
    }
}

function showCart() {
    let productCounts = localStorage.getItem('cartCounts');
    productCounts = parseInt(productCounts);
    const checkout = document.querySelector('#checkout');

    if (productCounts > 0) {
        checkout.classList.remove('hidden');
    } else {
        checkout.classList.add('hidden');
        document.querySelector('.count-basket').textContent = 0;
        for (i = 0; i < products.length; i++) {
            products[i].inCart = 0;
        }
        localStorage.removeItem('cartCounts');
        localStorage.removeItem('productsInCart');
        localStorage.removeItem('totalCost');
    }
}

function cartCounts(product, action) {
    let productCounts = localStorage.getItem('cartCounts');
    productCounts = parseInt(productCounts);

    let itemsInCart = localStorage.getItem('productsInCart');
    itemsInCart = JSON.parse(itemsInCart);

    if (action) {
        localStorage.setItem("cartCounts", productCounts - 1);
        document.querySelector('.count-basket').textContent = productCounts - 1;
    } else if (productCounts) {
        localStorage.setItem("cartCounts", productCounts + 1);
        document.querySelector('.count-basket').textContent = productCounts + 1;
    } else {
        localStorage.setItem("cartCounts", 1);
        document.querySelector('.count-basket').textContent = 1;
    }
    setItems(product);
}

function setItems(product) {
    let productCounts = localStorage.getItem('cartCounts');
    productCounts = parseInt(productCounts);
    let itemsInCart = localStorage.getItem('productsInCart');
    itemsInCart = JSON.parse(itemsInCart);

    if (itemsInCart != null) {
        let currentProduct = product.tag;

        if (itemsInCart[currentProduct] == undefined) {
            itemsInCart = {
                ...itemsInCart,
                [currentProduct]: product
            }
        }
        itemsInCart[currentProduct].inCart += 1;

    } else {
        product.inCart = 1;
        itemsInCart = {
            [product.tag]: product
        };
    }

    localStorage.setItem('productsInCart', JSON.stringify(itemsInCart));
}

function totalCost(product, action) {
    let cart = localStorage.getItem("totalCost");

    if (action) {
        cart = parseInt(cart);
        localStorage.setItem("totalCost", cart - product.price);
    } else if (cart != null) {
        cart = parseInt(cart);
        localStorage.setItem("totalCost", cart + product.price);
    } else {
        localStorage.setItem("totalCost", product.price);
    }
}

function displayCart() {
    let itemsInCart = localStorage.getItem('productsInCart');
    itemsInCart = JSON.parse(itemsInCart);
    let cart = localStorage.getItem("totalCost");
    cart = parseInt(cart);

    let productContainer = document.querySelector('.cart-products');

    if (itemsInCart && productContainer) {
        productContainer.innerHTML = '';
        Object.values(itemsInCart).map((item) => {
            productContainer.innerHTML += `
            <div class="products">
              <div class="left">
                <div class="top">
                  <div class="product">
                    <h4 id="name">${item.name}</h4>
                  </div>
                  <div id="price" class="price">Rp${item.price}.000</div>
                </div>
                <div class="bottom">
                  <div class="quantity">
                    <ion-icon
                      class="decrease count-button"
                      name="arrow-back-circle"
                    ></ion-icon>
                    <div>
                      <span id="quantity">${item.inCart}</span>
                    </div>
                    <ion-icon
                      class="increase count-button"
                      name="arrow-forward-circle"
                    ></ion-icon>
                  </div>
                  <div id="total" class="total">Rp${item.inCart * item.price}.000</div>
                </div>
              </div>
              <div class="right">
                <div class="delete">
                  <ion-icon class="delete-button" name="close-circle"></ion-icon>
                </div>
              </div>
            </div>
            `;
        });

        productContainer.innerHTML += `
        <div class="total-products-container">
            <h4 class="total-title">Total Belanja</h4>
            <h4 id="total-cost" class="total-cost">Rp${cart}.000</h4>
        </div> 
        `
        deleteButtons();
        manageQuantity();
    }
}

function manageQuantity() {
    let decreaseButtons = document.querySelectorAll('.decrease');
    let increaseButtons = document.querySelectorAll('.increase');
    let currentQuantity = 0;
    let currentProduct = '';
    let itemsInCart = localStorage.getItem('productsInCart');
    itemsInCart = JSON.parse(itemsInCart);

    for (let i = 0; i < increaseButtons.length; i++) {
        decreaseButtons[i].addEventListener('click', () => {
            currentQuantity = decreaseButtons[i].parentElement.querySelector('div span').textContent;
            currentProduct = decreaseButtons[i].parentElement.parentElement.previousElementSibling.querySelector('.product h4').textContent.toLocaleLowerCase().replace(/ /g, '').trim();

            if (itemsInCart[currentProduct].inCart > 1) {
                itemsInCart[currentProduct].inCart -= 1;
                cartCounts(itemsInCart[currentProduct], "decrease");
                totalCost(itemsInCart[currentProduct], "decrease");
                localStorage.setItem('productsInCart', JSON.stringify(itemsInCart));
                displayCart();
            }
        });

        increaseButtons[i].addEventListener('click', () => {
            currentQuantity = increaseButtons[i].parentElement.querySelector('div span').textContent;
            currentProduct = increaseButtons[i].parentElement.parentElement.previousElementSibling.querySelector('.product h4').textContent.toLocaleLowerCase().replace(/ /g, '').trim();

            itemsInCart[currentProduct].inCart += 1;
            cartCounts(itemsInCart[currentProduct]);
            totalCost(itemsInCart[currentProduct]);
            localStorage.setItem('productsInCart', JSON.stringify(itemsInCart));
            displayCart();
        });
    }
}

function deleteButtons() {
    let deleteButtons = document.querySelectorAll('.delete ion-icon');
    let productCounts = localStorage.getItem('cartCounts');
    let cartCost = localStorage.getItem("totalCost");
    let itemsInCart = localStorage.getItem('productsInCart');
    itemsInCart = JSON.parse(itemsInCart);
    let productName;

    for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener('click', () => {
            productName = deleteButtons[i].parentElement.parentElement.previousElementSibling.querySelector('.top .product h4').textContent.toLocaleLowerCase().replace(/ /g, '').trim();

            localStorage.setItem('cartCounts', productCounts - itemsInCart[productName].inCart);
            localStorage.setItem('totalCost', cartCost - (itemsInCart[productName].price * itemsInCart[productName].inCart));

            delete itemsInCart[productName];
            localStorage.setItem('productsInCart', JSON.stringify(itemsInCart));

            displayCart();
            showCart();
            onLoadCartCounts();
        })
    }
}

addToCart();
showCart();
onLoadCartCounts();
displayCart();