---
title: "Bifurcation of a Homoclinic Orbit"
date: 2023-06-13T12:43:06+02:00
draft: false
js: "bifurcation-homoclinic-orbit"
keywords: ["discrete_map", "bifurcation"]
---

In the [previous]({{< ref "pitchfork" >}}) [posts]({{< ref "hopf" >}}) we looked at systems in which subtle changes in a parameter lead to drastic changes the phase space -- an effect called a bifurcation. However, all those bifurcations were local, in that they only considered the phase portrait in a small neighborhood around a critical point. Now, we will zoom out and look at the whole phase space.
<!--more-->

Take a look at the phase space in the plot below:

<!-- Phase plot with a slider for the parameter -->
{{< plotly id="streamlines" >}}
{{< slider id="streamlinesSlider" min="0.5" max="0.9" step="0.02" value="0.8" >}}

Previously, a bifurcation occurred when a critical point changed its stability under the variation of a parameter. This is not the case here. The system of ODEs has two critical points, one at the origin $\mathbf{x}_1 = (0, 0)$ and one at $\mathbf{x}_2 = (1, 0)$. However, both points do not change their stability: $\mathbf{x}_1$ remains a saddle and $\mathbf{x}_2$ remains a stable focus for all values of $p$. 

And yet, the phase plot changes qualitatively as the parameter changes. Here is the same phase plot, but with the {{<span style="color:blue" text="stable" >}} and {{<span style="color:red" text="unstable" >}} manifolds of $\mathbf{x}_1$ marked. Can you find the value of $p$ at which a bifurcation occurs?

<!-- Same phase plot but with stable/unstable manifold in red -->
{{< plotly id="streamlinesManifolds" >}}
{{< slider id="streamlinesManifoldsSlider" min="0.5" max="0.9" step="0.02" value="0.8" >}}

At $p = 0.8$, the stable and unstable manifolds meet and form a single orbit. Our visualization makes this sudden jump very apparent: at $p = 0.78$, the {{<span style="color:red" text="unstable" >}} manifold spirals to the critical point at $\mathbf{x}_2 = (1, 0)$, but at $p = 0.8$, it gets caught by the critical point at the origin, $\mathbf{x}_1 = (0, 0)$. An orbit like this which starts at a critical point and returns back to it is called a homoclinic orbit. Similarly, a heteroclinic orbit is a trajectory which starts at one critical point and converges to another one. In fact, for $p < 0.8$, the unstable manifold is a heterocliic orbit since it starts at $\mathbf{x}_1$ and ends at $\mathbf{x}_2$.

{{< figure src="/images/homo-heteroclinic_orbit.png" caption="**Left**: heteroclinic orbit, **right**: homoclinic orbit" width=400 alt="An image of a hetero- and homoclinic orbit" align="center" >}}

If we push the slider even further to $p > 0.8$, something interesting happens. The {{<span style="color:blue" text="stable" >}} manifold splits from the homoclinic orbit and instead spirals to a limit cycle, visible as an oval-ish shape in the middle of the plot. Here's the vector space at $p = 0.9$ with the limit cycle marked in {{<span style="color:orange" text="orange" >}}:

{{< plotly id="limitCycle" >}}

It turns out, that there is nothing special about our system in particular that produces this limit cycle. In fact, the limit cycle appears in a wide variety of two-dimensional ODEs which undergo a homoclinic bifurcation. The theorem below illustrates this fact.

> **Andronov-Leontovich Theorem**
>
> Consider a two-dimensional system
> $$ \dot{\mathbf{x}} = f(\mathbf{x}, \alpha), \mathbf{x} \in \mathbb{R}^2, \alpha \in \mathbb{R} $$
> with smooth $f$, having at $\alpha = 0$ a saddle equilibrium point $\mathbf{x}_0 = 0$ with eigenvalues $\lambda_1(0) < 0 < \lambda_2(0)$ and a homoclinic orbit $\Gamma_0$. Assume that the following genericity conditions hold:
> * $\sigma_0 = \lambda_1(0) + \lambda_2(0) \neq 0$
> * $\beta(0) \neq 0$, where $\beta(\alpha)$ is the previously defined split function. 
> 
> Then, for all sufficiently small $|\alpha|$, there exists a neighborhood $U_0$ of $\Gamma_0 \cup x_0$ in which a unique limit cycle $L_\beta$ bifurcates from $\Gamma_0$. Moreover, the cycle is stable and exists for $\beta > 0$ if $\sigma_0 < 0$ and is unstable and exists for $\beta < 0$ if $\sigma_0 > 0$. 