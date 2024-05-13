async function displayTextLetterByLetter(text, element, role) {
    // Function to remove <p> tag element labels from text
    // const removePElementLabels = (str) => str.replace(/<p[^>]*>|<\/p>/gm, '');

    // Remove <p> tag element labels from the content
    // const contentWithoutPTags = removePElementLabels(text);

    // for (let i = 0; i < contentWithoutPTags.length; i++) {
    //   // Display slowly only if role is 'answer'
    //   if (role === 'answer') {
    //     await new Promise(resolve => setTimeout(() => {
    //       element.innerHTML += contentWithoutPTags.charAt(i);
    //       resolve();
    //     }, 20));
    //   } else {
    //     // Append the characters without delay
    //     element.innerText += contentWithoutPTags.charAt(i);
    //   }
    // }

    element.innerHTML = text;
    if(role === "question") {return}

    element.childNodes.forEach((node) => {
      if(node.nodeType === Node.TEXT_NODE) {
        animateTextNode(node,20)
      } else if(node.nodeType === Node.ELEMENT_NODE) {
        console.log(node.tagName)
        animateElementNode(node, 20)
      }
    })
}

function animateTextNode(node, delay) {
  var text = node.textContent.trim(); // Get text content
  node.textContent = ""; // Clear the text content

  var i = 0;
  var interval = setInterval(function() {
      node.textContent += text.charAt(i); // Append each character
      i++;

      // Check if we have reached the end of the text
      if (i >= text.length) {
          clearInterval(interval);
      }
  }, delay);
}

function animateElementNode(node, delay) {
  // Iterate over each child node of the element
  node.childNodes.forEach(function(childNode) {
      if (childNode.nodeType === Node.TEXT_NODE) {
          animateTextNode(childNode, delay);
      } else if (childNode.nodeType === Node.ELEMENT_NODE) {
          // Recursively handle nested elements
          animateElementNode(childNode, delay);
      }
  });
}

export default displayTextLetterByLetter
