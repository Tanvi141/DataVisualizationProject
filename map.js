var width_map = 600,   
height_map = 520;

//svg element for map
var div_map = d3.select("#map")
    .append("svg")
    .attr("width", width_map)
    .attr("height", height_map)
    .attr("transform", "translate(" + -200 + "," + height_map / 3 + ")"); 

// function that generates a random color
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    // return 'rgb(0,'+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+')'
    return color;
}

var colorMap = {}
places.map((d) => {colorMap[d]=getRandomColor()})
//console.log(colorMap)

var idx_time=0
// this is controller for city view bar graph
function showTimeCity(){
    
    //clearing the interval when graphs are done
    if((idx_time>=23 && selected_time=="Daywise View")||(idx_time>=23 && selected_time=="Hourwise View")){
        clearInterval(myVar);
        
    }
    else{   
        // console.log(idx)
        if(idx_time!=0)
        gbar.remove()
        if(idx_time==-1)
        idx_time=0
        // console.log(daywise[0][idx],daywise[0][idx+1])
        showBarGraphCity(daywise[city_selected][idx_time],daywise[city_selected][idx_time+1],idx_time+1);
        idx_time++;
    }
    // console.log(selected_time,idx_time)
}
// this is controller for gas view bar graph
function showTimeGas(){

    //clearing the interval when graphs are done
    if((idx_time>=23 && selected_time=="Daywise View")||(idx_time>=23 && selected_time=="Hourwise View")){
        clearInterval(myVar);
        console.log("sdfasdfasdfsafsadf")
        places.forEach(element => {
            console.log(element)
            d3.selectAll('#'+element.split(' ').join(''))
            .attr('fill',colorMap[element])
        });
    }
    else{
        if(idx_time!=0)
        gbar.remove()
        if(idx_time==-1)
        idx_time=0
        var qwe = selected_cities.map((d) => places.indexOf(d))
        // console.log(gas_selected)
        var curr =  gaswise[gas_selected][idx_time].filter((d,id) => (qwe.includes(id)))
        var nxt = gaswise[gas_selected][idx_time+1].filter((d,id) => (qwe.includes(id)))
        // console.log(curr,nxt)
        showBarGraphCity(curr,nxt,idx_time+1);
        idx_time++;
    }
}

// for getting the centroid of the city
function getCentroid(selection) {
    // get the DOM element from a D3 selection
    // you could also use "this" inside .each()
    var element = selection.node(),
    // use the native SVG interface to get the bounding box
    bbox = element.getBBox();
        // return the center of the bounding box
    return [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
}
// displaying the map
d3.json("http://localhost:8000/taiwan3.topo.json", function (data) {

    topo = topojson.feature(data, data.objects["layer1"]);

    prj = d3.geoMercator().center([121.079531, 23.678567]).scale(8000);
    path = d3.geoPath().projection(prj);
    // console.log(topo.features)
    div_map.selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        .attr('id',function(d){/*console.log(d.properties.COUNTYNAME);*/return d.properties.COUNTYNAME.split(' ').join('')})
        .attr("d", path)
        .attr("fill", function(d) {
            return colorMap[d.properties.COUNTYNAME];
        // return colorMap[d.COUNTYNAME]    
            })
        .attr("stroke", "rgba(0, 0, 0, 0.5)")
        .attr('stroke-width',2)
        // .attr("stroke", function(d){return colorMap[d.properties.COUNTYNAME]})
        .on("mouseover", function(d) {
            d3.select(this).attr("fill", "black");
            // .attr("stroke", 'orange')
            var center = getCentroid(d3.select(this)); 
            d3.select("#tooltip")
            .style("left", center[0]+700 + "px")
            .style("top", center[1]+100 + "px")
            .select("#name")
            .text(d.properties.COUNTYNAME);
            d3.select("#tooltip").classed("hidden", false); 
        })
        .on("mouseout", function(d) {
            d3.select(this).attr("fill", colorMap[d.properties.COUNTYNAME]);
            // .attr("stroke", function(d){return colorMap[d.properties.COUNTYNAME]})
            d3.select("#tooltip").classed("hidden", true); 
        })
        .on('click',function(d){
            if(selected_graph== "Bar Graph"){//in case of bar graph
            if(selected_view =="Gas View"){
            //changing the selected city
            city_selected = places.indexOf(d.properties.COUNTYNAME);
            clearInterval(myVar)
            myVar = setInterval("showTimeCity()",time);
            idx_time=-1}
            else{
                //appending to the selected cities in case of city view
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
                idx_time=-1
            }}
            else{//in case of line graph
                if(selected_view =="Gas View"){
                    //changing the selected city
                    console.log(selected_graph,selected_view)
                    city_selected = places.indexOf(d.properties.COUNTYNAME);
                    showlineGraph(rows)
                }
                else{
                    //appending to the selected cities in case of city view
                    //you can only have max of 5 cities selected in line graph
                    var clicked = d.properties.COUNTYNAME;
                    if(selected_cities.includes(clicked)){
                        var id = selected_cities.indexOf(clicked)
                        selected_cities.splice(id,1)
                    }
                    else{
                        if(selected_cities.length<5)
                        selected_cities.push(clicked)
                    }
                    showlineGraph(rows)
                }
            }
        })
        // .append("title")
        // .text(function(d) {
        //     return d.properties.COUNTYNAME;
        //     });


});