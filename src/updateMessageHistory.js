const updateMessageHistory = (data, role) => {
    messageHistory.push({
      role: role,
      content: data
    })
    localStorage.setItem("history", JSON.stringify(messageHistory))
  }

  export default updateMessageHistory