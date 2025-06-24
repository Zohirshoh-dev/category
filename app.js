"use strict";
const addCategoryBtn = document.getElementById('addCategoryBtn');
const addProductBtn = document.getElementById('addProductBtn');
const categoryList = document.getElementById('categoryList');
const productsContainer = document.getElementById('productsContainer');
const categoryModal = document.getElementById('categoryModal');
const productModal = document.getElementById('productModal');
const categoryNameInput = document.getElementById('categoryName');
const productTitleInput = document.getElementById('productTitle');
const productPriceInput = document.getElementById('productPrice');
const saveCategoryBtn = document.getElementById('saveCategoryBtn');
const saveProductBtn = document.getElementById('saveProductBtn');
let categories = JSON.parse(localStorage.getItem('categories') || '[]');
let products = JSON.parse(localStorage.getItem('products') || '[]');
let activeCategoryId = null;
function init() {
    if (!categoryList || !productsContainer)
        return;
    renderCategories();
    if (categories.length > 0) {
        activeCategoryId = categories[0].id;
        renderProducts();
    }
    setupEventListeners();
}
function renderCategories() {
    if (!categoryList)
        return;
    categoryList.innerHTML = '';
    categories.forEach(category => {
        const li = document.createElement('li');
        li.textContent = category.name;
        li.dataset.id = category.id;
        li.classList.toggle('active', category.id === activeCategoryId);
        li.addEventListener('click', () => {
            activeCategoryId = category.id;
            renderCategories();
            renderProducts();
        });
        categoryList.appendChild(li);
    });
}
function renderProducts() {
    if (!productsContainer || !activeCategoryId)
        return;
    productsContainer.innerHTML = '';
    const categoryProducts = products.filter(p => p.categoryId === activeCategoryId);
    categoryProducts.forEach(product => {
        const category = categories.find(c => c.id === product.categoryId);
        productsContainer.innerHTML += `
            <div class="product-card">
                <div class="product-image"></div>
                <div class="product-info">
                    <h4>${product.title}</h4>
                    <p>${(category === null || category === void 0 ? void 0 : category.name) || ''}</p>
                    <p>${product.price}$</p>
                </div>
            </div>
        `;
    });
}
function setupEventListeners() {
    addCategoryBtn === null || addCategoryBtn === void 0 ? void 0 : addCategoryBtn.addEventListener('click', () => showModal('category'));
    addProductBtn === null || addProductBtn === void 0 ? void 0 : addProductBtn.addEventListener('click', () => {
        if (!activeCategoryId) {
            alert('Select a category first');
            return;
        }
        showModal('product');
    });
    saveCategoryBtn === null || saveCategoryBtn === void 0 ? void 0 : saveCategoryBtn.addEventListener('click', saveCategory);
    saveProductBtn === null || saveProductBtn === void 0 ? void 0 : saveProductBtn.addEventListener('click', saveProduct);
    window.addEventListener('click', (e) => {
        if (e.target === categoryModal)
            hideModal('category');
        if (e.target === productModal)
            hideModal('product');
    });
}
function showModal(type) {
    const modal = type === 'category' ? categoryModal : productModal;
    if (modal)
        modal.style.display = 'flex';
    if (type === 'category' && categoryNameInput) {
        categoryNameInput.value = '';
    }
    else if (type === 'product') {
        if (productTitleInput)
            productTitleInput.value = '';
        if (productPriceInput)
            productPriceInput.value = '';
    }
}
function hideModal(type) {
    const modal = type === 'category' ? categoryModal : productModal;
    if (modal)
        modal.style.display = 'none';
}
function saveCategory() {
    if (!categoryNameInput)
        return;
    const name = categoryNameInput.value.trim();
    if (!name)
        return;
    const newCategory = {
        id: Date.now().toString(),
        name: name
    };
    categories.push(newCategory);
    localStorage.setItem('categories', JSON.stringify(categories));
    if (categories.length === 1) {
        activeCategoryId = newCategory.id;
    }
    renderCategories();
    hideModal('category');
}
function saveProduct() {
    if (!productTitleInput || !productPriceInput || !activeCategoryId)
        return;
    const title = productTitleInput.value.trim();
    const price = productPriceInput.value.trim();
    if (!title || !price)
        return;
    const newProduct = {
        id: Date.now().toString(),
        title: title,
        price: price,
        categoryId: activeCategoryId
    };
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
    hideModal('product');
}
init();
