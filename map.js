var width_map = 600,   
height_map = 520;


var div_map = d3.select("#map")
    .append("svg")
    .attr("width", width_map)
    .attr("height", height_map)
    .attr("transform", "translate(" + -300 + "," + height_map / 3 + ")"); 


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

var colorMap = {}
places.map((d) => {colorMap[d]=getRandomColor()})
console.log(colorMap)

var idx=0
function showTimeCity(){
    
    if(idx>=360){
        clearInterval(myVar);
    }
    else{
        // console.log(idx)
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

function getCentroid(selection) {
    // get the DOM element from a D3 selection
    // you could also use "this" inside .each()
    var element = selection.node(),
    // use the native SVG interface to get the bounding box
    bbox = element.getBBox();
        // return the center of the bounding box
    return [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
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
            if(flag_bar==0){
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