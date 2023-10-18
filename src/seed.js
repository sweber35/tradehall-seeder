import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

import constants from "../item-data.json" assert { type: "json" };

export function generateSeedData(number) {
  const itemTypeList = constants.item_constants
    .map((weaponType) => Object.keys(weaponType))
    .flat();

  const fakerList = faker.helpers
    .arrayElements(itemTypeList, number)
    .map((itemType) => {
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
            value = faker.number.int({
              min: enchantment.range.min,
              max: enchantment.range.max,
            });
          } else if ((enchantment.type = "percent")) {
            value =
              Math.floor(
                Math.random() *
                  (enchantment.range.max - enchantment.range.min) -
                  enchantment.range.min
              ) / 10;
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
        itemType === "crystal_sword"
          ? found.magic_weapon_damage[quality]
          : null;

      const damage = {
        ...(weaponDamage && {
          weaponDamage: faker.number.int({
            min: weaponDamage.min || 0,
            max: weaponDamage.max || 1,
          }),
        }),
        ...(magicDamage && { magicDamage: magicDamage }),
        ...(magicWeaponDamage && {
          magicWeaponDamage: faker.number.int({
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

      return {
        id: uuidv4(),
        itemType,
        quality,
        ...damage,
        enchantments,
        initialOffer,
      };
    });

  return fakerList;
}
