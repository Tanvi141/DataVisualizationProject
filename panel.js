var div_panel = d3.select("#map")
    .attr("width", width_map)
    .attr("height", height_map)
    .attr("transform", "translate(" + -300 + "," + height_map / 3 + ")");


//the config variables
var selected_view = "Gas View";
var selected_graph = "Bar Graph"
var selected_time = "Daywise View"
var leftptr = 2, rightptr = 10;
function createPanel() {


    var graphbutton = document.createElement("input");
    graphbutton.type = "button";
    graphbutton.value = "Change";
    graphbutton.id = "graphbutton";
    graphbutton.onclick = function () { changeGraph() }

    var graphtext = document.createElement("p");
    graphtext.innerHTML = "Bar Graph";
    graphtext.id = "graphtext";


    var viewbutton = document.createElement("input");
    viewbutton.type = "button";
    viewbutton.value = "Change";
    viewbutton.id = "viewbutton";
    viewbutton.onclick = function () { changeView() };

    var viewtext = document.createElement("p");
    viewtext.innerHTML = "Gas View";
    viewtext.id = "viewtext";

    var timebutton = document.createElement("input");
    timebutton.type = "button";
    timebutton.value = "Change";
    timebutton.id = "timebutton";
    timebutton.onclick = function () { changeTime() };

    var timetext = document.createElement("p");
    timetext.innerHTML = "Daywise View";
    timetext.id = "timetext";

    var slider1 = document.createElement("div");
    slider1.id = "hourslider"
    var slider2 = document.createElement("div");
    slider2.id = "monthslider"

    var selectPanel = document.getElementById('panel');
    selectPanel.appendChild(graphbutton);
    selectPanel.appendChild(graphtext);
    selectPanel.appendChild(viewbutton);
    selectPanel.appendChild(viewtext);
    selectPanel.appendChild(timebutton);
    selectPanel.appendChild(timetext);
    selectPanel.appendChild(slider1);
    selectPanel.appendChild(slider2);
}

function changeView() {
    var ele = document.getElementById('viewtext')
    if (ele.innerHTML == 'City View') {
        ele.innerHTML = 'Gas View'
        selected_view = "Gas View";
    }
    else {
        ele.innerHTML = 'City View'
        selected_view = "City View";
    }
    restartGraph();
}

function changeGraph() {
    var ele = document.getElementById('graphtext');
    if (ele.innerHTML == 'Bar Graph') {
        ele.innerHTML = 'Line Graph'
        selected_graph = "Line Graph"
    }
    else {
        ele.innerHTML = 'Bar Graph'
        selected_graph = "Bar Graph"
    }

    updateGraph();
    restartGraph();
}

function changeTime() {
    var ele = document.getElementById('timetext')
    if (ele.innerHTML == 'Daywise View') {
        ele.innerHTML = 'Hourwise View'
        selected_time = "Hourwise View"
    }
    else {
        ele.innerHTML = 'Daywise View';
        selected_time = "Daywise View"
    }
    updateSliders();
    restartGraph(1);
}

function createSliders() {
    var stepSlider1 = document.getElementById('hourslider');
    var stepSlider2 = document.getElementById('monthslider');

    noUiSlider.create(stepSlider1, {
        start: [2, 10],
        step: 1,
        range: {
            'min': [0],
            'max': [23]
        },
        pips: {
            mode: 'steps',
            density: 23,
        }
    });
    //Show the months
    noUiSlider.create(stepSlider2, {
        range: {
            min: timestamp('2015'),
            max: timestamp('2016')
        },
        // Steps of one week
        step: 7 * 24 * 60 * 60 * 1000,
        // Two more timestamps indicate the handle starting positions.
        start: [timestamp('2015'), timestamp('2016')],
        // No decimals
        format: { to: toFormat, from: Number }
    });

    stepSlider1.noUiSlider.on('end', function (values, handle) {
        leftptr = values[0];
        rightptr = values[1];
        restartGraph(1);
    });

    stepSlider2.noUiSlider.on('end', function (values, handle) {
        leftptr = values[0];
        rightptr = values[1];
        restartGraph(1);
    });    
    
    // stepSlider1.noUiSlider.on('slide', function (values, handle) {
    //     leftptr = values[0];
    //     rightptr = values[1];
    //     restartGraph(1);
    // });

    // stepSlider2.noUiSlider.on('slide', function (values, handle) {
    //     leftptr = values[0];
    //     rightptr = values[1];
    //     restartGraph(1);
    // });
}

function updateSliders() {
    var stepSlider1 = document.getElementById('hourslider');
    var stepSlider2 = document.getElementById('monthslider');

    if (selected_time == "Hourwise View") {
        stepSlider1.style.display = "none";
        stepSlider2.style.display = "block";
        var values=stepSlider2.noUiSlider.get();
        leftptr=values[0];
        rightptr=values[1];
    }
    else {
        stepSlider2.style.display = "none";
        stepSlider1.style.display = "block";
        var values=stepSlider1.noUiSlider.get();
        leftptr=values[0];
        rightptr=values[1];
    }
}

function updateGraph() {
    console.log(selected_graph)
    var bardiv = document.getElementById('barRace');
    var linediv = document.getElementById('lineAnimated');
    if (selected_graph == "Bar Graph") {
        bardiv.style.display = "block";
        linediv.style.display = "none";
    }
    else {
        bardiv.style.display = "none";
        linediv.style.display = "block";
    }
}

//initial functions
createPanel()
createSliders()
updateSliders()
updateGraph()

function restartGraph(recalculate=0) {
    clearInterval(myVar)

    //first preprocess the data if required
    console.log(rows)

  
    if (recalculate == 1) {
        var newdaywise=[]
        var newgaswise=[]

        //if it is newdaywise then for each day average hourly values 
        //if it is hourwise find all the days in the range and average for each value
        if(selected_time=="Daywise View"){
            leftptr=+leftptr
            rightptr=+rightptr
            //daywise
            for (var i = 0; i < places.length; i++)
                newdaywise.push([])
            for (var i = 0; i < rows.length; i += 24) {
                var avg = new Array(attributes.length).fill(0)
                var city = rows[i].city
                // console.log(city)
                for (var j = i+leftptr; j <= i + rightptr; j++) {
                    // console.log(rows[j])
                    avg = avg.map((val, idx) => val + parseFloat(rows[j].attributes[idx]))
                }
                // console.log(avg)
                avg = avg.map((val) => { if (mak[city] < val / (rightptr-leftptr+1)) mak[city] = val /(rightptr-leftptr+1); return val /(rightptr-leftptr+1)})
                newdaywise[city].push(avg)
            }
            for (var i = 0; i < attributes.length; i++)
                newgaswise.push([])
            for (var j = 0; j < attributes.length; j++)
                for (var i = 0; i < 365; i++)
                    newgaswise[j].push([])

            for (var i = 0; i < newdaywise.length; i++) {
                for (var j = 0; j < newdaywise[i].length; j++) {
                    for (var k = 0; k < attributes.length; k++) {
                        newgaswise[k][j].push(newdaywise[i][j][k])
                    }
                }
            }
        }
        else{
            var leftdate = new Date(+leftptr)
            var rightdate = new Date(+rightptr)

            //hourwise
            for(var c=0;c<places.length;c++){
                newdaywise.push([])
                for(var hr=0;hr<24;hr++){
                    var currrows=rows.filter(function(d){
                        return d.date.getTime()>leftdate.getTime() && d.date.getTime()<rightdate.getTime() && d.time.hour==hr && d.city==c;
                    })
                    var avg = new Array(attributes.length).fill(0)

                    for (var j = 0; j < currrows.length; j++) {
                        avg = avg.map((val, idx) => val + parseFloat(currrows[j].attributes[idx]))
                    }
                    avg = avg.map((val) => { if (mak[city] < val / currrows.length) mak[city] = val / currrows.length; return val / currrows.length })
                    newdaywise[c].push(avg)
                }
            }

            for (var i = 0; i < attributes.length; i++)
                newgaswise.push([])
            for (var j = 0; j < attributes.length; j++)
                for (var i = 0; i < 24; i++)
                    newgaswise[j].push([])

            for (var i = 0; i < newdaywise.length; i++) {
                for (var j = 0; j < newdaywise[i].length; j++) {
                    for (var k = 0; k < attributes.length; k++) {
                        newgaswise[k][j].push(newdaywise[i][j][k])
                    }
                }
            }
        }

        daywise=newdaywise
        gaswise=newgaswise
    }

    console.log("daywise",daywise)    
    console.log("gaswise",gaswise)    

    if(selected_graph=="Bar Graph"){
        idx_time = -1
        console.log(selected_view)
        if(selected_view=="Gas View"){
            myVar = setInterval("showTimeCity()", time);
        }
        else{
            myVar = setInterval("showTimeGas()", time);
        }
    }
    else{
        showlineGraph(rows)
    }
}

function timestamp(str) {
    console.log("timestamp of ", str, new Date(str).getTime)
    return new Date(str).getTime();
}

function toFormat(v) {
    return parseInt(v).toString();
}
