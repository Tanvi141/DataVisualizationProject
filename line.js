var divline = d3.select('#lineAnimated')
var svgline = divline.append('svg')
.attr('height',800)
.attr('width',800)

function getMax(a){
    return Math.max(...a.map(e => Array.isArray(e) ? getMax(e) : e));
  }

var lineFunction = d3.line()
    .x(function(d, i) {return x(dates_all[d.date]); }) // set the x values for the line generator
    .y(function(d) { return y(d.val[gas_selected]); }) // set the y values for the line generator 
    .curve(d3.curveMonotoneX)
// .interpolate("linear");
var lineFunction2 = d3.line()
    .x(function(d, i) { return x(d.date); }) // set the x values for the line generator
    .y(function(d) { return y(d.val); }) // set the y values for the line generator 
    .curve(d3.curveMonotoneX)
// .interpolate("linear");


function showlineGraph(rows){
    divline.select('svg')
    .remove()
    .exit()
    svgline = divline.append('svg')
    .attr('height',800)
    .attr('width',800)

    var dataNest=[];
    margin = ({top:20, right:30, bottom:30, left:40})
    var width = svgline.attr('width') - margin.left - margin.right
    var height = svgline.attr('height') - margin.bottom - margin.top

    if(selected_view=='Gas View')
    {
       dataNest=gaswise;
    }
    else{
        var max=0;
        var indices_cities=[]
        for(var i=0;i<places.length;i++){
            if(selected_cities.includes(places[i])){
                var city_entry=[]
                // console.log(dates_all)
                for(var j=0;j<dates_all.length;j++){
                    city_entry.push({
                        date: j,
                        city: i,
                        val: daywise[i][j]
                    })
                    if(daywise[i][j][gas_selected]>=max) max=daywise[i][j][gas_selected];
                }
                dataNest.push({
                    points: city_entry,
                    city: i,
                })
            }
        }
        console.log("dataNest",dataNest)
        y = d3.scaleLinear()
            .domain([0, max]).nice()
            .range([height - margin.bottom, margin.top])
        x = d3.scaleTime()
            .domain(d3.extent(rows, d => d.date))
            .range([margin.left, width - margin.right])
        var xaxis = svgline.append('g').call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0)).attr("transform", `translate(0,${height - margin.bottom})`)
        var yaxis =svgline.append('g').call(d3.axisLeft(y)).attr("transform", `translate(${margin.left},0)`)
        dataNest.forEach(function(d,i){
            console.log(d,i);
            svgline.append("path")
            .datum(d.points)
            .attr("d",lineFunction)
            .attr("stroke", function(){console.log(d); return colorMap[places[+d.city]]})
            .attr("stroke-width", 2)
            .attr("fill", "none");
        });
        indices_cities.forEach(function(d){
            console.log(d);

        });
    }


    
    if(selected_view=='City View')
    {}
    else{
        y = d3.scaleLinear()
        .domain([0, makk]).nice()
        .range([height - margin.bottom, margin.top])
    }
    var yaxis =svgline.append('g').call(d3.axisLeft(y)).attr("transform", `translate(${margin.left},0)`)
    
    
    if(selected_view=='City View'){
    
    }
    else{
        dataNest.forEach(function(d,i){
            console.log(d,i)
            svgline.append("path")
            .datum(d)
            .attr("d",lineFunction2)
            .attr("stroke", function(d){return colorBubbles[attributes[i]];})
            .attr("stroke-width", 1)
            .attr("fill", "none");
        });
    }
        
    
    var rect = svgline.append('rect')
        .attr('x',0)
        .attr('y',0)
        .attr('width',width)
        .attr('height',height - margin.bottom)
        .attr('fill','#fff')
        .transition()
        .duration(5000)
        .ease(d3.easeLinear) 
        .attr('x',width+50)
}
