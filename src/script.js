import config from '../config.js'

const app = () => {
    // Query Selectors
    const form = document.querySelector('.chat-form')

    // Functions
    const apiFetch = async () => {
        const formInput = document.getElementById('chat-input').value
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
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        const apiResponse = apiFetch()
    })

}
app()
