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

Previously, a bifurcation occurred when a critical point changed its stability under the variation of a parameter. This is not the case here. The system of ODEs has two critical points, one at the origin $\mathbf{x}_1 = (0, 0)$ and one at $\mathbf{x}_2 = (1, 0)$. However, both points do not change their stability: $\mathbf{x}_1$ remains a saddle and $\mathbf{x}_2$ remains a source for all values of $p$. 

And yet, the phase plot changes qualitatively as the parameter changes. Here is the same phase plot, but with the {{<span style="color:blue" text="stable" >}} and {{<span style="color:red" text="unstable" >}} manifolds marked. Can you find the value of $p$ at which a bifurcation occurs?

<!-- Same phase plot but with stable/unstable manifold in red -->
{{< plotly id="streamlinesManifolds" >}}
{{< slider id="streamlinesManifoldsSlider" min="0.5" max="0.9" step="0.02" value="0.8" >}}

At $p = 0.8$, the stable and unstable manifolds meet and form a single orbit. Our visualization makes this sudden jump very apparent: at $p = 0.78$, the {{<span style="color:blue" text="stable" >}} manifold spirals to the critical point in the center of the plot, but at $p = 0.8$, it gets caught by the critical point at the origin, $\mathbf{x} = 0$. An orbit like this which starts at a critical point at returns back to it is called a homoclinic orbit. Similarly, a heteroclinic orbit is a trajectory which starts at one critical point and converges to another one. 

{{< figure src="/images/homo-heteroclinic_orbit.png" caption="**Left**: heteroclinic orbit, **right**: homoclinic orbit" width=400 alt="An image of a hetero- and homoclinic orbit" align="center" >}}

If we push the slider even further to $p > 0.8$, something interesting happens. The {{<span style="color:red" text="unstable" >}} manifold splits from the homoclinic orbit and instead spirals to a limit cycle, visible as an oval-ish shape in the middle of the plot. 