var svgline = d3.select('#lineAnimated')
svgline = div.append('svg')
.attr('height',800)
.attr('width',800)


var lineFunction = d3.line()
.x(function(d) { return x(d.date); })
.y(function(d) { return y(d.rate); })
// .interpolate("linear");

function showlineGraph(data){
    console.log("called",data)
    margin = ({top:20, right:30, bottom:30, left:40})
    var width = svgbar.attr('width') - margin.left - margin.right
    var height = svgbar.attr('height') - margin.bottom - margin.top

    y = d3.scaleLinear()
    .domain([0, d3.max(data, d=> d.attributes[3])]).nice()
    .range([height - margin.bottom, margin.top])

    yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(data.attributes[3]))
        
    x = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([margin.left, width - margin.right])

    xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

    svgline.append("g")
        .call(xAxis);
    svgline.append("g")
        .call(yAxis);

    svgline.append("path")
        .attr("d", lineFunction(data))
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none");

}
