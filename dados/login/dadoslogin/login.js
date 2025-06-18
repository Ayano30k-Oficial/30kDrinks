 function login() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    const message = document.getElementById('message');

    if (user == 'ayano30k' && pass == 'ayano30k@2026') {
        window.location.href = "usuarios/ayano30k/ayano30k.html";
    } else {
      message.innerText = '❌ Usuário ou senha inválidos.';
    }
  }

  function logout() {
    document.getElementById('loginBox').style.display = 'block';
    document.getElementById('secretArea').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
  }