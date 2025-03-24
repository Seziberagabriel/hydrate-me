from flask import Flask, render_template, request, jsonify
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Function to calculate recommended water intake (in liters)
def calculate_water_intake(weight_kg):
    min_ml = weight_kg * 35  # Minimum water intake in milliliters
    max_ml = weight_kg * 40  # Maximum water intake in milliliters
    min_liters = round(min_ml / 1000, 2)  # Convert to liters
    max_liters = round(max_ml / 1000, 2)  # Convert to liters
    return f"{min_liters} - {max_liters} liters"

# Route to serve the main HTML page
@app.route('/')
def index():
    return render_template('index.html')  # Renders the HTML file located in the "templates" folder

# API route to handle hydration advice requests
@app.route('/get-hydration-advice', methods=['POST'])
def hydration_advice():
    try:
        data = request.json  # Get JSON data from the front-end
        if not data or 'name' not in data or 'weight' not in data:
            return jsonify({'error': 'Missing required fields'}), 400
        
        name = data['name'].strip()
        weight_kg = data['weight']

        # Validate inputs
        if not name:
            return jsonify({'error': 'Name is required.'}), 400
        if not isinstance(weight_kg, (int, float)) or weight_kg <= 0:
            return jsonify({'error': 'Please enter a valid weight.'}), 400

        # Calculate water intake
        water_intake = calculate_water_intake(weight_kg)

        # Prepare response
        response = {
            'message': f"Hello, {name}!",
            'waterIntake': f"Based on your weight ({weight_kg} kg), you should drink approximately {water_intake} of water per day."
        }
        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
    