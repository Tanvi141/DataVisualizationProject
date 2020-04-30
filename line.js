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
        xaxis.append('text')
            .attr('x',width-250)
            .attr('y',50)
            .attr('text-anchor','end')
            .attr('stroke','blue')
            .attr('fill','black')
            .style('font-size',27)
            .text(function(){if(selected_time=="Daywise View") return "day of the year";else{return "time of the day"}})

        yaxis.append('text')
            .attr('transform','rotate(-90)')
            .attr('x',-250)
            .attr('y',-10)
            .attr('text-anchor','end')
            .attr('stroke','blue')
            .attr('fill','black')
            .style('font-size',27)
            .style('z-index',1)
            .text(function(){if(selected_view=="Gas View") return `concentration in ${places[city_selected]}`; else return `concentration of ${attributes_units[gas_selected]}`})

        dataNest.forEach(function(d,i){
            if(selected_time=="Daywise View")
                svgline.append("path")
                    .datum(d.points)
                    .attr("d",lineFunction)
                    .attr("stroke", function(){console.log(d); return colorBubbles[attributes[+d.gas]]})
                    .attr("stroke-width", 3)
                    .attr("fill", "none")
                    .append("svg:title")
                      .text(function(d, i) { return attributes[+d.gas] });
            else
                svgline.append("path")
                    .datum(d.points)
                    .attr("d",lineFunction2)
                    .attr("stroke", function(){console.log(d); return colorBubbles[attributes[+d.gas]]})
                    .attr("stroke-width", 3)
                    .attr("fill", "none")
                    .append("svg:title")
                      .text(function(d, i) { return attributes[+d.gas] });
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
        xaxis.append('text')
            .attr('x',width-250)
            .attr('y',50)
            .attr('text-anchor','end')
            .attr('stroke','blue')
            .attr('fill','black')
            .style('font-size',27)
            .text(function(){if(selected_time=="Daywise View") return "day of the year";else{return "time of the day"}})

        yaxis.append('text')
            .attr('transform','rotate(-90)')
            .attr('x',-250)
            .attr('y',-20)
            .attr('text-anchor','end')
            .attr('stroke','blue')
            .attr('fill','black')
            .style('font-size',27)
            .style('z-index',1)
            .text(function(){if(selected_view=="Gas View") return `concentration in ${places[city_selected]}`; else return `concentration of ${attributes_units[gas_selected]}`})

        dataNest.forEach(function(d,i){
            console.log(d,i);
            if(selected_time=="Daywise View")
                svgline.append("path")
                    .datum(d.points)
                    .attr("d",lineFunction)
                    .attr("stroke", function(){console.log(d); return colorMap[places[+d.city]]})
                    .attr("stroke-width", 3)
                    .attr("fill", "none")
                    .append("svg:title")
                      .text(function(d, i) { return places[+d.city] });

                
            else
                svgline.append("path")
                    .datum(d.points)
                    .attr("d",lineFunction2)
                    .attr("stroke", function(){console.log(d); return colorMap[places[+d.city]]})
                    .attr("stroke-width", 3)
                    .attr("fill", "none")
                    .append("svg:title")
                      .text(function(d, i) { return places[+d.city] });

            var n = d.points.length
            console.log(d.points[0])
            svgline.append('text')
            .text(places[d.city])
            .attr("transform", "translate(" + (width-40) + "," + y(d.points[n-1].val) + ")")
                
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
