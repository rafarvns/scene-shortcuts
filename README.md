# Scene Shortcuts

![Foundry v12](https://img.shields.io/badge/foundry-v12-green)
![Latest Release](https://img.shields.io/github/v/release/rafarvns/scene-shortcuts?label=latest%20release)
![License](https://img.shields.io/github/license/rafarvns/scene-shortcuts)

## Overview

Scene Shortcuts is a lightweight and intuitive Foundry VTT module that allows you to place interactive icons directly on a scene's map. These icons act as shortcuts, letting players and GMs instantly transition to another scene with a single click.

Perfect for multi-room dungeons, world maps, or any setting where fast scene navigation enhances immersion and gameplay flow.

![Scene Shortcuts Demo](https://raw.githubusercontent.com/rafarvns/scene-shortcuts/main/docs/demo.gif)

## Features

- **Easy Navigation**: Add custom icons to any scene as teleport shortcuts
- **Simple Configuration**: Easily link icons to target scenes through a simple configuration menu
- **Visibility Control**: Supports GM-only or player-visible shortcut options
- **Customizable Appearance**: Fully customizable icon appearance and positioning
- **Multilingual Support**: Available in English, Portuguese (Brazil), and Spanish

## Installation

### Method 1: Foundry VTT Module Browser

1. Open the Foundry VTT setup screen
2. Go to the "Add-on Modules" tab
3. Click "Install Module"
4. Search for "Scene Shortcuts"
5. Click "Install"

### Method 2: Manual Installation

1. Download the [latest release](https://github.com/rafarvns/scene-shortcuts/releases/latest/download/module.zip)
2. Extract the zip file
3. Copy the extracted folder to your Foundry VTT `Data/modules/` folder
4. Restart Foundry VTT
5. Enable the module in your world's module settings

## Usage

### Creating a Scene Shortcut

1. Navigate to the scene where you want to place a shortcut
2. Click on the "Notes" control in the left toolbar
3. Click on the "Scene Shortcuts" button (dice icon)
4. Click anywhere on the canvas where you want to place the shortcut
5. Fill in the form:
   - **Shortcut Title**: Name for your shortcut
   - **Description**: Optional description
   - **Scene**: Select the target scene from the dropdown
   - **Image**: Choose an icon (defaults to a door icon if left blank)
   - **Image Scale**: Adjust the size of the icon
6. Click "Save"

### Using a Scene Shortcut

Double-click on any scene shortcut icon to instantly navigate to the linked scene.

## Configuration

Currently, the module doesn't require any special configuration. All settings are managed through the shortcut creation interface.

## Compatibility

- Tested with Foundry VTT v12
- Should work with most systems and modules

## Languages

Scene Shortcuts is available in:
- English
- Portuguese (Brazil)
- Spanish

## Support

If you encounter any issues or have suggestions for improvements, please [open an issue](https://github.com/rafarvns/scene-shortcuts/issues) on our GitHub repository.

## License

This module is licensed under the [MIT License](LICENSE).

## Credits

- Developed by [flamolino](https://github.com/rafarvns)
- Icon assets from [Game-icons.net](https://game-icons.net/)

## Changelog

See the [CHANGELOG.md](CHANGELOG.md) file for a detailed list of changes between versions.