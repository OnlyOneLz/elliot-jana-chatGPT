async function displayTextLetterByLetter(text, element, role) {
  if (role === "question") {
    element.innerHTML = text;
    return; // don't animate questions
  }

  // Attach the text to a temporary container so we can extract the nodes
  const temporaryDiv = document.createElement("div");
  temporaryDiv.style.display = "none";
  temporaryDiv.innerHTML = text;

  // Recursively animate each node
  await animateNodes(temporaryDiv.childNodes, element);

  // no need to delete temp div, as it was never appended to the DOM
}

async function animateNodes(nodes, parentElement) {
  for (const node of nodes) {
    await animateNode(node, parentElement);
  }
}

async function animateNode(node, parentElement) {
  if (node.nodeType === Node.TEXT_NODE) {
    await animateTextNode(node, parentElement);
  } else {
    const newNode = node.cloneNode(false);
    parentElement.appendChild(newNode);
    await animateNodes(node.childNodes, newNode);
  }
}

async function animateTextNode(node, parentElement) {
  const textNode = document.createTextNode("");
  parentElement.appendChild(textNode);

  return new Promise((resolve) => {
    let index = 0;
    const words = node.textContent.split(" ");
    const intervalId = setInterval(() => {
      if (index < words.length) {
        textNode.textContent = textNode.textContent + words[index] + " ";
        index++;
      } else {
        clearInterval(intervalId);
        resolve();
      }
    }, 50);
  });
}

export default displayTextLetterByLetter;
