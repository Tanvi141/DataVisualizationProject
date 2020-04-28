var div_panel = d3.select("#map")
    .attr("width", width_map)
    .attr("height", height_map)
    .attr("transform", "translate(" + -300 + "," + height_map / 3 + ")"); 

function createButton() {
    var button = document.createElement("input");
    button.type = "button";
    button.value = "City View";
    button.id="viewbutton";
    button.onclick = function(){changeView()}
    
    var selectPanel = document.getElementById('panel');
    selectPanel.appendChild(button);
}

function changeView(){
    var val  = document.getElementById('viewbutton').value;
    if(val =='City View'){ 
        clearInterval(myVar)
        document.getElementById('viewbutton').value = 'Gas View'
        myVar = setInterval("showTimeGas()",time);
        idx=-1
        flag_bar=1
    }
    else{
        document.getElementById('viewbutton').value = 'City View'
        clearInterval(myVar)
        myVar = setInterval("showTimeCity()",time)
        idx=-1
        flag_bar=0
    }
}
createButton()