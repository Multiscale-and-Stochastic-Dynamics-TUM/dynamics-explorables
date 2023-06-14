---
title: "Bifurcation of a Homoclinic Orbit"
date: 2023-06-13T12:43:06+02:00
draft: false
js: false
keywords: ["discrete_map", "bifurcation"]
---

In posts ... and ... we looked at systems in which subtle changes in a parameter lead to drastic changes the phase space -- an effect called a bifurcation. However, all those bifurcations were local, in that they only considered the phase portrait in a small neighborhood around the critical point. Now, we will zoom out and look at the whole phase space far from the critical point.
<!--more-->

Take a look at the phase space in the plot below:

<!-- Phase plot with a slider for the parameter -->

In the previous posts on bifurcations, a bifurcation occurred when the critical point changed its stability under the variation of a parameter. This system of ODEs has a critical point at $\mathbf{x} = 0$; however, this point remains a saddle for all values of $p$. And yet, the phase plot changes qualitatively as the parameter changes. Here is the same phase plot, but with the stable and unstable manifolds marked. Can you find the value of $p$ at which a bifurcation occurs?

<!-- Same phase plot but with stable/unstable manifold in red -->

<!-- how to compute things:

- Magic ODE: f[x_, y_, q_] := {a x  + (x^2 + y^2)* hopf[x - 1, y - 1, q][[1]], 
  b y  + (x^2 + y^2) * hopf[x - 1, y - 1 , q][[2]]}
- bifurcation at q = sqrt(2)
- Compute limit cycles by evolving a trajectory in positive/negative time and use the trajectory after several orbits
- limit cycle for q < sqrt(2)
-->

At p = TODO, the stable and unstable manifolds meet and form a single orbit. An orbit like this which starts at a critical point at returns back to it is called a homoclinic orbit. Similarly, a heteroclinic orbit is a trajectory which starts at one critical point and converges to another one. 

<!-- static image of homo/heteroclinic orbits -->