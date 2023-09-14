document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const tokenDisplay = document.getElementById('token-display');
    const jwtToken = document.getElementById('jwt-token');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const login = document.getElementById('login').value;
        const senha = document.getElementById('senha').value;

        // Enviar a solicitação POST para o backend
        fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login, senha })
        })
        .then(response => response.json())
        .then(data => {
            // Exibir o token JWT
            tokenDisplay.classList.remove('hidden');
            jwtToken.textContent = data.token;

            // Armazenar o token no localStorage
            localStorage.setItem('token', data.token);

            // Redirecionar para a página de cadastro de médico
            window.location.href = 'menu.html';
        })
        .catch(error => {
            console.error('Erro na autenticação:', error.message);
            alert('Erro na autenticação:', error.message);
        });
    });
});
