import os
import json
import re

def migrate():
    data_path = os.path.join(os.getcwd(), 'src', 'data.ts')
    output_dir = os.path.join(os.getcwd(), 'public', 'content', 'gallery')
    os.makedirs(output_dir, exist_ok=True)

    with open(data_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract GALLERY_ITEMS array block
    match = re.search(r'export const GALLERY_ITEMS: GalleryItem\[\] = (\[.*?\]);', content, re.DOTALL)
    if not match:
        print("Could not find GALLERY_ITEMS array")
        return

    items_json = match.group(1)
    items = json.loads(items_json)

    print(f"Found {len(items)} items to migrate.")

    for item in items:
        filename = f"item-{item['id']}.json"
        filepath = os.path.join(output_dir, filename)
        with open(filepath, 'w', encoding='utf-8') as out:
            json.dump(item, out, ensure_ascii=False, indent=2)

    print(f"Successfully created {len(items)} JSON files in {output_dir}")

if __name__ == '__main__':
    migrate()
