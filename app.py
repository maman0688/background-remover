from flask import Flask, request, render_template, jsonify, url_for
from rembg import remove
from PIL import Image
import io
import base64

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/remove-bg', methods=['POST'])
def remove_background():
    if 'image' not in request.files:
        return {'error': 'No image provided'}, 400
       
    file = request.files['image']

    # Hitung ukuran file asli
    file.stream.seek(0, io.SEEK_END)
    original_size = file.stream.tell() / 1024  # KB
    file.stream.seek(0)

    # Baca gambar asli
    input_image = Image.open(file.stream)

    # Remove background
    output_image = remove(input_image)

    # Simpan hasil ke memory
    img_byte_arr = io.BytesIO()
    output_image.save(img_byte_arr, format='PNG')
    result_size = len(img_byte_arr.getvalue()) / 1024  # KB

    # Encode gambar ke base64
    img_base64 = base64.b64encode(img_byte_arr.getvalue()).decode('utf-8')

    return jsonify({
        "original_size_kb": round(original_size, 2),
        "result_size_kb": round(result_size, 2),
        "image_base64": img_base64
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
