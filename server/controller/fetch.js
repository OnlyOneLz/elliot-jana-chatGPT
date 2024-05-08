const apiFetch = async (req, res) => {
  const messageHistory = req.body.messageHistory;
  try {
    const response = await fetch(process.env.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messageHistory,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      res.status(200).json({ success: true, data: data, response: response });
    } else {
      throw new Error();
    }
  } catch (error) {
    console.log(error, "Failed to fetch");
  }
};

module.exports = apiFetch;
