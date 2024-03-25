export const shirtsData = [
    { name: 'Billie Eilish Vintage Shirt', price: '79.90', productId: "Shirt0001", image: new URL('@/assets/shirts/billieShirt1.png', import.meta.url).href },
    { name: 'Michael Jordan Vintage Shirt', price: '89.90', productId: "Shirt0002", image: new URL('@/assets/shirts/jordanShirt1.png', import.meta.url).href },
    { name: 'Justin Bieber Vintage Shirt', price: '79.90', productId: "Shirt0003", image: new URL('@/assets/shirts/justinShirt1.png', import.meta.url).href },
    { name: 'LeBron James Vintage Shirt', price: '89.90', productId: "Shirt0004", image: new URL('@/assets/shirts/lebronShirt1.png', import.meta.url).href },
    { name: 'Travis Scott Vintage Shirt', price: '79.90', productId: "Shirt0005", image: new URL('@/assets/shirts/travisShirt1.png', import.meta.url).href },      
];

export function renderShirts(sortDirection = 'default') {
    if (sortDirection === 'l2h') {
        shirtsData.sort((a, b) => a.price - b.price); 
    } else if (sortDirection === 'h2l') {
        shirtsData.sort((a, b) => b.price - a.price); 
    } else if (sortDirection === 'default'){
        shirtsData.sort((a, b) => a.name.localeCompare(b.name));
    }

    const shirtsGrid = document.getElementById('shirtsGrid');
    shirtsGrid.innerHTML = ''; 

    shirtsData.forEach(shirt => {
        const shirtHTML = `
        <div class="shirt-info-container" data-id="${shirt.productId}" data-name="${shirt.name}" data-price="${shirt.price}" data-image="${shirt.image}">
            <RouterLink :to="'/shirts/' + shirt.productId">
                <div class="shirt-img-background-container">
                    <img src="${shirt.image}" alt="${shirt.name}" class="shirt-img" />
                </div>
            </RouterLink>
            <h3>${shirt.name}</h3>
            <p>RM${shirt.price}</p>
        </div>
    `;
        shirtsGrid.insertAdjacentHTML('beforeend', shirtHTML);
    });

    shirtsGrid.querySelectorAll('.shirt-info-container').forEach(shirtContainer => {
        shirtContainer.addEventListener('click', () => {
            const name = shirtContainer.dataset.name;
            const price = shirtContainer.dataset.price;
            const imageSrc = shirtContainer.dataset.image;
            const productId = shirtContainer.dataset.id;
            window.location.href = `/shirts/${productId}`; 
        });
    });
}


