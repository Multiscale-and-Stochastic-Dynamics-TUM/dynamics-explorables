---
title: "Poincaré map"
date: 2023-04-06T11:23:25+02:00
draft: false
js: poincare-map
---

Consider the two-dimensional ODE
    $$
    \begin{align}
    \dot{r} &= (1 - r^2) r \\\
    \dot{\theta} &= 10
    \end{align}
    $$
in polar coordinates. The ODE has a periodic orbit at $r = 1$ drawn in red.

{{< plotly id="vectorPlot">}}

Suppose we want to know how a point close to this periodic orbit behaves. Intuitively, it should behave almost-periodically, meaning that the trajectory should return to a point which is close to the starting point after a whole revolution around the circle.

Let us formalize this idea. Consider any point $y$ on the orbit. In our example, we have $y = \begin{pmatrix}0 & 1\end{pmatrix}^T$. Let 
    $$\Sigma = \\{x \in \mathbb{R} \mid (x - y) \cdot f(y) = 0 \\}$$
be a cross-section which contains $y$ and is perpendicular to the flow at $y$. In the sketch below, $\Sigma$ is drawn in orange. Let's choose a point $x \in \Sigma$ close to $y$, for and    track how it evolves.

{{< plotly id="singleTrajectory" >}}
{{< button id="stepButton" text="Play" >}}

We started at the point x = [0, x] and hit the cross-section again at the point x' = [0, x']. You can vary the starting point to see how the result changes.

{{< plotly id="allTrajectories" >}}
{{< slider id="y0Slider" min="0.0" max="2.0" step="0.1" value="1.3" >}}

<!-- <div class="range" style="--min:0.5; --max:1.5; --step:0.1;">
    <input type="range" id="y0Slider" min="0.5" max="1.5" step="0.1" value="1.3">
    <label id="y0SliderLabel" for="y0Slider"></label>
</div> -->

