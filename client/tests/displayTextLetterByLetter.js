// import { test } from "./test-helpers";
// import displayChatMessage from "../src/displayChatMessage";
// import { notEqual } from "./test-helpers";
import displayTextLetterByLetter from "../src/displayTextLetterByLetter.js";

// test('removePElementLabels function removes <p> tags from text', () => {
//     const input = '<p>This is a test.</p>';
//     const expectedOutput = 'This is a test.';
//     const output = removePElementLabels(input);
//     equal(output, expectedOutput, 'Should remove <p> tags from text');
//   });

const content = `<p>This is the first paragraph of my example. It contains some  text.</p>

<p>This is the second paragraph. Here's a list of items:</p>

<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>

<p>And here's a numbered list:</p>

<ol>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</ol>

<p><a href="https://www.google.com">Link to Google</a></p>

<p>Finally, here's a third paragraph.</p>`

console.log("in the test")

const messages = document.getElementById("chat-messages")

const thisMessage = document.createElement("div");
console.log(thisMessage)
thisMessage.classList.add("message","answer");
messages.appendChild(thisMessage)
displayTextLetterByLetter(content,thisMessage,"answer")
