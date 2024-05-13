export const updateMessageHistory = (data, role, messageHistory) => {
  messageHistory.push({
    role: role,
    content: data,
  });
  localStorage.setItem("history", JSON.stringify(messageHistory));
};

export default updateMessageHistory;
