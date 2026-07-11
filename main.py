from flask import Flask, request, send_file
from flask_cors import CORS
from rembg import remove
from PIL import Image
import io

app = Flask(__name__)
# CORS allow karta hai ke hamara HTML frontend is API se baat kar sakay
CORS(app) 

# Naya route taake browser par 404 error na aaye
@app.route('/', methods=['GET'])
def home():
    return "Backend API bilkul theek chal rahi hai! Ab frontend ki bari hai."

@app.route('/remove-bg', methods=['POST'])
def remove_background():
    # Check karna ke image file aayi hai ya nahi
    if 'image' not in request.files:
        return {"error": "Koi image upload nahi ki gayi"}, 400
    
    file = request.files['image']
    input_image = Image.open(file.stream)
    
    # AI Engine: Background remove karna
    output_image = remove(input_image)
    
    # Processed image ko wapis bhejne ke liye tayar karna
    img_byte_arr = io.BytesIO()
    output_image.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    
    return send_file(img_byte_arr, mimetype='image/png')

if __name__ == '__main__':
    print("AI Backend Server Start Ho Raha Hai...")
    app.run(debug=True, port=5000)