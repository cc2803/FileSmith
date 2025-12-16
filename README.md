# FileSmith ⚒️

FileSmith is a lightweight VS Code extension that helps you quickly insert **language-specific boilerplate code** using a fast, keyboard-driven workflow.

It’s built for developers who frequently start from the same skeletons — competitive programmers, script writers, and anyone bootstrapping projects.

---

## What it does

* Detects the language of the active file automatically
* Shows relevant boilerplate templates via a QuickPick menu
* Inserts templates as **interactive snippets** (tab through placeholders)
* Lets you create new templates directly from real code files

No snippet JSON pain. No escaping newlines.

---

## Key features

* **Single command**: `Filesmith: Insert Boilerplate`
* **Keyboard-first**: bind it to a shortcut and stay in flow
* **Language aware**: templates are scoped per `languageId`
* **Multiple templates per language**
* **Workspace or user-level templates**
* **Graceful UX** with friendly error handling

---

## Creating templates (recommended workflow)

1. Write your boilerplate in a normal source file (`.cpp`, `.py`, etc.)
2. Run **Filesmith: Insert Boilerplate**
3. Choose **Create new template from current file…**
4. Give it a name

That’s it — the file becomes a reusable template for that language.

---

## Snippet support

Templates use VS Code’s snippet syntax:

```text
${1:first placeholder}
${2:next placeholder}
```

After insertion, press `Tab` to jump between placeholders.

---

## Configuration

Templates are stored in settings:

```jsonc
"filesmith.templates": {
  "cpp": {
    "Default main": "/* code */",
    "My CP Template": "/* code */"
  },
  "python": {
    "Default script": "/* code */"
  }
}
```

They can live in:

* User settings (global)
* Workspace settings (`.vscode/settings.json`)

---

## Built with

* VS Code Extension API
* `vscode.SnippetString`
* QuickPick-based UI

---

FileSmith focuses on speed, simplicity, and working with **real code**, not configuration gymnastics.
