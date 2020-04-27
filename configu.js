var time=100
const separators=[':',' ','/']
var rows=[];
var daywise = [];
var gaswise = [];
var myVar=0
var gbar
var mak=[]
var makgases = []
var attributes=['CO','NO2','NO','NOx','SO2'];
var places=['Taipei','New Taipei','Taoyuan','Hsinchu','Hsinchu City','Keelung','Yilan','Miaoli','Changhua','Nantou','Yunlin','Taichung','Chiayi','Chiayi City','Pingtung','Tainan','Kaohsiung','Hualien','Taitung','Penghu','Kinmen','Lianjiang'];
var city_selected=0
var gas_selected=0 
var selected_cities = ['Taipei','New Taipei','Taoyuan','Hsinchu','Hsinchu City']
var flag = 0
var bubbles = [ 50, 100, 150, 200, 250]
var width_map = 600,   
height_map = 520;


d3.csv("http://localhost:8000/final.csv", function (d) {
    
    for(var i=0;i<places.length;i++)//separate index for each city
    daywise.push([])
    // daywise = new Array(places.length).fill([])
    mak = new Array(places.length).fill(0)
    makgases = new Array(attributes.length).fill(0)
    // gaswise = new Array(attributes.length).fill([])
    console.log(d.length)
    console.log(places.length)
    for(var i=0;i<d.length;i++){
        var entry={}
        
        //parsing for the time
        // console.log(d[i])
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
            if(makgases[j]<d[i][at])
                makgases[j] = d[i][at]
        }

        entry={
            time:entry_time,
            city:entry_place,
            attributes:entry_attributes,
        }
        rows.push({...entry})
    }
    console.log(rows.length)
    for(var i=0;i<rows.length;i+=24){
        var avg = new Array(attributes.length).fill(0)
        var city = rows[i].city
        // console.log(city)
        for(var j=i;j<i+24;j++)
        {
            // console.log(rows[j])
            avg = avg.map((val,idx) => val + parseFloat(rows[j].attributes[idx]))
        }
        // console.log(avg)
        avg = avg.map((val) => {if(mak[city]<val/24)mak[city]=val/24; return val/24})
        daywise[city].push(avg)
        // console.log(avg)
    }

    for(var i=0;i<attributes.length;i++)
        gaswise.push([])
    for(var j=0;j<attributes.length;j++)
        for(var i=0;i<365;i++)
            gaswise[j].push([])

    for(var i=0;i<daywise.length;i++)
    {
        for(var j=0;j<daywise[i].length;j++)
        {
            for(var k=0;k<attributes.length;k++)
            {
                gaswise[k][j].push(daywise[i][j][k])
            }
        }
    }
    
})
$(document).ready(function(){
    myVar = setInterval("showTimeCity()",time);
})



function changeView(){
    var val  = document.getElementById('button').innerHTML;
    if(val =='City View'){ 
        clearInterval(myVar)
        document.getElementById('button').innerHTML = 'Gas View'
        myVar = setInterval("showTimeGas()",time);
        idx=-1
        flag=1
    }
    else{
        document.getElementById('button').innerHTML = 'City View'
        clearInterval(myVar)
        myVar = setInterval("showTimeCity()",time)
        idx=-1
        flag=0
    }
}

