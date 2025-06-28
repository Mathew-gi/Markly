import { drawTextWithBold } from "./drawWithBold";

export function renderMarkdown(doc, text, startY = 40, lineHeight = 18) {
  const lines = text.split("\n");
  const maxWidth = doc.internal.pageSize.getWidth() - 80;
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginTop = 40;
  const marginBottom = 40;
  let y = startY;

  const ensureNewPage = () => {
    if (y + lineHeight > pageHeight - marginBottom) {
      doc.addPage();
      y = marginTop;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("# ")) {
      doc.setFontSize(18).setFont("Montserrat-Bold", "bold");
      ensureNewPage();
      doc.text(doc.splitTextToSize(line.slice(2), maxWidth), 40, y);
      y += lineHeight;
      doc.setFontSize(12).setFont("Montserrat-VariableFont_wght", "normal");
    } else if (line.startsWith("## ")) {
      doc.setFontSize(14).setFont("Montserrat-Bold", "bold");
      ensureNewPage();
      doc.text(doc.splitTextToSize(line.slice(3), maxWidth), 40, y);
      y += lineHeight;
      doc.setFontSize(12).setFont("Montserrat-VariableFont_wght", "normal");
    } else if (line.trim() === "---") {
      ensureNewPage();
      const lineY = y + lineHeight / 2;
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(40, lineY, maxWidth + 40, lineY);
      y += lineHeight * 2;
    } else if (/^\d+\.\s/.test(line)) {
      const match = line.match(/^(\d+)\.\s(.*)/);
      if (match) {
        const num = match[1];
        const content = match[2];
        const listLines = doc.splitTextToSize(content, maxWidth - 20);
        ensureNewPage();
        doc.text(`${num}. ${listLines[0]}`, 40, y);
        for (let j = 1; j < listLines.length; j++) {
          y += lineHeight;
          doc.text(`   ${listLines[j]}`, 40, y);
        }
        y += lineHeight;
      }
    } else if (line.startsWith("- ")) {
      const bullet = "• ";
      const content = line.slice(2);
      const listLines = doc.splitTextToSize(content, maxWidth - 10);
      ensureNewPage();

      y = drawTextWithBold(
        doc,
        `${bullet}${listLines[0]}`,
        40,
        y,
        maxWidth,
        0
      );
      for (let j = 1; j < listLines.length; j++) {
        y = drawTextWithBold(
          doc,
          `  ${listLines[j]}`,
          40,
          y,
          maxWidth,
          lineHeight
        );
      }
      y += lineHeight;
    } else if (line.includes("|")) {
      const cells = line
        .split("|")
        .map((c) => c.trim())
        .filter((c) => c !== "");
      const nextLine = lines[i + 1];
      const isTableDivider =
        nextLine &&
        /^(\s*\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?\s*)$/.test(nextLine);

      const colCount = cells.length;
      const colWidth = maxWidth / colCount;
      let x = 40;
      ensureNewPage();

      if (isTableDivider) {
        cells.forEach((cell, idx) => {
          doc.setFont("Montserrat-Bold", "bold").setFontSize(12);
          doc.text(cell, x + 2, y + 12);

          doc.setDrawColor(0);
          doc.setLineWidth(0.5);
          doc.rect(x, y, colWidth, lineHeight, "S");
          x += colWidth;
        });
        y += lineHeight;
        i++; 
      } else {

        cells.forEach((cell, idx) => {
          doc.setFont("Montserrat-VariableFont_wght", "normal").setFontSize(12);
          doc.text(cell, x + 2, y + 12);

          doc.setDrawColor(0);
          doc.setLineWidth(0.5);
          doc.rect(x, y, colWidth, lineHeight, "S");
          x += colWidth;
        });
        y += lineHeight;
      }
    }else if (line.trim() !== "") {
      ensureNewPage();
      y = drawTextWithBold(doc, line, 40, y, maxWidth, lineHeight);
    }
  }

  return y;
}
