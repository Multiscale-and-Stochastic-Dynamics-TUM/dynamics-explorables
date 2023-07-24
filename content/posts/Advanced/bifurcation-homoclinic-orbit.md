---
title: "Bifurcation of a Homoclinic Orbit"
date: 2023-06-13T12:43:06+02:00
draft: false
js: "bifurcation-homoclinic-orbit"
keywords: ["discrete_map", "bifurcation"]
---

In the [previous]({{< ref "pitchfork" >}}) [posts]({{< ref "hopf" >}}) we looked at systems in which subtle changes in a parameter lead to drastic changes the phase space -- an effect called a bifurcation. However, all those bifurcations were local, in that they only considered the phase portrait in a small neighborhood around the critical point. Now, we will zoom out and look at the whole phase space.
<!--more-->

Take a look at the phase space in the plot below:

<!-- Phase plot with a slider for the parameter -->
{{< plotly id="streamlines" >}}
{{< slider id="streamlinesSlider" min="0.5" max="0.9" step="0.02" value="0.8" >}}

Previously, a bifurcation occurred when a critical point changed its stability under the variation of a parameter. This is not the case here: the system of ODEs has a critical point at $\mathbf{x} = 0$; however, this point remains a saddle for all values of $p$. And yet, the phase plot changes qualitatively as the parameter changes. Here is the same phase plot, but with the {{<span style="color:blue" text="stable" >}} and {{<span style="color:red" text="unstable" >}} manifolds marked. Can you find the value of $p$ at which a bifurcation occurs?

<!-- Same phase plot but with stable/unstable manifold in red -->
{{< plotly id="streamlinesManifolds" >}}
{{< slider id="streamlinesManifoldsSlider" min="0.5" max="0.9" step="0.02" value="0.8" >}}

At $p = 0.8$, the stable and unstable manifolds meet and form a single orbit. An orbit like this which starts at a critical point at returns back to it is called a homoclinic orbit. Similarly, a heteroclinic orbit is a trajectory which starts at one critical point and converges to another one. 

{{< figure src="/images/homo-heteroclinic_orbit.png" caption="**Left**: heteroclinic orbit, **right**: homoclinic orbit" width=400 alt="An image of a hetero- and homoclinic orbit" align="center" >}}
