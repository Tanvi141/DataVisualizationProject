var div_panel = d3.select("#map")
    .attr("width", width_map)
    .attr("height", height_map)
    .attr("transform", "translate(" + -300 + "," + height_map / 3 + ")"); 


//the config variables
var selected_view="Gas View";
var selected_graph="Bar Graph"
var selected_time="Daywise View"
function createPanel() {
    

    var graphbutton= document.createElement("input");
    graphbutton.type = "button";
    graphbutton.value = "Change";
    graphbutton.id="graphbutton";
    graphbutton.onclick = function(){changeGraph()}
    
    var graphtext= document.createElement("p");
    graphtext.innerHTML="Bar Graph"; 
    graphtext.id="graphtext";
    

    var viewbutton = document.createElement("input");
    viewbutton.type = "button";
    viewbutton.value = "Change";
    viewbutton.id="viewbutton";
    viewbutton.onclick = function(){changeView()};

    var viewtext=document.createElement("p");
    viewtext.innerHTML="Gas View";
    viewtext.id="viewtext";
    
    var timebutton = document.createElement("input");
    timebutton.type = "button";
    timebutton.value = "Change";
    timebutton.id="timebutton";
    timebutton.onclick = function(){changeTime()};

    var timetext=document.createElement("p");
    timetext.innerHTML="Daywise View";
    timetext.id="timetext";

    var slider1=document.createElement("div");
    slider1.id="hourslider"
    var slider2=document.createElement("div");
    slider2.id="monthslider"

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

function changeView(){
    var ele = document.getElementById('viewtext')    
    clearInterval(myVar)
    if(ele.innerHTML =='City View'){ 
        ele.innerHTML = 'Gas View'
        myVar = setInterval("showTimeGas()",time);
        flag_bar=1
    }
    else{
        ele.innerHTML = 'City View'
        myVar = setInterval("showTimeCity()",time)
        flag_bar=0
    }
    idx_time=-1
    selected_view=ele.innerHTML;
}

function changeGraph(){
    var ele  = document.getElementById('graphtext');    
    if(ele.innerHTML =='Bar Graph'){ 
        ele.innerHTML = 'Line Graph'
        selected_graph="Line Graph"
    }
    else{
        ele.innerHTML = 'Bar Graph'
        selected_graph="Bar Graph"
    }

    updateGraph()
}

function changeTime(){
    var ele  = document.getElementById('timetext')    
    if(ele.innerHTML =='Daywise View'){ 
        ele.innerHTML = 'Hourwise View'
        selected_time="Hourwise View"
    }
    else{
        ele.innerHTML = 'Daywise View';
        selected_time="Daywise View"
    }
    updateSliders()
}

function createSliders(){
    var stepSlider1 = document.getElementById('hourslider');
    var stepSlider2 = document.getElementById('monthslider');

    noUiSlider.create(stepSlider1, {
        start: [2,10],
        step: 1,
        range: {
            'min': [0],
            'max': [24]
        },
        pips: {
            mode: 'steps',
            density: 24,
        }
    });
        //Show the months
    noUiSlider.create(stepSlider2, {
        start: [2,10],
        step: 1,
        range: {
            'min': [0],
            'max': [12]
        },
        pips: {
            mode: 'steps',
            density: 12,
        }
    });

    stepSlider1.noUiSlider.on('update', function (values, handle) {
        console.log(values[handle]);
    });

    stepSlider2.noUiSlider.on('update', function (values, handle) {
        console.log(values[handle]);
    });
}

function updateSliders(){
    var stepSlider1 = document.getElementById('hourslider');
    var stepSlider2 = document.getElementById('monthslider');
    
    if(selected_time=="Hourwise View"){
        stepSlider1.style.display="none";    
        stepSlider2.style.display="block";    
    }
    else{
        stepSlider2.style.display="none";    
        stepSlider1.style.display="block";    
    }
}

function updateGraph(){
    console.log(selected_graph)
    var bardiv= document.getElementById('barRace');
    var linediv=document.getElementById('lineAnimated');
    if(selected_graph=="Bar Graph"){
        bardiv.style.display="block";
        linediv.style.display="none";
    }
    else{
        bardiv.style.display="none";
        linediv.style.display="block";
    }
}

//initial functions
createPanel()
createSliders()
updateSliders()
updateGraph() 

function makeTheMagicHappen(){
    
    //first preprocess the data
}