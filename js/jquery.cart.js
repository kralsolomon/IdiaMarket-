let btnLocation = document.getElementById('open_cart_btn');

function formatterCart(priceSum) {
    let price = priceSum.toString();
    let formattedPrice = '';
    for (let i = 0; i < price.length; i++) {
        if (i > 0 && i % 3 === 0) {
            formattedPrice = ' ' + formattedPrice;
        }
        formattedPrice = price[price.length - 1 - i] + formattedPrice;
    }
    return formattedPrice;
}

btnLocation.addEventListener('click', function () {
    const divElement = document.createElement('div');
    divElement.classList.add('jqcart_layout');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    let itemsHtml = cart.map(item => {
        let itemTotalPrice = item.price * item.quantity;
        return `
            <ul class="jqcart_tbody" data-id="${item.code}">
                <li class="jqcart_small_td">
                    <img src="${item.img}" alt="Img">
                </li>
                <li>
                    <div class="jqcart_nd">
                        <a href="${item.link}">${item.title}</a>
                    </div>
                </li>
                <li></li>
                <li class="jqcart_price">${formatterCart(item.price)} <span class="product_item_price_par">₸</span></li>
                <li>
                    <div class="jqcart_pm">
                        <input type="text" class="jqcart_amount" value="${item.quantity}" readonly>
                        <span class="jqcart_incr" data-code="${item.code}" data-incr="1">
                            <i class="fa fa-angle-up" aria-hidden="true"></i>
                        </span>
                        <span class="jqcart_incr" data-code="${item.code}" data-incr="-1">
                            <i class="fa fa-angle-down" aria-hidden="true"></i>
                        </span>
                    </div>
                </li>
                <li class="jqcart_sum">${formatterCart(itemTotalPrice)} <span class="product_item_price_par">₸</span></li>
            </ul>
        `;
    }).join('');

    let totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    divElement.innerHTML = `
        <div class="jqcart_content">
            <div class="jqcart_table_wrapper">
                <div class="jqcart_manage_order">
                    <ul class="jqcart_thead">
                        <li></li>
                        <li>ТОВАР</li>
                        <li></li>
                        <li>ЦЕНА</li>
                        <li>КОЛИЧЕСТВО </li>
                        <li>СТОИМОСТЬ</li>
                    </ul>
                    ${itemsHtml}
                </div>
            </div>
            <div class="jqcart_manage_block">
                <div class="jqcart_btn">
                    <button class="jqcart_open_form_btn">Оформить заказ</button>
                    <form class="jqcart_order_form" style="opacity: 0">
                        <input class="jqcart_return_btn" type="reset" value="Продолжить покупки">
                    </form>
                </div>
                <div class="jqcart_subtotal">Итого: <strong>${formatterCart(totalAmount)}</strong> <span class="product_item_price_par">₸</span></div>
            </div>
        </div>
    `;

    document.body.appendChild(divElement);

    document.querySelector('.jqcart_layout').addEventListener('click', function (event) {
        if (event.target === document.querySelector('.jqcart_layout')) {
            document.querySelector('.jqcart_layout').remove();
        }
    });

    document.querySelectorAll('.jqcart_incr').forEach(button => {
        button.addEventListener('click', function() {
            let code = this.getAttribute('data-code');
            let increment = parseInt(this.getAttribute('data-incr'), 10);
            updateCartQuantity(code, increment);
        });
    });
});

function updateCartQuantity(code, increment) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let product = cart.find(item => item.code === code);

    if (product) {
        product.quantity += increment;
        if (product.quantity <= 0) {
            cart = cart.filter(item => item.code !== code);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
    }
}

function updateCartUI() {
    const existingCart = document.querySelector('.jqcart_layout');
    if (existingCart) {
        existingCart.remove();
        btnLocation.click();
    }
    updateCartCount();
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.open_cart_number').textContent = totalItems;
}

updateCartCount();
