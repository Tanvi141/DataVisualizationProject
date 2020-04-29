# CO, NO, NO2, NOx,SO2 
# FOR TEMPERATURE,2
# Tamsui,Datong ka temperature kabhi record hi nahi hua he so now changing them
# only null,#,*,x
# done

# FOR CH4,3 
# Cailiao,Dayuan,Guanyin,Linkou,Longtan,Pingzhen,Shilin,Tamsui,Wanhua,Wanli,Xindian,Xinzhuang,Xizhi,Yangming dont have data
# so i think we should leave this gas.
# not done

# FOR CO,4
# only null,#,*,x
# done

# FOR NMHC,5
# same as CH4
# i think we should leave this also
# not done

# FOR NO,6
# only null,#,*,x
# done

# FOR NO2,7
# only null,#,*,x
# done

# FOR NOx,8
# only null,#,*,x
# done

# FOR O3,9
# Datong,Sanchong have null values, so not touching their values
# done

# FOR PH_RAIN,10
# 84% is null, so we should leave this
# not done

# FOR PM10,11
# only null,#,*,x
# done

# FOR PM2.5,12
# there is an 'x' suffix, tell what to do
# not done

# FOR RAINFALL,13
# either value is NR or null, i think we should leave this

# FOR RAIN_COND,14
# same as rainfall

# FOR RH,15
# Datong,Tamsui have null values, so not touching their values
# only null,#,*,x
# done

# FOR SO2,16
# only null,#,*,x
# done

# FOR THC,17
# 56% values are null, so i think we should leave this
# not done

# FOR UVB,WD_HR, excessive null,so we should leave this

# rest 3 columns are related to wind like direction,speed, doesnt make sense in our visualization,so we should leave these 
import csv
data = []
# for temperature,O3,rh
# with open('2015_Air_quality_in_northern_Taiwan.csv','r') as f:
# 	reader = csv.reader(f)
# 	k=0
# 	last=0
# 	for row in reader:
# 		# print(row)
# 		try:
# 			temp = float(row[15])
# 			data.append(row)
# 			last = row[15]
# 		except:
# 			if row[15]=='' and row[1]!='Datong' and row[1]!='Tamsui':
# 				row[15] = last
# 			elif('#' in row[15]):
# 				row[15] = row[15].split('#')[0]
# 				last  = row[15]
# 			elif('x' in row[15]):
# 				row[15] = row[15].split('x')[0]
# 				last = row[15]
# 			elif('*' in row[15]):
# 				row[15] = row[15].split('*')[0]
# 				last = row[15]
# 			data.append(row)
# with open('2015_Air_quality_in_northern_Taiwan.csv','w') as f:
# 	writer = csv.writer(f)
# 	for row in data:
# 		writer.writerow(row)

# for co,no,no2,nox,pm10
# with open('2015_Air_quality_in_northern_Taiwan.csv','r') as f:
# 	reader = csv.reader(f)
# 	k=0
# 	last=0
# 	for row in reader:
# 		# print(row)
# 		try:
# 			co = float(row[16])
# 			data.append(row)
# 			last = row[16]
# 		except:
# 			if row[16]=='':
# 				row[16] = last
# 			elif('#' in row[16]):
# 				row[16] = row[16].split('#')[0]
# 				last  = row[16]
# 			elif('x' in row[16]):
# 				row[16] = row[16].split('x')[0]
# 				last = row[16]
# 			elif('*' in row[16]):
# 				row[16] = row[16].split('*')[0]
# 				last = row[16]
# 			data.append(row)
# with open('2015_Air_quality_in_northern_Taiwan.csv','w') as f:
# 	writer = csv.writer(f)
# 	for row in data:
# 		writer.writerow(row)
scam = {
	'Banqiao':'Taipei',
	'Cailiao':'New Taipei',
	'Datong':'Taoyuan',
	'Dayuan':"Hsinchu",
	'Guanyin':"Hsinchu City",
	'Guting':"Keelung",
	'Keelung':"Yilan",
	'Linkou':"Miaoli",
	'Longtan':"Changhua",
	'Pingzhen':"Nantou",
	'Sanchong':"Yunlin",
	'Shilin':"Taichung",
	'Songshan':"Chiayi",
	'Tamsui':"Chiayi City",
	'Taoyuan':"Pingtung",
	'Tucheng':"Tainan",
	'Wanhua':"Kaohsiung",
	'Wanli':"Hualien",
	'Xindian':"Taitung",
	'Xinzhuang':"Penghu",
	'Xizhi':"Kinmen",
	'Yangming':"Lianjiang",
	'Yonghe':'Kaohsiung City',
	'Zhongli':'Tainan City',
	'Zhongshan':'Taichung City',
}
cities = []
with open('2015_Air_quality_in_northern_Taiwan.csv','r') as f:
	reader = csv.reader(f)
	for row in reader:
		if row[1] not in cities:
			cities.append(row[1])
			print(row[1])
print(len(cities))
data = [['time','city','CO','NO','NO2','NOx','SO2']]
with open('2015_Air_quality_in_northern_Taiwan.csv','r') as f:
	reader = csv.reader(f)
	for row in reader:
		if row[1] in scam:
			data.append([row[0],scam[row[1]],row[4],row[6],row[7],row[8],row[16]])
with open('final.csv','w') as f:
	writer = csv.writer(f)
	for row in data:
		writer.writerow(row)
