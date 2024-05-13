// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";
import OpenAI from "openai";

const openai = new OpenAI({
  organization: 'org-0TrPXmRKst6gFbo6R4CWll5c',
  apiKey: 'API_KEY'
});

async function generativeAIcommunication(message: string) {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are a great smallbasic programming language developer. You can predict the next code well based on the written code." },
      { role: "assistant", content: "You can make a complete sentence based on the already written code and the currently incomplete sentence structure. Please replace the part that says 'Expression' in context correctly." },
      { role: "user", content: message }
    ],
    model: "gpt-3.5-turbo",
  });

  // console.log(completion.choices[0].message.content)
  const response = completion.choices[0].message.content;
  // console.log(response);
  return response;
}

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
    const untitledUri = vscode.Uri.parse("untitled:" + path.join("SuggestedCode.sb"));
    const document = await vscode.workspace.openTextDocument(untitledUri);
    const userEditor = vscode.window.activeTextEditor;
    const newEditor = await vscode.window.showTextDocument(document, {
      viewColumn: vscode.ViewColumn.Beside,
      preview: false,
    });

    if (!folderPath) {
      vscode.window.showErrorMessage("Workspace is not open");
      return;
    }

    if (userEditor) {
      const document = userEditor.document;
      const entireText = document.getText(); // 문서의 전체 내용을 가져옵니다.

      // 정보 메시지 표시 (지연 처리 포함)
      vscode.window.showInformationMessage("ChatGPT SmallBasic Completion is generating code...", "OK");

      const response = await generativeAIcommunication(entireText);
      console.log(response)
      

      setTimeout(async () => {
        await newEditor.edit((editBuilder) => {
          // 웹뷰의 기존 내용을 전부 삭제(초기화)
          const lastLine = newEditor.document.lineAt(newEditor.document.lineCount - 1);
          const range = new vscode.Range(new vscode.Position(0, 0), lastLine.range.end);
          editBuilder.delete(range);

          editBuilder.insert(
            new vscode.Position(0, 0),
            "[입력한 코드]\n" +
              entireText +
              "\n\n" +
              "==\n\n" +
              "[제안된 코드]\n" +
              response
          );
        });
      }, 5000);
    }
  });
  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
