import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import updateMessageHistory from "../js/updateMessageHistory.js";
import apiFetch from "../js/apiFetch.js";
import displayChatMessage from "../js/displayChatMessage.js";
import displayOldChatMessage from "../js/displayOldChatMessage.js";
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
  const logoutBtn = document.getElementById("logout-btn");
  const submitBtn = document.getElementById("submit-btn");

  // Get Token
  const hash = window.location.hash;
  const token = hash.split("=")[1]
    ? hash.split("=")[1]
    : localStorage.getItem("token");
  localStorage.setItem("token", token);

  // Variables
  const userId = await getUser(token);
  let firstTitle = false;
  let conversationId = false;
  let loading = false;

  // State
  let messageHistory = localStorage.getItem("history")
    ? JSON.parse(localStorage.getItem("history"))
    : [];

  // Functions
  const setLoading = (loading) => {
    const spinner = submitBtn.querySelector(".spinner");

    if (loading) {
      submitBtn.style.backgroundImage = "none";
      spinner.style.display = "inline-block"; // Show spinner
    } else {
      submitBtn.style.backgroundImage =
        'url("../assets/images-removebg-preview.png")';
      spinner.style.display = "none"; // Hide spinner
    }
  };

  const clearChat = async () => {
    messageHistory = [];
    localStorage.setItem("history", JSON.stringify(messageHistory));
    messagesDiv.innerHTML = "";
    formInput.value = "";
    chatLabel.innerHTML = "Ask Away...";
  };

  const createNewChat = async (query) => {
    const messageTitle = query;
    createConversation(userId, messageTitle);
    firstTitle = false;
    formInput.min = 0;
    clearChat();
  };

  // API Calls
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
      data.messages.forEach((message) => {
        updateMessageHistory(
          message.message,
          message.role === "question" ? "user" : "assistant",
          messageHistory
        );
        displayOldChatMessage(
          message.role === "question"
            ? message.message
            : marked.parse(message.message),
          message.role === "question" ? "question" : "answer",
          messagesDiv
        );
      });
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
      if (response.status === 401) {
        window.location.href =
          "http://127.0.0.1:5500/client/src/html/login.html#";
      } else if (data.length > 0) {
        data.forEach((chat) => {
          const chats = document.createElement("li");
          chats.classList.add(`action-bar-li`);
          chats.id = `${chat._id}`;
          chats.innerHTML = `${chat.conversationName}`;
          actionBarUl.appendChild(chats);
          const binImg = document.createElement("img");
          binImg.src = "../assets/dummy-removebg-preview copy 5.png";
          binImg.classList.add("bin-btn");
          chats.appendChild(binImg);
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
      await fetch(`http://localhost:4000/messages/${conversationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteConversationWithMesssages = async (conversationId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/conversations/${conversationId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        console.log("Deleted conversation");
      }
      const messageHistory = localStorage.getItem("history");
      if (messageHistory && messageHistory.length > 0) {
        const response2 = await fetch(
          `http://localhost:4000/messages/${conversationId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response2.ok) {
          console.log("Deleted Messages");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  await getChats();

  // Event Listeners
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (!loading) {
      loading = true;
      setLoading(loading);

      const query = formInput.value;
      const conversationId = localStorage.getItem("conversationId");
      if (firstTitle) {
        await createNewChat(query);
      } else {
        formInput.value = "";
        displayChatMessage(query + "?", "question", messagesDiv);
        updateMessageHistory(query, "user", messageHistory);
        const apiResponse = await apiFetch(messageHistory);
        if (apiResponse) {
          const messageContent = apiResponse.data.choices[0].message.content;
          updateMessageHistory(messageContent, "assistant", messageHistory);
          displayChatMessage(
            marked.parse(messageContent),
            "answer",
            messagesDiv
          );
          newMessage("question", userId, conversationId, query + "?");
          newMessage("answer", userId, conversationId, messageContent);
        }
        loading = false;
        setLoading(loading);
      }
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
      "Enter chat name below to continue (at least 3 characters)";
    formInput.min = 3;
    formInput.placeholder = "Enter chat name";
  });

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("conversationId");
    localStorage.removeItem("history");
    window.location.href = "http://127.0.0.1:5500/client/src/html/login.html#";
  });

  document.addEventListener("click", (event) => {
    conversationId = localStorage.getItem("conversationId");
    if (conversationId) {
      const element = document.getElementById(conversationId);
      if (element) {
        element.style.backgroundColor = "#222";
      }
    }

    if (event.target.classList.contains("action-bar-li")) {
      clearChat();
      fetchMessages(event.target.id);
      localStorage.setItem("conversationId", event.target.id);
      event.target.style.backgroundColor = "#4a4949";
    }

    if (event.target.classList.contains("bin-btn")) {
      deleteConversationWithMesssages(event.target.parentElement.id);
      const chats = document.querySelectorAll(".action-bar-li");
      if (chats.length > 0) {
        const newChatId = chats[0].id;
        fetchMessages(newChatId);
        localStorage.setItem("conversationId", newChatId);
        const conversationHighlight = document.getElementById(newChatId);
        conversationHighlight.style.backgroundColor = "#4a4949";
      }
      clearChat();
    }
  });
};

app();
