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
    const folderPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath; // 첫 번째 작업영역 폴더 경로 가져오기
    const untitledUri = vscode.Uri.parse("untitled:" + path.join("SuggestedCode.sb")); // 코드를 보여줄 제목이 지정되지 않은 문서에 대한 URI 생성
    const document = await vscode.workspace.openTextDocument(untitledUri); // URI에서 문서 열기 또는 만들기
    const userEditor = vscode.window.activeTextEditor; // 사용자가 '현재 작업 중인' 활성 텍스트 편집기 가져오기
    // 사용자가 '현재 작업 중인' 활성 텍스트 편집기 옆에 새 텍스트 문서(document, 임시로만든 SuggestedCode.sb 파일) 열기
    const newEditor = await vscode.window.showTextDocument(document, {
      viewColumn: vscode.ViewColumn.Beside,
      preview: false,
    });

    // 현재 작업영역이 열려있지 않다면 에러 메시지 출력
    if (!folderPath) {
      vscode.window.showErrorMessage("Workspace is not open");
      return;
    }

    // 사용자가 '현재 작업 중인' 활성 텍스트 편집기가 있다면 코드를 가져와서 ChatGPT API에 전달
    if (userEditor) {
      const document = userEditor.document;
      const entireText = document.getText(); // 문서의 전체 내용(코드)을 가져온다.

      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          cancellable: false,
        },
        async (progress) => {
          progress.report({ message: "ChatGPT SmallBasic Completion is generating code..." });
          const response = await generativeAIcommunication(entireText);
          progress.report({ message: "Updating editor now..." });

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

          progress.report({ message: "ChatGPT SmallBasic Completion has completed generating code!" });
          await new Promise((resolve) => setTimeout(resolve, 2000)); // 2초 동안 완료 메시지 출력
          return;
        }
      );
    }
  });
  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
