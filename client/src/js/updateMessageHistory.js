export const updateMessageHistory = (data, role, messageHistory) => {
  messageHistory.push({
    role: role,
    content: data,
  });
  console.log(messageHistory);
  localStorage.setItem("history", JSON.stringify(messageHistory));
};

export default updateMessageHistory;
