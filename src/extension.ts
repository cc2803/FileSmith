// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
type TemplateMap = Record<string, Record<string, string>>; // languageId -> templateName -> body

const defaultTemplates: TemplateMap = {
  cpp: {
    "Default main": [
      "#include <bits/stdc++.h>",
      "using namespace std;",
      "",
      "int main() {",
      "  ios::sync_with_stdio(false);",
      "  cin.tie(nullptr);",
      "",
      "  ${1:int t;} cin >> t;",
      "  while (t--) {",
      "    ${2:// your code here}",
      "  }",
      "",
      "  return 0;",
      "}"
    ].join("\n")
  },
  python: {
    "Default script": [
      "#!/usr/bin/env python3",
      "import sys",
      "input = sys.stdin.read",
      "data = input().split()",
      "",
      "index = 0",
      "${1:t} = int(data[index])",
      "index += 1",
      "",
      "for _ in range(t):",
      "  ${2:# your code here}",
      "",
      "${3:print('Hello World!')}"
    ].join("\n")
  }
};

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('filesmith.insertBoilerplate', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      const msg = vscode.window.showErrorMessage('No active editor found');
      return;
    }

    const languageId = editor.document.languageId;

    // 1. Gather templates (defaults + user)
    const config = vscode.workspace.getConfiguration('filesmith');
    const userTemplates = config.get<TemplateMap>('templates') || {};

    const langDefaults = defaultTemplates[languageId] || {};
    const langUser = userTemplates[languageId] || {};
    const langTemplates: Record<string, string> = { ...langDefaults, ...langUser };

    const templateNames = Object.keys(langTemplates);

    // 2. If none, offer to create one
    if (templateNames.length === 0) {
      const choice = await vscode.window.showQuickPick(
        [
          { label: '$(add) Create new template…', description: `No templates for ${languageId} yet` }
        ],
        { placeHolder: `No ${languageId} templates found` }
      );

      if (!choice) {
        return;
      }

	  await createTemplateFromCurrentFile(languageId, userTemplates);
      return;
    }

    // 3. Build QuickPick items: existing templates + "Create new"
    const items: vscode.QuickPickItem[] = [
      ...templateNames.map(name => ({
        label: name,
        description: `Use ${languageId} template`
      })),
      {
		label: '$(add) Create new template from current file…',
		description: `Use the entire content of this ${languageId} file as a template`
  	  }
    ];

    const picked = await vscode.window.showQuickPick(items, {
      placeHolder: `Choose a ${languageId} boilerplate or create a new one`
    });

    if (!picked) {
      return; // user cancelled
    }

    // 4. If "Create new from current file...", go to creation flow
	if (picked.label === '$(add) Create new template from current file…') {
	await createTemplateFromCurrentFile(languageId, userTemplates);
	return;
	}

    // 5. Otherwise, insert selected template
    const chosenName = picked.label;
    const templateBody = langTemplates[chosenName];

    if (!templateBody) {
      const msg = vscode.window.showErrorMessage(`Template "${chosenName}" not found for ${languageId}`);
      return;
    }

    const snippet = new vscode.SnippetString(templateBody);
    const success = await editor.insertSnippet(snippet, editor.selection.active);

    if (success) {
      const msg = vscode.window.showInformationMessage(`Boilerplate "${chosenName}" inserted. Use Tab to navigate.`);

    } else {
      const msg = vscode.window.showErrorMessage('Failed to insert boilerplate');

    }
  });

  context.subscriptions.push(disposable);
}


// This method is called when your extension is deactivated
export function deactivate() {}

async function createTemplateFromCurrentFile(
  languageId: string,
  allUserTemplates: TemplateMap
) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    const msg = vscode.window.showErrorMessage('No active editor found to capture template from.');
    return;
  }

  // Read the full content of the current file
  const doc = editor.document;
  const body = doc.getText();

  if (!body.trim()) {
    const msg = vscode.window.showWarningMessage('Current file is empty. Add some code before creating a template.');
    return;
  }

  // Ask for a template name
  const name = await vscode.window.showInputBox({
    prompt: `Name for new ${languageId} template (from current file)`,
    placeHolder: 'e.g. Competitive main, Flask app, Script boilerplate'
  });

  if (!name) {
    return;
  }

  const config = vscode.workspace.getConfiguration('filesmith');
  const langUser = allUserTemplates[languageId] || {};

  const updatedForLang = { ...langUser, [name]: body };
  const updatedAll: TemplateMap = { ...allUserTemplates, [languageId]: updatedForLang };

  // Save to workspace settings.json
  await config.update('templates', updatedAll, vscode.ConfigurationTarget.Workspace);

  const msg = vscode.window.showInformationMessage(
    `New ${languageId} template "${name}" saved from current file.`
  );
}

