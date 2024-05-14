async function displayTextLetterByLetter(text, element, role) {
  if (role === "question") {
    element.innerHTML = text;
    return;
  }

  // Attach the text to a temporary container so we can extract the nodes
  const temporaryDiv = document.createElement("div");
  temporaryDiv.style.display = "none";
  temporaryDiv.innerHTML = text;

  // Recursively animate each node
  await animateNodes(temporaryDiv.childNodes, element);

  temporaryDiv.parentNode.removeChild(temporaryDiv);
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
    const text = node.textContent;
    const intervalId = setInterval(() => {
      if (index < text.length) {
        textNode.textContent += text[index];
        index++;
      } else {
        clearInterval(intervalId);
        resolve();
      }
    }, 20); // Adjust the interval as needed for desired speed
  });
}

export default displayTextLetterByLetter;
