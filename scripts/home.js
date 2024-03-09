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
})