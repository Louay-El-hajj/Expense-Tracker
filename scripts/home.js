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
})