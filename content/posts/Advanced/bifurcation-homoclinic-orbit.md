---
title: "Bifurcation of a Homoclinic Orbit"
date: 2023-06-13T12:43:06+02:00
draft: false
js: "bifurcation-homoclinic-orbit"
keywords: ["discrete_map", "bifurcation"]
bibFile: static/bibliography.json
---

In the [previous]({{< ref "pitchfork" >}}) [posts]({{< ref "hopf" >}}) we looked at systems in which subtle changes in a parameter lead to drastic changes the phase space -- an effect called a bifurcation. However, all those bifurcations were local, in that they only considered the phase portrait in a small neighborhood around a critical point. Now, we will zoom out and look at the whole phase space.
<!--more-->

Take a look at the phase space in the plot below:

<!-- Phase plot with a slider for the parameter -->
{{< plotly id="streamlines" >}}
{{< slider id="streamlinesSlider" min="0.5" max="0.9" step="0.02" value="0.8" >}}

(the numerical example is taken from {{< cite "strogatz_nonlinear_2019" 266 >}} with some modifications)

Previously, a bifurcation occurred when a critical point changed its stability under the variation of a parameter. This is not the case here. The system of ODEs has two critical points, one at the origin $\mathbf{x}_1 = (0, 0)$ and one at $\mathbf{x}_2 = (1, 0)$. However, both points do not change their stability: $\mathbf{x}_1$ remains a saddle and $\mathbf{x}_2$ remains an unstable focus for all values of $p$. 

And yet, the phase plot changes qualitatively as the parameter changes. Here is the same phase plot, but with the {{<span text="stable" >}} and {{<span text="unstable" >}} manifolds of $\mathbf{x}_1$ marked. Can you find the value of $p$ at which a bifurcation occurs?

<!-- Same phase plot but with stable/unstable manifold in red -->
{{< plotly id="streamlinesManifolds" >}}
{{< slider id="streamlinesManifoldsSlider" min="0.5" max="0.9" step="0.02" value="0.8" >}}

At $p = 0.8$, the stable and unstable manifolds meet and form a single orbit. Our visualization makes this sudden jump very apparent: at $p = 0.78$, the {{<span text="stable" >}} manifold spirals to the critical point at $\mathbf{x}_2 = (1, 0)$, but at $p = 0.8$, it gets caught by the critical point at the origin, $\mathbf{x}_1 = (0, 0)$. An orbit like this which starts at a critical point and returns back to it is called a homoclinic orbit. Similarly, a heteroclinic orbit is a trajectory which starts at one critical point and converges to another one. In fact, for $p < 0.8$, the stable manifold is a heterocliic orbit since it starts at $\mathbf{x}_2$ and ends at $\mathbf{x}_1$.

{{< figure src="/images/homo-heteroclinic_orbit.png" caption="**Left**: heteroclinic orbit, **right**: homoclinic orbit" width=400 alt="An image of a hetero- and homoclinic orbit" align="center" >}}

If we push the slider even further to $p > 0.8$, something interesting happens. The {{<span text="unstable" >}} manifold splits from the homoclinic orbit and instead spirals to a limit cycle, visible as an oval-ish shape in the middle of the plot. Here's the vector space at $p = 0.9$ with the limit cycle marked in {{<span style="color:orange" text="orange" >}}:

{{< plotly id="limitCycle" >}}

It turns out, that there is nothing special about our system in particular that produces this limit cycle. In fact, the limit cycle appears in a wide variety of two-dimensional ODEs which undergo a homoclinic bifurcation. 

To explore this effect, we will zoom in closely to the saddle point at $\mathbf{x}_1$. We will also bend and wiggle the system around the origin to make the stable and unstable manifolds locally parallel to the axes. The mathematical details of this coordinate change are described in {{< cite "kuznetsov_elements_1998" 64-66 >}}, but you can just click the "zoom" button below for the magic to happen.

<!-- an animation of the zooming -->
{{< plotly id="zoomAnim" >}}
{{< button text="Zoom!" >}}

Let's reiterate what we know about this zoomed-in system. At $p = 0.8$, the manifolds meet and form a single homoclinic orbit. If we step aside from $p = 0.8$, the manifolds split, but they will still remain close to each other (given that the RHS is sufficiently smooth). To quantify this idea of "close", let's draw a vertical line at $x = 1$, perpendicular to the {{< span text="stable" >}} manifold, and measure the distance between the stable and unstable manifolds along this line. 

{{< plotly id="localManifold" >}}
{{< slider id="localSlider" min="0.5" max="0.9" step="0.02" value="0.8" >}}

We will call this signed distance $\beta(p)$. For $p = 0.02??$, the distance is equal to $\beta(p) = 0.02??$. 

You might notice that this construction is very similar to a [Poincaré map]({{< ref "poincare-map" >}}), in that we have an orbit (the homoclinic orbit at $p = 0.8$) and a cross-section to this orbit. Indeed, Poincaré maps will play a key role in the following. 

