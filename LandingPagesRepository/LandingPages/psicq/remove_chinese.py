import re
import sys

CHINESE_PATTERN = re.compile(r'[\u4e00-\u9fff]')

def remove_chinese_characters(text):
    """Remove all Chinese characters from the given text."""
    return CHINESE_PATTERN.sub('', text)

def process_file(input_file, output_file=None, buffer_size=8192):
    """
    Process a text file to remove Chinese characters using buffered I/O.
    
    Args:
        input_file (str): Path to the input text file
        output_file (str): Path to the output file (optional, defaults to input_file_cleaned.txt)
        buffer_size (int): Buffer size for file operations (default: 8192)
    """
    try:
        # Generate output filename if not provided
        if output_file is None:
            base_name = input_file.rsplit('.', 1)[0]
            extension = input_file.rsplit('.', 1)[1] if '.' in input_file else ''
            output_file = f"{base_name}_cleaned.{extension}" if extension else f"{base_name}_cleaned"
        
        total_removed = 0
        total_processed = 0
        
        # Process file with buffered I/O
        with open(input_file, 'r', encoding='utf-8', buffering=buffer_size) as infile, \
             open(output_file, 'w', encoding='utf-8', buffering=buffer_size) as outfile:
            
            while True:
                chunk = infile.read(buffer_size)
                if not chunk:
                    break
                
                cleaned_chunk = remove_chinese_characters(chunk)
                outfile.write(cleaned_chunk)
                
                chunk_removed = len(chunk) - len(cleaned_chunk)
                total_removed += chunk_removed
                total_processed += len(chunk)
        
        print(f"Successfully processed '{input_file}'")
        print(f"Cleaned content saved to: '{output_file}'")
        print(f"Characters removed: {total_removed}")
        print(f"Total characters processed: {total_processed}")
        print(f"Removal efficiency: {(total_removed/total_processed*100):.2f}%")
        
    except FileNotFoundError:
        print(f"Error: Input file '{input_file}' not found.")
        sys.exit(1)
    except Exception as e:
        print(f"Error processing file: {e}")
        sys.exit(1)

def main():
    if len(sys.argv) < 2:
        print("Usage: python remove_chinese.py <input_file> [output_file]")
        print("Example: python remove_chinese.py text.txt cleaned.txt")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    
    process_file(input_file, output_file)

if __name__ == "__main__":
    main()