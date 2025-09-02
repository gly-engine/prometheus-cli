const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'vendor', 'prometheus', 'src');
const destinationDir = path.join(__dirname, '..', 'build');

const replacements = [
  {
    files: ['prometheus/randomStrings.lua'],
    from: /local\s*Ast,\s*utils\s*=\s*require\("prometheus\.ast"\),\s*require\("prometheus\.util"\);/,
    to: 'local Ast = require("prometheus.ast")\nlocal utils = require("prometheus.util")'
  },
  {
    files: ['prometheus/bit.lua'],
    from: /require/g,
    to: 'non_require'
  },
  {
    from: /"--/g,
    to: '"\\045\\045'
  }
];

function processDirectory(source, destination) {
  fs.mkdirSync(destination, { recursive: true });

  const entries = fs.readdirSync(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      processDirectory(sourcePath, destinationPath);
    } else if (entry.isFile()) {
      let content = fs.readFileSync(sourcePath, 'utf8');

      const relativePath = path.relative(sourceDir, sourcePath);

      const replacementsForFile = replacements.filter(rep => !rep.files || rep.files.includes(relativePath));

      for (const replacement of replacementsForFile) {
        content = content.replace(replacement.from, replacement.to);
      }

      fs.writeFileSync(destinationPath, content, 'utf8');
    }
  }
}

processDirectory(sourceDir, destinationDir);
