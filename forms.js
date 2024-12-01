// forms.js
document.querySelector('.contact-form').addEventListener('submit', function (event) {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
  
    if (!name || !email || !message) {
      alert("Por favor, preencha todos os campos.");
      event.preventDefault();
      return;
    }
  
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Por favor, insira um e-mail válido.");
      event.preventDefault();
      return;
    }
  
    alert("Mensagem enviada com sucesso!");
  });
  