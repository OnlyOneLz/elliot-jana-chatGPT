export const createConversation = async (
  userId,
  conversationName,
  getChats
) => {
  try {
    const response = await fetch(`http://localhost:4000/conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        conversationName: conversationName,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      const lists = document.querySelector("#ul-chats");
      while (lists.firstChild) {
        lists.removeChild(lists.firstChild);
      }
      getChats();
    }
  } catch (error) {
    console.error("Error adding message", error);
  }
};

export default createConversation;
