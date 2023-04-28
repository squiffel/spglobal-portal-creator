// Get the width of the text
function getTextWidth(text, fontSize, letterSpacing) {
  // Start the width as 0
  let width = 0;
  ctx.font = `${fontWeight} ${fontSize}px Akkurat LL`;

  // Measure all the words combined with spaces
  for (let i = 0; i < text.length; i++) {
    width += ctx.measureText(text[i]).width + letterSpacing;
  }

  return width;
}

// Check if ONE word is wider than the container
function isAnyWordWiderThanRect(words) {
  return words.some(
    (word) => getTextWidth(word, fontSize, letterSpacing) > rectWidth
  );
}

function fitText() {
  let lines = [];
  //let words = text.split(" ");
  let words = text
    .split(/((?:S&P Global)|\s+|[\n\r]|[\u00A9\u00AE\u2122])/)
    .filter((w) => w.length > 0);

  // If ONE word is wider than the container shrink the font size until it fits
  while (isAnyWordWiderThanRect(words)) {
    fontSize -= 1;
  }

  // First word in current line
  let currentLine = words[0];

  // Go through all the words in the sentence
  for (let i = 1; i < words.length; i++) {
    // Get the next word in the string
    const word = words[i];

    // Check if the word contains a newline or return character
    if (word.includes("\n") || word.includes("\r")) {
      const [beforeSpecialChar, afterSpecialChar] = word.split(/[\n\r]/, 2);

      // Add the part before the special character to the current line and push it to lines array
      const lineBeforeSpecialChar = currentLine + " " + beforeSpecialChar;
      lines.push(lineBeforeSpecialChar);

      // Move the remaining text after the special character to a new line
      currentLine = afterSpecialChar;
    } else {
      // Add word to the current string of words
      const newLine = currentLine + " " + word;

      // Check if the combined words are less than the width of the container
      if (getTextWidth(newLine, fontSize, letterSpacing) <= rectWidth) {
        currentLine = newLine; // Update the current line
      } else {
        // If the word doesn't fit on this line, move it to the start of the next line
        lines.push(currentLine);
        currentLine = word;
      }
    }
  }

  // Create an array where the lines are sorted by whether they fit horizontally in the available space. Text wrap.
  lines.push(currentLine);

  // Check if the resulting lines fit in the container vertically, if not make the font smaller and recursively start the process again.
  if (lines.length * fontSize * lineHeight > rectHeight) {
    fontSize -= 1;
    return fitText();
  }

  return lines;
}
