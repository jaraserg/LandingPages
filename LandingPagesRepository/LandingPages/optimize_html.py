import os
import urllib.parse
from bs4 import BeautifulSoup

def process_html(filepath):
    print(f"Processing {filepath}...")
    folder_name = os.path.basename(os.path.dirname(filepath))
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            html_content = f.read()
            
        soup = BeautifulSoup(html_content, 'html.parser')

        # 1. Responsiveness
        head = soup.find('head')
        if head:
            viewport = head.find('meta', {'name': 'viewport'})
            if not viewport:
                meta = soup.new_tag('meta')
                meta['name'] = 'viewport'
                meta['content'] = 'width=device-width, initial-scale=1.0'
                head.append(meta)
                print(f"  Added viewport meta tag.")
                
        # 2. Performance & 3. Visibility
        images = soup.find_all('img')
        for img in images:
            # Add lazy loading
            if not img.get('loading'):
                img['loading'] = 'lazy'
            
            src = img.get('src')
            if src and not src.startswith(('http://', 'https://', 'data:')):
                # Check if local file exists
                parsed_src = urllib.parse.urlparse(src).path
                # remove leading slash for absolute path calculation if needed
                parsed_src = parsed_src.lstrip('/')
                base_dir = os.path.dirname(filepath)
                local_img_path = os.path.join(base_dir, parsed_src)
                
                # Check normalized path
                if not os.path.exists(local_img_path):
                    fallback_keyword = folder_name.lower().replace(' ', '')
                    if not fallback_keyword:
                        fallback_keyword = "landingpage"
                    fallback_url = f"https://loremflickr.com/800/600/{fallback_keyword}"
                    print(f"  Replacing missing image '{src}' with fallback '{fallback_url}'.")
                    img['src'] = fallback_url
        
        # 4. Minimal Footer
        new_footer_html = '''<footer style="text-align: center; padding: 20px; font-size: 14px;">
    <a href="#" style="text-decoration: none; color: inherit;">&copy; 2026 Trademark</a>
</footer>'''
        # Use html.parser but keep it as a BeautifulSoup object fragment
        new_footer_soup = BeautifulSoup(new_footer_html, 'html.parser').footer
        
        existing_footers = soup.find_all('footer')
        if existing_footers:
            # Replace all existing footers, typically there's only one
            for footer in existing_footers:
                # We need to copy the soup object if replacing multiple times to avoid detaching errors
                import copy
                footer.replace_with(copy.copy(new_footer_soup))
            print(f"  Replaced existing <footer> tag.")
        else:
            # If no footer tag, append it to body
            body = soup.find('body')
            if body:
                body.append(new_footer_soup)
                print(f"  Appended new <footer> to <body>.")

        # Save the file
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(str(soup))
            
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

def main():
    base_dir = r"c:\Users\USER\opencode\LandingPages"
    for root, dirs, files in os.walk(base_dir):
        if 'index.html' in files:
            filepath = os.path.join(root, 'index.html')
            process_html(filepath)

if __name__ == '__main__':
    main()
