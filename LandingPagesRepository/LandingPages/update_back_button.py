import os
import re

root_dir = r"c:\Users\Daniela\opencode\LandingPagesRepository\LandingPages"

old_button_pattern = re.compile(
    r'<a href="\.\./index\.html" style="position: fixed; top: 20px; left: 20px;[^>]+>.*?(?:Back to Showcase).*?</a>',
    re.IGNORECASE | re.DOTALL
)

new_button_html = '<a href="../index.html" style="position: fixed; bottom: 20px; left: 20px; z-index: 999999; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); color: white; padding: 8px 16px; border-radius: 20px; font-family: sans-serif; font-size: 12px; font-weight: 500; border: 1px solid rgba(255,255,255,0.2); text-decoration: none; display: flex; align-items: center; gap: 6px; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.3);" onmouseover="this.style.background=\'rgba(0,255,0,0.2)\'; this.style.borderColor=\'rgba(0,255,0,0.5)\';" onmouseout="this.style.background=\'rgba(0,0,0,0.8)\'; this.style.borderColor=\'rgba(255,255,255,0.2)\';"><span style="font-size: 14px;">←</span> Showcase</a>'

count = 0

for root, dirs, files in os.walk(root_dir):
    # Only skip the root dir itself, so we only target subdirectories
    if root == root_dir:
        continue
    for file in files:
        if file.lower() == "index.html":
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if old_button_pattern.search(content):
                new_content = old_button_pattern.sub(new_button_html, content)
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated: {filepath}")
                count += 1

print(f"Total files updated: {count}")
