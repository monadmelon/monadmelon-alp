import os
import json

# --- CONFIGURATION ---
# This script should be in your root 'monadmelon' folder.
# It will scan the 'content' subfolder and save the output in the root.
CONTENT_DIR = "content"
OUTPUT_FILE = "filesystem.json"

def generate_filesystem_map():
    """
    Automatically discovers and recursively scans directories inside the CONTENT_DIR
    to generate a complete map of the file system.
    """
    print(f"Scanning directory: '{CONTENT_DIR}'...")
    filesystem = {}
    root_listing = ["README.md"]

    # --- Step 1: Automatically find all directories inside 'content' ---
    try:
        # This will create a list like ['aud', 'log', 'net', 'projects', 'usr']
        scannable_dirs = [d for d in os.listdir(CONTENT_DIR) if os.path.isdir(os.path.join(CONTENT_DIR, d))]
    except FileNotFoundError:
        print(f"FATAL ERROR: The '{CONTENT_DIR}' directory was not found.")
        print("Please make sure this script is in your root 'monadmelon' folder.")
        return None

    # --- Step 2: Recursively scan each discovered directory ---
    for dir_name in scannable_dirs:
        root_listing.append(f"{dir_name}/")
        fs_key = f"{dir_name}/"
        filesystem[fs_key] = []
        
        dir_to_walk = os.path.join(CONTENT_DIR, dir_name)
        
        # os.walk is the powerful tool that goes into all subfolders
        for current_path, subdirs, files in os.walk(dir_to_walk):
            # Get the path relative to the directory we started scanning (e.g., 'projects/')
            relative_path = os.path.relpath(current_path, dir_to_walk)

            for item in sorted(subdirs + files):
                # If in the base folder, path is just the item. If nested, it's relative_path/item
                entry = os.path.join(relative_path, item) if relative_path != "." else item
                
                # Add a trailing slash for directories
                if os.path.isdir(os.path.join(current_path, item)):
                    entry += "/"
                
                filesystem[fs_key].append(entry.replace(os.sep, '/'))
        
        print(f"  - Scanned '{fs_key}', found {len(filesystem[fs_key])} total items.")

    filesystem["~"] = sorted(root_listing)
    return filesystem

def write_json(data, filename):
    if data is None:
        return
    with open(filename, "w") as f:
        json.dump(data, f, indent=4)
    print(f"\nSuccess! '{filename}' has been created/updated in your root directory.")

if __name__ == "__main__":
    fs_map = generate_filesystem_map()
    write_json(fs_map, OUTPUT_FILE)