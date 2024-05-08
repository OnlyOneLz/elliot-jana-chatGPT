async function displayTextLetterByLetter(text, element, role) {
    // Function to remove <p> tag element labels from text
    const removePElementLabels = (str) => str.replace(/<p[^>]*>|<\/p>/gm, '');
  
    // Remove <p> tag element labels from the content
    const contentWithoutPTags = removePElementLabels(text);
  
    for (let i = 0; i < contentWithoutPTags.length; i++) {
      // Display slowly only if role is 'answer'
      if (role === 'answer') {
        await new Promise(resolve => setTimeout(() => {
          element.innerHTML += contentWithoutPTags.charAt(i);
          resolve();
        }, 20));
      } else {
        // Append the characters without delay
        element.innerHTML += contentWithoutPTags.charAt(i);
      }
    }
}

export default displayTextLetterByLetter