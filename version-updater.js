/**
 * Version updater for semantic versioning
 * Updates version numbers in various files
 */

const fs = require('fs');
const path = require('path');

function updateVersionInFile(filename, newVersion) {
  const filePath = path.resolve(filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`File ${filename} not found, skipping...`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;

  // Update Python files (app.py)
  if (filename.endsWith('.py')) {
    const versionRegex = /__version__\s*=\s*["']([^"']+)["']/;
    if (versionRegex.test(content)) {
      content = content.replace(versionRegex, `__version__ = "${newVersion}"`);
      updated = true;
    }
  }

  // Update Markdown files (readme.md)
  if (filename.endsWith('.md')) {
    const versionRegex = /Current Version:\s*\*\*([^*]+)\*\*/;
    if (versionRegex.test(content)) {
      content = content.replace(versionRegex, `Current Version: **${newVersion}**`);
      updated = true;
    }
  }

  // Update XML files (unraid-template.xml)
  if (filename.endsWith('.xml')) {
    const versionRegex = /<Version>([^<]+)<\/Version>/;
    if (versionRegex.test(content)) {
      content = content.replace(versionRegex, `<Version>${newVersion}</Version>`);
      updated = true;
    }
  }

  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated version in ${filename} to ${newVersion}`);
  } else {
    console.log(`No version found to update in ${filename}`);
  }
}

// Export for use with semantic-release
module.exports = {
  updateVersionInFile
};
