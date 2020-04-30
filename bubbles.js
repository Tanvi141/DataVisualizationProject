var colorBubbles = {}
attributes.map((d) => {colorBubbles[d]=getRandomColor()})
// console.log(colorBubbles)
div_map
.append('text')
.attr('x',215)
.attr('y',85)
.attr('font-weight','bold')
.attr('font-size',24)
.text('Gases')
div_map.selectAll('.bubble').data(bubbles)
.enter()
.append('circle')
.attr('cx',function(d){return d+100})
.attr('cy',40)
.attr('r',20)
.attr('id',function(d,i){return ('bubble'+i)})
.attr('fill',function(d){return colorBubbles[attributes[(d/50)-1]]})
.on('click',function(d,i){
    if(selected_view=='City View'){
        console.log(gas_selected)

    gas_selected = i;
    d3.select(this)
    .transition()
    .duration(time*2)
    .attr('r',30)
    .transition()
    .duration(time*2)
    .attr('r',20)
    restartGraph();}
})


div_map.selectAll('.text').data(bubbles)
.enter()
.append('text')
.attr('x',function(d){return d+100})
.attr('y',45)
.attr('id','bubble')
.attr('font-weight','bold')
.attr('text-anchor',"middle")
.text(function(d,i){return attributes[i].slice(0,2)})
.append('tspan')
.text(function(d,i){return attributes[i].slice(2)})
.style('font-size', '.9rem')
    .attr('dx', '.01em')
    .attr('dy', '.3em')
.on('click',function(d,i){
    if(selected_view=='City View'){
    console.log(d,i)
    gas_selected = i;
    d3.select('#bubble'+gas_selected)
    .transition()
    .duration(time*2)
    .attr('r',30)
    .transition()
    .duration(time*2)
    .attr('r',20)
    restartGraph();}
})

