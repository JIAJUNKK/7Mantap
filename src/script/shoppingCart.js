async function addToCart(axios, api_path, name, price, imageSrc, size, productId) {
    let cart = retrieveCartFromLocalStorage();
    const existingShirt = cart.find(item => item.name === name && item.size === size);
    if (existingShirt) {
        existingShirt.count++;
    } else {
        const shirt = { name, price, imageSrc, size, productId, count: 1 }; 
        cart.push(shirt);
    }
    saveCartToLocalStorage(cart);
    console.log("This is shoppingCart: ", cart);
    const token = localStorage.getItem('token');
    if (token) {
        try {
            await axios.post(`${api_path}/updateUserCart`, { cart }, { headers: { Authorization: token } });
        } catch (error) {
            console.error("Error updating cart data on the server:", error);
        }
    }
    window.location.reload();
}

function saveCartToLocalStorage(cart) {
    localStorage.setItem('shoppingCart', JSON.stringify(cart)); 
}

function retrieveCartFromLocalStorage() {
    const storedCart = localStorage.getItem('shoppingCart');
    if (storedCart) {
        return JSON.parse(storedCart);
    } else {
        return []; 
    }
}

export { addToCart, retrieveCartFromLocalStorage, saveCartToLocalStorage};
