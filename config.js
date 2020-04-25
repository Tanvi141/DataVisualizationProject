
d3.csv("http://localhost:8000/final.csv", function (d) {
    const separators=[':',' ','/']
    var rows=[];
    var attributes=['CO','NO2','NO','NOx','SO2'];
    var places=['Taipei','New Taipei','Taoyuan','Hsinchu','Hsinchu City','Keelung','Yilan','Miaoli','Changhua','Nantou','Yunlin','Taichung','Chiayi','Chiayi City','Pingtung','Tainan','Kaohsiung','Hualien','Taitung','Penghu','Kinmen','Lianjiang'];
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
        entry_place=places.indexOf(d[i].city)

        //the values of all the attributes
        entry_attributes=[]
        for(var j=0;j<attributes.length;j++){
            at=attributes[j]
            entry_attributes.push(d[i][at])
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
