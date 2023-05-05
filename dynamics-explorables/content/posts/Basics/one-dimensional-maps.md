---
title: "One Dimensional Maps"
date: 2023-04-24T21:21:00+02:00
draft: false
js: one-dimensional-maps
---

One of the most famous one-dimensional maps is the so-called logistic map. The equation is given by:: 

$$y_{k+1} = 4y_k(1-y_k)$$

You can see the iterations of the logistic map in the cobweb diagram below.
Select an initial condition for the map and start iterating. Change the initial condition to reset the plot.


{{< slider id="startValueSlider" min="0.0" max="1.0" step="0.01" value="0.4" >}}

{{< plotly id="plotlyMap">}}
{{< button id="stepButton" text="Iterate">}}

