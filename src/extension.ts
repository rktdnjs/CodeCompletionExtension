// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // console.log('Congratulations, your extension "hoho" is now active!');

  // --- Webview Example ---
  let currentDocument: vscode.TextDocument | undefined = undefined;
  let disposable = vscode.commands.registerCommand("extension.completeCode", async () => {
    const folderPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;

    if (!folderPath) {
      vscode.window.showErrorMessage("Workspace is not open");
      return;
    }

    const untitledUri = vscode.Uri.parse("untitled:" + path.join("SuggestedCode.sb"));
    const document = await vscode.workspace.openTextDocument(untitledUri);
    const editor = await vscode.window.showTextDocument(document, {
      viewColumn: vscode.ViewColumn.Beside,
      preview: false,
    });

    // 정보 메시지 표시 (지연 처리 포함)
    vscode.window.showInformationMessage("ChatGPT SmallBasic Completion is generating code...", "OK");

    setTimeout(async () => {
      await editor.edit((editBuilder) => {
        editBuilder.insert(
          new vscode.Position(0, 0),
          'TextWindow.ForegroundColor = "Yellow"\nTextWindow.WriteLine("Hello World")\n'
        );
      });
    }, 5000);
  });
  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
