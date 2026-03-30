from pdf2image import convert_from_path
import os

POPPLER_PATH = r"C:\Program Files\Release-25.11.0-0\poppler-25.11.0\Library\bin"

def pdf_to_images(pdf_path, output_folder="ocr_temp"):
    os.makedirs(output_folder, exist_ok=True)
    pages = convert_from_path(pdf_path, 300, poppler_path=POPPLER_PATH)

    image_paths = []
    for i, page in enumerate(pages):
        image_path = os.path.join(output_folder, f"page_{i+1}.jpg")
        page.save(image_path, "JPEG")
        image_paths.append(image_path)

    return image_paths
