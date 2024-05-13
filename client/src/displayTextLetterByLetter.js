async function displayTextLetterByLetter(text, element, role) {
  // attach the text
  element.innerHTML = text;
  // return early for question; it doesn't need to be animated
  if (role === "question") { return }

  const nodes = element.childNodes
  const delay = 20

  // start animating the child nodes sequentially and return a promise
  return animateNodesRecursively(nodes, 0, delay);
}

function animateNodesRecursively(nodes, index, delay) {
  // Return a promise that resolves when all nodes are animated
  return new Promise((resolve, _) => {
    if (index >= nodes.length) {
      resolve(); // if all nodes are done, resolve and return.
      return;
    }
    // otherwise, animate the current node
    animateSingleNode(nodes[index], delay).then(() => {
      // after one node resolves, recursively call this function for the next in the list
      animateNodesRecursively(nodes, index + 1, delay).then(() => {
        resolve(); // Resolve the promise when all nodes are animated
      });
    });
  });
}

function animateSingleNode(node, delay) {
  return new Promise((resolve, _) => {
    if (node.nodeType === Node.TEXT_NODE) {
      animateTextNode(node, delay).then(() => {
        resolve(); // Resolve the promise when the text node is animated
      });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Handle element nodes
      animateElementNode(node, delay).then(() => {
        resolve(); // Resolve the promise when the element node is animated
      });
    } else {
      resolve(); // Resolve for other node types
    }
  });
}

function animateTextNode(node, delay) {
  return new Promise((resolve, _) => {
    const text = node.textContent.trim(); // Get text content
    node.textContent = ""; // Clear the text content

    let i = 0;
    const interval = setInterval(() => {
      node.textContent += text.charAt(i); // Append each character
      i++;

      // Check if we have reached the end of the text
      if (i >= text.length) {
        clearInterval(interval);
        resolve(); // Resolve the promise when the text is fully animated
      }
    }, delay);
  });
}


function animateElementNode(node, delay) {
  return new Promise((resolve, _) => {
    node.classList.add("visible")
    // Animate child nodes of the element
    animateNodesRecursively(node.childNodes, 0, delay).then(() => {
      resolve(); // Resolve the promise when all child nodes are animated
    });
  });
}

export default displayTextLetterByLetter
