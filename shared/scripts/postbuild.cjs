const fs = require('fs');
const path = require('path');

// Recursively process all .cjs files
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.cjs')) {
      // Read the file
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Replace require statements to add .cjs extension
      content = content.replace(/require\("([^"]*?)(?<!\.cjs)"\)/g, 'require("$1.cjs")');
      
      // Write back
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Updated ${filePath}`);
    }
  });
}

processDirectory('./dist/cjs');
console.log('✓ Post-build processing complete');
