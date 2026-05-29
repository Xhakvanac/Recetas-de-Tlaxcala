const fs = require('fs');

const htmlContent = fs.readFileSync('cocina_tlaxcaltecav4.html', 'utf-8');
const styleMatch = htmlContent.match(/<style>([\s\S]*?)<\/style>/);

if (styleMatch) {
  fs.writeFileSync('frontend/src/index.css', styleMatch[1]);
  console.log('CSS extracted successfully.');
} else {
  console.log('No style tag found.');
}
