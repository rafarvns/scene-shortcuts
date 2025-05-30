# Changelog

All notable changes to the Scene Shortcuts module will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2023-05-30

### Fixed
- Fixed "Unexpected token 'export'" error by properly loading scene-shortcuts.js as an ES module

## [1.1.0] - 2023-05-29

### Added
- Multilingual support with translations for:
  - English
  - Portuguese (Brazil)
  - Spanish
- Comprehensive documentation (README.md)
- Changelog file
- MIT License

### Changed
- Refactored codebase to follow Foundry VTT module standards
- Organized code into a proper class structure
- Improved error handling and notifications
- Fixed scene navigation on double-click
- Updated module.json with proper metadata and manifest+ properties

### Fixed
- Double-click now properly navigates to the target scene
- Error messages are now properly localized

## [1.0.0] - 2023-05-01

### Added
- Initial release
- Basic functionality to create scene shortcuts
- Custom icon support
- Scene navigation via shortcuts
