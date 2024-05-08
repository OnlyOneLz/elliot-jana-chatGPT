const apiFetch = async (messageHistory) => {
  try {
    const response = await fetch(`http://localhost:4005/Api-fetch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messageHistory: messageHistory,
      }),
    });
    const data = await response.json();
    return { data: data, response: response };
  } catch (error) {
    console.error("Error adding message", error);
  }
};

export default apiFetch;
