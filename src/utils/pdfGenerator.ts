import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { Template } from "@/components/library/TemplateCard";

interface DocumentData {
  template: Partial<Template>;
  formData: {
    clientName: string;
    documentNumber: string;
    date: string;
    feeAmount: number;
    additionalDetails: string;
  };
  language: "en" | "gu";
}

/**
 * Helper function to wrap text to fit within a specified width
 */
function wrapText(text: string, maxWidth: number, font: { widthOfTextAtSize: (text: string, fontSize: number) => number }, fontSize: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);

    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Format date for display - Always use English for PDF
 */
function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Get document content based on category and language
 */
function getDocumentContent(
  category: string | undefined,
  language: "en" | "gu"
): string {
  if (category === "Affidavit") {
    return language === "en"
      ? "This affidavit is being made for identity verification purposes and all information provided is true and correct to the best of my knowledge."
      : "આ શપથપત્ર ઓળખ ચકાસણી હેતુ માટે બનાવવામાં આવી રહ્યું છે અને આપેલી બધી માહિતી મારા જ્ઞાન મુજબ સાચી અને સચોટ છે.";
  }

  if (category === "NOC") {
    return language === "en"
      ? "I hereby issue this No Objection Certificate (NOC) and confirm that I have no objection regarding the matter stated above."
      : "હું આ કોઈ વાંધો પ્રમાણપત્ર (NOC) જારી કરું છું અને પુષ્ટિ કરું છું કે ઉપર જણાવેલા મામલા પર મારો કોઈ વાંધો નથી.";
  }

  if (category === "Agreement") {
    return language === "en"
      ? "This agreement is made and entered into on the date mentioned above between the parties for the purpose stated."
      : "આ કરાર ઉપર જણાવેલી તારીખે કરાયો છે અને ઉદ્દેશ્ય માટે પક્ષો વચ્ચે પ્રવેશ્યો છે.";
  }

  return "";
}

/**
 * Generate PDF using pdf-lib and open it for printing
 */
export async function generateLegalPdf(data: DocumentData): Promise<void> {
  try {
    const pdfDoc = await PDFDocument.create();
    // A4 size in points: 595.28 x 841.89 (210mm x 297mm)
    const page = pdfDoc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();

    // Embed fonts
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    // Margins
    const marginLeft = 70.866; // 25mm in points (25mm = 70.866pt)
    const marginRight = 70.866;
    const marginTop = 85.039; // 30mm in points
    const marginBottom = 85.039;
    const contentWidth = width - marginLeft - marginRight;

    let currentY = height - marginTop;

    // Title - Use English for PDF as standard fonts don't support Unicode
    const title = data.template.name || "Document Title";

    const titleSize = 18;
    page.drawText(title, {
      x: marginLeft + (contentWidth - timesBoldFont.widthOfTextAtSize(title, titleSize)) / 2,
      y: currentY,
      size: titleSize,
      font: timesBoldFont,
      color: rgb(0, 0, 0),
    });
    currentY -= 35;

    // Document Number (centered below title)
    const docNoText = data.formData.documentNumber || "DOC-XXXX-XXXX";
    const docNoSize = 10;
    page.drawText(docNoText, {
      x: marginLeft + (contentWidth - timesRomanFont.widthOfTextAtSize(docNoText, docNoSize)) / 2,
      y: currentY,
      size: docNoSize,
      font: timesRomanFont,
      color: rgb(0.4, 0.4, 0.4),
    });
    currentY -= 40;

    // Draw line below header
    page.drawLine({
      start: { x: marginLeft, y: currentY },
      end: { x: width - marginRight, y: currentY },
      thickness: 1,
      color: rgb(0.7, 0.7, 0.7),
    });
    currentY -= 30;

    // Date (right aligned) - Using English format
    const dateText = `Date: ${formatDate(data.formData.date)}`;
    const dateSize = 11;
    const dateX = width - marginRight - timesRomanFont.widthOfTextAtSize(dateText, dateSize);
    page.drawText(dateText, {
      x: dateX,
      y: currentY,
      size: dateSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    currentY -= 40;

    // Opening statement - Always use English for PDF generation
    const opening = { prefix: "I, ", suffix: ", do hereby solemnly affirm and declare on oath as follows:" };
    const fontSize = 12;
    const lineHeight = 16;

    // Draw "I, " prefix
    page.drawText(opening.prefix, {
      x: marginLeft,
      y: currentY,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });

    // Draw client name (underlined) - Use ASCII-safe text
    const clientName = data.formData.clientName || "(Client Name)";
    const clientNameWidth = timesBoldFont.widthOfTextAtSize(clientName, fontSize);
    const clientNameX = marginLeft + timesRomanFont.widthOfTextAtSize(opening.prefix, fontSize);

    page.drawText(clientName, {
      x: clientNameX,
      y: currentY,
      size: fontSize,
      font: timesBoldFont,
      color: rgb(0, 0, 0),
    });

    // Draw underline for client name
    page.drawLine({
      start: { x: clientNameX, y: currentY - 2 },
      end: { x: clientNameX + clientNameWidth, y: currentY - 2 },
      thickness: 1.5,
      color: rgb(0, 0, 0),
    });

    // Draw suffix
    const suffixX = clientNameX + clientNameWidth + 5;
    const suffixText = opening.suffix;
    page.drawText(suffixText, {
      x: suffixX,
      y: currentY,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    currentY -= lineHeight * 2;

    // Document content based on category - Always use English for PDF
    const content = getDocumentContent(data.template.category, "en");
    if (content) {
      const contentLines = wrapText(content, contentWidth, timesRomanFont, fontSize);
      for (const line of contentLines) {
        page.drawText(line, {
          x: marginLeft,
          y: currentY,
          size: fontSize,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        currentY -= lineHeight;
      }
      currentY -= 10;
    }

    // Additional Details
    if (data.formData.additionalDetails) {
      currentY -= 20;
      
      // Draw line above additional details
      page.drawLine({
        start: { x: marginLeft, y: currentY },
        end: { x: width - marginRight, y: currentY },
        thickness: 1,
        color: rgb(0.7, 0.7, 0.7),
      });
      currentY -= 20;

      const detailsLabel = "Additional Details:"; // Using English for PDF
      page.drawText(detailsLabel, {
        x: marginLeft,
        y: currentY,
        size: fontSize,
        font: timesBoldFont,
        color: rgb(0, 0, 0),
      });
      currentY -= lineHeight;

      const detailsLines = wrapText(
        data.formData.additionalDetails,
        contentWidth,
        timesRomanFont,
        fontSize
      );
      
      // Use the current page variable, but track which page we're on
      let currentPage = page;
      
      for (const line of detailsLines) {
        // Check if we need a new page
        if (currentY < marginBottom + lineHeight) {
          currentPage = pdfDoc.addPage([595.28, 841.89]);
          currentY = 841.89 - marginTop;
        }
        currentPage.drawText(line, {
          x: marginLeft,
          y: currentY,
          size: fontSize,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        currentY -= lineHeight;
      }
    }

    // Fee Section
    if (data.formData.feeAmount > 0) {
      currentY -= 30;

      // Draw line above fee
      page.drawLine({
        start: { x: marginLeft, y: currentY },
        end: { x: width - marginRight, y: currentY },
        thickness: 1,
        color: rgb(0.7, 0.7, 0.7),
      });
      currentY -= 20;

      const feeLabel = data.language === "en" ? "Fee Amount:" : "Fee Amount:"; // Using English for now as Gujarati needs Unicode support
      const feeText = `${feeLabel} Rs. ${data.formData.feeAmount}`;
      page.drawText(feeText, {
        x: marginLeft,
        y: currentY,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
      currentY -= 40;
    }

    // Signature Section
    currentY -= 30;

    // Draw thick line above signature
    page.drawLine({
      start: { x: marginLeft, y: currentY },
      end: { x: width - marginRight, y: currentY },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    currentY -= 30;

    // Signature and Name side by side - Using English for PDF
    const signatureLabel = "Signature:";
    const nameLabel = "Name:";

    // Signature on left
    page.drawText(signatureLabel, {
      x: marginLeft,
      y: currentY,
      size: fontSize,
      font: timesBoldFont,
      color: rgb(0, 0, 0),
    });
    currentY -= 5;

    // Draw line for signature
    const signatureLineWidth = 150;
    page.drawLine({
      start: { x: marginLeft, y: currentY },
      end: { x: marginLeft + signatureLineWidth, y: currentY },
      thickness: 1.5,
      color: rgb(0, 0, 0),
    });
    currentY += 25;

    // Name on right
    page.drawText(nameLabel, {
      x: width - marginRight - 200,
      y: currentY,
      size: fontSize,
      font: timesBoldFont,
      color: rgb(0, 0, 0),
    });
    currentY -= 5;

    // Draw line and name text
    const nameText = data.formData.clientName || "(Client Name)";
    page.drawLine({
      start: { x: width - marginRight - 200, y: currentY },
      end: { x: width - marginRight - 200 + signatureLineWidth, y: currentY },
      thickness: 1.5,
      color: rgb(0, 0, 0),
    });

    // Draw name text below line
    currentY -= 18;
    page.drawText(nameText, {
      x: width - marginRight - 200,
      y: currentY,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    // Create a hidden iframe to load the PDF without opening a visible tab
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "-9999px"; // Move far off-screen instead of making it visible
    iframe.style.bottom = "-9999px";
    iframe.style.width = "1px";
    iframe.style.height = "1px";
    iframe.style.border = "none";
    iframe.style.opacity = "0";
    iframe.style.pointerEvents = "none";
    iframe.src = url;

    document.body.appendChild(iframe);

    // Helper function to download PDF as fallback
    const downloadPDF = () => {
      const link = document.createElement("a");
      link.href = url;
      link.download = `${(data.template.name || "Document").replace(/\s+/g, "_")}_${data.formData.documentNumber}.pdf`;
      link.click();
    };

    // Wait for PDF to load in iframe, then trigger print
    iframe.onload = () => {
      setTimeout(() => {
        try {
          // Try to print from iframe
          if (iframe.contentWindow) {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
          }
        } catch (error) {
          console.error("Error printing from iframe:", error);
          // Fallback: if iframe print fails, download the PDF
          downloadPDF();
        }
      }, 500);
    };

    // Fallback: if onload doesn't fire, try printing after a delay
    setTimeout(() => {
      try {
        if (iframe.contentWindow) {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        }
      } catch (error) {
        console.error("Error printing PDF (fallback):", error);
        // Fallback to download if print fails
        downloadPDF();
      }
    }, 1500);

    // Clean up iframe and URL after a delay (keep URL alive during print dialog)
    setTimeout(() => {
      if (iframe.parentNode === document.body) {
        document.body.removeChild(iframe);
      }
      // Revoke URL after a longer delay to ensure print dialog has time to work
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 10000); // 10 seconds should be enough for print dialog interaction
    }, 5000); // Remove iframe after 5 seconds, but keep URL for 10 more seconds
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}
