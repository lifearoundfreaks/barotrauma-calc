import xml.etree.ElementTree as ET
import os
import json
import shutil

from collections import defaultdict

used_textures = set()

redundant_items = {
    "bluewire", "orangewire", "greenwire", "blackwire", "brownwire",
    "andcomponent", "greatercomponent", "addercomponent", "colorcomponent",
    "subtractcomponent", "multiplycomponent", "dividecomponent",
    "powcomponent", "orcomponent", "xorcomponent", "notcomponent",
    "concatcomponent", "sincomponent", "coscomponent", "tancomponent",
    "asincomponent", "acoscomponent", "atancomponent", "roundcomponent",
    "ceilcomponent", "floorcomponent", "factorialcomponent", "abscomponent",
    "squarerootcomponent", "modulocomponent", "equalscomponent",
    "delaycomponent", "memorycomponent", "lightcomponent90",
    "signalcheckcomponent", "regexcomponent", "oscillator", "wificomponent"
}


def parse_items(path):

    tree = ET.parse(path)
    items = tree.getroot()

    parsed_items = {}

    for item in items:

        # Removing redundant wires
        if item.get('identifier') in redundant_items:
            continue

        item_data = {}

        if (price := item.find('Price')) is not None:
            default_price = float(price.attrib['baseprice'])
            soldeverywhere = price.attrib.get('soldeverywhere', 'true')
            minleveldifficulty = float(price.attrib.get('minleveldifficulty', 0))
            modified_dict = {}
            price_data = {
                'default': default_price,
                'soldeverywhere': soldeverywhere,
                'modified': modified_dict,
                'minleveldifficulty': minleveldifficulty,
            }

            for subprice in price:
                modified_dict[subprice.attrib['locationtype']] = {
                    'multiplier': float(subprice.attrib.get('multiplier', 1)),
                }
                min_amt = int(subprice.attrib.get('minavailable', 0))
                if min_amt:
                    modified_dict[subprice.attrib['locationtype']][
                        'min_amt'] = min_amt
                if soldeverywhere != 'true':
                    modified_dict[subprice.attrib['locationtype']]['sold'] = \
                        subprice.attrib.get('sold', 'true')

            item_data['price'] = price_data

        recipe, refill_recipe, *_ = (*item.findall('Fabricate'), None, None)
        if recipe is not None:
            quantities = defaultdict(float)
            batch = float(recipe.attrib.get('amount', 1.))
            for ingredient in [
                *recipe.findall('Item'), *recipe.findall('RequiredItem')
            ]:

                amount = float(ingredient.attrib.get('mincondition', 1))
                if ingredient.attrib.get('usecondition') == "false":
                    amount = 1.
                if batch != 1.:
                    amount /= batch

                identifier = ingredient.attrib.get(
                    'identifier', ingredient.attrib.get('tag'))
                quantities[identifier] += amount

            skills = {}
            for skill in recipe.findall('RequiredSkill'):
                skills[skill.attrib['identifier']] = int(skill.attrib['level'])

            if quantities:
                item_data['fabricate'] = quantities
                item_data['fabricate_time'] = \
                    round(int(recipe.attrib.get('requiredtime', 1)) / batch, 2)
                item_data['fabricator_types'] = \
                    recipe.attrib['suitablefabricators']
                item_data['fabrication_batch'] = batch
                if skills:
                    item_data['skills'] = skills

        if refill_recipe is not None:
            quantities = defaultdict(float)
            for ingredient in refill_recipe.findall('RequiredItem'):

                nested_identifier = ingredient.attrib['identifier']
                if item.attrib['identifier'] != nested_identifier:
                    quantities[nested_identifier] += 1

            if quantities:
                item_data['refilled_with'] = quantities

        if (recipe := item.find('Deconstruct')) is not None:
            quantities = defaultdict(float)

            # Calculating total weight if deconstruction is random
            if (chooserandom := recipe.attrib.get("chooserandom") == "true"):
                total_weight = sum(
                    float(ingredient.attrib['commonness']) for ingredient in [
                        *recipe.findall('Item'),
                        *recipe.findall('RequiredItem')])

            batch = float(recipe.attrib.get('amount', 1.))
            for ingredient in [
                *recipe.findall('Item'), *recipe.findall('RequiredItem')
            ]:
                amount = float(ingredient.attrib.get('outcondition', 1))*batch
                if chooserandom:
                    amount *= \
                        float(ingredient.attrib['commonness']) / total_weight

                quantities[ingredient.attrib['identifier']] += round(
                    amount, 2)

            if quantities:
                item_data['deconstruct'] = quantities
                item_data['deconstruct_time'] = recipe.attrib['time']
                item_data['random_deconstruction'] = chooserandom

        if item_data:
            parsed_items[item.attrib['identifier']] = item_data

            sprite = item.find('InventoryIcon')
            if sprite is None:
                sprite = item.find('Sprite')

            split_dir = sprite.attrib['texture'].rsplit('/', 1)
            if len(split_dir) > 1:
                texture_dir = sprite.attrib['texture']
            else:
                texture_dir = path.rsplit("/", 1)[0] + "/" + split_dir[0]

            used_textures.add(texture_dir)
            item_data['texture'] = texture_dir.rsplit('/', 1)[-1]
            item_data['sourcerect'] = sprite.attrib['sourcerect']

    return parsed_items


def save_texture(texture_dir):

    file_name = texture_dir.rsplit("/", 1)[-1]
    shutil.copyfile(texture_dir, f"copied_textures/{file_name}")


game_items = {}

ITEMS_FOLDER = 'Content/Items/'

folders_to_check = list(filter(
    os.path.isdir,
    map(lambda _dir: os.path.join(ITEMS_FOLDER, _dir),
        os.listdir(ITEMS_FOLDER))
))
subfolders = []

while (folders := folders_to_check or subfolders):
    folders_to_check, subfolders = [], []
    for folder in folders:
        for filename in os.listdir(folder):
            if os.path.isdir((subfolder := f"{folder}/{filename}")):
                subfolders.append(subfolder)
            elif filename.endswith('.xml'):
                game_items.update(parse_items(f"{folder}/{filename}"))


for key, item in game_items.items():

    parsed_key = "wire" if key == "redwire" else key

    if (fabricate := item.get('fabricate')) is not None:
        # item['fabricate_profit'] = profit = item['price']['default'] - sum(
        #     game_items[key]['price']['default'] * value
        #     for key, value in fabricate.items()
        # )
        for ingredient, amount in fabricate.items():
            ingredient_dict = game_items[ingredient]
            if 'used_in' not in ingredient_dict:
                ingredient_dict['used_in'] = {}
            ingredient_dict['used_in'][parsed_key] = round(1 / amount, 2)

    if (deconstruct := item.get('deconstruct')) is not None:
        # item['deconstruct_profit'] = profit = sum(
        #     game_items[key]['price']['default'] * value
        #     for key, value in deconstruct.items()
        # ) - item.get('price', {'default': 0.})['default']
        for ingredient, amount in deconstruct.items():
            ingredient_dict = game_items[ingredient]
            if 'scrapped_from' not in ingredient_dict:
                ingredient_dict['scrapped_from'] = {}
            ingredient_dict['scrapped_from'][parsed_key] = round(1 / amount, 2)

translations = defaultdict(set)
TRANSLATIONS_FOLDER = 'Content/Texts'

# This crutch is needed because wire item has no fabrication recipe
game_items['wire'].update(game_items.pop('redwire'))

vanilla_names = {}

for folder in filter(
    os.path.isdir,
    map(lambda _dir: os.path.join(TRANSLATIONS_FOLDER, _dir),
        os.listdir(TRANSLATIONS_FOLDER))
):
    for filename in os.listdir(folder):
        if filename.endswith('.xml'):
            tree = ET.parse(f"{folder}/{filename}")
            items = tree.getroot()

            for item in items:

                if item.tag.startswith('entityname'):

                    identifier = item.tag.replace('entityname.', '')
                    if (text := item.text) is not None:
                        translations[identifier].add(item.text)
                        if filename == 'EnglishVanilla.xml':
                            vanilla_names[identifier] = item.text


for key, game_item in game_items.items():

    searchstring = f"{key} " + " ".join(map(
        lambda s: s.lower(), translations.get(key, [])))
    game_item['searchstring'] = searchstring
    if key == "relaycomponent":
        game_item['display_name'] = "Logic component"
    else:
        game_item['display_name'] = vanilla_names.get(key, key)

with open('parsed_data.json', 'w', encoding='utf8') as outfile:
    json.dump(game_items, outfile)
    # json.dump(game_items, outfile, indent=4, ensure_ascii=False)

for texture in used_textures:

    save_texture(texture)
