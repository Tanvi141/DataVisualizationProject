var svgline = d3.select('#lineAnimated')
svgline = div.append('svg')
.attr('height',800)
.attr('width',800)


var lineFunction = d3.line()
    .x(function(d, i) { return x(d.date); }) // set the x values for the line generator
    .y(function(d) { return y(d.attributes[3]); }) // set the y values for the line generator 
    .curve(d3.curveMonotoneX)
// .interpolate("linear");

function showlineGraph(rows){
    //preprocess
    var dayline=[]
    for(var i=0;i<rows.length;i+=24){
        var avg = new Array(attributes.length).fill(0)
        var city = rows[i].city
        for(var j=i;j<i+24;j++)
        {
            avg = avg.map((val,idx) => val + parseFloat(rows[j].attributes[idx]))
        }
        avg = avg.map((val) => {if(mak[city]<val/24)mak[city]=val/24; return val/24})
        dayline.push({
           attributes: avg,
            date:rows[i].date,
            city:rows[i].city,
            time: rows[i].time
        })
    }
    data=dayline.filter(d=>(d.city==21 && (d.time.day==14 || d.time.day==28)))
    // console.log("called",data)
    margin = ({top:20, right:30, bottom:30, left:40})
    var width = svgline.attr('width') - margin.left - margin.right
    var height = svgline.attr('height') - margin.bottom - margin.top

    y = d3.scaleLinear()
    .domain([0, d3.max(data, d=> d.attributes[3])]).nice()
    .range([height - margin.bottom, margin.top])

    yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    // .call(g => g.select(".tick:last-of-type text").clone()
    //     .attr("x", 3)
    //     .attr("text-anchor", "start")
    //     .attr("font-weight", "bold")
    //     .text(data.attributes[3]))
        
    x = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([margin.left, width - margin.right])

    xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

    svgline.append("g")
        .call(xAxis);

    svgline.append("path")
        .datum(data)
        .attr("d",lineFunction)
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none");
    
    var rect = svgline.append('rect')
        .attr('x',0)
        .attr('y',0)
        .attr('width',width)
        .attr('height',height - margin.bottom)
        .attr('fill','#fff')
        .transition()
        .duration(5000)
        .ease(d3.easeLinear) 
        .attr('x',width+50)

    svgline.append("g")
        .call(yAxis);
}
