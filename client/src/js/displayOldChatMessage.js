
const displayOldChatMessage = (content, role, messagesDiv) => {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add(role, "message");

  const messageTitle = document.createElement("h2");
  messageTitle.classList.add(role);
  messageTitle.innerHTML = role === "question" ? "You" : "ChatGPT"

  const messageText = document.createElement("p");
  messageText.innerHTML = content

  messageContainer.appendChild(messageTitle);
  messageContainer.appendChild(messageText);

  messagesDiv.appendChild(messageContainer);
};

export default displayOldChatMessage;
