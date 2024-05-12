import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import updateMessageHistory from "../js/updateMessageHistory.js";
import apiFetch from "../js/apiFetch.js";
import displayChatMessage from "../js/displayChatMessage.js";
import getUser from "../js/getUser.js";
import createConversation from "../js/createConversation.js";
import newMessage from "./newMessage.js";

const app = async () => {
  // Query Selectors
  const form = document.querySelector(".chat-form");
  const formInput = document.getElementById("chat-input");
  const chatLabel = document.querySelector(".chat-label");
  const messagesDiv = document.querySelector("#chat-messages");
  const clearButton = document.getElementById("clear");
  const actionBarUl = document.getElementById("ul-chats");
  const newChatBtn = document.querySelector(".new-chat");

  const hash = window.location.hash;
  const token = hash.split("=")[1];

  const userId = await getUser(token);

  let firstTitle = false;
  let conversationId = false;

  // Statements

  if (token) {
    localStorage.setItem("token", token);
  }

  // state
  let messageHistory = localStorage.getItem("history")
    ? JSON.parse(localStorage.getItem("history"))
    : [];

  // Functions

  const clearChat = async () => {
    messageHistory = [];
    localStorage.setItem("history", JSON.stringify(messageHistory));
    messagesDiv.innerHTML = "";
    formInput.value = "";
    chatLabel.innerHTML = "Ask Away...";
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/conversations/one/${chatId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      data.messages.map((message) => {
        updateMessageHistory(
          message.message,
          message.role === "question" ? "user" : "assistant",
          messageHistory
        );
        displayChatMessage(
          message.role === "question"
            ? message.message
            : marked.parse(message.message),
          message.role === "question" ? "question" : "answer",
          messagesDiv
        );
      });
      console.log(data);
    } catch (error) {
      console.error("Error adding message", error);
    }
  };

  const getChats = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/conversations/user/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      if (response.status === 401) {
        window.location.href =
          "http://127.0.0.1:5500/client/src/html/login.html#";
      } else {
        data.map((chat) => {
          const chats = document.createElement("li");
          chats.classList.add(`action-bar-li`);
          chats.id = `${chat._id}`;
          chats.innerHTML = `${chat.conversationName}`;
          actionBarUl.appendChild(chats);
        });
        if (!conversationId) {
          clearChat();
          await fetchMessages(data[0]._id);
          const conversationHighlight = document.getElementById(
            `${data[0]._id}`
          );
          conversationHighlight.style.backgroundColor = "#4a4949";
          localStorage.setItem("conversationId", data[0]._id);
        }
      }
      return data.userId;
    } catch (error) {
      console.error("Error adding message", error);
    }
  };

  const deleteMessages = async () => {
    const conversationId = localStorage.getItem("conversationId");
    try {
      const response = await fetch(
        `http://localhost:4000/messages/${conversationId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  await getChats();

  const createNewChat = async (query) => {
    const messageTitle = query;
    console.log(userId);
    createConversation(userId, messageTitle);
    firstTitle = false;
    formInput.min = 0;
    clearChat();
  };

  // Event Listeners
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const query = formInput.value;
    const conversationId = localStorage.getItem("conversationId");
    if (firstTitle) {
      createNewChat(query);
    } else {
      displayChatMessage(query + "?", "question", messagesDiv);
      updateMessageHistory(query, "user", messageHistory);
      const apiResponse = await apiFetch(messageHistory);
      const messageContent = apiResponse.data.choices[0].message.content;
      updateMessageHistory(messageContent, "assistant", messageHistory);
      displayChatMessage(marked.parse(messageContent), "answer", messagesDiv);
      newMessage("question", userId, conversationId, query + "?");
      newMessage("answer", userId, conversationId, messageContent);
    }
  });

  clearButton.addEventListener("click", async () => {
    clearChat();
    await deleteMessages();
  });

  newChatBtn.addEventListener("click", () => {
    firstTitle = true;
    clearChat();
    chatLabel.innerHTML =
      "Enter chat name below to comtinue (atleast 3 characters)";
    formInput.min = 3;
    formInput.placeholder = "Enter chat name ";
  });

  document.addEventListener("click", (event) => {
    conversationId = localStorage.getItem("conversationId");
    if (conversationId) {
      const conversationHighlight = document.getElementById(
        `${conversationId}`
      );
      console.log(conversationHighlight, "hello");
      conversationHighlight.style.backgroundColor = "rgba(18, 18, 18, 0.767)";
    }
    if (event.target.classList.contains("action-bar-li")) {
      clearChat();
      const chatId = event.target.id;
      console.log("Clicked chat ID:", chatId);
      fetchMessages(chatId);
      localStorage.setItem("conversationId", chatId);
      const conversationHighlight = document.getElementById(`${chatId}`);
      conversationHighlight.style.backgroundColor = "#4a4949";
    }
  });

  if (messageHistory.length > 0) {
    messageHistory.forEach(({ role, content }) => {
      displayChatMessage(
        content,
        role === "user" ? "question" : "answer",
        messagesDiv
      );
    });
  }
};

app();
