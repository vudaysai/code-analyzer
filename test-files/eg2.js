const fs = require("fs");
const path = require("path");

// Abstract class for language syntax support
class LanguageSyntax {
  isComment(line) {
    throw new Error("Must implement isComment");
  }

  isBlank(line) {
    return line.trim() === "";
  }

  isCode(line) {
    return !this.isBlank(line) && !this.isComment(line);
  }

  isImport(line) {
    throw new Error("Must implement isImport");
  }

  isVariableDeclaration(line) {
    throw new Error("Must implement isVariableDeclaration");
  }
}

class JavaScriptSyntax extends LanguageSyntax {
  constructor() {
    super();
    this.inBlockComment = false;
  }

  isComment(line) {
    const trimmed = line.trim();

    if (this.inBlockComment) {
      if (trimmed.includes("*/")) {
        this.inBlockComment = false;
      }
      return true;
    }

    if (trimmed.startsWith("/*")) {
      this.inBlockComment = !trimmed.includes("*/");
      return true;
    }

    return trimmed.startsWith("//");
  }

  isImport(line) {
    const trimmed = line.trim();
    return (
      trimmed.startsWith("import ") ||
      trimmed.startsWith("require(") ||
      (trimmed.startsWith("const ") && trimmed.includes("require("))
    );
  }

  isVariableDeclaration(line) {
    const trimmed = line.trim();
    return (
      trimmed.startsWith("let ") ||
      trimmed.startsWith("const ") ||
      trimmed.startsWith("var ")
    );
  }
}

class JavaSyntax extends LanguageSyntax {
  constructor() {
    super();
    this.inBlockComment = false;
  }

  isComment(line) {
    const trimmed = line.trim();

    if (this.inBlockComment) {
      if (trimmed.includes("*/")) {
        this.inBlockComment = false;
      }
      return true;
    }

    if (trimmed.startsWith("/*")) {
      this.inBlockComment = !trimmed.includes("*/");
      return true;
    }

    return trimmed.startsWith("//");
  }

  isImport(line) {
    const trimmed = line.trim();
    return trimmed.startsWith("import ");
  }

  // TODO: Implementation
  isVariableDeclaration(line) {
    return 0;
  }
}

// Main analyzer class
class CodeAnalyzer {
  constructor(languageSyntax) {
    this.syntax = languageSyntax;
  }

  analyze(filePath) {
    // For large files, consider reading line by line using readline for better memory efficiency
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split(/\r?\n/);

    let blank = 0;
    let comments = 0;
    let imports = 0;
    let code = 0;
    let variables = 0;

    for (let line of lines) {
      if (this.syntax.isBlank(line)) blank++;
      else if (this.syntax.isComment(line)) {
        comments++;
      } else if (this.syntax.isImport(line)) {
        imports++;
        code++;
      } else if (this.syntax.isVariableDeclaration(line)) {
        variables++;
        code++;
      } else code++;
    }

    return {
      blank,
      comments,
      imports,
      code,
      variables,
      total: lines.length,
    };
  }
}

// Factory to select syntax handler based on file extension
function getSyntaxForExtension(extension) {
  switch (extension) {
    case ".js":
      return new JavaScriptSyntax();
    case ".java":
      return new JavaSyntax();
    // Add more language cases if needed
    default:
      throw new Error(`Unsupported file extension: ${extension}`);
  }
}

/*
    --- CLI Execution Check: Verifying if the file is run directly or required as a module ---
    To support analyzing multiple files in a source tree:
    1. Check if the input path is a directory using fs.statSync().isDirectory()
    2. If so, recursively collect all files with supported extensions (e.g., .js, .java) using fs.readdirSync()
    3. For each collected file, detect syntax via getSyntaxForExtension() and run analyze()
    4. Aggregate results (blank, comments, imports, code, total) across all files
    This approach enables directory-wide analysis rather than single-file only 
*/
if (require.main === module) {
  const filePath = process.argv[2];
  if (!filePath || !fs.existsSync(filePath)) {
    console.error("Please provide a valid source file path.");
    process.exit(1);
  }

  const fileExtension = path.extname(filePath);
  let syntax;

  try {
    syntax = getSyntaxForExtension(fileExtension);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }

  const analyzer = new CodeAnalyzer(syntax);
  const result = analyzer.analyze(filePath);

  console.log(`Blank: ${result.blank}`);
  console.log(`Comments: ${result.comments}`);
  console.log(`Imports: ${result.imports}`);
  console.log(`Variables: ${result.variables}`);
  console.log(`Code: ${result.code}`);
  console.log(`\nCode Analyzer`);
  console.log(`\nTotal: ${result.total}`);
}
