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
  let currentDocument: vscode.TextDocument | undefined = undefined;
  let disposable = vscode.commands.registerCommand("extension.completeCode", async () => {
    // 'untitled' 스키마와 함께 새 문서 URI 생성
    const untitledUri = vscode.Uri.parse("untitled:" + path.join("SuggestedCode.sb"));

    // 새로 생성된 'untitled' 문서를 열기
    const document = await vscode.workspace.openTextDocument(untitledUri);
    const editor = await vscode.window.showTextDocument(document, {
      viewColumn: vscode.ViewColumn.Beside, // 새 창을 스플릿 뷰로 옆에 엽니다.
      preview: false, // 이 문서가 프리뷰 모드가 아니게 설정합니다.
    });

    // 편집기에서 코드 삽입
    await editor.edit((editBuilder) => {
      if (document.getText().length === 0) {
        editBuilder.insert(
          new vscode.Position(0, 0),
          'TextWindow.ForegroundColor = "Yellow"\nTextWindow.WriteLine("Hello World")\n'
        );
      }
    });
  });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
