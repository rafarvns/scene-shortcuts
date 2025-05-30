
const MODULE_ID = 'scene-shortcuts';
const TEMPLATE_PATH = `modules/${MODULE_ID}/templates/shortcut-form.html`;
const DEFAULT_ICON = 'icons/svg/door-exit.svg';

Hooks.once("init", () => {
    console.log(`${MODULE_ID} | Initializing Scene Shortcuts module`);

    loadTemplates([TEMPLATE_PATH]);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = `modules/${MODULE_ID}/styles/scene-shortcuts.css`;
    document.head.appendChild(link);
});

Hooks.on("getSceneControlButtons", controls => {
    console.log(controls);
    const tilesLayer = controls.find(c => c.name === "notes");
    tilesLayer.tools.push({
        name: "scene-shortcut-button",
        title: "Scene Shortcuts",
        icon: "fas fa-signs-post",
        button: true,
        active: false,
        onClick: toggleSceneShortcutTool
    });
});

function toggleSceneShortcutTool() {
    const tool = ui.controls.control.tools.find(t => t.name === "scene-shortcut-button");
    tool.active = !tool.active;

    ui.controls.render();

    if (tool.active) {
        canvas.stage.on("click", onSceneClick);
    } else {
        canvas.stage.off("click", onSceneClick);
    }
}

function onSceneClick(event) {
    const position = event.data.getLocalPosition(canvas.stage);

    openSceneShortcutForm(position);
}

async function openSceneShortcutForm(position) {
    const scenes = game.scenes.map(scene => {
        return {
            id: scene.id,
            name: scene.name
        };
    });

    const content = await renderTemplate(TEMPLATE_PATH, {
        posX: Math.round(position.x),
        posY: Math.round(position.y),
        scenes: scenes
    });

    const dialog = new Dialog({
        title: "Scene Shortcut",
        content: content,
        classes: ['scene-shortcuts-form'],
        buttons: {
            save: {
                icon: '<i class="fas fa-save"></i>',
                label: "Save",
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
                        data.imagePath = DEFAULT_ICON;
                    }
                    await insertImageAtPosition(data);
                }
            },
            cancel: {
                icon: '<i class="fas fa-times"></i>',
                label: "Cancel"
            }
        },
        default: "save",
        close: () => {
            const tool = ui.controls.control.tools.find(t => t.name === "scene-shortcut-button");
            if (tool && tool.active) {
                tool.active = false;
                ui.controls.render();
                canvas.stage.off("click", onSceneClick);
            }
        },
        render: html => {
            const filePicker = html.find(".file-picker");
            filePicker.click(event => {
                const button = event.currentTarget;
                const input = button.previousElementSibling;
                const type = button.dataset.type;
                const target = button.dataset.target;

                new foundry.applications.FilePicker({
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

async function insertImageAtPosition(data) {
    const scene = canvas.scene;

    if (!scene) {
        ui.notifications.error("Nenhuma cena está ativa atualmente.");
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
                [MODULE_ID]: {
                    title: data.title,
                    data: data,
                }
            }
        };

        const createdNotes = await scene.createEmbeddedDocuments("Note", [noteData]);

        canvas.notes.draw();

        if (createdNotes && createdNotes.length > 0) {
            const createdNote = createdNotes[0];
            registerNoteClickEvent(createdNote);
        }

        ui.notifications.info(`Nota "${data.title}" inserida na cena atual "${scene.name}".`);
    } catch (error) {
        console.error("Erro ao criar atalho de cena:", error, {err: JSON.stringify(error)}, error.message);
        ui.notifications.error("Falha ao criar atalho de cena. Veja o console para detalhes.");
    }
}

function registerNoteClickEvent(note) {
    console.log('Helloo!0');

    Hooks.once("refreshNote", (noteObject) => {
        if (noteObject.document.id === note.id) {
            setupClickHandler(noteObject);
        }
    });

    // Tenta aplicar o callback imediatamente, se a nota já estiver renderizada
    const noteObject = canvas.notes.placeables.find(n => n.document.id === note.id);
    if (noteObject) {
        setupClickHandler(noteObject);
    }
}

function setupClickHandler(noteObject) {
    let lastClickTime = 0;

    noteObject.mouseInteractionManager.callbacks.clickLeft = (event) => {
        event.stopPropagation();
        event.preventDefault();

        const now = Date.now();
        if (now - lastClickTime < 300) {
            handleNoteDoubleClick.call(noteObject, event);
        }
        lastClickTime = now;
    };
}

function handleNoteDoubleClick(event) {
    console.log('Helloo!2', event);
    const note = this.document;
    const flags = note.flags[MODULE_ID];

    if (flags) {
        console.log("Dados do clique:", flags);
    }
}
