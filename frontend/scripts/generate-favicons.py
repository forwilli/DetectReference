#!/usr/bin/env python3
"""
Generate favicon files from SVG source
Requires: pip install cairosvg pillow
"""

import os
from pathlib import Path
try:
    import cairosvg
    from PIL import Image
except ImportError:
    print("Please install required packages: pip install cairosvg pillow")
    exit(1)

# Define paths
SCRIPT_DIR = Path(__file__).parent
PUBLIC_DIR = SCRIPT_DIR.parent / "public"
SVG_PATH = PUBLIC_DIR / "favicon.svg"

# Define sizes to generate
SIZES = [
    (16, "favicon-16x16.png"),
    (32, "favicon-32x32.png"),
    (180, "apple-touch-icon.png"),
    (192, "android-chrome-192x192.png"),
    (512, "android-chrome-512x512.png"),
]

def generate_favicons():
    """Generate PNG favicons from SVG source"""
    
    if not SVG_PATH.exists():
        print(f"Error: SVG file not found at {SVG_PATH}")
        return
    
    print(f"Generating favicons from {SVG_PATH}")
    
    for size, filename in SIZES:
        output_path = PUBLIC_DIR / filename
        
        # Convert SVG to PNG
        cairosvg.svg2png(
            url=str(SVG_PATH),
            write_to=str(output_path),
            output_width=size,
            output_height=size
        )
        
        print(f"✓ Generated {filename} ({size}x{size})")
    
    # Also create a favicon.ico with multiple sizes
    ico_path = PUBLIC_DIR / "favicon.ico"
    
    # Load different sizes for ICO file
    images = []
    for size in [16, 32, 48]:
        png_path = PUBLIC_DIR / f"favicon-{size}x{size}.png"
        if not png_path.exists():
            # Generate if not exists
            cairosvg.svg2png(
                url=str(SVG_PATH),
                write_to=str(png_path),
                output_width=size,
                output_height=size
            )
        
        img = Image.open(png_path)
        images.append(img)
    
    # Save as ICO
    images[0].save(
        ico_path,
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)]
    )
    print(f"✓ Generated favicon.ico")
    
    print("\nAll favicons generated successfully!")

if __name__ == "__main__":
    generate_favicons()