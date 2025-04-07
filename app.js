// YOUR FIREBASE CONFIG (from your project)
const firebaseConfig = {
  apiKey: "AIzaSyA4bpwi7aFNxDJOiVn9s19M39SpLZNrjvA",
  authDomain: "roommate-expenses-f27db.firebaseapp.com",
  projectId: "roommate-expenses-f27db",
  storageBucket: "roommate-expenses-f27db.firebasestorage.app",
  messagingSenderId: "631142702506",
  appId: "1:631142702506:web:bc5fe881a79727ced21fd3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// DOM Elements
const expenseForm = document.getElementById('expense-form');
const balanceDisplay = document.getElementById('balance');
const expenseList = document.getElementById('expense-list');

let currentBalance = 0;

// Add Expense to Firebase
expenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const description = document.getElementById('description').value;
    
    try {
        await db.collection('expenses').add({
            name,
            amount,
            description,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        currentBalance -= amount;
        updateBalanceDisplay();
        expenseForm.reset();
        
        if (currentBalance <= 0) {
            alert('Balance is zero! Add more money.');
        }
    } catch (error) {
        console.error("Error adding expense: ", error);
        alert("Error adding expense. Please try again.");
    }
});

// Real-time updates
db.collection('expenses')
  .orderBy('timestamp', 'desc')
  .onSnapshot((snapshot) => {
    expenseList.innerHTML = '';
    snapshot.forEach(doc => {
        const expense = doc.data();
        const expenseItem = document.createElement('div');
        expenseItem.className = 'expense-item';
        expenseItem.innerHTML = `
            <div>
                <span class="expense-name">${expense.name}</span>
                <span class="expense-description">${expense.description}</span>
            </div>
            <span class="expense-amount">-$${expense.amount.toFixed(2)}</span>
        `;
        expenseList.appendChild(expenseItem);
    });
});

function updateBalanceDisplay() {
    balanceDisplay.textContent = `$${currentBalance.toFixed(2)}`;
    balanceDisplay.classList.toggle('zero-balance', currentBalance <= 0);
}