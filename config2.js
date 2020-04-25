var time=500
const separators=[':',' ','/']
var rows=[];
var daywise = [];
var myVar=0
var gbar
var mak=[]
var attributes=['CO','NO2','NO','NOx','SO2'];
var places=['Taipei','New Taipei','Taoyuan','Hsinchu','Hsinchu City','Keelung','Yilan','Miaoli','Changhua','Nantou','Yunlin','Taichung','Chiayi','Chiayi City','Pingtung','Tainan','Kaohsiung','Hualien','Taitung','Penghu','Kinmen','Lianjiang'];
var city_selected=0
var north = "rgba(0, 154, 202, 0.5)",
west = "khaki",
east = "rgba(204, 28, 28, 0.6)",
south = "darkseagreen",
islands = "rgba(128, 0, 128, 0.5)";

var width_map = 600,   
height_map = 520;

var colorMap = {
    "Taipei" : north, 
    "New Taipei" : north, 
    "Taoyuan" : north,
    "Hsinchu" : north,
    "Hsinchu City" : north,
    "Keelung" : north,
    "Yilan" : north,
    "Miaoli" : west,
    "Changhua" : west,
    "Nantou" : west,
    "Yunlin" : west,
    "Taichung" : west,
    "Chiayi" : south,
    "Chiayi City" : south,
    "Pingtung" : south, 
    "Tainan" : south,
    "Kaohsiung" : south,
    "Hualien" : east,
    "Taitung" : east,
    "Penghu" : islands,
    "Kinmen" : islands,
    "Lianjiang" : islands
};

d3.csv("http://localhost:8000/final.csv", function (d) {
    
    // for(var i=0;i<places.length;i++)//separate index for each city
    // daywise.push([])
    daywise = new Array(places.length).fill([])
    mak = new Array(places.length).fill(0)
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
    console.log(daywise.length)
    // console.log(daywise)
})
$(document).ready(function(){
    myVar = setInterval("showTime()",time);
})
var idx=0
function showTime(){
    // console.log(len);
    // d3.selectAll('svg').remove()
    
    if(idx>=360){
        clearInterval(myVar);
    }
    else{
        if(idx!=0)
        gbar.remove()
        // console.log(daywise[0][idx],daywise[0][idx+1])
        showBarGraph(daywise[city_selected][idx],daywise[city_selected][idx+1]);
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
    .attr("transform", "translate(" + -300 + "," + height_map / 2 + ")"); 

function showBarGraph(data,nxt){
    
    var marginL = 100
    var marginR = 100
    var marginU = 100
    var marginD = 100
    var width = svgbar.attr('width') - marginL - marginR
    var height = svgbar.attr('height') - marginU - marginD
    var xscalebar = d3.scaleBand().range([0,width]).padding(0.4)
    var yscalebar = d3.scaleLinear().range([height,0])
    gbar = svgbar.append('g').attr('transform','translate('+marginL+','+marginU+')')
    xscalebar = xscalebar.domain(attributes.map(function(d){return d}))
    // yscalebar = yscalebar.domain([0,d3.max(data, function(d,i){return Math.max(d,nxt[i])})])
    yscalebar = yscalebar.domain([0,mak[city_selected]])
    var xaxisbar = gbar.append('g').call(d3.axisBottom().scale(xscalebar)).attr('transform','translate(0,'+ height + ')').style('font-size',16)
    xaxisbar.append('text')
    .attr('x',width-250)
    .attr('y',50)
    .attr('text-anchor','end')
    .attr('stroke','blue')
    .attr('fill','black')
    .style('font-size',32)
    .text('Gases')
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
    .text('Concentration('+places[city_selected]+')')
    bars = gbar.selectAll('.bar').data(data)
    // gbar.selectAll('.bar')
    // .data(data)
    bars = bars
    .enter()
    .append('rect')
    .attr('x',function(d,i){return xscalebar(attributes[i])})
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
                        city_selected = places.indexOf(d.properties.COUNTYNAME);
                        clearInterval(myVar)
                        myVar = setInterval("showTime()",time);
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