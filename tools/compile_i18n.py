import json
import os

def set_nested_value(dic, path, value):
    keys = path.split('.')
    curr = dic
    for i, key in enumerate(keys[:-1]):
        if key in curr:
            if not isinstance(curr[key], dict):
                # print(f"Warning: Collision at {'.'.join(keys[:i+1])}. Overwriting string '{curr[key]}' with dictionary to accommodate '{path}'.")
                curr[key] = {}
        else:
            curr[key] = {}
        curr = curr[key]
    
    leaf_key = keys[-1]
    if leaf_key in curr and isinstance(curr[leaf_key], dict):
        # print(f"Warning: Collision at {path}. Cannot set leaf value because it's already a branch dictionary.")
        return
        
    curr[leaf_key] = value

def extract_i18n(db_path, output_dir):
    # grouped_translations[category][lang] = tree
    grouped_translations = {}
    unique_keys_count = 0

    def process_object(obj):
        nonlocal unique_keys_count
        if not isinstance(obj, dict):
            return

        # Find all keys ending in _int
        int_keys = [k for k in obj.keys() if k.endswith('_int')]
        for int_key in int_keys:
            key_val = obj[int_key]
            if not isinstance(key_val, str):
                continue
            
            # Determine category from the key_val (prefix before first dot)
            if '.' in key_val:
                category = key_val.split('.')[0]
            else:
                category = 'misc'

            base_field = int_key[:-4] # e.g. name, description, msg, category
            
            en_val = ""
            it_val = ""
            
            # Try to find English value
            if base_field in obj:
                val = obj[base_field]
                if isinstance(val, str):
                    en_val = val
                elif isinstance(val, dict):
                    en_val = val.get('en', '')
                    it_val = val.get('it', '')
            
            # Try to find Italian value (if not already found in dict)
            it_field = base_field + "_it"
            if not it_val and it_field in obj:
                it_val = obj[it_field]
            
            # If still no Italian, use English as fallback
            if en_val and not it_val:
                it_val = en_val
            
            if key_val and en_val:
                # Remove extra whitespace and handle multiline
                en_val = en_val.strip()
                it_val = it_val.strip()
                
                if category not in grouped_translations:
                    grouped_translations[category] = {'en': {}, 'it': {}}
                
                set_nested_value(grouped_translations[category]['en'], key_val, en_val)
                set_nested_value(grouped_translations[category]['it'], key_val, it_val)
                unique_keys_count += 1

    def walk_data(data):
        if isinstance(data, list):
            for item in data:
                walk_data(item)
        elif isinstance(data, dict):
            process_object(data)
            # Recursively walk in case there are nested structures
            for k, v in data.items():
                if isinstance(v, (dict, list)):
                    walk_data(v)

    if not os.path.exists(db_path):
        print(f"Error: DB path not found: {db_path}")
        return

    for root, dirs, files in os.walk(db_path):
        for file in files:
            if file.endswith('.json'):
                file_path = os.path.join(root, file)
                print(f"Processing {file_path}")
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        walk_data(data)
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")

    # Write output files
    os.makedirs(output_dir, exist_ok=True)
    
    # Remove old big files if they exist to avoid confusion
    for old_file in ['en.json', 'it.json']:
        old_path = os.path.join(output_dir, old_file)
        if os.path.exists(old_path):
            os.remove(old_path)

    for category, langs in grouped_translations.items():
        for lang, translations in langs.items():
            if not translations:
                continue
            
            # Create language subdirectory
            lang_dir = os.path.join(output_dir, lang)
            os.makedirs(lang_dir, exist_ok=True)
            
            output_file = os.path.join(lang_dir, f"{category}.json")
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(translations, f, indent=2, ensure_ascii=False)
            print(f"Saved {lang}/{category}.json")

    print(f"Extraction complete.")
    print(f"Found {unique_keys_count} translation entries across {len(grouped_translations)} categories.")

if __name__ == "__main__":
    # Base paths relative to the project root
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(current_dir)
    
    db_path = os.path.join(project_root, 'js', 'db')
    output_dir = os.path.join(project_root, 'js', 'plugins', 'i18n')
    
    extract_i18n(db_path, output_dir)
