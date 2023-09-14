document.addEventListener('DOMContentLoaded', function () {
    const cadastroForm = document.getElementById('cadastro-form');
    const mensagem = document.getElementById('mensagem');

    // Obtenha o token armazenado no localStorage
    const token = localStorage.getItem('token');

    // Substitua 'http://localhost:8080/pacientes' pelo URL do seu endpoint de teste
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
        console.error('Erro ao verificar endpoint de pacientes:', error);
        mensagem.textContent = 'Erro de conexão. Tente novamente mais tarde.';
        mensagem.className = 'erro';
        mensagem.classList.remove('hidden');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    });

    cadastroForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const telefone = document.getElementById('telefone').value;
        const cpf = document.getElementById('cpf').value;
        const endereco = {
            logradouro: document.getElementById('logradouro').value,
            bairro: document.getElementById('bairro').value,
            cep: document.getElementById('cep').value,
            cidade: document.getElementById('cidade').value,
            uf: document.getElementById('uf').value,
            numero: document.getElementById('numero').value,
            complemento: document.getElementById('complemento').value
        };

        // Dados do paciente
        const dadosPaciente = {
            nome,
            email,
            telefone,
            cpf,
            endereco
        };

        // Substitua 'http://localhost:8080/pacientes' pelo URL do seu endpoint de cadastro de pacientes
        fetch('http://localhost:8080/pacientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dadosPaciente)
        })
        .then(response => {
            if (response.status === 201) {
                // Cadastro bem-sucedido
                mensagem.textContent = 'Cadastro do paciente realizado com sucesso!';
                mensagem.className = 'sucesso';
                mensagem.classList.remove('hidden');

                // Redirecionar após 2 segundos (2000 milissegundos)
                setTimeout(() => {
                    window.location.href = 'menu.html';
                }, 2000);
            } else {
                // Erro ao cadastrar paciente
                mensagem.textContent = 'Erro ao cadastrar paciente. Tente novamente.';
                mensagem.className = 'erro';
                mensagem.classList.remove('hidden');
            }
        })
        .catch(error => {
            // Erro de conexão ou outro erro
            console.error('Erro ao cadastrar paciente:', error.message);
            mensagem.textContent = 'Erro de conexão. Tente novamente mais tarde.';
            mensagem.className = 'erro';
            mensagem.classList.remove('hidden');

        });
    });
});
