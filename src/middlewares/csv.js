import csv from 'csv'

csv
.generate({ delimiter: ','})
.pipe(csv.parse({ delimiter: ','}))