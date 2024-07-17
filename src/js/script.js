/**
 ** Setarea marginii superioare pentru scroll
 */

// Inaltimea NavBar in "px"
let navBarHeight = document.querySelector('.sticky-top').offsetHeight;

// Lista de elemente
let navLinks = document.querySelectorAll('.navbar-link');

for (const section of navLinks) {
	section.style.scrollMarginTop = navBarHeight + 'px';
}



/**
 ** Functii pentru cart si modal
 */

// Selecteaza toate produsele
let itemsProduct = document.querySelectorAll('[data-bs-toggle]');

// Selectare elementelor modale care vor trebui modificate
let modalContent = document.querySelector('.modal-content');

let modalTitle = '';
let modalImg = '';
let modalText = '';
let modalPrice = '';

let count = '';
let btnAdd = '';
let btnRemove = '';

// Caontainer cos
let containerCards = document.querySelector('#main-cart');

// Cart
let cartData = {};
// Icon cart
let cartDomIcon = document.querySelector('#cart-link');
// Lista butoane care adauga produsul in cos 
let btnAddToCart = document.querySelectorAll('.cart-btn');

// Numele cheie in "localStorage"
const ITEM_STORAGE = 'produse';
// Extragerea datelor din "localSorage"
const GET_DATA_STORAGE = localStorage.getItem(ITEM_STORAGE);
// Conversia datelor din "localStorage" intr-un obiect
const OBJ_DATA_STORAGE = JSON.parse(GET_DATA_STORAGE);


if (modalContent) {
	modalTitle = modalContent.querySelector('.modal-title');
	modalImg = modalContent.querySelector('.modal-img');
	modalText = modalContent.querySelector('.card-text-description');
	modalPrice = modalContent.querySelector('.modal-footer > p > .price');

	addEventPrice(modalContent);
}


// Adauga un evente la fiecare produs
for (const item of itemsProduct) {
	item.addEventListener('click', () => {
		// Extragerea datelor din produsul selectat
		let cardBox = item.closest('.card');
		let title = cardBox.querySelector('.card-title');
		let img = cardBox.querySelector('.card-img-top');
		let imgSrc = img.src;
		let imgAlt = img.alt;
		let description = cardBox.querySelector('.card-text-description');
		let price = cardBox.querySelector('.price');

		// Actualizarea elementelor modale
		modalTitle.textContent = title.innerText;
		modalImg.src = imgSrc;
		modalImg.alt = imgAlt;

		if (description) {
			modalText.textContent = description.innerText;
		} else {
			modalText.textContent = '';
		}

		count.innerText = 1;
		modalPrice.setAttribute('data-pret', price.innerText);
		modalPrice.textContent = price.innerText;
	});
}

// Verificarea existentei datelor in "localeSorage" si actualizarea "DOM"
if (OBJ_DATA_STORAGE) {
	cartData = OBJ_DATA_STORAGE;
	updateCart();
}

// Event la butoane pentru a adauga in cos
for (const btn of btnAddToCart) {
	btn.addEventListener('click', () => {
		let cardBox = btn.closest('.card');
		addProductToCart(cardBox);
	});
}

createCardFromStorage();


// Actualizeaza pretul total a produsului in baza cantitatii in "modal"
function updateModalPrice() {
	let amount = count.innerText;
	let price = modalPrice.getAttribute('data-pret') * amount;
	modalPrice.textContent = price;
}

// Adaugarea produselor in cos
function addProductToCart(cardBox, title = '.card-title') {
	let productTitle = cardBox.querySelector(title).innerText;
	let productPrice = cardBox.querySelector('.price');
	let description = cardBox.querySelector('.card-text-description');
	let imgSrc = cardBox.querySelector('img').src;
	let amount = cardBox.querySelector('.amount');

	// Constrol existenta datelor in element
	if (description) {
		description = description.innerText;
	} else {
		description = '';
	}

	// Constrol existenta valoarei a atributului din element
	if (productPrice.getAttribute('data-pret')) {
		productPrice = Number(productPrice.getAttribute('data-pret'));
	} else {
		productPrice = productPrice.innerText;
	}

	// Control existenta elementului in DOM 
	if (amount) {
		amount = Number(amount.innerText);
	} else {
		amount = 1;
	}

	if (cartData[productTitle]) {
		// Creșterea cantitatii de produs
		if (amount > 1) {

			if (title !== '.card-title') {
				cartData[productTitle].cantitate = amount;
			} else {
				cartData[productTitle].cantitate += amount;
			}

		} else {
			cartData[productTitle].cantitate++;
		}
	} else {
		// Crearea unui nou obiect in obiectul "cartData"
		cartData[productTitle] = {
			pret: productPrice,
			descriere: description,
			cantitate: amount,
			img: imgSrc,
		};
	}

	updateCart();
}

// Scade cantitatea produsului sau sterge da
function removeProduct(productTitle) {
	if (cartData[productTitle].cantitate > 1) {
		cartData[productTitle].cantitate--;
	} else {
		deleteProduct(productTitle);
	}

	updateCart();
}

// Strege produsul din obiectul "cartData"
function deleteProduct(productTitle) {
	delete cartData[productTitle];
	updateCart();
}

// Actualizarea cosului cu numarul de produse adaugate
function updateCart() {

	if (cartDomIcon) {
		let amount = 0;
		let badge = cartDomIcon.querySelector('.badge');

		for (const product in cartData) {
			amount += cartData[product].cantitate;
		}

		// Actualizarea cantitatii de produse selectate in "DOM"
		badge.textContent = amount;
	}

	// Eliminarea articolului din "localStorage"
	localStorage.removeItem(ITEM_STORAGE);
	// Settarea datelor in "localSorage"
	localStorage.setItem(ITEM_STORAGE, JSON.stringify(cartData));
}


/**
 * todo: Pagina cart
 */

// Inserarea produselor in pagina
function createCardFromStorage() {
	if (containerCards) {
		getDataFromStorage(OBJ_DATA_STORAGE);
	}
}

// Actualizarea "DOM" cu produse adaugate in "localeStorage"
function getDataFromStorage(dataFromStorage) {
	containerCards.textContent = '';

	for (const product in dataFromStorage) {
		// Content card
		let div1 = createHtmlElement('div', 'row row-cols-1');
		let div2 = createHtmlElement('div', 'card mb-3 p-0 card-product h-25');
		let div3 = createHtmlElement('div', 'row g-0');

		// Box imagine
		let div4 = createHtmlElement('div', 'col-lg-2 img-fluid img-container d-flex justify-content-center align-items-center');
		let img = createHtmlElement('img', 'w-100 h-100 img rounded-start object-fit-cover');
		img.src = dataFromStorage[product].img;
		img.alt = product;

		// Box descriere
		let div5 = createHtmlElement('div', 'col-lg-6 ');
		let div6 = createHtmlElement('div', 'card-body');
		let h5 = createHtmlElement('h5', 'card-title title');
		h5.innerText = product;
		let p = createHtmlElement('p', 'card-text card-text-description');
		p.innerText = dataFromStorage[product].descriere;

		// Box pret
		let div7 = createHtmlElement('div', 'col-lg-3 row-cols-3 cart-pret');
		let div8 = createHtmlElement('div', 'card-body');
		let h5_1 = createHtmlElement('h5', 'card-title price');
		h5_1.innerText = dataFromStorage[product].pret;

		let div9 = createHtmlElement('div', 'card-body cantitatea');
		let btn1 = createHtmlElement('button', 'remove btn h5');
		btn1.innerText = '-';
		let span = createHtmlElement('span', 'amount card-title h5');
		span.innerText = dataFromStorage[product].cantitate;
		let btn2 = createHtmlElement('button', 'add btn h5');
		btn2.innerText = '+';

		let div10 = createHtmlElement('div', 'card-body');
		let h5_2 = createHtmlElement('h5', 'card-title final-price');
		h5_2.innerText = dataFromStorage[product].pret * dataFromStorage[product].cantitate;

		// Box delete
		let div11 = createHtmlElement('div', 'col-lg-1');
		let div12 = createHtmlElement('div', 'card-body');
		let btn3 = createHtmlElement('button', 'card-title delete');

		// Asemblarea contenitorului
		containerAssembly(containerCards, div1);
		containerAssembly(div1, div2);
		containerAssembly(div2, div3);

		// Box img
		containerAssembly(div3, div4);
		containerAssembly(div4, img);

		// Box description
		containerAssembly(div3, div5);
		containerAssembly(div5, div6);
		containerAssembly(div6, h5);
		containerAssembly(div6, p);

		// Box pret
		containerAssembly(div3, div7);
		containerAssembly(div7, div8);
		containerAssembly(div8, h5_1);

		// Cantitatea
		containerAssembly(div7, div9);
		containerAssembly(div9, btn1);
		containerAssembly(div9, span);
		containerAssembly(div9, btn2);

		// Pret total
		containerAssembly(div7, div10);
		containerAssembly(div10, h5_2);

		// Box delet
		containerAssembly(div3, div11);
		containerAssembly(div11, div12);
		containerAssembly(div12, btn3);
	}
	let boxPret = document.querySelectorAll('.cart-pret');

	addEventPrice(boxPret);
}

// Adauga event la butoanele pret
function addEventPrice(arrItems) {

	if (NodeList.prototype.isPrototypeOf(arrItems)) {
		// Cart page update
		for (const item of arrItems) {
			let productContainer = item.closest('.card');
			let productTitle = productContainer.querySelector('.title').innerText;
			let btnDelete = productContainer.querySelector('.delete');
			let initialPrice = item.querySelector('.price');
			let finalPrice = item.querySelector('.final-price');
			let count = item.querySelector('.amount');
			let btnAdd = item.querySelector('.add');
			let btnRemove = item.querySelector('.remove');

			// Buton care adauga produs
			btnAdd.addEventListener('click', () => {
				count.innerText++;
				updatePriceFinal(initialPrice, count, finalPrice);
				addProductToCart(productContainer, '.title');
			});

			// Buton care scade produs
			btnRemove.addEventListener('click', () => {
				count.innerText--;

				if (count.innerText > 0) {
					updatePriceFinal(initialPrice, count, finalPrice);
					removeProduct(productTitle);
				} else {
					removeProduct(productTitle);
					createCardFromStorage();
				}
			});

			// Buton sterge produsul din cos
			btnDelete.addEventListener('click', () => {
				deleteProduct(productTitle);
				createCardFromStorage();
			});
		}
	} else {
		// Modal update
		count = arrItems.querySelector('.amount');
		btnAdd = arrItems.querySelector('.add');
		btnRemove = arrItems.querySelector('.remove');

		// Buton care adauga produs
		btnAdd.addEventListener('click', () => {
			count.innerText++;
			updateModalPrice();
		});

		// Buton care scade produs
		btnRemove.addEventListener('click', () => {
			if (count.innerText > 1) {
				count.innerText--;
				updateModalPrice();
			}
		});
	}

}

// Actualizeaza pretul total a produsului in baza cantitatii in "pagina cart"
function updatePriceFinal(initialPrice, count, finalPrice) {
	let amount = count.innerText;
	let price = initialPrice.innerText * amount;
	finalPrice.textContent = price;
}

// Creaza un element si adauga clase
function createHtmlElement(tagName, className) {
	let elementHtml = document.createElement(tagName);

	if (className) {
		// Adauca o clasa la un element
		elementHtml.className += className;
	}

	return elementHtml;
}

// Functie di asemblarea elementului
function containerAssembly(element, insetElement, positionElement = 'beforeend') {
	return element.insertAdjacentElement(positionElement, insetElement);
}