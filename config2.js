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
// var north = "rgba(0, 154, 202, 0.5)",
// west = "khaki",
// east = "rgba(204, 28, 28, 0.6)",
// south = "darkseagreen",
// islands = "rgba(128, 0, 128, 0.5)";

var width_map = 600,   
height_map = 520;

// var colorMap = {
//     "Taipei" : north, 
//     "New Taipei" : north, 
//     "Taoyuan" : north,
//     "Hsinchu" : north,
//     "Hsinchu City" : north,
//     "Keelung" : north,
//     "Yilan" : north,
//     "Miaoli" : west,
//     "Changhua" : west,
//     "Nantou" : west,
//     "Yunlin" : west,
//     "Taichung" : west,
//     "Chiayi" : south,
//     "Chiayi City" : south,
//     "Pingtung" : south, 
//     "Tainan" : south,
//     "Kaohsiung" : south,
//     "Hualien" : east,
//     "Taitung" : east,
//     "Penghu" : islands,
//     "Kinmen" : islands,
//     "Lianjiang" : islands
// };
var colorMap = {}
places.map((d) => {colorMap[d]=getRandomColor()})
console.log(colorMap)
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
    // daywise.map((d) => console.log(d.length))
    // console.log(daywise.length)
    // gaswise = gaswise.map((d) => [new Array(365).fill([])])
    for(var i=0;i<attributes.length;i++)
    gaswise.push([])
    for(var j=0;j<attributes.length;j++)
        for(var i=0;i<365;i++)
            gaswise[j].push([])
    // gaswise = gaswise.map((d) => console.log(d))
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

    // console.log(gaswise)
    // gaswise.map((d) => console.log(d.))
    
})
$(document).ready(function(){
    myVar = setInterval("showTimeCity()",time);
})
var idx=0
function showTimeCity(){
    // console.log(len);
    // d3.selectAll('svg').remove()
    
    if(idx>=360){
        clearInterval(myVar);
    }
    else{
        // con  sole.log(idx)
        if(idx!=0)
        gbar.remove()
        if(idx==-1)
        idx=0
        // console.log(daywise[0][idx],daywise[0][idx+1])
        showBarGraphCity(daywise[city_selected][idx],daywise[city_selected][idx+1],idx+1);
        idx++;
    }
}
function showTimeGas(){
    if(idx>=360){
        clearInterval(myVar);
    }
    else{
        if(idx!=0)
        gbar.remove()
        if(idx==-1)
        idx=0
        var qwe = selected_cities.map((d) => places.indexOf(d))
        console.log(gas_selected)
        var curr =  gaswise[gas_selected][idx].filter((d,id) => (qwe.includes(id)))
        var nxt = gaswise[gas_selected][idx+1].filter((d,id) => (qwe.includes(id)))
        // console.log(curr,nxt)
        showBarGraphCity(curr,nxt,idx+1);
        idx++;
    }
}
function getRandomColor() {
var letters = '0123456789ABCDEF';
var color = '#';
for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
}
return color;
}
var div = d3.select('#barRace')
var svgbar = div.append('svg')
.attr('height',800)
.attr('width',800)

var div_map = d3.select("#map")
    .append("svg")
    .attr("width", width_map)
    .attr("height", height_map)
    .attr("transform", "translate(" + -300 + "," + height_map / 3 + ")"); 

function showBarGraphCity(data,nxt,day){
    
    var marginL = 100
    var marginR = 100
    var marginU = 100
    var marginD = 100
    var width = svgbar.attr('width') - marginL - marginR
    var height = svgbar.attr('height') - marginU - marginD
    var xscalebar = d3.scaleBand().range([0,width]).padding(0.4)
    var yscalebar = d3.scaleLinear().range([height,0])
    var xlabel,ylabel;
    gbar = svgbar.append('g').attr('transform','translate('+marginL+','+marginU+')')
    gbar.append('text').attr('x',500).attr('y',0).text('Day: ' + day).attr('font-size',32)
    if(flag==0)
    {
        yscalebar = yscalebar.domain([0,mak[city_selected]])
        xscalebar = xscalebar.domain(attributes.map(function(d){return d}))
        xlabel = 'Gases'
        ylabel = 'Concentration('+places[city_selected]+')'
    }
    else
    {   
        xscalebar = xscalebar.domain(selected_cities.map(function(d){return d}))
        // yscalebar = yscalebar.domain([0,d3.max(data, function(d,i){return Math.max(d,nxt[i])})])
        yscalebar = yscalebar.domain([0,makgases[gas_selected]])
        xlabel = 'Cities'
        ylabel = 'Concentration'
    }
    var xaxisbar = gbar.append('g').call(d3.axisBottom().scale(xscalebar)).attr('transform','translate(0,'+ height + ')').style('font-size',16)
    xaxisbar.append('text')
    .attr('x',width-250)
    .attr('y',50)
    .attr('text-anchor','end')
    .attr('stroke','blue')
    .attr('fill','black')
    .style('font-size',32)
    .text(xlabel)
    var yaxisbar = gbar.append('g').call(d3.axisLeft().scale(yscalebar)).style('font-size',16)
    yaxisbar.append('text')
    .attr('transform','rotate(-90)')
    .attr('x',-150)
    .attr('y',-50)
    .attr('text-anchor','end')
    .attr('stroke','blue')
    .attr('fill','black')
    .style('font-size',32)
    .style('z-index',10)
    .text(ylabel)
    bars = gbar.selectAll('.bar').data(data)
    // gbar.selectAll('.bar')
    // .data(data)
    bars = bars
    .enter()
    .append('rect')
    .attr('x',function(d,i){if(flag==0){return xscalebar(attributes[i])} else{return xscalebar(selected_cities[i])} })
    .attr('y',function(d){return yscalebar(d)})
    .attr('width', function(d){return xscalebar.bandwidth()})
    .attr('height', function(d){return height-yscalebar(d)})
    .style('fill','#123123')
    .transition()
    .duration(time)
    .ease(d3.easeLinear)
    .attr('y',function(d,i){return yscalebar(nxt[i])})
    .attr('height',function(d,i){return height-yscalebar(nxt[i])})
    
}

d3.json("http://localhost:8000/taiwan.topo.json", function (data) {

                topo = topojson.feature(data, data.objects["layer1"]);

                prj = d3.geoMercator().center([120.979531, 23.978567]).scale(8000);
                path = d3.geoPath().projection(prj);
                console.log(path)
                div_map.selectAll("path")
                   .data(topo.features)
                   .enter()
                   .append("path")
                   .attr('id',function(d){return d.properties.COUNTYNAME})
                   .attr("d", path)
                   .attr("fill", function(d) {
                     return colorMap[d.properties.COUNTYNAME];
                    // return colorMap[d.COUNTYNAME]    
                     })
                   .attr("stroke", "rgba(238, 238, 238, 0.5)")
                   .on("mouseover", function(d) {
                      d3.select(this).attr("fill", "orange");     
                      var center = getCentroid(d3.select(this)); 
                      d3.select("#tooltip")
                      .style("left", center[0]+1000 + "px")
                      .style("top", center[1] + "px")
                      .select("#name")
                      .text(d.properties.COUNTYNAME);
                      d3.select("#tooltip").classed("hidden", false); 
                    })
                    .on("mouseout", function(d) {
                        d3.select(this).attr("fill", colorMap[d.properties.COUNTYNAME]);
                        d3.select("#tooltip").classed("hidden", true); 
                    })
                    .on('click',function(d){
                        if(flag==0){
                        city_selected = places.indexOf(d.properties.COUNTYNAME);
                        clearInterval(myVar)
                        myVar = setInterval("showTimeCity()",time);
                        idx=-1}
                        else{
                            var clicked = d.properties.COUNTYNAME;
                            if(selected_cities.includes(clicked)){
                                var id = selected_cities.indexOf(clicked)
                                selected_cities.splice(id,1)
                            }
                            else{
                                selected_cities.push(clicked)
                            }
                            clearInterval(myVar)
                            myVar = setInterval("showTimeGas()",time);
                            idx=-1
                        }
                    })
                   .append("title")
                   .text(function(d) {
                     return d.properties.COUNTYNAME;
                     });


            });


            function getCentroid(selection) {
                // get the DOM element from a D3 selection
                // you could also use "this" inside .each()
                var element = selection.node(),
                // use the native SVG interface to get the bounding box
                bbox = element.getBBox();
                 // return the center of the bounding box
                return [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
            }
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
div_map.selectAll('.bubble').data(bubbles)
.enter()
.append('circle')
.attr('cx',function(d){console.log(d);return d})
.attr('cy',30)
.attr('r',20)
.attr('fill','red')
.on('click',function(d,i){
    if(flag==1){
    gas_selected = i;
    clearInterval(myVar);
    myVar = setInterval("showTimeGas()",time);
    idx=-1}
})

div_map.selectAll('.text').data(bubbles)
.enter()
.append('text')
.attr('x',function(d){console.log(d);return d})
.attr('y',35)
.attr('text-anchor',"middle")
.text(function(d,i){return attributes[i]})

