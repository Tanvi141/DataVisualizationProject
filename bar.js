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
    if(selected_view=='City View'){
        var grayed = places.filter((p) => !selected_cities.includes(p))

        grayed.forEach(element => {
        // console.log(element,day)
        d3.selectAll('#'+element.split(' ').join(''))
        .attr('fill','rgba(25,25,25,0.4)')
        
    });
    }
    var yscales = []
    if(selected_view =="Gas View")
    {
        var city_name = places[city_selected]
        d3.selectAll('#'+city_name.split(' ').join(''))
        .attr('fill',getRandomColor())
        for(var i=0;i<attributes.length;i++)
        {
            var yscale = d3.scaleLinear().range([height,0])
            yscales.push(yscale.domain([0,makgases[city_selected][i]]))
        }
        yscalebar = yscalebar.domain([0,mak[city_selected]])
        xscalebar = xscalebar.domain(attributes.map(function(d){return d}))
        xlabel = 'Gases'
        ylabel = 'Concentration('+places[city_selected]+')'
    }
    else
    {   
        xscalebar = xscalebar.domain(selected_cities.map(function(d){return d}))
        // yscalebar = yscalebar.domain([0,d3.max(data, function(d,i){return Math.max(d,nxt[i])})])
        // console.log(makgases[gas_selected])
        var qwe=0
        for(var i=0;i<selected_cities.length;i++){
            console.log(makgases[places.indexOf(selected_cities[i])])
            if(qwe<makgases[places.indexOf(selected_cities[i])][gas_selected])
            qwe=makgases[places.indexOf(selected_cities[i])][gas_selected]
        }
        console.log(qwe)
        yscalebar = yscalebar.domain([0,qwe])
        xlabel = 'Cities'
        ylabel = 'Concentration'
    }
    if(selected_view=='City View')
        var xaxisbar = gbar.append('g').call(d3.axisBottom().scale(xscalebar)).attr('transform','translate(0,'+ height + ')').style('font-size',16).selectAll('text').attr("y", 0).attr("x", 9).attr("dy", ".35em").attr('transform','rotate(90)').style("text-anchor", "start");
    else
        var xaxisbar = gbar.append('g').call(d3.axisBottom().scale(xscalebar)).attr('transform','translate(0,'+ height + ')').style('font-size',16)
    xaxisbar.append('text')
    .attr('x',width-250)
    .attr('y',50)
    .attr('text-anchor','end')
    .attr('stroke','blue')
    .attr('fill','black')
    .style('font-size',32)
    .text(xlabel)
    if(selected_view=='City View'){
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
    .text(ylabel)}
    else{
        yscales.forEach((ele,i) => {
            gbar.append('g').call(d3.axisLeft().scale(ele)).style('font-size',12).attr('transform','translate('+xscalebar(attributes[i])+', 0 )')
            gbar.append('g').call(d3.axisRight().scale(ele).tickSize(0)).style('font-size',0).attr('transform','translate('+(xscalebar(attributes[i])+xscalebar.bandwidth())+', 0 )')
        })
    }
    bars = gbar.selectAll('.bar').data(data)
    var duplicate = data
    duplicate.sort()
    // console.log(data[4])
    bars = bars
    .enter()
    .append('rect')
    .attr('x',function(d,i){if(selected_view =="Gas View"){return xscalebar(attributes[i])} else{return xscalebar(selected_cities[i])} })
    .attr('y',function(d,i){if(selected_view=='City View'){return yscalebar(d)} else{return yscales[i](d)} })
    .attr('width', function(d){return xscalebar.bandwidth()})
    .attr('height', function(d,i){if(selected_view=='City View'){return height-yscalebar(d)}else{return height-yscales[i](d)}})
    .style('fill',function(d,ind){
        if(selected_view =="Gas View"){
            return colorBubbles[attributes[ind]]}
        else{
            // console.log(zones[ind])
            d3.selectAll('#'+selected_cities[ind].split(' ').join(''))
            .attr('fill',zones[duplicate.indexOf(d)])
            return colorMap[selected_cities[ind]]}})
    .transition()
    .duration(time)
    .ease(d3.easeLinear)
    .attr('y',function(d,i){if(selected_view=='City View'){return yscalebar(nxt[i])} else{return yscales[i](nxt[i])}})
    .attr('height',function(d,i){
        if(selected_view=='City View'){return height-yscalebar(nxt[i])}else{return height-yscales[i](nxt[i])}})
    
}
