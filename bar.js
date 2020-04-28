var div = d3.select('#barRace')
var svgbar = div.append('svg')
.attr('height',800)
.attr('width',800)

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
    if(selected_view =="Gas View")
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

    bars = bars
    .enter()
    .append('rect')
    .attr('x',function(d,i){if(selected_view =="Gas View"){return xscalebar(attributes[i])} else{return xscalebar(selected_cities[i])} })
    .attr('y',function(d){return yscalebar(d)})
    .attr('width', function(d){return xscalebar.bandwidth()})
    .attr('height', function(d){return height-yscalebar(d)})
    .style('fill',function(d,ind){if(selected_view =="Gas View"){return colorBubbles[attributes[ind]]}else{return colorMap[selected_cities[ind]]}})
    .transition()
    .duration(time)
    .ease(d3.easeLinear)
    .attr('y',function(d,i){return yscalebar(nxt[i])})
    .attr('height',function(d,i){return height-yscalebar(nxt[i])})
    
}
