import { CONSTANTS, MODULE } from '../constants.js'
import { getSetting, setSetting, resetSetting } from '../utils.js'
import { CustomEncumbranceForm } from './custom-encumbrance-form.js'
import { setConfig } from '../encumbrance.js'

const itemClass = `${MODULE.ID}-item`
const listClass = `${MODULE.ID}-list`

export class EncumbranceForm extends CustomEncumbranceForm {
    constructor (...args) {
        super(args)

        this.metric = game.settings.get('dnd5e', 'metricWeightUnits') || false
        this.settingKey = CONSTANTS.ENCUMBRANCE.SETTING.KEY
        this.setting = getSetting(this.settingKey) || foundry.utils.deepClone(CONFIG.DND5E.encumbrance)
        this.setFunction = setConfig
        this.type = 'encumbrance'
    }

    static get defaultOptions () {
        return mergeObject(super.defaultOptions, {
            template: CONSTANTS.ENCUMBRANCE.TEMPLATE.FORM,
            title: game.i18n.localize('CUSTOM_ENCUMBRANCE_SETTINGS.form.encumbrance.title')
        })
    }

    async getData () {
        const data = this.setting
        data.metric = this.metric
        data.equippedItemWeightModifier = getSetting(CONSTANTS.ENCUMBRANCE.EQUIPPED_ITEM_WEIGHT_MODIFIER.SETTING.KEY)
        data.proficientEquippedItemWeightModifier = getSetting(CONSTANTS.ENCUMBRANCE.PROFICIENT_EQUIPPED_ITEM_WEIGHT_MODIFIER.SETTING.KEY)
        data.unequippedItemWeightModifier = getSetting(CONSTANTS.ENCUMBRANCE.UNEQUIPPED_ITEM_WEIGHT_MODIFIER.SETTING.KEY)

        return data
    }

    activateListeners (html) {
        super.activateListeners(html)
    }

    async _reset () {
        const reset = async () => {
            await Promise.all([
                setSetting(this.settingKey, CONFIG.CUSTOM_ENCUMBRANCE_SETTINGS[this.type]),
                resetSetting(CONSTANTS.ENCUMBRANCE.EQUIPPED_ITEM_WEIGHT_MODIFIER.SETTING.KEY),
                resetSetting(CONSTANTS.ENCUMBRANCE.PROFICIENT_EQUIPPED_ITEM_WEIGHT_MODIFIER.SETTING.KEY),
                resetSetting(CONSTANTS.ENCUMBRANCE.UNEQUIPPED_ITEM_WEIGHT_MODIFIER.SETTING.KEY)
            ])
            this.setFunction(CONFIG.CUSTOM_ENCUMBRANCE_SETTINGS[this.type])
            this.render(true)
        }

        const d = new Dialog({
            title: game.i18n.localize('CUSTOM_ENCUMBRANCE_SETTINGS.dialog.reset.title'),
            content: `<p>${game.i18n.localize('CUSTOM_ENCUMBRANCE_SETTINGS.dialog.reset.content')}</p>`,
            buttons: {
                yes: {
                    icon: '<i class="fas fa-check"></i>',
                    label: game.i18n.localize('CUSTOM_ENCUMBRANCE_SETTINGS.dialog.reset.yes'),
                    callback: async () => {
                        reset()
                    }
                },
                no: {
                    icon: '<i class="fas fa-times"></i>',
                    label: game.i18n.localize('CUSTOM_ENCUMBRANCE_SETTINGS.dialog.reset.no')
                }
            }
        })
        d.render(true)
    }

    async _updateObject (event, formData) {
        const ignore = ['equippedItemWeightModifier', 'proficientEquippedItemWeightModifier', 'unequippedItemWeightModifier']

        Object.entries(formData).forEach(([key, value]) => {
            if (ignore.includes(key)) return

            setProperty(this.setting, key, value)
        })

        await Promise.all([
            setSetting(this.settingKey, this.setting),
            setSetting(CONSTANTS.ENCUMBRANCE.EQUIPPED_ITEM_WEIGHT_MODIFIER.SETTING.KEY, formData.equippedItemWeightModifier),
            setSetting(CONSTANTS.ENCUMBRANCE.PROFICIENT_EQUIPPED_ITEM_WEIGHT_MODIFIER.SETTING.KEY, formData.proficientEquippedItemWeightModifier),
            setSetting(CONSTANTS.ENCUMBRANCE.UNEQUIPPED_ITEM_WEIGHT_MODIFIER.SETTING.KEY, formData.unequippedItemWeightModifier)
        ])
        this.setFunction(this.setting)
    }
}
