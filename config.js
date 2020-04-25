
d3.csv("http://localhost:8000/2015_Air_quality_in_northern_Taiwan.csv", function (d) {
    const separators=[':',' ','/']
    var rows=[];
    var attributes=['CO','NO2','NO','NOx','O3'];
    var places=['Banqiao','Cailiao','Datong','Dayuan','Guanyin','Guting','Keelung','Linkou','Longtan','Pingzhen','Sanchong','Shilin','Songshan','Tamsui','Taoyuan','Tucheng','Wanhua','Wanli','Xindian','Xinzhuang','Xizhi','Yangming','Yonghe','Zhongli' ];
    var last={}
    console.log(d.length)
    console.log(places.length)
    for(var i=0;i<6;i++){
        var entry={}
        
        //parsing for the time
        console.log(d[i])
        times=d[i].time.split(new RegExp(separators.join('|'), 'g'))
        entry_time={
            year: Number(times[0]),
            month: Number(times[1]),
            day: Number(times[2]),
            hour: Number(times[3]),
        }

        //finding the city
        entry_place=places.indexOf(d[i].station)

        //the values of all the attributes
        entry_attributes=[]
        for(var j=0;j<attributes.length;j++){
            at=attributes[j]
            if (d[i][at]==null){
                entry_attributes.push(last[at])
            }
            else{
                entry_attributes.push(d[i][at])
                last[at]=d[i][at]
            }
        }

        entry={
            time:entry_time,
            city:entry_place,
            attributes:entry_attributes,
        }
        rows.push({...entry})
    }
    console.log(rows)
})
