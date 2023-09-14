document.addEventListener('DOMContentLoaded', function () {
    const consultaForm = document.getElementById('consulta-form');
    const pacienteSelect = document.getElementById('paciente'); // Alterado para pacienteSelect
    const medicoSelect = document.getElementById('medico');
    const dataHoraInput = document.getElementById('data-hora');
    const token = getToken();

    // Função para buscar o token do localStorage
    function getToken() {
        return localStorage.getItem('token');
    }

    // Função para buscar a lista de médicos e preencher o select
    function carregarMedicos() {
        fetch('http://localhost:8080/medicos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data.content)) {
                data.content.forEach(medico => {
                    const option = document.createElement('option');
                    option.value = medico.id;
                    option.textContent = `${medico.nome} - ${medico.especialidade}`; //medico.nome;
                    medicoSelect.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('Erro ao buscar médicos:', error.message);
            window.location.href = 'login.html';
        });
    }
    
    // Função para buscar a lista de pacientes e preencher o select de pacientes
    function carregarPacientes() {
        fetch('http://localhost:8080/pacientes', { // Endpoint para listar pacientes
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data.content)) {
                    data.content.forEach(paciente => {
                        const option = document.createElement('option');
                        option.value = paciente.id;
                        option.textContent = `${paciente.nome} - ${paciente.especialidade}`;//paciente.nome; // Suponha que o nome do paciente esteja no campo 'nome'
                        pacienteSelect.appendChild(option);
                    });
                }
            })
            .catch(error => {
                console.error('Erro ao buscar pacientes:', error);
                window.location.href = 'login.html';
            });
    }

    // Função para lidar com o envio do formulário
    consultaForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const pacienteId = pacienteSelect.value;
        const medicoId = medicoSelect.value;
        const agendamento = {
            idPaciente: pacienteId,
            idMedico: medicoId,
            data: dataHoraInput.value
        };

        // Envie o agendamento
        enviarAgendamento(agendamento, token);
    });

    // Carregue a lista de médicos quando a página for carregada
    carregarMedicos();
    
    // Carregue a lista de pacientes quando a página for carregada
    carregarPacientes();
});

// Função para enviar o agendamento
function enviarAgendamento(agendamento, token) {
    fetch('http://localhost:8080/consultas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(agendamento)
    })
    .then(response => {
        if (response.status === 200) {
            alert('Agendamento criado com sucesso!');
            window.location.href = 'menu.html';
            // Redirecione para outra página ou execute ações adicionais conforme necessário
        } else if (response.status === 400) {
            return response.text().then(errorMessage => {
                alert(`Erro ao criar agendamento: ${errorMessage}`);
            });
        } else {
            alert('Erro ao criar agendamento.');
        }
    })
    .catch(error => {
        console.error('Erro ao enviar agendamento:', error);
        alert(`Erro ao enviar agendamento: ${error.message}`);
    });
}
