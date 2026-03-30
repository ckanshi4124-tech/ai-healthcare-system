import pytesseract
from pytesseract import Output
from PIL import Image

def extract_text_tesseract(image_path):
    try:
        img = Image.open(image_path)

        # Use Tesseract to extract text with confidence values
        data = pytesseract.image_to_data(img, output_type=Output.DICT)

        text = []
        confidences = []

        for i, word in enumerate(data["text"]):
            if word.strip() != "":
                text.append(word)
                confidences.append(int(data["conf"][i]))

        avg_conf = sum(confidences) / len(confidences) if confidences else 0
        return " ".join(text), avg_conf

    except Exception as e:
        print("Tesseract Error:", e)
        return "", 0
