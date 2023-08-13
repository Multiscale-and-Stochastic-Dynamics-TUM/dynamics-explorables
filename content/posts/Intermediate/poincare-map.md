---
title: "Poincaré map"
date: 2023-04-06T11:23:25+02:00
draft: false
js: poincare-map
keywords: ["discrete_map"]
featured: true
---

Imagine you are a spectator at a car race. You are sitting in front of a race track and you watch racing cars roar past you as they do their laps. You can't see the whole race track at once, only a small piece of it in front of you. Nevertheless, is there something you can deduce about the trajectories of the cars just by observing how they pass in front of you? Press the button below to animate the car!
<!-- more -->

{{< plotly id="carExample" height="60%" >}}
{{< button id="carButton" text="Lap" >}}

{{< slider id="carSlider" min="-1.0" max="1.0" step="0.1" value="0.8" label="start height" >}}

It looks like the car gets attracted to a certain point on the track even if it starts closer to one of the sides. We can speculate that maybe there is one optimal trajectory around the lap that gives the best results, so the driver wants to get as close to this trajectory as possible. 

Let's put some numbers on this. Every time a car passes us, we will record its distance from the center of the track (the y-coordinate in the image). When the same car returns, we will record its position again. What we get is a function that maps the starting position to the return position.

{{< plotly id="carTrajectory" height="60%" >}}

{{< slider id="carSlider2" min="-1.0" max="1.0" step="0.1" value="0.8" label="start height" >}}

{{< plotly id="carPoincareMap" >}}

This function is called the Poincaré map. It is a [discrete map]({{< ref "/posts/basics/one-dimensional-maps" >}}), and we can iterate it to get the position of the car after it makes one lap, two laps, three laps and so on. The map has an attractive fixed point at zero, so if we apply the map multiple times, the result will converge to this fixed point. For our racing example, this means that the car will always return to the same point on the track in front of you. 

## Zooming out

Mathematically, to define a Poincaré map, we need a continuous-time dynamical system which has a periodic orbit. In our racing example, the dynamical system is given by the movement of the cars, and the periodic orbit is our hypothesized most optimal trajectory that the drivers want to follow. From a more general point of view, the dynamical system is usually given by an ODE. 

The sketch below shows a simple vector field on an ODE that has a periodic orbit drawn in red. 

{{< plotly id="vectorPlot" height="70%" >}}

Consider any point $\mathbf{y}$ on the orbit. This will be the position of the viewer. Here, we have $\mathbf{y} = \begin{pmatrix}0 & 1\end{pmatrix}^T$. Let 
  $$\Sigma = \\{x \in \mathbb{R} \mid (x - y) \cdot f(y) = 0 \\}$$
be a cross-section which contains $y$ and is perpendicular to the flow at $y$. In the sketch below, $\Sigma$ is drawn in {{< span style="color:orange" text="orange" >}}. Let's choose a point $x \in \Sigma$ close to $y$, for and track how it evolves. Press "play" to start the simulation. 

{{< plotly id="singleTrajectory" height="70%" >}}
{{< button id="stepButton" text="Play" >}}

We started at the point {{< span id="startingPointSpan" text="$\mathbf{x} = \begin{pmatrix} x_1 & x_2 \end{pmatrix}^T = \begin{pmatrix} 0 & 1.3 \end{pmatrix}^T$" >}} and hit the cross-section again at the point {{< span id="returnPointSpan" text="$\mathbf{x}' = \begin{pmatrix} x_1' & x_2' \end{pmatrix}^T = \begin{pmatrix} 0 & 1.06 \end{pmatrix}^T$" >}}. Try changing the y-coordinate $x_2$ of the starting point below to explore how the return point $\mathbf{x}'$ changes.

{{< plotly id="allTrajectories" height="70%" >}}
{{< slider id="x2Slider" min="0.0" max="2.0" step="0.1" value="1.3" >}}

Similarly to our racing example, we can define a Poincare map $P(\mathbf{x})$ which maps the starting point $\mathbf{x}$ on the cross-section to the return point $\mathbf{x}'$.

{{< plotly id="poincareMap" >}}

It can be shown that the map is locally well-defined and $C^1$ on $\mathcal{B}(y, \delta) \cap \Sigma$. The Poincaré map is a helpful tool in analyzing dynamical systems with periodic orbits because it reduces the dimensionality of the system by one -- in our case, from two dimensions to one. 