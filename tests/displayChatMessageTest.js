import { test } from "./test-helpers";
import displayChatMessage from "../src/displayChatMessage";
import { notEqual } from "./test-helpers";
// We want to test that it creates a div on the page

test("create div", () => {
  const messagesDiv = document.getElementById("chat-messages");
  const beforeValue = messagesDiv.children.length
  displayChatMessage('Whats the time?', 'question', messagesDiv);
  const afterValue = messagesDiv.children.length
  notEqual(afterValue, beforeValue + 1)
});

// We want to test that it adds the classlist question and answer
// We want to test that it sets the inner html of message title to 'you' and 'chatGbt'
// We want to test that it appends child messageTitle and this.message to meaasgesDiv
