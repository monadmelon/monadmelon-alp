import os
import json

# --- CONFIGURATION ---
CONTENT_DIR = "content"
OUTPUT_FILE = "filesystem.json"

def generate_filesystem_map():
    """
    Automatically discovers and recursively scans directories and files inside the CONTENT_DIR
    to generate a complete map of the file system.
    """
    print(f"Scanning directory: '{CONTENT_DIR}'...")
    filesystem = {}
    
    # **THE FIX:** Start with an empty list instead of hardcoding README.md
    root_listing = []

    # --- Step 1: Find all files and directories inside 'content' ---
    try:
        all_content_items = os.listdir(CONTENT_DIR)
        scannable_dirs = [d for d in all_content_items if os.path.isdir(os.path.join(CONTENT_DIR, d))]
        root_content_files = [f for f in all_content_items if os.path.isfile(os.path.join(CONTENT_DIR, f))]
    except FileNotFoundError:
        print(f"FATAL ERROR: The '{CONTENT_DIR}' directory was not found.")
        return None

    # Add discovered items to the root listing for '~'
    for d in scannable_dirs:
        root_listing.append(f"{d}/")
    for f in root_content_files:
        root_listing.append(f)

    # --- Step 2: Recursively scan each discovered directory ---
    for dir_name in scannable_dirs:
        fs_key = f"{dir_name}/"
        filesystem[fs_key] = []
        dir_to_walk = os.path.join(CONTENT_DIR, dir_name)
        
        for current_path, subdirs, files in os.walk(dir_to_walk):
            relative_path = os.path.relpath(current_path, dir_to_walk)
            for item in sorted(subdirs + files):
                entry = os.path.join(relative_path, item) if relative_path != "." else item
                if os.path.isdir(os.path.join(current_path, item)):
                    entry += "/"
                filesystem[fs_key].append(entry.replace(os.sep, '/'))
        
        print(f"  - Scanned '{fs_key}', found {len(filesystem[fs_key])} total items.")

    filesystem["~"] = sorted(root_listing)
    return filesystem

def write_json(data, filename):
    if data is None: return
    with open(filename, "w") as f:
        json.dump(data, f, indent=4)
    print(f"\nSuccess! '{filename}' has been updated in your root directory.")

if __name__ == "__main__":
    fs_map = generate_filesystem_map()
    write_json(fs_map, OUTPUT_FILE)