// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// plz 'npm install' initial of cloneproject
import * as vscode from "vscode";
import * as path from "path";
import OpenAI from "openai";

// -- ChatGPT API Code --
const openai = new OpenAI({
  organization: "org-0TrPXmRKst6gFbo6R4CWll5c",
  apiKey: "YOUR_API_KEY",
});

// (Temporary) Fine Tuning Code
async function generativeAIcommunication(message: string) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a great smallbasic programming language developer. You can predict the next code well based on the written code.",
      },
      {
        role: "assistant",
        content:
          "You can make a complete sentence based on the already written code and the currently incomplete sentence structure. Please replace the part that says 'Expression' in context correctly.",
      },
      { role: "user", content: message },
    ],
    model: "gpt-3.5-turbo",
  });

  const response = completion.choices[0].message.content;
  return response;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // --- Webview Output Code ---
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
      const entireText = document.getText(); // 문서의 전체 내용(코드)을 가져온다.

      // 처리 메시지 표시(코드 생성 중)
      vscode.window.showInformationMessage("ChatGPT SmallBasic Completion is generating code...");

      const response = await generativeAIcommunication(entireText);

      await newEditor.edit((editBuilder) => {
        // 웹뷰의 기존 내용을 전부 삭제(초기화)
        const lastLine = newEditor.document.lineAt(newEditor.document.lineCount - 1);
        const range = new vscode.Range(new vscode.Position(0, 0), lastLine.range.end);
        editBuilder.delete(range);

        // 새롭게 받은 내용을 웹뷰에 출력
        editBuilder.insert(
          new vscode.Position(0, 0),
          "[입력한 코드]\n" + entireText + "\n\n" + "==\n\n" + "[제안된 코드]\n" + response
        );
      });

      // 처리 메시지 표시(코드 생성 완료)
      vscode.window.showInformationMessage("ChatGPT SmallBasic Completion has completed generating code!");
    }
  });
  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
