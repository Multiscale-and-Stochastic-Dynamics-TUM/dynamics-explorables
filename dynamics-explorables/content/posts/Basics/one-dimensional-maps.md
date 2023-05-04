---
title: "One Dimensional Maps"
date: 2023-04-24T21:21:00+02:00
draft: false
js: one-dimensional-maps
---

Logistic one of the mos famous one dimmensional map is the so called Logistic map. The ecuation of the so called 
map is: 

$$y_{k+1} = 4y_k(1-y_k)$$

In this page we present a computation of the iterations of the logistic map that shows the iterations of the cobweb diagram.
Select an initial condition for the map and start iterating. Change the initial condition for reseting the plot.


{{< slider id="startValueSlider" min="0.0" max="1.0" step="0.01" value="0.4" >}}

{{< plotly id="plotlyMap">}}
{{< button id="stepButton" text="Iterate">}}

