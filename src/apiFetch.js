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

  export default apiFetch