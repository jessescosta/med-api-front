document.addEventListener('DOMContentLoaded', function () {
	const mostrarMaisBotao = document.getElementById('mostrar-mais');
	const cadastrosMenu = document.getElementById('cadastros');
	const listagensMenu = document.getElementById('listagens');

	mostrarMaisBotao.addEventListener('click', function () {
		if (listagensMenu.style.display === 'none') {
			listagensMenu.style.display = 'block';
			mostrarMaisBotao.textContent = 'Mostrar Menos';
		} else {
			listagensMenu.style.display = 'none';
			mostrarMaisBotao.textContent = 'Mostrar Mais';
		}
	});

	// Verifique se há um token na localStorage
	const token = localStorage.getItem('token');
	const menuContainer = document.querySelector('.menu-container');

	// Se não houver token, oculte o menu
	if (!token) {
		menuContainer.style.display = 'none';
		window.location.href = 'login.html';
	}
	
	// Adicione um evento de clique ao botão "Sair"
	document.getElementById('botao-voltar').addEventListener('click', function () {
		// Limpe o token do localStorage
		localStorage.removeItem('token');

		// Redirecione para a página de login
		window.location.href = 'login.html';
	});
});