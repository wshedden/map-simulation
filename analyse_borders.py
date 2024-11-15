# Analyse borders file "country_code","country_name","country_border_code","country_border_name"

import pandas as pd
import numpy as np
from scipy.interpolate import interp1d

# Load the CSV file
file_path = '/home/will/code/web/mapgame/borders.csv'
data = pd.read_csv(file_path)

# Extract the country code and border code columns
country_border_codes = data[['country_code', 'country_border_code']]
country_border_codes = country_border_codes.drop_duplicates()

# Load the CSV files
populations = pd.read_csv('/home/will/code/web/mapgame/populations_interpolated.csv')
country_codes = pd.read_csv('/home/will/code/web/mapgame/countrycodes.csv')

# Standardize the country names in both dataframes
populations['Country/Territory'] = populations['Country/Territory'].str.strip()
country_codes['name'] = country_codes['name'].str.strip()

# Merge the dataframes on the country names
merged_df = populations.merge(country_codes, left_on='Country/Territory', right_on='name', how='left')

# Create a mapping of country names to country codes
country_code_mapping = merged_df.set_index('Country/Territory')['alpha-2'].to_dict()

# Add the country codes to the populations dataframe
populations['country_code'] = populations['Country/Territory'].map(country_code_mapping)

# Print all rows with missing country codes
missing_country_codes = populations[populations['country_code'].isnull()]

country_code_mapping = {
    'Bolivia': 'BO',
    'British Virgin Islands': 'VG',
    'Brunei': 'BN',
    'Cape Verde': 'CV',
    'Curacao': 'CW',
    'Czech Republic': 'CZ',
    'DR Congo': 'CD',
    'Falkland Islands': 'FK',
    'Iran': 'IR',
    'Ivory Coast': 'CI',
    'Laos': 'LA',
    'Macau': 'MO',
    'Micronesia': 'FM',
    'Moldova': 'MD',
    'Namibia': 'NA',
    'Netherlands': 'NL',
    'North Korea': 'KP',
    'Palestine': 'PS',
    'Republic of the Congo': 'CG',
    'Reunion': 'RE',
    'Russia': 'RU',
    'Saint Barthelemy': 'BL',
    'Saint Martin': 'MF',
    'Sint Maarten': 'SX',
    'South Korea': 'KR',
    'Syria': 'SY',
    'Taiwan': 'TW',
    'Tanzania': 'TZ',
    'Turkey': 'TR',
    'United Kingdom': 'GB',
    'United States': 'US',
    'United States Virgin Islands': 'VI',
    'Vatican City': 'VA',
    'Venezuela': 'VE',
    'Vietnam': 'VN'
}



# Print missing country codes
missing_country_codes = populations[populations['country_code'].isnull()]
# Go through all countries with no code and add the country codes from the mapping
for country_name in missing_country_codes['Country/Territory']:
    populations.loc[populations['Country/Territory'] == country_name, 'country_code'] = country_code_mapping[country_name]
    
# Print all rows, scrollable
pd.set_option('display.max_rows', None)
print(populations)

# Save to populations_interpolated_with_codes.csv
populations.to_csv('/home/will/code/web/mapgame/populations_interpolated_with_codes.csv', index=False)