var divline = d3.select('#lineAnimated')
var svgline = divline.append('svg')
.attr('height',800)
.attr('width',800)


var lineFunction = d3.line()
    .x(function(d, i) { return x(d.date); }) // set the x values for the line generator
    .y(function(d) { return y(d.attributes[gas_selected]); }) // set the y values for the line generator 
    .curve(d3.curveMonotoneX)
// .interpolate("linear");
var lineFunction2 = d3.line()
    .x(function(d, i) { return x(d.date); }) // set the x values for the line generator
    .y(function(d) { return y(d.val); }) // set the y values for the line generator 
    .curve(d3.curveMonotoneX)
// .interpolate("linear");


function showlineGraph(rows){
    divline.select('svg')
    .remove()
    .exit()
    svgline = divline.append('svg')
    .attr('height',800)
    .attr('width',800)

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
    var dataNest=[];
    var makk=0;
    if(selected_view=='Gas View')
    {
        console.log(city_selected)
        data = dayline.filter(d => (d.city==city_selected) && (d.time.day==14 || d.time.day==28))
        for(var i=0;i<attributes.length;i++)
        {
            var qwe=[]
            for(var j=0;j<data.length;j++){
                if(makk<data[j].attributes[i])
                makk = data[j].attributes[i]
                qwe.push({val:data[j].attributes[i],date:data[j].date})
            }
            dataNest.push(qwe)
        }
    }
    else{    
        data=dayline.filter(d=>(selected_cities.includes(places[d.city]) && (d.time.day==14 || d.time.day==28)))
        dataNest = d3.nest()
        .key(function(d){return d.city})
        .entries(data)
    }
    // console.log("called",data)
    console.log(dataNest)
    margin = ({top:20, right:30, bottom:30, left:40})
    var width = svgline.attr('width') - margin.left - margin.right
    var height = svgline.attr('height') - margin.bottom - margin.top
    
    console.log(dataNest)
    if(selected_view=='City View')
    {y = d3.scaleLinear()
    .domain([0, d3.max(data, d=> d.attributes[gas_selected])]).nice()
    .range([height - margin.bottom, margin.top])}
    else{
        y = d3.scaleLinear()
        .domain([0, makk]).nice()
        .range([height - margin.bottom, margin.top])
    }
    var yaxis =svgline.append('g').call(d3.axisLeft(y)).attr("transform", `translate(${margin.left},0)`)
    // yAxis = g => g
    // .attr("transform", `translate(${margin.left},0)`)
    // .call(d3.axisLeft(y))
    // .call(g => g.select(".domain").remove())
    
    // .call(g => g.select(".tick:last-of-type text").clone()
    //     .attr("x", 3)
    //     .attr("text-anchor", "start")
    //     .attr("font-weight", "bold")
    //     .text(data.attributes[3]))
        
    x = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([margin.left, width - margin.right])
    var xaxis = svgline.append('g').call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0)).attr("transform", `translate(0,${height - margin.bottom})`)
    // xAxis = g => g
    // .attr("transform", `translate(0,${height - margin.bottom})`)
    // .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

    // svgline.append("g")
    //     .call(xAxis)
    //     .call(yAxis)
    if(selected_view=='City View'){
    dataNest.forEach(function(d,i){
        console.log(d,i)
        svgline.append("path")
        .datum(d.values)
        .attr("d",lineFunction)
        .attr("stroke", function(d){return colorMap[places[d[0].city]]})
        .attr("stroke-width", 1)
        .attr("fill", "none");
    });
    }
    else{
        dataNest.forEach(function(d,i){
            console.log(d,i)
            svgline.append("path")
            .datum(d)
            .attr("d",lineFunction2)
            .attr("stroke", function(d){return colorBubbles[attributes[i]];})
            .attr("stroke-width", 1)
            .attr("fill", "none");
        });
    }
        
    
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

    // svgline.append("g")
    //     .call(yAxis);
}
