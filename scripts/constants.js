export const MODULE = {
    ID: 'custom-encumbrance-settings',
    NAME: 'Custom Encumbrance Settings'
}

export const CONSTANTS = {
    CONFIG: {
        TEMPLATE: {
            FORM: 'modules/custom-encumbrance-settings/templates/config-form.hbs',
            LIST: 'modules/custom-encumbrance-settings/templates/config-list.hbs'
        }
    },
    DEBUG: {
        MENU: {
            KEY: 'debug-menu',
            HINT: 'CUSTOM_ENCUMBRANCE_SETTINGS.menu.debug.hint',
            ICON: 'fas fa-bug',
            LABEL: 'CUSTOM_ENCUMBRANCE_SETTINGS.menu.debug.label',
            NAME: 'CUSTOM_ENCUMBRANCE_SETTINGS.menu.debug.name'
        },
        FORM: {
            TITLE: 'CUSTOM_ENCUMBRANCE_SETTINGS.form.debug.title'
        },
        SETTING: {
            KEY: 'debug'
        },
        TEMPLATE: {
            FORM: 'modules/custom-dnd5e/templates/debug-form.hbs',
            IMPORT_DIALOG: 'modules/custom-dnd5e/templates/import-dialog.hbs'
        }
    },
    ENCUMBRANCE: {
        EQUIPPED_ITEM_WEIGHT_MODIFIER: {
            SETTING: {
                KEY: 'equipped-item-weight-modifier'
            }
        },
        PROFICIENT_EQUIPPED_ITEM_WEIGHT_MODIFIER: {
            SETTING: { KEY: 'proficient-equipped-item-weight-modifier'}
        },
        UNEQUIPPED_ITEM_WEIGHT_MODIFIER: {
            SETTING: {
                KEY: 'unequipped-item-weight-modifier'
            }
        },
        ID: 'encumbrance',
        MENU: {
            KEY: 'encumbrance-menu',
            HINT: 'CUSTOM_ENCUMBRANCE_SETTINGS.menu.encumbrance.hint',
            ICON: 'fas fa-pen-to-square',
            LABEL: 'CUSTOM_ENCUMBRANCE_SETTINGS.menu.encumbrance.label',
            NAME: 'CUSTOM_ENCUMBRANCE_SETTINGS.menu.encumbrance.name'
        },
        SETTING: {
            KEY: 'encumbrance'
        },
        TEMPLATE: {
            FORM: 'modules/custom-encumbrance-settings/templates/encumbrance-form.hbs'
        }
    },
    LANGUAGES: {
        ID: 'languages',
        MENU: {
            KEY: 'languages-menu',
            HINT: 'CUSTOM_ENCUMBRANCE_SETTINGS.menu.languages.hint',
            ICON: 'fas fa-pen-to-square',
            LABEL: 'CUSTOM_ENCUMBRANCE_SETTINGS.menu.languages.label',
            NAME: 'CUSTOM_ENCUMBRANCE_SETTINGS.menu.languages.name'
        },
        SETTING: {
            KEY: 'languages'
        }
    }
}
