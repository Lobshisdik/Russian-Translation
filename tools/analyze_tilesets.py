import os
import json
from PIL import Image

tileset_dir = r"c:\github\hypernet-explorer\img\tilesets"
output_file = r"c:\github\hypernet-explorer\js\db\Sprites\ASCIITileset.json"

result = {}

tile_size = 48

for filename in os.listdir(tileset_dir):
    if filename.endswith(".png") and not filename.endswith(".bump.png") and not filename.endswith(".specular.png"):
        filepath = os.path.join(tileset_dir, filename)
        try:
            with Image.open(filepath) as img:
                img = img.convert("RGB")
                width, height = img.size
                
                # Only process if width is a multiple of tile_size (usually 768)
                if width % tile_size == 0 and width >= tile_size:
                    cols = width // tile_size
                    rows = height // tile_size
                    
                    file_data = {}
                    
                    for r in range(rows):
                        for c in range(cols):
                            tile_idx = r * cols + c
                            
                            # Extract tile
                            left = c * tile_size
                            top = r * tile_size
                            right = left + tile_size
                            bottom = top + tile_size
                            
                            tile_img = img.crop((left, top, right, bottom))
                            
                            # Calculate average color
                            pixels = list(tile_img.getdata())
                            
                            if not pixels:
                                continue
                                
                            avg_r = sum(p[0] for p in pixels) // len(pixels)
                            avg_g = sum(p[1] for p in pixels) // len(pixels)
                            avg_b = sum(p[2] for p in pixels) // len(pixels)
                            
                            hex_color = f"#{avg_r:02x}{avg_g:02x}{avg_b:02x}"
                            file_data[str(tile_idx)] = hex_color
                            
                    result[filename] = file_data
                    print(f"Processed {filename}")
        except Exception as e:
            print(f"Error processing {filename}: {e}")

# Output as JSON in the specified file
with open(output_file, "w") as f:
    json.dump(result, f, indent=2)

print(f"Output written to {output_file}")
