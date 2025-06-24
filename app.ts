interface Category {
    id: string;
    name: string;
}

interface Product {
    id: string;
    title: string;
    price: string;
    categoryId: string;
}

const addCategoryBtn = document.getElementById('addCategoryBtn') as HTMLButtonElement | null;
const addProductBtn = document.getElementById('addProductBtn') as HTMLButtonElement | null;
const categoryList = document.getElementById('categoryList') as HTMLElement | null;
const productsContainer = document.getElementById('productsContainer') as HTMLElement | null;
const categoryModal = document.getElementById('categoryModal') as HTMLElement | null;
const productModal = document.getElementById('productModal') as HTMLElement | null;
const categoryNameInput = document.getElementById('categoryName') as HTMLInputElement | null;
const productTitleInput = document.getElementById('productTitle') as HTMLInputElement | null;
const productPriceInput = document.getElementById('productPrice') as HTMLInputElement | null;
const saveCategoryBtn = document.getElementById('saveCategoryBtn') as HTMLButtonElement | null;
const saveProductBtn = document.getElementById('saveProductBtn') as HTMLButtonElement | null;

let categories: Category[] = JSON.parse(localStorage.getItem('categories') || '[]');
let products: Product[] = JSON.parse(localStorage.getItem('products') || '[]');
let activeCategoryId: string | null = null;

function init(): void {
    if (!categoryList || !productsContainer) return;
    
    renderCategories();
    if (categories.length > 0) {
        activeCategoryId = categories[0].id;
        renderProducts();
    }
    setupEventListeners();
}

function renderCategories(): void {
    if (!categoryList) return;
    
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

function renderProducts(): void {
    if (!productsContainer || !activeCategoryId) return;
    
    productsContainer.innerHTML = '';
    const categoryProducts = products.filter(p => p.categoryId === activeCategoryId);
    
    categoryProducts.forEach(product => {
        const category = categories.find(c => c.id === product.categoryId);
        
        productsContainer.innerHTML += `
            <div class="product-card">
                <div class="product-image"></div>
                <div class="product-info">
                    <h4>${product.title}</h4>
                    <p>${category?.name || ''}</p>
                    <p>${product.price}$</p>
                </div>
            </div>
        `;
    });
}

function setupEventListeners(): void {
    addCategoryBtn?.addEventListener('click', () => showModal('category'));
    addProductBtn?.addEventListener('click', () => {
        if (!activeCategoryId) {
            alert('Select a category first');
            return;
        }
        showModal('product');
    });

    saveCategoryBtn?.addEventListener('click', saveCategory);
    saveProductBtn?.addEventListener('click', saveProduct);

    window.addEventListener('click', (e) => {
        if (e.target === categoryModal) hideModal('category');
        if (e.target === productModal) hideModal('product');
    });
}

function showModal(type: 'category' | 'product'): void {
    const modal = type === 'category' ? categoryModal : productModal;
    if (modal) modal.style.display = 'flex';
    
    if (type === 'category' && categoryNameInput) {
        categoryNameInput.value = '';
    } else if (type === 'product') {
        if (productTitleInput) productTitleInput.value = '';
        if (productPriceInput) productPriceInput.value = '';
    }
}

function hideModal(type: 'category' | 'product'): void {
    const modal = type === 'category' ? categoryModal : productModal;
    if (modal) modal.style.display = 'none';
}

function saveCategory(): void {
    if (!categoryNameInput) return;
    
    const name = categoryNameInput.value.trim();
    if (!name) return;

    const newCategory: Category = {
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

function saveProduct(): void {
    if (!productTitleInput || !productPriceInput || !activeCategoryId) return;
    
    const title = productTitleInput.value.trim();
    const price = productPriceInput.value.trim();
    
    if (!title || !price) return;

    const newProduct: Product = {
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