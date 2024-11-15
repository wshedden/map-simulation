import json

def save_filtered_countries():
    disputed_regions = ['W. Sahara', 'Kosovo', 'N. Cyprus', 'Antarctica', 'Somaliland']
    
    with open('countries.json', 'r') as file:
        data = json.load(file)
    
    geometries = data['objects']['countries']['geometries']
    filtered_geometries = [geometry for geometry in geometries if geometry['properties']['name'] not in disputed_regions]
    
    data['objects']['countries']['geometries'] = filtered_geometries
    
    with open('countries_no_disputed.json', 'w') as file:
        json.dump(data, file, indent=2)

if __name__ == "__main__":
    save_filtered_countries()