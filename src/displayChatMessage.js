import displayTextLetterByLetter from "./displayTextLetterByLetter.js";

const displayChatMessage = (content, role, messagesDiv) => {
    const thisMessage = document.createElement("div");
    thisMessage.classList.add(role);
    const messageTitle = document.createElement("h2")
    messageTitle.classList.add(role);


    if (role === 'question'){
      messageTitle.innerHTML = 'You'
    } else {
      messageTitle.innerHTML = 'Chat GPT'
    }

      displayTextLetterByLetter(content, thisMessage, role);

      messagesDiv.appendChild(messageTitle);
      messagesDiv.appendChild(thisMessage)
}

export default displayChatMessage
