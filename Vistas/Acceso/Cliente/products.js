// Cargar las categorías al inicio
fetch('https://fakestoreapi.com/products/categories')
    .then(res => res.json())
    .then(categories => {
        const categoryList = document.getElementById('category-list');
        
        // Agregar la opción "Todas" para ver todos los productos
        const allLink = document.createElement('li');
        const allCategoryLink = document.createElement('a');
        allCategoryLink.href = "#";
        allCategoryLink.textContent = "Todas";
        allCategoryLink.onclick = (e) => {
            e.preventDefault();
            filterByCategory(''); // Mostrar todos los productos
        };
        allLink.appendChild(allCategoryLink);
        categoryList.appendChild(allLink);

        // Crear un enlace por cada categoría
        categories.forEach(category => {
            const listItem = document.createElement('li');
            const categoryLink = document.createElement('a');
            categoryLink.href = "#";
            categoryLink.textContent = category;
            categoryLink.onclick = (e) => {
                e.preventDefault();
                filterByCategory(category); // Filtrar productos por categoría
            };
            listItem.appendChild(categoryLink);
            categoryList.appendChild(listItem);
        });
    });

// Cargar productos por defecto
fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(products => displayProducts(products));

// Función para mostrar los productos
function displayProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Limpiar la lista de productos
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <h3 class="product-title" onclick="viewDetails(${product.id})">${product.title}</h3>
            <p>$${product.price}</p>
        `;
        productList.appendChild(productDiv);
    });
}


// Función para buscar productos dinámicamente
function searchProducts() {
    const query = document.getElementById('search').value.toLowerCase();
    fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then(products => {
            const filteredProducts = products.filter(product => product.title.toLowerCase().includes(query));
            displayProducts(filteredProducts);
        });
}

// Función para filtrar productos por categoría
function filterByCategory(category) {
    const url = category ? `https://fakestoreapi.com/products/category/${category}` : 'https://fakestoreapi.com/products';
    fetch(url)
        .then(res => res.json())
        .then(products => displayProducts(products));
}

// Función para ver detalles de un producto en la barra lateral
function viewDetails(productId) {
    fetch(`https://fakestoreapi.com/products/${productId}`)
        .then(res => res.json())
        .then(product => {
            // Mostrar los detalles en la barra lateral
            document.getElementById('product-title').textContent = product.title;
            document.getElementById('product-category').textContent = product.category;
            document.getElementById('product-description').textContent = product.description;
            document.getElementById('product-price').textContent = product.price;
        });
}

// Obtener el nombre del usuario de la URL
window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userName = urlParams.get('user');
    document.getElementById('user-display').textContent = userName ? userName : 'Usuario';

    // Configurar el botón de cerrar sesión
    document.getElementById('btn_logout').addEventListener('click', () => {
        import('../Acceso/firebase.js').then(({ auth }) => {
            import('https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js').then(({ signOut }) => {
                signOut(auth).then(() => {
                    window.location.href = '/Vistas/Acceso/login.html';
                }).catch((error) => {
                    console.error("Error al cerrar sesión:", error.message);
                });
            });
        });
    });
};
