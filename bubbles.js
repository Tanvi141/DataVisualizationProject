var colorBubbles = {}
attributes.map((d) => {colorBubbles[d]=getRandomColor()})
console.log(colorBubbles)

div_map.selectAll('.text').data(bubbles)
.enter()
.append('text')
.attr('x',function(d){return d})
.attr('y',35)
.attr('id','bubble')
.attr('font-weight','bold')
.attr('text-anchor',"middle")
.text(function(d,i){return attributes[i]})
.on('click',function(d,i){
    gas_selected = i;
    restartGraph();
})

div_map.selectAll('.bubble').data(bubbles)
.enter()
.append('circle')
.attr('cx',function(d){return d})
.attr('cy',30)
.attr('r',20)
.attr('opacity',0.3)
.attr('id','bubble')
.attr('fill',function(d){return colorBubbles[attributes[(d/50)-1]]})
.on('click',function(d,i){
    gas_selected = i;
    d3.select(this)
    .transition()
    .duration(time*2)
    .attr('r',30)
    .transition()
    .duration(time*2)
    .attr('r',20)
    restartGraph();
})


