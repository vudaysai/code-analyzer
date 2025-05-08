# Code Analyzer

A node.js script for analyzing code files and extracting metrics like blank lines, comments, imports, variable declarations and total code lines. Currently supports **JavaScript** and **Java** files.

## Features:
- **Blank Lines**: Counts blank lines.
- **Comments**: Detects single-line (`//`) and multi-line (`/*...*/`) comments.
- **Imports**: Detects `import` statements and `require` in JavaScript.
- **Variable Declarations**: Detects `let`, `const`, and `var` in JavaScript (Java implementation pending).
- **Code Lines**: Counts actual code lines excluding comments, imports, and variable declarations.

### Supported Languages:
- **JavaScript (.js)**: Full support for comments, imports, and variable declarations.
- **Java (.java)**: Supports comments and imports (variable declaration detection is pending).

## Prerequisite:
- **Node.js** must be installed on your system.

## Usage:
1. Clone the repo and navigate to the project folder.
2. Place the source code files you want to analyze inside the `test-files` folder.
3. Run the analyzer:
    ```bash
    node analyzer.js test-files/<file-name>
    ```
### Example:

To analyze a `eg1.java` file located in the `test-files` folder:
```bash
node analyzer.js test-files/eg1.java
```
### Sample Output:
```bash
Blank: 3
Comments: 3
Imports: 1
Variables: 0
Code: 6

Code Analyzer

Total: 12
```

## Pending Features:
- Variable declaration detection for **Java** files.
- Support for more languages (e.g., C, C++) can be added by extending the `LanguageSyntax` class.
- Support for analyzing multiple files in a source tree
