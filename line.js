var divline = d3.select('#lineAnimated')
var svgline = divline.append('svg')
.attr('height',800)
.attr('width',800)

function getMax(a){
    return Math.max(...a.map(e => Array.isArray(e) ? getMax(e) : e));
  }

var lineFunction = d3.line()
    .x(function(d, i) {return x(dates_all[d.date]); }) // set the x values for the line generator
    .y(function(d) { return y(d.val); }) // set the y values for the line generator 
    .curve(d3.curveMonotoneX)

var lineFunction2 = d3.line()
    .x(function(d, i) { return x(i); }) // set the x values for the line generator
    .y(function(d) { return y(d.val); }) // set the y values for the line generator 
    .curve(d3.curveMonotoneX)


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
    
    if(selected_time=="Daywise View"){
        x = d3.scaleTime()
        .domain(d3.extent(rows, d => d.date))
        .range([margin.left, width - margin.right])
    }
    else{
        x = d3.scaleLinear()
        .domain([0,23])
        .range([margin.left, width - margin.right])
    }
    if(selected_view=='Gas View')
    {
        var max=0;
        //plot the lines for all gases in city_selected
        for(var i=0;i<attributes.length;i++){
            var gas_entry=[]

            for(var j=0;j<dates_all.length;j++){
                gas_entry.push({
                    date: j,
                    gas: i,
                    val: gaswise[i][j][city_selected]
                })
                if(gaswise[i][j][city_selected]>=max) max=gaswise[i][j][gas_selected];
            }
            dataNest.push({
                points: gas_entry,
                gas: i,
            })
        }
        console.log("dataNest",dataNest)
        y = d3.scaleLinear()
            .domain([0, max]).nice()
            .range([height - margin.bottom, margin.top])

        var xaxis = svgline.append('g').call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0)).attr("transform", `translate(0,${height - margin.bottom})`)
        var yaxis =svgline.append('g').call(d3.axisLeft(y)).attr("transform", `translate(${margin.left},0)`)
        dataNest.forEach(function(d,i){
            if(selected_time=="Daywise View")
                svgline.append("path")
                    .datum(d.points)
                    .attr("d",lineFunction)
                    .attr("stroke", function(){console.log(d); return colorBubbles[attributes[+d.gas]]})
                    .attr("stroke-width", 2)
                    .attr("fill", "none");
            else
                svgline.append("path")
                    .datum(d.points)
                    .attr("d",lineFunction2)
                    .attr("stroke", function(){console.log(d); return colorBubbles[attributes[+d.gas]]})
                    .attr("stroke-width", 2)
                    .attr("fill", "none");
        });
    }
    else{ //city view
        var max=0;
        for(var i=0;i<places.length;i++){
            if(selected_cities.includes(places[i])){
                var city_entry=[]
                // console.log(dates_all)
                for(var j=0;j<dates_all.length;j++){
                    city_entry.push({
                        date: j,
                        city: i,
                        val: daywise[i][j][gas_selected]
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
        var xaxis = svgline.append('g').call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0)).attr("transform", `translate(0,${height - margin.bottom})`)
        var yaxis =svgline.append('g').call(d3.axisLeft(y)).attr("transform", `translate(${margin.left},0)`)
        dataNest.forEach(function(d,i){
            console.log(d,i);
            if(selected_time=="Daywise View")
                svgline.append("path")
                    .datum(d.points)
                    .attr("d",lineFunction)
                    .attr("stroke", function(){console.log(d); return colorMap[places[+d.city]]})
                    .attr("stroke-width", 2)
                    .attr("fill", "none");
                
            else
                svgline.append("path")
                    .datum(d.points)
                    .attr("d",lineFunction2)
                    .attr("stroke", function(){console.log(d); return colorMap[places[+d.city]]})
                    .attr("stroke-width", 2)
                    .attr("fill", "none");
                
        });
    }

    var rect = svgline.append('rect')
        .attr('x',0)
        .attr('y',0)
        .attr('width',width)
        .attr('height',height - margin.bottom)
        .attr('fill',"rgb(236, 253, 252)")
        .transition()
        .duration(5000)
        .ease(d3.easeLinear) 
        .attr('x',width+50)
}
