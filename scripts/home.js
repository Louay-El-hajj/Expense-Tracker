document.addEventListener('DOMContentLoaded', function () {
    // Function to make a GET request for the currencies api
    async function fetchCurrencies() {
        try {
            const response = await fetch('https://ivory-ostrich-yoke.cyclic.app/students/available');
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
    async function convertCurrency(from, to, amount) {
        try {
            const response = await fetch('https://ivory-ostrich-yoke.cyclic.app/students/convert', {
                method: 'POST',
                body: JSON.stringify({ from, to, amount }),
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
    //  import transactions from local storage
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
         //funtion to remove  a transactio
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

        //apply changes to  the local storage
        localStorage.setItem('transactions', JSON.stringify(transactions));

        // Display the updated transactions and balance
        displayTransactions(transactions);
        displayBalance(transactions);
    }
};



})