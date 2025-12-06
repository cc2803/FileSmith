// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  	
	let disposable = vscode.commands.registerCommand('filesmith.insertBoilerplate', async () => {
		//Get active editor
		const editor = vscode.window.activeTextEditor;
	    if (!editor) {
    	vscode.window.showErrorMessage('No active editor found');
      	return;
    	}

		// Detect language ID
		const languageId = editor.document.languageId;
		vscode.window.showInformationMessage(`Detected language: ${languageId}`);
		
		//Define default templates
		const defaultTemplates: Record<string, string> = {
		'cpp': [
			'#include <bits/stdc++.h>',
			'using namespace std;',
			'',
			'int main() {',
			'  ios::sync_with_stdio(false);',
			'  cin.tie(nullptr);',
			'  ',
			'  int t; cin >> t;',
			'  while (t--) {',
			'    // your code here',
			'  }',
			'  ',
			'  return 0;',
			'}'
		].join('\\n'),

		'python': [
			'#!/usr/bin/env python3',
			'import sys',
			'input = sys.stdin.read',
			'data = input().split()',
			'',
			'index = 0',
			't = int(data[index])',
			'index += 1',
			'',
			'for _ in range(t):',
			'  # your code here',
			'',
			'# print("Hello World!")'
		].join('\\n')
		};

		// Get user config overrides
		const config = vscode.workspace.getConfiguration('filesmith');
		const userTemplates = config.get<Record<string, string>>('templates') || {};

		// Pick template (user override > default)
		const template = userTemplates[languageId] || defaultTemplates[languageId];
		
		if (!template) {
		vscode.window.showWarningMessage(`No boilerplate for language: ${languageId}`);
		return;
		}

		vscode.window.showInformationMessage(`Inserting ${languageId} boilerplate...`);
		// Phase 4 will insert this as snippet

		//Extension activity status Message
		vscode.window.showInformationMessage('Filesmith: Boilerplate command ready!');
    // TODO: Phase 3 will add real boilerplate logic here
  });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
