import config from '../config.js'

const app = () => {
    // Query Selectors
    const form = document.querySelector('.chat-form')
    const messagesDiv = document.querySelector("#chat-messages")

    const displayChatMessage =  (content, role) => {
      console.log(content)
      const thisMessage = document.createElement("div")
      thisMessage.classList.add(role)
      thisMessage.innerHTML = content 
      messagesDiv.appendChild(thisMessage)
    }

    // Functions
    const apiFetch = async () => {
        const formInput = document.getElementById('chat-input').value
        displayChatMessage(formInput + '?', "question")
        try {
            const response = await fetch(config.apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${config.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: formInput }]
                })
            })
            const data = await response.json()
            if(response.ok) {
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
    form.addEventListener('submit',async function (event) {
        event.preventDefault()
        const apiResponse = await apiFetch()
        displayChatMessage(apiResponse.choices[0].message.content, "answer")
    })

}
app()
