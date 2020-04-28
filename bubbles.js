var colorBubbles = {}
bubbles.map((d) => {colorBubbles[d]=getRandomColor()})
console.log(colorBubbles)

div_map.selectAll('.bubble').data(bubbles)
.enter()
.append('circle')
.attr('cx',function(d){return d})
.attr('cy',30)
.attr('r',20)
.attr('fill',function(d){return colorBubbles[d]})
.on('click',function(d,i){
    console.log("clicked")
    gas_selected = i;
    restartGraph();
})

div_map.selectAll('.text').data(bubbles)
.enter()
.append('text')
.attr('x',function(d){return d})
.attr('y',35)
.attr('text-anchor',"middle")
.text(function(d,i){return attributes[i]})
.on('click',function(d,i){
    console.log("clicked")
    gas_selected = i;
    restartGraph();
})
