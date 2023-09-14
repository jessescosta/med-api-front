// Variável global para armazenar os paciente buscados
let pacienteData = [];

// Função para buscar paciente e listar na página
function buscarPaciente() {
    const token = localStorage.getItem('token');

    fetch('http://localhost:8080/pacientes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data && Array.isArray(data.content)) {
            // Armazene os dados dos paciente na variável global
            pacienteData = data.content;

            const pacienteLista = document.getElementById('pacientes-lista');

            // Limpa qualquer conteúdo anterior na lista
            pacienteLista.innerHTML = '';

            // Itera sobre os objetos JSON e cria linhas da tabela
            pacienteData.forEach(paciente => {
                const pacienteRow = document.createElement('tr');
                pacienteRow.innerHTML = `
                    <td>${paciente.id}</td>
                    <td>${paciente.nome}</td>
                    <td>${paciente.email}</td>
                    <td>${paciente.cpf}</td>
                    <td>${paciente.telefone}</td>
                    <td>
                        <button onclick="excluirPaciente(${paciente.id})">Excluir</button>
                        <button onclick="editarPaciente(${paciente.id})">Editar</button>
                    </td>
                `;

                pacienteLista.appendChild(pacienteRow);
            });
        } else {
            console.error('A resposta da API não contém um array JSON válido:', data);
        }
    })
    .catch(error => {
        console.error('Sessão expirada! ', error.message);
        window.location.href = 'login.html';
    });
}

// Função para excluir um Paciente
function excluirPaciente(id) {
    const token = localStorage.getItem('token');

    if (confirm('Tem certeza de que deseja excluir este Paciente?')) {
        fetch(`http://localhost:8080/pacientes/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.status === 204) {
                alert('Paciente excluído com sucesso.');
                buscarPaciente();
            } else {
                console.error(`Erro ao excluir Paciente com ID ${id}: `, response.statusText);
            }
        })
        .catch(error => {
            console.error(`Erro ao excluir Paciente com ID ${id}:`, error);
        });
    }
}



function preencherFormularioEdicao(paciente) {
    document.getElementById('paciente-id').value = paciente.id;
    document.getElementById('nome').value = paciente.nome;
    document.getElementById('email').value = paciente.email;
    document.getElementById('cpf').value = paciente.cpf;
    document.getElementById('telefone').value = paciente.telefone;
}

// Função para buscar um Paciente por ID
function buscarPacientePorId(id) {
    const token = localStorage.getItem('token');

    return fetch(`http://localhost:8080/pacientes/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            console.error(`Erro ao buscar Paciente com ID ${id}: `, response.statusText);
            return null;
        }
    })
    .catch(error => {
        console.error(`Erro ao buscar Paciente com ID ${id}:`, error);
        return null;
    });
}

// Função para editar um Paciente
function editarPaciente(id) {
    const pacienteEditando = pacienteData.find(paciente => paciente.id === id);

    if (pacienteEditando) {
        // Preencher o formulário de edição com os detalhes do Paciente
        preencherFormularioEdicao(pacienteEditando);

        // Exibir o formulário de edição
        document.getElementById('edicao-paciente').style.display = 'block';
    }
}

// Função para atualizar um Paciente
function atualizarPaciente(paciente) {
    const token = localStorage.getItem('token');

    return fetch(`http://localhost:8080/pacientes?id=${paciente.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paciente)
    })
    .then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            console.error(`Erro ao atualizar Paciente com ID ${paciente.id}: `, response.statusText);
            throw new Error(`Erro ao atualizar Paciente com ID ${paciente.id}`);
        }
    })
    .catch(error => {
        console.error(`Erro ao atualizar Paciente com ID ${paciente.id}:`, error);
        throw error;
    });
}

function cancelarEdicao() {
    pacienteEditandoId = null;
    document.getElementById('formulario-edicao').reset();
    document.getElementById('edicao-paciente').style.display = 'none';
}

document.getElementById('formulario-edicao').addEventListener('submit', function (e) {
    e.preventDefault();
    const pacienteAtualizado = {
        id: document.getElementById('paciente-id').value,
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        cpf: document.getElementById('cpf').value,
        telefone: document.getElementById('telefone').value
    };

    atualizarPaciente(pacienteAtualizado)
        .then(() => {
            alert('Paciente atualizado com sucesso.');
            cancelarEdicao();
            buscarPaciente();
        })
        .catch(error => {
            console.error('Erro ao atualizar Paciente:', error);
        });
});

document.addEventListener('DOMContentLoaded', function () {
    buscarPaciente();
});
