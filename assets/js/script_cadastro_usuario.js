document.addEventListener('DOMContentLoaded', function () {
    const cadastroForm = document.getElementById('cadastro-form');
    const mensagem = document.getElementById('mensagem');

    // Obtenha o token armazenado no localStorage
    const token = localStorage.getItem('token');

    // Substitua 'http://localhost:8080/login' pelo URL do seu endpoint de teste
    fetch('http://localhost:8080/pacientes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.status === 200) {
            // Endpoint está ativo e token é válido, permita o acesso ao formulário de cadastro
            cadastroForm.style.display = 'block';
        } else {
            // Endpoint não está ativo ou token não é válido, redirecione para 'menu.html'
            window.location.href = 'menu.html';
        }
    })
    .catch(error => {
        // Erro de conexão ou outro erro
        console.error('Erro ao verificar endpoint de usuario:', error);
        mensagem.textContent = 'Erro de conexão. Tente novamente mais tarde.';
        mensagem.className = 'erro';
        mensagem.classList.remove('hidden');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    });

    cadastroForm.addEventListener('submit', function (event) {
        event.preventDefault();
    
        const login = document.getElementById('login').value.toUpperCase();
        const senha = document.getElementById('senha').value;
    
        // Dados do usuario
        const dadosUsuario = {
            login,
            senha
        };
    
        // Substitua 'http://localhost:8080/login' pelo URL do seu endpoint de cadastro de usuario
        fetch('http://localhost:8080/login/usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dadosUsuario)
        })
        .then(response => {
            if (response.status === 200) {
                // Cadastro bem-sucedido
                mensagem.textContent = 'Cadastro do usuario realizado com sucesso!';
                mensagem.className = 'sucesso';
                mensagem.classList.remove('hidden');
    
                // Redirecionar após 2 segundos (2000 milissegundos)
                setTimeout(() => {
                    window.location.href = 'menu.html';
                }, 2000);
            } else {
                // Erro ao cadastrar usuario
                response.json().then(data => {
                    const errorMessage = data.error; // Suponha que a mensagem de erro esteja no campo 'error' do JSON de resposta
                    console.error(`Erro ao cadastrar usuario: ${errorMessage}`);
                    mensagem.textContent = 'Erro ao cadastrar usuario. Tente novamente.';
                    mensagem.className = 'erro';
                    mensagem.classList.remove('hidden');
                }).catch(error => {
                    console.error('Erro ao processar a resposta JSON:', error);
                    mensagem.textContent = 'Erro ao processar a resposta do servidor. Tente novamente mais tarde.';
                    mensagem.className = 'erro';
                    mensagem.classList.remove('hidden');
                });
            }
        })
        .catch(error => {
            // Erro de conexão ou outro erro
            console.error(`Erro ao fazer a solicitação HTTP: ${error.message}`);
            mensagem.textContent = 'Erro de conexão. Tente novamente mais tarde.';
            mensagem.className = 'erro';
            mensagem.classList.remove('hidden');
        });
    });
    

});
