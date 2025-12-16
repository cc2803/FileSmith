# Change Log

All notable changes to the **FileSmith** extension will be documented in this file.

This project follows [Keep a Changelog](https://keepachangelog.com/)  
and adheres to [Semantic Versioning](https://semver.org/).

---

## [0.1.0] – 2025-12-16

### Added
- Initial release of FileSmith
- Command: `Filesmith: Insert Boilerplate`
- Automatic language detection using active editor `languageId`
- Built-in default templates for common languages (C++, Python)
- QuickPick-based template selection
- Support for multiple templates per language
- Ability to create templates from the current file
- Manual template creation option
- Snippet-style placeholders and tabstops
- Workspace and user-level template configuration
- Graceful handling of missing editor, empty files, and missing templates
