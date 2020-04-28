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
    if(flag_bar==1){
    gas_selected = i;
    clearInterval(myVar);
    myVar = setInterval("showTimeGas()",time);
    idx=-1}
})

div_map.selectAll('.text').data(bubbles)
.enter()
.append('text')
.attr('x',function(d){return d})
.attr('y',35)
.attr('text-anchor',"middle")
.text(function(d,i){return attributes[i]})
.on('click',function(d,i){
    if(flag_bar==1){
    gas_selected = i;
    clearInterval(myVar);
    myVar = setInterval("showTimeGas()",time);
    idx=-1}
})
