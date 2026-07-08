const fs = require('fs');
const path = require('path');

// Recursively process all .js files in esm directory
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.js')) {
      // Read the file
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Replace import/export statements to add .js extension
      // Replace from "./path" with from "./path.js" (for relative imports only)
      content = content.replace(/from ["'](\.[^"']*?)(?<!\.js)["']/g, 'from "$1.js"');
      
      // Write back
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Updated ${filePath}`);
    }
  });
}

processDirectory('./dist/esm');
console.log('✓ ESM post-build processing complete');
