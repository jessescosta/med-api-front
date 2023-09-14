// Variável global para armazenar os médicos buscados
let medicosData = [];

// Função para buscar médicos e listar na página
function buscarMedicos() {
    const token = localStorage.getItem('token');

    fetch('http://localhost:8080/medicos', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data && Array.isArray(data.content)) {
            // Armazene os dados dos médicos na variável global
            medicosData = data.content;

            const medicosLista = document.getElementById('medicos-lista');

            // Limpa qualquer conteúdo anterior na lista
            medicosLista.innerHTML = '';

            // Itera sobre os objetos JSON e cria linhas da tabela
            medicosData.forEach(medico => {
                const medicoRow = document.createElement('tr');
                medicoRow.innerHTML = `
                    <td>${medico.id}</td>
                    <td>${medico.nome}</td>
                    <td>${medico.email}</td>
                    <td>${medico.crm}</td>
                    <td>${medico.especialidade}</td>
                    <td>
                        <button onclick="excluirMedico(${medico.id})">Excluir</button>
                        <button onclick="editarMedico(${medico.id})">Editar</button>
                    </td>
                `;

                medicosLista.appendChild(medicoRow);
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

// Função para excluir um médico alert(`${error.message}`);
function excluirMedico(id) {
    const token = localStorage.getItem('token');

    if (confirm('Tem certeza de que deseja excluir este médico?')) {
        fetch(`http://localhost:8080/medicos/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.status === 204) {
                alert('Médico excluído com sucesso.');
                buscarMedicos();
            } else {
                console.error(`Erro ao excluir médico com ID ${id}: `, response.statusText);
            }
        })
        .catch(error => {
            console.error(`Erro ao excluir médico com ID ${id}:`, error);
        });
    }
}



function preencherFormularioEdicao(medico) {
    document.getElementById('medico-id').value = medico.id;
    document.getElementById('nome').value = medico.nome;
    document.getElementById('email').value = medico.email;
    document.getElementById('crm').value = medico.crm;
    document.getElementById('especialidade').value = medico.especialidade;
}

// Função para buscar um médico por ID
function buscarMedicoPorId(id) {
    const token = localStorage.getItem('token');

    return fetch(`http://localhost:8080/medicos/${id}`, {
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
            console.error(`Erro ao buscar médico com ID ${id}: `, response.statusText);
            return null;
        }
    })
    .catch(error => {
        console.error(`Erro ao buscar médico com ID ${id}:`, error);
        return null;
    });
}

// Função para editar um médico
function editarMedico(id) {
    const medicoEditando = medicosData.find(medico => medico.id === id);

    if (medicoEditando) {
        // Preencher o formulário de edição com os detalhes do médico
        preencherFormularioEdicao(medicoEditando);

        // Exibir o formulário de edição
        document.getElementById('edicao-medico').style.display = 'block';
    }
}

// Função para atualizar um médico
function atualizarMedico(medico) {
    const token = localStorage.getItem('token');

    return fetch(`http://localhost:8080/medicos?id=${medico.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(medico)
    })
    .then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            console.error(`Erro ao atualizar médico com ID ${medico.id}: `, response.statusText);
            throw new Error(`Erro ao atualizar médico com ID ${medico.id}`);
        }
    })
    .catch(error => {
        console.error(`Erro ao atualizar médico com ID ${medico.id}:`, error);
        throw error;
    });
}

function cancelarEdicao() {
    medicoEditandoId = null;
    document.getElementById('formulario-edicao').reset();
    document.getElementById('edicao-medico').style.display = 'none';
}

document.getElementById('formulario-edicao').addEventListener('submit', function (e) {
    e.preventDefault();
    const medicoAtualizado = {
        id: document.getElementById('medico-id').value,
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        crm: document.getElementById('crm').value,
        especialidade: document.getElementById('especialidade').value
    };

    atualizarMedico(medicoAtualizado)
        .then(() => {
            alert('Médico atualizado com sucesso.');
            cancelarEdicao();
            buscarMedicos();
        })
        .catch(error => {
            console.error('Erro ao atualizar médico:', error);
        });
});

document.addEventListener('DOMContentLoaded', function () {
    buscarMedicos();
});
