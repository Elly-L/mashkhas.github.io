import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBzdOGu7WZUs_ePxH9xXR-v41lcf2I378A",
    authDomain: "joslo-clinics-and--chemist.firebaseapp.com",
    projectId: "joslo-clinics-and--chemist",
    storageBucket: "joslo-clinics-and--chemist.appspot.com",
    messagingSenderId: "814810693232",
    appId: "1:814810693232:web:550c13cea3cb6f726bbeb5",
    measurementId: "G-1JKEDGQL3G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Login Functionality
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm['email'].value;
    const password = loginForm['password'].value;

    console.log("Attempting to sign in with:", email); // Log email for debugging

    try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Login successful");
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
    } catch (error) {
        console.error("Error logging in: ", error);
        alert("Login failed, please check your credentials.");
    }
});

// Logout Functionality
document.getElementById('logout').addEventListener('click', async () => {
    try {
        await signOut(auth);
        document.getElementById('login-page').style.display = 'block';
        document.getElementById('dashboard').style.display = 'none';
    } catch (error) {
        console.error("Error logging out: ", error);
        alert("Logout failed, please try again.");
    }
});

// Manage Customer Data
document.getElementById('manage-customers').addEventListener('click', () => {
    console.log('Manage Customers button clicked');
    document.getElementById('home-panel').style.display = 'none';
    document.getElementById('manage-customers-section').style.display = 'block';
    loadProductOptions();
});

document.getElementById('customer-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    const productId = document.getElementById('product-select').value;
    const quantity = document.getElementById('quantity').value;
    const pricePerUnit = document.getElementById('price-per-unit').value;
    const total = document.getElementById('total').value;

    try {
        await addDoc(collection(db, "customers"), {
            name,
            phone,
            productId,
            quantity,
            pricePerUnit,
            total
        });
        alert("Customer data saved successfully.");
    } catch (error) {
        console.error("Error saving customer data: ", error);
        alert("Failed to save customer data.");
    }
});

// Load Products for Selection
async function loadProductOptions() {
    const productSelect = document.getElementById('product-select');
    try {
        const productsSnapshot = await getDocs(collection(db, "products"));
        productSelect.innerHTML = '<option value="">Select a product</option>';
        productsSnapshot.forEach((doc) => {
            const product = doc.data();
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = `${product.name} - $${product.price}`;
            productSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading product options: ", error);
    }
}

document.getElementById('product-select').addEventListener('change', async (e) => {
    const productId = e.target.value;
    if (productId) {
        try {
            const productDoc = doc(db, "products", productId);
            const productSnap = await getDoc(productDoc);
            const product = productSnap.data();
            document.getElementById('price-per-unit').value = product.price;
            document.getElementById('total').value = (product.price * document.getElementById('quantity').value).toFixed(2);
        } catch (error) {
            console.error("Error fetching product details: ", error);
        }
    } else {
        document.getElementById('price-per-unit').value = '';
        document.getElementById('total').value = '';
    }
});

document.getElementById('quantity').addEventListener('input', () => {
    const quantity = document.getElementById('quantity').value;
    const pricePerUnit = document.getElementById('price-per-unit').value;
    document.getElementById('total').value = (quantity * pricePerUnit).toFixed(2);
});

// View Customer Data
document.getElementById('view-customers').addEventListener('click', () => {
    console.log('View Customers button clicked');
    document.getElementById('home-panel').style.display = 'none';
    document.getElementById('view-customers-section').style.display = 'block';
});

document.getElementById('search-customer').addEventListener('input', async (e) => {
    const searchText = e.target.value.toLowerCase();
    const customerDetails = document.getElementById('customer-details');
    try {
        const customersSnapshot = await getDocs(collection(db, "customers"));
        customerDetails.innerHTML = '';
        customersSnapshot.forEach((doc) => {
            const customer = doc.data();
            if (customer.name.toLowerCase().includes(searchText)) {
                const div = document.createElement('div');
                div.textContent = `Name: ${customer.name}, Phone: ${customer.phone}`;
                customerDetails.appendChild(div);
            }
        });
    } catch (error) {
        console.error("Error searching customer data: ", error);
    }
});

// Manage Products
document.getElementById('manage-products').addEventListener('click', () => {
    console.log('Manage Products button clicked');
    document.getElementById('home-panel').style.display = 'none';
    document.getElementById('manage-products-section').style.display = 'block';
});

document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('product-name').value;
    const price = document.getElementById('product-price').value;
    const quantity = document.getElementById('product-quantity').value;

    try {
        await addDoc(collection(db, "products"), {
            name,
            price: parseFloat(price),
            quantity: parseInt(quantity, 10)
        });
        alert("Product added successfully.");
    } catch (error) {
        console.error("Error adding product: ", error);
        alert("Failed to add product.");
    }
});
