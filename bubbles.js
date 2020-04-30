var colorBubbles = {}
attributes.map((d) => {colorBubbles[d]=getRandomColor()})
// console.log(colorBubbles)

div_map.selectAll('.text').data(bubbles)
.enter()
.append('text')
.attr('x',function(d){return d})
.attr('y',45)
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
.attr('cy',40)
.attr('r',20)
// .attr('opacity',0.3)
.attr('id',function(d,i){'bubble'})
.attr('fill',function(d){return colorBubbles[attributes[(d/50)-1]]})
.on('click',function(d,i){
    if(selected_view=='City View'){
        console.log(gas_selected)
    d3.selectAll('#bubble')
    .attr('stroke-width',function(){console.log('asdfbhjasbfhabsfhjbsadfbajhsdvfdshfv');return 0})
    .attr('stroke','#ffffff')
    gas_selected = i;
    d3.select(this)
    .attr('stroke-width',4)
    .attr('stroke','#000000')
    .transition()
    .duration(time*2)
    .attr('r',30)
    .transition()
    .duration(time*2)
    .attr('r',20)
    restartGraph();}
})


