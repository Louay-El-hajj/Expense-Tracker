document.addEventListener('DOMContentLoaded', function () {
    
    async function fetchCurrencies() {
        try {
            const response = await fetch('https://rich-erin-angler-hem.cyclic.app/students/available');
            const data = await response.json();

            console.log('Received data:', data);

            let currencies;

            if (Array.isArray(data)) {
                currencies = data;
            } else if (data && Array.isArray(data.currencies)) {
                currencies = data.currencies;
            } else {
                console.error('Invalid data structure received from the API:', data);
                return [];
            }

            return currencies;
        } catch (error) {
            console.error('API Call Failed:', error);
            return [];
        }
    }

   
    async function initializeCurrencies() {
        const currencies = await fetchCurrencies();

        const currencySelect = document.getElementById('currency');
        const currencyFilterSelect = document.getElementById('filterCurrency');

        currencyFilterSelect.innerHTML = '<option value="all">All</option>';

        currencies.forEach(currency => {
            const currencyValue = typeof currency === 'object' ? currency.code || currency.name : currency;
            currencySelect.innerHTML += `<option value="${currencyValue}">${currencyValue}</option>`;
            currencyFilterSelect.innerHTML += `<option value="${currencyValue}">${currencyValue}</option>`;
        });
    }

    // Function to make a POST request for currency conversion
    async function convertCurrency(from, to, amount) {
        try {
            const parsedAmount = parseFloat(amount);
    
            const formData = new URLSearchParams();
            formData.append('from', from);
            formData.append('to', to);
            formData.append('amount', parsedAmount);
    
            const response = await fetch('https://rich-erin-angler-hem.cyclic.app/students/convert', {
                method: 'POST',
                body: formData,
            });
    
            const exchangeRateData = await response.json();
    
            console.log('Exchange Rate Data:', exchangeRateData);
    
            const exchangeRate = exchangeRateData.rate !== undefined ? exchangeRateData.rate : exchangeRateData;
    
            console.log('Exchange Rate:', exchangeRate);
    
            return exchangeRate;
        } catch (error) {
            console.error('Currency conversion failed:', error);
            throw new Error('Currency conversion failed');
        }
    }

    // Function to display transactions
function displayTransactions(transactions) {
    const transactionList = document.getElementById('transactionList');

    // Clear the existing content of the list
    transactionList.innerHTML = '';

    transactions.forEach((transaction, index) => {
        const usdAmount = transaction.usdAmount || 0;
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}: ${transaction.amount} ${transaction.currency} - ${usdAmount.toFixed(2)} USD - ${new Date(transaction.timestamp).toLocaleString()} 
            <button onclick="removeTransaction(${index})">Remove</button>
            <button onclick="editTransaction(${index})">Edit</button>
        `;
        transactionList.appendChild(listItem);
    });
}

    // Load transactions from local storage
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    displayTransactions(transactions);
    displayBalance(transactions);

    
    window.addTransaction = async function () {
        const type = document.getElementById('type').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const currency = document.getElementById('currency').value;

        if (!amount || isNaN(amount)) {
            alert('Please enter a valid amount.');
            return;
        }

        let usdAmount = amount; 

        if (currency !== 'USD') {
            try {
                const exchangeRate = await convertCurrency(currency, 'USD', 1);
                usdAmount = type === 'expense' ? -amount * exchangeRate : amount / exchangeRate;
                console.log('USD Amount:', usdAmount);
            } catch (error) {
                console.error('Currency conversion failed:', error);
                alert('Currency conversion failed. Please try again.');
                return;
            }
        }

        try {
            const transaction = { type, amount, currency, usdAmount, timestamp: new Date().toISOString() };
            transactions.push(transaction);
            localStorage.setItem('transactions', JSON.stringify(transactions));

            displayTransactions(transactions);
            displayBalance(transactions);

           
            document.getElementById('amount').value = '';
        } catch (error) {
            console.error('Transaction processing failed:', error);
            alert('Transaction processing failed. Please try again.');
        }
    };

    // Function to remove a transaction
    window.removeTransaction = function (index) {
        if (confirm('Are you sure you want to remove this transaction?')) {
            transactions.splice(index, 1);
            localStorage.setItem('transactions', JSON.stringify(transactions));
            displayTransactions(transactions);
            displayBalance(transactions);
        }
    };

    // Function to edit a transaction
    window.editTransaction = function (index) {
        const transaction = transactions[index];
        if (transaction) {
            document.getElementById('type').value = transaction.type;
            document.getElementById('amount').value = transaction.amount;
            document.getElementById('currency').value = transaction.currency;

           
            transactions.splice(index, 1);

            
            localStorage.setItem('transactions', JSON.stringify(transactions));

            // Display the edited transactions and balance
            displayTransactions(transactions);
            displayBalance(transactions);
        }
    };

    // Function to filter transactions
    window.filterTransactions = function () {
        const filterType = document.getElementById('filterType').value;
        const filterCurrency = document.getElementById('filterCurrency').value;
        const amountFrom = parseFloat(document.getElementById('amountFrom').value) || 0;
        const amountTo = parseFloat(document.getElementById('amountTo').value) || Infinity;
    
        const filteredTransactions = transactions.filter(transaction => {
            const typeCondition = filterType === 'all' || transaction.type === filterType;
            const currencyCondition = filterCurrency === 'all' || transaction.currency === filterCurrency;
            const amountCondition = transaction.usdAmount >= amountFrom && transaction.usdAmount <= amountTo;
    
            return typeCondition && currencyCondition && amountCondition;
        });
    
        displayTransactions(filteredTransactions);
        displayBalance(filteredTransactions);
    };

    // Function to display total balance
    function displayBalance(transactions) {
        const totalBalance = transactions.reduce((sum, transaction) => {
            const amountInUSD = transaction.usdAmount || 0;
            return sum + amountInUSD;
        }, 0);

        console.log('Total Balance:', totalBalance);
        document.getElementById('balance').textContent = `Total Balance: $${totalBalance.toFixed(2)} USD`;
    }

    // Initialize currencies on page load
    initializeCurrencies();
});
