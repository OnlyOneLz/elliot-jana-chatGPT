import { test } from "./test-helpers.js";
import displayChatMessage from "../src/displayChatMessage.js";
import { equal } from "./test-helpers.js";
// We want to test that it creates a div on the page
// We want to test that it appends child messageTitle and this.message to meaasgesDiv

test("create div", () => {
  const messagesDiv = document.getElementById("chat-messages");
  const beforeValue = messagesDiv.children.length;
  displayChatMessage("Whats the time?", "question", messagesDiv);
  const afterValue = messagesDiv.children.length;
  equal(afterValue, beforeValue + 1);
  // check that tagName === "DIV" on the last child
  equal(messagesDiv.children[1].tagName, "DIV");
});

// We want to test that it sets the inner html of message title to 'you' and 'chatGbt'
// We want to test that it adds the classlist question and answer
test("creates a h2 with the correct title", () => {
  const messagesDiv = document.getElementById("chat-messages");
  displayChatMessage("Whats the time?", "question", messagesDiv);
  const messageTitle = document.querySelector(".question");
  equal(messageTitle.innerHTML, "You");
  displayChatMessage("20:48", "answer", messagesDiv);
  const messageTitleAnswer = document.querySelector(".answer");
  equal(messageTitleAnswer.innerHTML, "Chat GPT");
});
