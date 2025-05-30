// scene-shortcuts.js
// Main module class for Scene Shortcuts

/**
 * Scene Shortcuts Module
 * Allows placing clickable shortcuts on scenes to navigate between them
 */
class SceneShortcuts {
    static MODULE_ID = 'scene-shortcuts';
    static TEMPLATE_PATH = `modules/${this.MODULE_ID}/templates/shortcut-form.html`;
    static DEFAULT_ICON = 'icons/svg/door-exit.svg';
    
    /**
     * Initialize the module
     */
    static init() {
        console.log(`${this.MODULE_ID} | Initializing Scene Shortcuts module`);
        
        // Load templates
        loadTemplates([this.TEMPLATE_PATH]);
        
        // Register settings
        this.registerSettings();
        
        // Add CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = `modules/${this.MODULE_ID}/styles/scene-shortcuts.css`;
        document.head.appendChild(link);
    }
    
    /**
     * Register module settings
     */
    static registerSettings() {
        // Add settings here if needed in the future
    }
    
    /**
     * Set up hooks
     */
    static registerHooks() {
        Hooks.on("getSceneControlButtons", this.getSceneControlButtons.bind(this));
        Hooks.on("refreshNote", this.onRefreshNote.bind(this));
    }
    
    /**
     * Add button to the scene controls
     * @param {Array} controls - The array of control buttons
     */
    static getSceneControlButtons(controls) {
        const notesLayer = controls.find(c => c.name === "notes");
        notesLayer.tools.push({
            name: "scene-shortcut-button",
            title: game.i18n.localize("SCENE-SHORTCUTS.Controls.Title"),
            icon: "fas fa-signs-post",
            button: true,
            active: false,
            onClick: this.toggleSceneShortcutTool.bind(this)
        });
    }
    
    /**
     * Toggle the shortcut tool on/off
     */
    static toggleSceneShortcutTool() {
        const tool = ui.controls.control.tools.find(t => t.name === "scene-shortcut-button");
        tool.active = !tool.active;
        
        ui.controls.render();
        
        if (tool.active) {
            canvas.stage.on("click", this.onSceneClick.bind(this));
        } else {
            canvas.stage.off("click", this.onSceneClick.bind(this));
        }
    }
    
    /**
     * Handle clicks on the canvas
     * @param {PIXI.InteractionEvent} event - The click event
     */
    static onSceneClick(event) {
        const position = event.data.getLocalPosition(canvas.stage);
        this.openSceneShortcutForm(position);
    }
    
    /**
     * Open the shortcut creation form
     * @param {Object} position - The x,y coordinates where the user clicked
     */
    static async openSceneShortcutForm(position) {
        const scenes = game.scenes.map(scene => {
            return {
                id: scene.id,
                name: scene.name
            };
        });
        
        const content = await renderTemplate(this.TEMPLATE_PATH, {
            posX: Math.round(position.x),
            posY: Math.round(position.y),
            scenes: scenes
        });
        
        const dialog = new Dialog({
            title: game.i18n.localize("SCENE-SHORTCUTS.Form.Title"),
            content: content,
            classes: ['scene-shortcuts-form'],
            buttons: {
                save: {
                    icon: '<i class="fas fa-save"></i>',
                    label: game.i18n.localize("SCENE-SHORTCUTS.Form.Save"),
                    callback: async html => {
                        const form = html.find("form")[0];
                        const data = {
                            title: form.title.value,
                            posX: parseInt(form.posX.value),
                            posY: parseInt(form.posY.value),
                            description: form.description.value,
                            imagePath: form.imagePath.value,
                            imageScale: parseFloat(form.imageScale.value),
                            sceneId: form.sceneId.value
                        };
                        
                        if (!data.imagePath) {
                            data.imagePath = this.DEFAULT_ICON;
                        }
                        await this.insertImageAtPosition(data);
                    }
                },
                cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: game.i18n.localize("SCENE-SHORTCUTS.Form.Cancel")
                }
            },
            default: "save",
            close: () => {
                const tool = ui.controls.control.tools.find(t => t.name === "scene-shortcut-button");
                if (tool && tool.active) {
                    tool.active = false;
                    ui.controls.render();
                    canvas.stage.off("click", this.onSceneClick.bind(this));
                }
            },
            render: html => {
                const filePicker = html.find(".file-picker");
                filePicker.click(event => {
                    const button = event.currentTarget;
                    const input = button.previousElementSibling;
                    const type = button.dataset.type;

                    new FilePicker({
                        type: type,
                        current: input.value === "" ? 'icons/svg/' : input.value,
                        callback: path => {
                            input.value = path;
                        }
                    }).browse();
                });
            }
        });
        
        dialog.render(true);
    }
    
    /**
     * Insert a shortcut note at the specified position
     * @param {Object} data - The shortcut data
     */
    static async insertImageAtPosition(data) {
        const scene = canvas.scene;
        
        if (!scene) {
            ui.notifications.error(game.i18n.localize("SCENE-SHORTCUTS.Notifications.NoActiveScene"));
            return;
        }
        
        try {
            const noteData = {
                entryId: null,
                x: data.posX,
                y: data.posY,
                iconSize: 100 * data.imageScale,
                text: data.title,
                textAnchor: CONST.TEXT_ANCHOR_POINTS.CENTER,
                textColor: "#FFFFFF",
                fontSize: 24,
                texture: {
                    src: data.imagePath,
                },
                flags: {
                    [this.MODULE_ID]: {
                        title: data.title,
                        description: data.description,
                        sceneId: data.sceneId
                    }
                }
            };
            
            const createdNotes = await scene.createEmbeddedDocuments("Note", [noteData]);
            
            canvas.notes.draw();
            
            if (createdNotes && createdNotes.length > 0) {
                const createdNote = createdNotes[0];
                this.registerNoteClickEvent(createdNote);
            }
            
            ui.notifications.info(game.i18n.format("SCENE-SHORTCUTS.Notifications.ShortcutCreated", {
                title: data.title,
                sceneName: scene.name
            }));
        } catch (error) {
            console.error("Error creating scene shortcut:", error);
            ui.notifications.error(game.i18n.localize("SCENE-SHORTCUTS.Notifications.ShortcutError"));
        }
    }
    
    /**
     * Register click event for a note
     * @param {Note} note - The note document
     */
    static registerNoteClickEvent(note) {
        // The refreshNote hook will handle this
    }
    
    /**
     * Handle note refresh events
     * @param {NoteObject} noteObject - The note object being refreshed
     */
    static onRefreshNote(noteObject) {
        const flags = noteObject.document.flags[this.MODULE_ID];
        if (flags) {
            this.setupClickHandler(noteObject);
        }
    }
    
    /**
     * Set up click handler for a note
     * @param {NoteObject} noteObject - The note object
     */
    static setupClickHandler(noteObject) {
        let lastClickTime = 0;
        
        noteObject.mouseInteractionManager.callbacks.clickLeft = (event) => {
            console.log(noteObject, event);
            event.stopPropagation();
            event.preventDefault();
            
            const now = Date.now();
            if (now - lastClickTime < 300) {
                this.handleNoteDoubleClick.call(noteObject, event);
            }
            lastClickTime = now;
        };
    }
    
    /**
     * Handle double-click on a note
     * @param {PIXI.InteractionEvent} event - The click event
     */
    static handleNoteDoubleClick(event) {
        const note = this.document;
        const flags = note.flags[SceneShortcuts.MODULE_ID];
        
        if (flags && flags.sceneId) {
            const targetScene = game.scenes.get(flags.sceneId);
            if (targetScene) {
                targetScene.view();
            } else {
                ui.notifications.error(game.i18n.localize("SCENE-SHORTCUTS.Notifications.SceneNotFound"));
            }
        }
    }
}

// Initialize the module
Hooks.once("init", () => SceneShortcuts.init());
Hooks.once("ready", () => SceneShortcuts.registerHooks());

export default SceneShortcuts;