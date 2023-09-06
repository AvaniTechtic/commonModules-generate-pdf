const express = require('express');
const PDFDocument = require('pdfkit');
const puppeteer = require('puppeteer');
const fs = require('fs');

const router = express.Router();

// Define a route for generating a PDF
router.get('/generate-pdf', (req, res) => {
  // Create a new PDF document
  const doc = new PDFDocument();

  // Set the response headers for a PDF file
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="example.pdf"');

  // Pipe the PDF content to the response stream
  doc.pipe(res);

  // Add content to the PDF
  doc.fontSize(16).text('Hello, this is your PDF content!', 100, 100);

  // End of the document
  doc.end();
});

// Define a route for generating a PDF with a table
router.get('/generate-pdf-with-table', async (req, res) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage({headless: true});
  
      // Define the HTML content with a table
      const htmlContent = `
        <html>
        <head>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <h1>Table Example</h1>
          <table>
            <thead>
              <tr>
                <th>Header 1</th>
                <th>Header 2</th>
                <th>Header 3</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Row 1, Cell 1</td>
                <td>Row 1, Cell 2</td>
                <td>Row 1, Cell 3</td>
              </tr>
              <tr>
                <td>Row 2, Cell 1</td>
                <td>Row 2, Cell 2</td>
                <td>Row 2, Cell 3</td>
              </tr>
              <tr>
                <td>Row 3, Cell 1</td>
                <td>Row 3, Cell 2</td>
                <td>Row 3, Cell 3</td>
              </tr>
            </tbody>
          </table>
        </body>
        </html>
      `;
  
      // Set the response headers for a PDF file
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="table-example.pdf"');
  
      // Generate PDF from HTML content
      await page.setContent(htmlContent);
      await page.pdf({ format: 'A4', printBackground: true }).then((pdf) => {
        res.send(pdf);
      });
  
      // Close the browser
      await browser.close();
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while generating the PDF.');
    }
  });

module.exports = router