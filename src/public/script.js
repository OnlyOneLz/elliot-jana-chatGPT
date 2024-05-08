import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import updateMessageHistory from '../updateMessageHistory.js';
import apiFetch from '../apiFetch.js';
import displayChatMessage from "../displayChatMessage.js";

const app = () => {
  // Query Selectors
  const form = document.querySelector('.chat-form')
  const formInput = document.getElementById('chat-input')
  const messagesDiv = document.querySelector("#chat-messages")
  const clearButton = document.getElementById("clear")

  // state
  let messageHistory = localStorage.getItem("history") ? JSON.parse(localStorage.getItem("history")) : []
  console.log(messageHistory)

  // Event Listeners
  form.addEventListener('submit', async function (event) {
    event.preventDefault()
    const query = formInput.value
    displayChatMessage(query + '?', "question", messagesDiv)
    updateMessageHistory(query, "user", messageHistory)
    const apiResponse = await apiFetch(messageHistory)
    const messageContent = apiResponse.data.choices[0].message.content
    updateMessageHistory(messageContent, "assistant", messageHistory)
    displayChatMessage(marked.parse(messageContent), "answer", messagesDiv)
  })

  clearButton.addEventListener("click", () => {
    messageHistory = []
    localStorage.setItem("history", JSON.stringify(messageHistory))
    messagesDiv.innerHTML = ""
  })

  if(messageHistory.length > 0) {
    messageHistory.forEach(({role, content}) => {
      displayChatMessage(content, role === "user" ? "question" : "answer", messagesDiv)
    })
  }
}
app()
