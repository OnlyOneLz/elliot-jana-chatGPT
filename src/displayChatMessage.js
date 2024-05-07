import displayTextLetterByLetter from "./displayTextLetterByLetter.js";

const displayChatMessage = (content, role, messagesDiv) => {
  const thisMessage = document.createElement("div");
  thisMessage.classList.add(role, "message");

  const messageTitle = document.createElement("h2")
  messageTitle.classList.add(role);
  const messageText = document.createElement("p")

  if (role === 'question') {
    messageTitle.innerHTML = 'You'
  } else {
    messageTitle.innerHTML = 'Chat GPT'
  }

  displayTextLetterByLetter(content, messageText, role);
  thisMessage.appendChild(messageTitle);
  thisMessage.appendChild(messageText);

  messagesDiv.appendChild(thisMessage);
}

export default displayChatMessage
