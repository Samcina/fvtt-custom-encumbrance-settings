import { CONSTANTS } from './constants.js'
import { Logger, getSetting, registerSetting } from './utils.js'
import { register as registerEncumbrance, setConfig as setEncumbrance } from './encumbrance.js'
import { patchPrepareEncumbrance } from './patches/prepare-encumbrance.js'

/**
 * HOOKS
 */
Hooks.on('init', async () => {
    CONFIG.CUSTOM_ENCUMBRANCE_SETTINGS = deepClone(CONFIG.DND5E)

    registerSetting(
        CONSTANTS.DEBUG.SETTING.KEY,
        {
            scope: 'world',
            config: false,
            type: Boolean,
            default: false
        }
    )

    patchPrepareEncumbrance()
    registerEncumbrance()

    setEncumbrance(getSetting(CONSTANTS.ENCUMBRANCE.SETTING.KEY))

    Logger.debug(
        'Loading templates',
        [
            CONSTANTS.CONFIG.TEMPLATE.FORM,
            CONSTANTS.CONFIG.TEMPLATE.LIST,
        ]
    )

    loadTemplates([
        CONSTANTS.CONFIG.TEMPLATE.FORM,
        CONSTANTS.CONFIG.TEMPLATE.LIST,
    ])
})
