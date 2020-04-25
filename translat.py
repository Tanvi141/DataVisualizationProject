from translate import Translator
translator= Translator(to_lang="en",from_lang='zh-cn')
langu = ['臺北市',
'新北市',
'桃園縣',
'新竹縣',
'新竹市',
'基隆市',
'宜蘭縣',
'苗栗縣',
'彰化縣',
'南投縣',
'雲林縣',
'臺中市',
'嘉義縣',
'嘉義市',
'屏東縣',
'臺南市',
'高雄市',
'花蓮縣',
'臺東縣',
'澎湖縣',
'金門縣',
'連江縣']
for l in langu:
    translation = translator.translate(l)
    print(translation)
# 