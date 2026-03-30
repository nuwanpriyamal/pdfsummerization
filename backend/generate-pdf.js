const PDFDocument = require('pdfkit');
const fs = require('fs');

const dir = './pdf';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

const doc = new PDFDocument();
doc.pipe(fs.createWriteStream('./pdf/test.pdf'));

doc.fontSize(25)
   .text('OpenClaw AI Demonstration Scenario', 100, 100);

doc.fontSize(14)
   .text('This is a test PDF document intended to be processed by OpenClaw AI.', 100, 150)
   .text('It contains sample text that outlines a project status report.', 100, 170)
   .text('', 100, 190)
   .text('Summary of constraints:', 100, 210)
   .text('- Budget is 20% over target.', 100, 230)
   .text('- Timeline needs to be extended by 2 weeks.', 100, 250);

doc.end();
console.log('PDF generated at ./pdf/test.pdf');
