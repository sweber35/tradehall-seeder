import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

import constants from "../item-data.json" assert { type: "json" };

function getRandomInt(range) {
  let min = Math.ceil(range.min);
  let max = Math.floor(range.max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(range) {
  const float = Math.random() * (range.max - range.min) + range.min;
  return parseFloat(float).toFixed(2);
}

export function generateSeedData(number) {
  const itemTypeList = constants.item_constants
    .map((weaponType) => Object.keys(weaponType))
    .flat();

  const fakerList = Array.from({ length: number }, () =>
    faker.helpers.arrayElement(itemTypeList)
  ).map((itemType, index) => {
    const found = Object.values(
      constants.item_constants.find((type) =>
        Object.keys(type).includes(itemType)
      )
    )[0];

    const qualityTable = {
      uncommon: 1,
      rare: 2,
      epic: 3,
      legendary: 4,
      unique: 5,
    };

    const quality = faker.helpers.arrayElement(Object.keys(qualityTable));

    const enchantments = faker.helpers
      .arrayElements(constants.enchantment_constants, qualityTable[quality])
      .map((enchantment) => {
        let value = 0;

        if (enchantment.type === "number") {
          value = getRandomInt({
            min: enchantment.range.min,
            max: enchantment.range.max,
          });
        } else if ((enchantment.type = "percent")) {
          value = getRandomFloat({
            max: enchantment.range.max,
            min: enchantment.range.min,
          });
        }

        return {
          name: enchantment.name,
          type: enchantment.type,
          value,
        };
      });

    // everything but crystal ball and spellbook has weapon damage
    const weaponDamage = !["crystal_ball", "spellbook"].includes(itemType)
      ? found.damage[quality]
      : null;

    // only these have magic damage
    const magicDamage = ["crystal_ball", "spellbook", "magic_staff"].includes(
      itemType
    )
      ? found.magic_damage[quality]
      : null;

    // only crystal sword has magic weapon damage
    const magicWeaponDamage =
      itemType === "crystal_sword" ? found.magic_weapon_damage[quality] : null;

    const damage = {
      ...(weaponDamage && {
        weaponDamage: getRandomInt({
          min: weaponDamage.min || 0,
          max: weaponDamage.max || 1,
        }),
      }),
      ...(magicDamage && { magicDamage: magicDamage }),
      ...(magicWeaponDamage && {
        magicWeaponDamage: getRandomInt({
          min: magicWeaponDamage.min,
          max: magicWeaponDamage.max,
        }),
      }),
    };

    const initialOffer = faker.number.float({
      min: 100,
      max: 2000,
      precision: 50,
    });

    const createdAt = Date.now();

    return {
      id: uuidv4(),
      updatedAt: createdAt,
      itemType,
      classes: found.classes,
      quality,
      ...damage,
      enchantments,
      offers: [{ timestamp: createdAt, amount: initialOffer }],
    };
  });

  return fakerList;
}
