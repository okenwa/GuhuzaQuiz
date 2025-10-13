// Client-side parsers for PDF and DOCX into plain text

export async function parsePdfToText(file: File): Promise<string> {
  const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");
  // Use local worker file from public directory
  if (!(GlobalWorkerOptions as any).workerSrc) {
    (GlobalWorkerOptions as any).workerSrc = "/pdf.worker.min.js";
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise;

  let fullText = "";
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const strings = content.items
      .map((item: any) => (typeof item.str === "string" ? item.str : ""))
      .filter(Boolean);
    fullText += strings.join(" ") + "\n";
  }
  return normalizeWhitespace(fullText);
}

export async function parseDocxToText(file: File): Promise<string> {
  // Use browser build of mammoth
  const mammoth: any = await import("mammoth/mammoth.browser");
  const arrayBuffer = await file.arrayBuffer();
  // Convert to HTML in browser build, then strip tags
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const html: string = result?.value || "";
  const text = htmlToPlainText(html);
  return normalizeWhitespace(text);
}

function htmlToPlainText(html: string): string {
  // Basic tag stripping suitable for our short-term needs
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").replace(/\s\n/g, " ").trim();
}



