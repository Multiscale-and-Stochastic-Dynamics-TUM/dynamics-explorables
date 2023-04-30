import Plotly from 'plotly.js-dist-min'
 
plot = document.getElementById('plotlyDiv')
radiobutton = document.getElementById('help')
radiobutton.setAttribute("array", "help")
radiobutton.getAttribute("array")


Plotly.newPlot(
    plot, [], {xaxis: {range: [-10, 10]}, yaxis: {range: [-10, 10]}, showlegend: true, margin: {l:20,t:20,b:20,r:20}});

var tracked_point = [0.0,0.0]
Plotly.addTraces(plot,{x: [tracked_point[0]], y: [tracked_point[1]], mode: "markers", marker: {color: "black"}, name: "Tracked Point"})



/////adding click handle to the plot/////
plot_container = plot.querySelector(["svg.main-svg"])
clickHandler = (event) => {
    var element = plot_container.querySelector(["g.xy"]).querySelector(["rect"])
    var l_margin = element.x.baseVal.value
    var t_margin = element.y.baseVal.value
    var width = element.width.baseVal.value
    var height = element.height.baseVal.value

    var x_click = event.offsetX
    var y_click = event.offsetY

    
    if(x_click<l_margin || x_click>l_margin+width || y_click<t_margin || y_click>t_margin+height){
        return
    }
    //getting parameters of the axis on data
    var fig_layout = plot.layout
    var x_lim = fig_layout.xaxis.range
    var y_lim = fig_layout.yaxis.range

    var x_coord = (x_click - l_margin)/width*(x_lim[1]-x_lim[0])+x_lim[0]
    var y_coord = (y_click - t_margin)/height*(y_lim[0]-y_lim[1])+y_lim[1] //reminder the axis are reverted in respect to coordinates on the page
    tracked_point = [x_coord,y_coord]
    Plotly.update(plot, data_update = {x: [[tracked_point[0]]], y: [[tracked_point[1]]]}, 0)
    return
    } 
plot.addEventListener("click", clickHandler)
/////end/////

array = [1,2,3]