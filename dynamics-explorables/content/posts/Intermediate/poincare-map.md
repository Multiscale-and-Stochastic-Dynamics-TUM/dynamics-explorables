---
title: "Poincaré map"
date: 2023-04-06T11:23:25+02:00
draft: false
js: poincare-map
cover:
    image: "https://images.unsplash.com/photo-1479232284091-c8829ec114ad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
    alt: "What is definitely the Poincare map"
    caption: 'Photo by <a href="https://unsplash.com/@rrruthie?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Ruthie</a> on <a href="https://unsplash.com/de/fotos/a6mfMjCFkII?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>'
keywords: ["discrete_map"]
featured: true
---

Consider the two-dimensional ODE in polar coordinates 
    $$
    \begin{align}
    \dot{r} &= (1 - r^2) r \\\
    \dot{\theta} &= 10.
    \end{align}
    $$
The ODE has a periodic orbit at $r = 1$ drawn in red.

{{< plotly id="vectorPlot">}}

Suppose we want to know how a point close to this periodic orbit behaves. Intuitively, it should behave almost-periodically, meaning that the trajectory should return to a point which is close to the starting point after a whole revolution around the circle.

Let us formalize this idea. Consider any point $\mathbf{y}$ on the orbit. In our example, we have $\mathbf{y} = \begin{pmatrix}0 & 1\end{pmatrix}^T$. Let 
    $$\Sigma = \\{x \in \mathbb{R} \mid (x - y) \cdot f(y) = 0 \\}$$
be a cross-section which contains $y$ and is perpendicular to the flow at $y$. In the sketch below, $\Sigma$ is drawn in {{< span style="color:orange" text="orange" >}}. Let's choose a point $x \in \Sigma$ close to $y$, for and track how it evolves. Press "play" to start the simulation. 

{{< plotly id="singleTrajectory" >}}
{{< button id="stepButton" text="Play" >}}

We started at the point {{< span id="startingPointSpan" text="$\mathbf{x} = \begin{pmatrix} x_1 & x_2 \end{pmatrix}^T = \begin{pmatrix} 0 & 1.3 \end{pmatrix}^T$" >}} and hit the cross-section again at the point {{< span id="returnPointSpan" text="$\mathbf{x}' = \begin{pmatrix} x_1' & x_2' \end{pmatrix}^T = \begin{pmatrix} 0 & 1.06 \end{pmatrix}^T$" >}}. Try changing the y-coordinate $x_2$ of the starting point below to explore how the return point $\mathbf{x}'$ changes.

{{< plotly id="allTrajectories" >}}
{{< slider id="x2Slider" min="0.0" max="2.0" step="0.1" value="1.3" >}}

The map $P(\mathbf{x})$ which maps the starting point $\mathbf{x}$ to the return point $\mathbf{x}'$ is called the Poincaré map. It can be shown that the map is locally well-defined and $C^1$ on $\mathcal{B}(y, \delta) \cap \Sigma$. The Poincaré map is a helpful tool in analyzing dynamical systems with periodic orbits because it reduces the dimensionality of the system by one. 

We can apply the usual tools for the analysis of discrete systems to learn more about the Poincaré map. For example, we see graphically in the plot below that the map has a fixed point at $x_2 = 1$. This corresponds to the periodic orbit in the two-dimensional system. Furthermore, since the fixed point is stable, so is the periodic orbit.

{{< plotly id="poincarePlot" >}}