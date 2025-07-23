import csv
import random

# Define car data with misspelled brands and budget/lesser-known brands
car_brands = {
    # Misspelled luxury brands
    'Porche': ['911', 'Cayenne', 'Macan', 'Panamera', 'Boxster', 'Cayman', 'Taycan'],
    'Lamborgini': ['Huracan', 'Aventador', 'Gallardo', 'Murcielago', 'Urus'],
    'Ferarri': ['488 GTB', 'F8 Tributo', '812 Superfast', 'Roma', 'Portofino', 'SF90'],
    'Awdi': ['R8', 'A4', 'A6', 'A8', 'Q5', 'Q7', 'e-tron', 'RS6', 'TT'],
    'McLarren': ['720S', '570S', 'P1', '650S', 'GT', 'Artura'],
    'BWM': ['M8', 'M3', 'M5', 'X5', 'X3', 'i8', 'i4', '330i', '540i'],
    'Mercedez': ['AMG GT', 'C63 AMG', 'E63 AMG', 'S-Class', 'G-Wagon', 'EQS'],
    'Teslla': ['Model S', 'Model 3', 'Model X', 'Model Y', 'Roadster'],
    
    # Misspelled common brands
    'Fourd': ['Mustang', 'F-150', 'Explorer', 'Escape', 'Focus', 'Mach-E'],
    'Chevrolett': ['Corvette', 'Camaro', 'Silverado', 'Tahoe', 'Malibu', 'Bolt'],
    'Toyoto': ['Supra', 'Camry', 'Corolla', 'RAV4', 'Highlander', 'Prius'],
    'Hondda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'NSX', 'Insight'],
    'Nisann': ['GT-R', '370Z', 'Altima', 'Sentra', 'Rogue', 'Leaf'],
    'Hyundai': ['Genesis', 'Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Ioniq'],
    'Volkswagon': ['Golf', 'Jetta', 'Passat', 'Tiguan', 'Atlas', 'ID.4'],
    'Suburu': ['WRX', 'Outback', 'Forester', 'Impreza', 'Legacy', 'Ascent'],
    'Mazada': ['MX-5 Miata', 'Mazda3', 'Mazda6', 'CX-5', 'CX-9', 'RX-8'],
    'Lexas': ['LC 500', 'IS', 'ES', 'GS', 'LS', 'RX', 'NX'],
    'Infiniti': ['Q50', 'Q60', 'QX50', 'QX60', 'QX80', 'G37'],
    'Acurra': ['NSX', 'TLX', 'ILX', 'MDX', 'RDX', 'TSX'],
    
    # Budget/lesser-known brands
    'Mitsubishi': ['Outlander', 'Eclipse Cross', 'Mirage', 'Lancer', 'Galant'],
    'Kia': ['Forte', 'Optima', 'Sorento', 'Sportage', 'Soul', 'Stinger'],
    'Suzuki': ['Swift', 'Vitara', 'Jimny', 'Baleno', 'Ignis'],
    'Dacia': ['Duster', 'Logan', 'Sandero', 'Spring', 'Lodgy'],
    'Skoda': ['Octavia', 'Superb', 'Fabia', 'Kodiaq', 'Karoq'],
    'Seat': ['Leon', 'Ibiza', 'Ateca', 'Arona', 'Tarraco'],
    'Fiat': ['500', 'Panda', 'Tipo', 'Punto', '500X'],
    'Renault': ['Clio', 'Megane', 'Captur', 'Kadjar', 'Scenic'],
    'Peugeot': ['208', '308', '508', '2008', '3008', '5008'],
    'Citroen': ['C3', 'C4', 'C5', 'Berlingo', 'Picasso'],
    'Opel': ['Astra', 'Corsa', 'Insignia', 'Crossland', 'Grandland'],
    'Lada': ['Vesta', 'Granta', 'Niva', 'Largus', 'XRAY'],
    'Geely': ['Coolray', 'Azkarra', 'Okavango', 'Emgrand', 'Atlas'],
    'BYD': ['Atto 3', 'Dolphin', 'Seal', 'Tang', 'Han'],
    'Great Wall': ['Haval H6', 'Wey VV7', 'Ora Good Cat', 'Poer', 'Cannon'],
    'Chery': ['Tiggo', 'Arrizo', 'QQ', 'eQ1', 'Exeed'],
    'MG': ['ZS', 'HS', 'Marvel R', 'Cyberster', '5'],
    'SsangYong': ['Tivoli', 'Korando', 'Rexton', 'Musso', 'XLV'],
    'Proton': ['Saga', 'Persona', 'Iriz', 'Exora', 'X70'],
    'Perodua': ['Myvi', 'Axia', 'Bezza', 'Aruz', 'Alza']
}

# Electric car models (for setting isElectric = True)
electric_models = {
    'Teslla': ['Model S', 'Model 3', 'Model X', 'Model Y', 'Roadster'],
    'Awdi': ['e-tron'],
    'BWM': ['i8', 'i4'],
    'Mercedez': ['EQS'],
    'Fourd': ['Mach-E'],
    'Chevrolett': ['Bolt'],
    'Toyoto': ['Prius'],
    'Hondda': ['Insight'],
    'Nisann': ['Leaf'],
    'Hyundai': ['Ioniq'],
    'Volkswagon': ['ID.4'],
    'Porche': ['Taycan'],
    'BYD': ['Atto 3', 'Dolphin', 'Seal'],
    'MG': ['Marvel R']
}

def generate_car_data():
    # Select random brand and model
    brand = random.choice(list(car_brands.keys()))
    model = random.choice(car_brands[brand])
    
    # Determine if electric
    is_electric = brand in electric_models and model in electric_models[brand]
    
    # Generate year (2015-2024)
    year = random.randint(2015, 2024)
    
    # Generate specs based on car type
    if is_electric:
        engine_size = 0.0  # Electric cars don't have traditional engines
        horsepower = random.randint(200, 1020)  # Tesla Plaid can go over 1000hp
        torque = random.randint(250, 1050)
        acceleration = round(random.uniform(2.0, 6.5), 1)
        price = random.randint(35000, 200000)
    else:
        # Luxury/sports cars get higher specs
        if brand in ['Porche', 'Lamborgini', 'Ferarri', 'McLarren', 'Awdi', 'BWM', 'Mercedez']:
            engine_size = round(random.uniform(2.0, 6.5), 1)
            horsepower = random.randint(300, 800)
            torque = random.randint(280, 650)
            acceleration = round(random.uniform(2.5, 5.5), 1)
            price = random.randint(80000, 400000)
        # Budget/economy cars get lower specs and prices
        elif brand in ['Mitsubishi', 'Kia', 'Suzuki', 'Dacia', 'Fiat', 'Lada', 'Geely', 'Chery', 'Proton', 'Perodua']:
            engine_size = round(random.uniform(1.0, 2.5), 1)
            horsepower = random.randint(70, 200)
            torque = random.randint(90, 220)
            acceleration = round(random.uniform(6.0, 12.0), 1)
            price = random.randint(8000, 35000)
        else:
            # Regular cars
            engine_size = round(random.uniform(1.0, 4.0), 1)
            horsepower = random.randint(120, 400)
            torque = random.randint(150, 350)
            acceleration = round(random.uniform(4.0, 9.0), 1)
            price = random.randint(15000, 80000)
    
    return [
        brand,
        model,
        year,
        is_electric,
        engine_size,
        horsepower,
        torque,
        acceleration,
        price
    ]

def generate_csv(filename='car_data.csv', num_rows=10000):
    headers = [
        'Car Make',
        'Car Model', 
        'Year',
        'isElectric',
        'Engine Size (L)',
        'Horsepower',
        'Torque (lb-ft)',
        '0-60 MPH Time (seconds)',
        'Price (in USD)'
    ]
    
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        
        # Write header
        writer.writerow(headers)
        
        # Generate and write data rows
        for i in range(num_rows):
            row_data = generate_car_data()
            writer.writerow(row_data)
            
            # Progress indicator
            if (i + 1) % 1000 == 0:
                print(f"Generated {i + 1} rows...")
    
    print(f"Successfully generated {filename} with {num_rows} rows of car data!")

# Run the generator
if __name__ == "__main__":
    generate_csv('car_data.csv', 10000)