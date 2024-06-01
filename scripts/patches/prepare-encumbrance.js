import { MODULE, CONSTANTS } from '../constants.js'
import { getSetting } from '../utils.js'

export function patchPrepareEncumbrance () {
    if (game.modules.get('variant-encumbrance-dnd5e')?.active) return
    libWrapper.register(MODULE.ID, 'game.dnd5e.dataModels.actor.AttributesFields.prepareEncumbrance', prepareEncumbrancePatch, 'OVERRIDE')
}

function simplifyBonus(bonus, data={}) {
  if ( !bonus ) return 0;
  if ( Number.isNumeric(bonus) ) return Number(bonus);
  try {
    const roll = new Roll(bonus, data);
    return roll.isDeterministic ? Roll.safeEval(roll.formula) : 0;
  } catch(error) {
    console.error(error);
    return 0;
  }
}

function convertWeight(value, from, to) {
  if ( from === to ) return value;
  const message = unit => `Weight unit ${unit} not defined in CONFIG.DND5E.weightUnits`;
  if ( !CONFIG.DND5E.weightUnits[from] ) throw new Error(message(from));
  if ( !CONFIG.DND5E.weightUnits[to] ) throw new Error(message(to));
  return value
    * CONFIG.DND5E.weightUnits[from].conversion
    / CONFIG.DND5E.weightUnits[to].conversion;
}

async function prepareEncumbrancePatch (rollData, { validateItem }={}) {
    const equippedMod = getSetting(CONSTANTS.ENCUMBRANCE.EQUIPPED_ITEM_WEIGHT_MODIFIER.SETTING.KEY) || 0
    const proficientEquippedMod = getSetting(CONSTANTS.ENCUMBRANCE.PROFICIENT_EQUIPPED_ITEM_WEIGHT_MODIFIER.SETTING.KEY) || 0
    const unequippedMod = getSetting(CONSTANTS.ENCUMBRANCE.UNEQUIPPED_ITEM_WEIGHT_MODIFIER.SETTING.KEY) || 0

    const config = CONFIG.DND5E.encumbrance;
    const encumbrance = this.attributes.encumbrance ??= {};
    const baseUnits = CONFIG.DND5E.encumbrance.baseUnits[this.parent.type]
      ?? CONFIG.DND5E.encumbrance.baseUnits.default;
    const unitSystem = game.settings.get("dnd5e", "metricWeightUnits") ? "metric" : "imperial";

    // Get the total weight from items
    let weight = this.parent.items
        .filter(item => !item.container && (validateItem?.(item) ?? true))
        .reduce((weight, item) => {
            const equipped = item.system.equipped
            const proficient = item.system.proficiencyMultiplier
            const mod = (proficient) ? Math.min(proficientEquippedMod, equippedMod) : equippedMod
            return weight + ((equipped) ? (item.system.totalWeightIn?.(baseUnits[unitSystem]) ?? 0) * mod : (item.system.totalWeightIn?.(baseUnits[unitSystem]) ?? 0) * unequippedMod || 0)
        }, 0)

    // [Optional] add Currency Weight (for non-transformed actors)
    const currency = this.currency;
    if ( game.settings.get("dnd5e", "currencyWeight") && currency ) {
      const numCoins = Object.values(currency).reduce((val, denom) => val + Math.max(denom, 0), 0);
      const currencyPerWeight = config.currencyPerWeight[unitSystem];
      weight += convertWeight(
        numCoins / currencyPerWeight,
        config.baseUnits.default[unitSystem],
        baseUnits[unitSystem]
      );
    }

    // Determine the Encumbrance size class
    const keys = Object.keys(CONFIG.DND5E.actorSizes);
    const index = keys.findIndex(k => k === this.traits.size);
    const sizeConfig = CONFIG.DND5E.actorSizes[
      keys[this.parent.flags.dnd5e?.powerfulBuild ? Math.min(index + 1, keys.length - 1) : index]
    ];
    const sizeMod = sizeConfig?.capacityMultiplier ?? sizeConfig?.token ?? 1;
    let maximumMultiplier;

    const calculateThreshold = threshold => {
        let base = this.abilities.str?.value ?? 10;
        const bonus = simplifyBonus(encumbrance.bonuses?.[threshold], rollData)
          + simplifyBonus(encumbrance.bonuses?.overall, rollData);
        let multiplier = simplifyBonus(encumbrance.multipliers[threshold], rollData)
          * simplifyBonus(encumbrance.multipliers.overall, rollData);
        if ( threshold === "maximum" ) maximumMultiplier = multiplier;
        if ( this.parent.type === "vehicle" ) base = this.attributes.capacity.cargo * (config.vehicleWeightMultiplier[unitSystem] ?? 1);
        else multiplier *= (config.threshold[threshold]?.[unitSystem] ?? 1) * sizeMod;
        return (base * multiplier).toNearest(0.1) + bonus;
      };

    // Populate final Encumbrance values
    encumbrance.value = weight.toNearest(0.1);
    encumbrance.thresholds = {
      encumbered: calculateThreshold("encumbered"),
      heavilyEncumbered: calculateThreshold("heavilyEncumbered"),
      maximum: calculateThreshold("maximum")
    };
    encumbrance.max = encumbrance.thresholds.maximum;
    encumbrance.mod = (sizeMod * maximumMultiplier).toNearest(0.1);
    encumbrance.stops = {
      encumbered: Math.clamp((encumbrance.thresholds.encumbered * 100) / encumbrance.max, 0, 100),
      heavilyEncumbered: Math.clamp((encumbrance.thresholds.heavilyEncumbered * 100) / encumbrance.max, 0, 100)
    };
    encumbrance.pct = Math.clamp((encumbrance.value * 100) / encumbrance.max, 0, 100);
    encumbrance.encumbered = encumbrance.value > encumbrance.heavilyEncumbered;
}
