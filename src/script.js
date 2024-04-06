import config from '../config.js'
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

const app = () => {
  // Query Selectors
  const form = document.querySelector('.chat-form')
  const formInput = document.getElementById('chat-input')
  const messagesDiv = document.querySelector("#chat-messages")

  // state
  const messageHistory = []

  // Functions
  const updateMessageHistory = (data, role) => {
    messageHistory.push({
      role: role,
      content: data
    })
  }

  const displayChatMessage = (content, role) => {
    const thisMessage = document.createElement("div")
    thisMessage.classList.add(role)
    thisMessage.innerHTML = content
    messagesDiv.appendChild(thisMessage)
  }

  const apiFetch = async () => {
    try {
      const response = await fetch(config.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: messageHistory
        })
      })
      const data = await response.json()
      if (response.ok) {
        console.log(data)
        return data
      } else {
        throw new Error
      }
    } catch (error) {
      console.log(error, 'Failed to fetch');
    }
  }

  // Event Listeners
  form.addEventListener('submit', async function (event) {
    event.preventDefault()
    const query = formInput.value
    displayChatMessage(query, "question")
    updateMessageHistory(query, "user")
    const apiResponse = await apiFetch()
    const messageContent = apiResponse.choices[0].message.content
    updateMessageHistory(messageContent, "assistant")
    displayChatMessage(marked.parse(messageContent), "answer")
  })
}
app()
