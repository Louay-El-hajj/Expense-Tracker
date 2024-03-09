function validateLogin() {
    
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    const username = usernameInput.value;
    const password = passwordInput.value;

    
    if (username === 'nabiha' && password === 'nabiha') {  
        window.location.href = '../pages/home.html';
    } else {
        alert('Invalid username or password. Please try again.');
        passwordInput.value = '';
    }
}