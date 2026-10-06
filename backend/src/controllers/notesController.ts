import { PDFParse } from "pdf-parse";

export const extractNotes = async (
  req: any,
  res: any
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const { mimetype, originalname, buffer } = req.file;
    const extension = originalname.toLowerCase().split(".").pop();

    let text = "";

    if (mimetype === "text/plain" || extension === "txt") {
      // Plain text — decode the buffer directly, nothing to parse.
      text = buffer.toString("utf-8");
    } else if (mimetype === "application/pdf" || extension === "pdf") {
      // Parse the PDF in memory — nothing is written to disk.
      const parser = new PDFParse({ data: buffer });

      try {
        const result = await parser.getText();
        text = result.text;
      } finally {
        await parser.destroy();
      }
    } else {
      return res.status(400).json({
        success: false,
        message:
          "Unsupported file type. Upload a .txt or .pdf file.",
      });
    }

    if (!text.trim()) {
      return res.status(422).json({
        success: false,
        message:
          "No selectable text was found. Scanned PDFs require OCR and cannot be extracted here.",
      });
    }

    res.json({
      success: true,
      filename: originalname,
      text,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to extract notes",
    });
  }
};
