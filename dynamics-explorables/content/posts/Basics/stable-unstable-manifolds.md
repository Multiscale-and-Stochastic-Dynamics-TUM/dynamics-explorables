---
title: "Stable & Unstable Manifolds"
date: 2023-04-06T11:37:41+02:00
draft: false
js: stable-unstable-manifolds
cover:
    image: ""
    alt: ""
    caption: ""
keywords: ["manifold"]
---
{{< plotly id="plotlyDiv" >}}
{{< button id="linPlayButton" text="Play" >}}
{{< button id="linResetButton" text="Reset" >}}
{{< button id="TEST" text="TEST" >}}

{{< radio_button id = "time_forwards" name = "time" value = 5 label = "Forwards">}}
{{< radio_button id = "time_backwards" name = "time" value = -5 label = "Backwards">}}



Welcome to the section about stable and unstable manifolds,
an important structure in the phase space that helps to understand dynamics around the equilibrium points (if the point satisfies certain conditions).
First the idea will be introcuced on the linear systems in tabs "Linear System" and "Eigenspaces" and generalised in "General System" and "Manifolds".
Otherwise, you can interract immediately with the example above.
You can click the graph to put a point on the phase space and evolve it by clicking "Play".
You can change parameters of the demo using inputs to the right.

## Linear

In this section let us consider a continuous-time ($T$) dynamical system $\dot x = f(x)$, generating flow $\phi_t(\cdot)$, with an eqilibrium point $x_\*$ (WLOG $x_\*$ is located at the origin).
As seen previously linearisation is a good starting point to analise any given dynamical system.
Linearisation of the system at $x_\*$ is a system of the form: $\dot X = AX$, where $A$ is the matrix $A = Df(x_\*)$.
If the matrix $A$ has no eigenvalues with the real parts equal to zero, the point $x_\*$ is called hyperbolic.
In the demonstration above we have an example of a two dimentional linearised system with a hyperbolic eqilibrium.
You can put a point by clicking the phase space and evolve it by pressing "Play". 
Try different initial conditions and see if their trajectories (orbits) follow any patterns.

The system we look at in the example is:
$$\begin{pmatrix} \dot x \newline \dot y \end{pmatrix} = \begin{pmatrix} x \newline -y + x^2 \end{pmatrix},$$
with the equilibrium at the origin. The jacobian at the origin is the following matrix:

$$Df (\textbf{0}) = \begin{pmatrix}  
1 & 0\newline
0 & -1
\end{pmatrix}$$
