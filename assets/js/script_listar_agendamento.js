// Variável global para armazenar os agendamentos buscados
let agendamentosData = [];


// Função para buscar agendamentos e listar na página
function buscarAgendamento() {
    const token = localStorage.getItem('token');

    fetch('http://localhost:8080/consultas', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data && Array.isArray(data)) {
            // Armazene os dados dos agendamentos na variável global
            agendamentosData = data;

            const agendamentosLista = document.getElementById('agendamentos-lista');

            // Limpa qualquer conteúdo anterior na lista
            agendamentosLista.innerHTML = '';

            // Itera sobre os objetos JSON e cria linhas da tabela
            agendamentosData.forEach(agendamento => {
                // Formate a data para o formato desejado
                const dataFormatada = new Date(agendamento.data).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                const agendamentoRow = document.createElement('tr');
                agendamentoRow.innerHTML = `
                    <td>${agendamento.id}</td>
                    <td>${dataFormatada}</td>
                    <td>${agendamento.nomePaciente}</td>
                    <td>${agendamento.cpf}</td>
                    <td>${agendamento.especialidade}</td>
                    <td>${agendamento.nomeMedico}</td>
                    <td>${agendamento.email}</td>
                    <td>${agendamento.motivoCancelamento}</td>
                    <td>
                        <button onclick="editarAgendamento(${agendamento.id})">Cancelar</button>
                    </td>
                `;

                agendamentosLista.appendChild(agendamentoRow);
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



function preencherFormularioEdicao(agendamento) {
    document.getElementById('agendamento-id').value = agendamento.id;
    document.getElementById('motivoCancelamento').value = agendamento.motivoCancelamento;

}

// Função para buscar um agendamento por ID
function buscarAgendamentoPorId(id) {
    const token = localStorage.getItem('token');

    return fetch(`http://localhost:8080/consultas/${id}`, {
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
            console.error(`Erro ao buscar agendamento com ID ${id}: `, response.statusText);
            return null;
        }
    })
    .catch(error => {
        console.error(`Erro ao buscar agendamento com ID ${id}:`, error);
        return null;
    });
}

// Função para editar um agendamento
function editarAgendamento(id) {
    const agendamentoEditando = agendamentosData.find(agendamento => agendamento.id === id);

    if (agendamentoEditando) {
        // Preencher o formulário de edição com os detalhes do agendamento
        preencherFormularioEdicao(agendamentoEditando);

        // Exibir o formulário de edição
        document.getElementById('edicao-agendamento').style.display = 'block';
    }
}

// Função para atualizar um agendamento
function atualizarAgendamento(agendamento) {
    const token = localStorage.getItem('token');

    return fetch(`http://localhost:8080/consultas`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(agendamento)
    })
    .then(response => {
        if (response.status === 200) {
            return response.json();
        } else if (response.status === 400) {
            return response.text().then(errorMessage => {
                throw new Error(`Erro ao atualizar agendamento: ${errorMessage}`);
            });
        } else {
            console.error(`Erro ao atualizar agendamento com ID ${agendamento.id}: `, response.statusText);
            throw new Error(`Erro ao atualizar agendamento com ID ${agendamento.id}`);
        }
    })
    .catch(error => {
        console.error(`Erro ao atualizar agendamento com ID ${agendamento.id}:`, error.message);
        alert(`${error.message}`);
        throw error;
    });
}


function cancelarEdicao() {
    agendamentoEditandoId = null;
    document.getElementById('formulario-edicao').reset();
    document.getElementById('edicao-agendamento').style.display = 'none';
}

document.getElementById('formulario-edicao').addEventListener('submit', function (e) {
    e.preventDefault();
    const agendamentoAtualizado = {
        idConsulta: document.getElementById('agendamento-id').value,
        motivoCancelamento: document.getElementById('motivoCancelamento').value
    };

    atualizarAgendamento(agendamentoAtualizado)
        .then(() => {
            alert('Agendamento atualizado com sucesso.');
            cancelarEdicao();
            buscarAgendamento();
        })
        .catch(error => {
            console.error('Erro ao atualizar agendamento:', error);
        });
});

document.addEventListener('DOMContentLoaded', function () {
    buscarAgendamento();
});
