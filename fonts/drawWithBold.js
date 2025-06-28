export function drawTextWithBold(doc, text, x, y, maxWidth, lineHeight) {
    const regex = /(\*\*([^*]+)\*\*)/g;
    let lastIndex = 0;
    let currentX = x;
    let initialY = y;
  
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const normalText = text.slice(lastIndex, match.index);
        const splitNormal = doc.splitTextToSize(normalText, maxWidth - (currentX - x));
        splitNormal.forEach((line, idx) => {
          if (idx === 0) {
            doc.setFont("Montserrat-VariableFont_wght", "normal");
            doc.text(line, currentX, y);
            currentX += doc.getTextWidth(line);
          } else {
            y += lineHeight;
            currentX = x;
            doc.text(line, currentX, y);
            currentX += doc.getTextWidth(line);
          }
        });
      }
  
      const boldText = match[2];
      const splitBold = doc.splitTextToSize(boldText, maxWidth - (currentX - x));
      splitBold.forEach((line, idx) => {
        if (idx === 0) {
          doc.setFont("Montserrat-Bold", "bold");
          doc.text(line, currentX, y);
          currentX += doc.getTextWidth(line);
        } else {
          y += lineHeight;
          currentX = x;
          doc.text(line, currentX, y);
          currentX += doc.getTextWidth(line);
        }
      });
  
      lastIndex = regex.lastIndex;
    }
  
    if (lastIndex < text.length) {
      const normalText = text.slice(lastIndex);
      const splitNormal = doc.splitTextToSize(normalText, maxWidth - (currentX - x));
      splitNormal.forEach((line, idx) => {
        if (idx === 0) {
          doc.setFont("Montserrat-VariableFont_wght", "normal");
          doc.text(line, currentX, y);
          currentX += doc.getTextWidth(line);
        } else {
          y += lineHeight;
          currentX = x;
          doc.text(line, currentX, y);
          currentX += doc.getTextWidth(line);
        }
      });
    }
  
    return y + lineHeight;
  }
  