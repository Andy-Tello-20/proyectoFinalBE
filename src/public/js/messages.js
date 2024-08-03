const socket = io();

const emailUser = document.getElementById("emailUser");
const messageUser = document.getElementById("messageUser");
const dataUser = document.getElementById("dataUser");
const renderMessages = document.getElementById("renderMessages");

dataUser.addEventListener("submit", (e) => {
  e.preventDefault();
  if (
    emailUser.value.trim().length > 0 &&
    messageUser.value.trim().length > 0
  ) {
    renderMessages.innerHTML += `<p>Email: ${emailUser.value}</p><p>Message: ${messageUser.value}</p>`;
  }
  socket.emit("dataUser", {
    user: emailUser.value,
    message: messageUser.value,
  });
});
