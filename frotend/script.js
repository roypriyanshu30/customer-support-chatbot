function sendMessage() {
  const input = document.getElementById('user-input');
  const message = input.value;
  input.value = "";

  const chatBox = document.getElementById('chat-box');
  chatBox.innerHTML += `<div>User: ${message}</div>`;

  fetch('http://localhost:5000/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: message })
  })
  .then(res => res.json())
  .then(data => {
    chatBox.innerHTML += `<div>Bot: ${data.response}</div>`;
  });
}
