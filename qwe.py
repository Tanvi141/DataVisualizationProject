import csv
with open('2015_Air_quality_in_northern_Taiwan.csv','r') as f:
	reader = csv.reader(f)
	for row in reader:
		try:
			temp = float(row[16])
		except:
			print(row)