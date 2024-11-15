import pandas as pd
from scipy.interpolate import interp1d
import numpy as np

# Load the CSV file
file_path = '/home/will/code/web/mapgame/populations.csv'
data = pd.read_csv(file_path)


# Extract the 1970 and 2022 population columns
population_1970_2022 = data[['Country/Territory', '1970 Population', '2022 Population']]

# Print the resulting DataFrame
print(population_1970_2022)

# Interpolate the population data for each year between 1970 and 2022
years = np.arange(1970, 2023)
population_interpolated = pd.DataFrame()
population_interpolated['Country/Territory'] = population_1970_2022['Country/Territory']
for index, row in population_1970_2022.iterrows():
    f = interp1d([1970, 2022], [row['1970 Population'], row['2022 Population']])
    population_interpolated.loc[index, years] = f(years)
    

# Save the dataframe
population_interpolated.to_csv('/home/will/code/web/mapgame/populations_interpolated.csv', index=False)
