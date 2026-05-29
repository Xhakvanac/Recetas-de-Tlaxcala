import PyPDF2
import sys

def extract(pdf_path, txt_path):
    try:
        with open(pdf_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
        with open(txt_path, 'w', encoding='utf-8', errors='ignore') as f:
            f.write(text)
        print(f"Extracted {pdf_path} to {txt_path}")
    except Exception as e:
        print(f"Error on {pdf_path}: {e}")

extract('Proyecto Integral Final_propuesta de arquitectura.pdf', 'arq.txt')
extract('documentacion_cocina_tlaxcalteca.pdf', 'doc.txt')
