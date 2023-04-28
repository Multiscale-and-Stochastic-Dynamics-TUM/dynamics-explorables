---
title: "Lorenz Attractor"
date: 2023-04-06T12:31:36+02:00
draft: false
js: "lorenz-attractor"
pyodide: true
featured: true
---

The Lorenz attractor is probably the most famous example of chaos. It is an ODE given by
    $$
    \begin{align}
    x &= \sigma (y - x) \\\
    y &= x (\rho - z) - y \\\
    z &= xy - \beta z.
    \end{align}
    $$
Try changing the parameters below and see how the trajectory behaves.

{{< plotly id="plotly3D">}}

{{< button id="playButton" text="Pause" >}}
{{< button id="resetButton" text="Reset" >}}

{{< slider id="sigmaSlider" min="0" max="20" step="0.1" value="10" >}}

{{< slider id="rhoSlider" min="26" max="30" step="0.1" value="28" >}}

{{< slider id="betaSlider" min="0" max="4" step="0.1" value="8/3" >}}