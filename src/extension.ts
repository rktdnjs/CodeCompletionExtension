// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // console.log('Congratulations, your extension "hoho" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  // let disposable = vscode.commands.registerCommand("extension.helloWorld", () => {
  //   // The code you place here will be executed every time your command is executed
  //   // Display a message box to the user
  //   vscode.window.showInformationMessage("Hello World from hoho!");
  // });
  // context.subscriptions.push(disposable);

  // --- Webview Example ---

  // Track the current panel with a webview
  let currentPanel: vscode.WebviewPanel | undefined = undefined;

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.completeCode", () => {
      const columnToShowIn = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
      // Create and show a new webview using split view
      const panel = vscode.window.createWebviewPanel(
        "SuggestedCompletedCode", // Identifies the 'type' of the webview. Used internally
        "Suggested Completed Code", // Title of the panel displayed to the user
        columnToShowIn ? vscode.ViewColumn.Beside : vscode.ViewColumn.One, // Editor column to show the new webview panel in.
        {
          enableScripts: true, // Webview options. More on these later.
        }
      );

      // 웹뷰 콘텐츠 설정
      panel.webview.html = `
      <html>
      <head>
        <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.5.0/styles/default.min.css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.5.0/highlight.min.js"></script>
        <script>hljs.initHighlightingOnLoad();</script>
        <style>
          body { padding: 10px; }
          pre { background-color: #F9F9F9; padding: 5px; }
        </style>
      </head>
      <body>
        <h1>Suggested Complete Code</h1>
        <pre><code class="smallbasic">TextWindow.ForegroundColor = "Yellow"\nTextWindow.WriteLine("Hello World")</code></pre>
      </body>
      </html>`;
    })
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
