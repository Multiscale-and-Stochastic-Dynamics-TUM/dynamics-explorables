---
title: "Bifurcation of a Homoclinic Orbit"
date: 2023-06-13T12:43:06+02:00
draft: false
js: "bifurcation-homoclinic-orbit"
keywords: ["discrete_map", "bifurcation"]
bibFile: static/bibliography.json
cover:
    image: "images/homoclinic-bifurcation-cover.png"
    alt: "Global and local view of the homoclinic bifurcation."
    caption: ""
featured: true
---

In the [previous]({{< ref "pitchfork" >}}) [posts]({{< ref "hopf" >}}) we looked at systems in which subtle changes in a parameter lead to drastic changes the phase space -- an effect called a bifurcation. However, all those bifurcations were local, in that they only considered the phase portrait in a small neighborhood around a critical point. Now, we will zoom out and look at the whole phase space.
<!--more-->

Take a look at the phase space in the plot below:

<!-- Phase plot with a slider for the parameter -->
{{< plotly id="streamlines" >}}
{{< slider id="streamlinesSlider" min="0.5" max="0.9" step="0.02" value="0.5" >}}

(the numerical example is taken from {{< cite "strogatz_nonlinear_2019" 266 >}} with some modifications)

Previously, a bifurcation occurred when a critical point changed its stability under the variation of a parameter. This is not the case here. The system of ODEs has two critical points, one at the origin $\mathbf{x}_1 = (0, 0)$ and one at $\mathbf{x}_2 = (1, 0)$. However, both points do not change their stability: $\mathbf{x}_1$ remains a saddle and $\mathbf{x}_2$ remains an unstable focus for all values of $p$. 

And yet, the phase plot changes qualitatively as the parameter changes. Here is the same phase plot, but with the {{<span text="stable" >}} and {{<span text="unstable" >}} manifolds of $\mathbf{x}_1$ marked. Can you find the value of $p$ at which a bifurcation occurs?

<!-- Same phase plot but with stable/unstable manifold in red -->
{{< plotly id="manifolds" >}}
{{< slider id="manifoldsSlider" min="0.5" max="0.9" step="0.02" value="0.5" >}}

At $p = 0.8$, the stable and unstable manifolds meet and form a single orbit. Our visualization makes this sudden jump very apparent: at $p = 0.78$, the {{<span text="stable" >}} manifold spirals to the critical point at $\mathbf{x}_2 = (1, 0)$, but at $p = 0.8$, it gets caught by the critical point at the origin, $\mathbf{x}_1 = (0, 0)$. An orbit like this which starts at a critical point and returns back to it is called a homoclinic orbit. Similarly, a heteroclinic orbit is a trajectory which starts at one critical point and converges to another one. In fact, for $p < 0.8$, the stable manifold is a heterocliic orbit since it starts at $\mathbf{x}_2$ and ends at $\mathbf{x}_1$.

{{< figure src="/images/homo-heteroclinic_orbit.png" caption="**Left**: heteroclinic orbit, **right**: homoclinic orbit" width=400 alt="An image of a hetero- and homoclinic orbit" align="center" >}}

If we push the slider even further to $p > 0.8$, something interesting happens. The {{<span text="unstable" >}} manifold splits from the homoclinic orbit and instead spirals to a limit cycle, visible as an oval-ish shape in the middle of the plot. Here's the vector space at $p = 0.9$ with the {{<span text="limit cycle" >}} drawn:

{{< plotly id="limitCycle" >}}

It turns out, that there is nothing special about our system in particular that produces this limit cycle. In fact, the limit cycle appears in a wide variety of two-dimensional ODEs which undergo a homoclinic bifurcation. 

To explore this effect, we will zoom in closely to the saddle point at $\mathbf{x}_1$. We will also bend and wiggle the system around the origin to make the stable and unstable manifolds locally parallel to the axes. The mathematical details of this coordinate change are described in {{< cite "kuznetsov_elements_1998" 234-238 >}}.

{{< plotly id="zoomInOut" cols=2 height="80%" >}}

Let's reiterate what we know about this zoomed-in system. At $p = 0.8$, the manifolds meet and form a single homoclinic orbit. If we step aside from $p = 0.8$, the manifolds split, but they will still remain close to each other (given that the RHS is sufficiently smooth). To quantify this idea of "close", let's draw a vertical line $\Sigma$ at $x = 1$, perpendicular to the {{< span text="stable" >}} manifold, and find the point where the unstable manifold intersects this line for the first time. The signed {{< span text="distance" >}} from the stable manifold to the intersection point will be called $\beta(p)$. 

{{< plotly id="firstCrosssection" height="60%" >}}
{{< slider id="firstCrosssectionSlider" min="0.75" max="0.85" step="0.01" value="0.85" >}}

For {{< span id="pSpan" text="$p = 0.02$" >}}, the distance is equal to {{< span id="betaSpan" text="$\beta(p) = 0.041$" >}}. 

You might notice that this construction is very similar to a [Poincaré map]({{< ref "poincare-map" >}}), in that we take an orbit, draw a cross-section to this orbit and look at how nearby trajectories return to this cross-section. Indeed, Poincaré maps will play a key role in the following discussion. 

Our goal is to show that the system has a limit cycle above the bifurcation point. We can show this by constructing a Poincaré map on the cross-section $\Sigma$. If the map has a fixed point, i.e., a point which returns to itself after a full revolution, then this fixed point must correspond to a limit cycle of the system. 

We will construct the Poincaré map in two steps: using a local and a global mapping. To define the local mapping, let's draw another cross-section $\Pi$, this time, perpendicular to the {{< span text="unstable" >}} manifold:

{{< plotly id="secondCrosssection" height="60%" >}}

We will define the Poincaré map $P$ as a composition of a local map $\Delta: \Sigma \rightarrow \Pi$, which evolves the points close to the saddle point, and a global map $Q: \Pi \rightarrow Q$, which does a big loop outside of our local view. Click the button below for an animation of both maps!

$$
P = Q \circ \Delta
$$

{{< plotly id="localGlobalMapAnim" height="60%" >}}
{{< button id="animButton" text="Local map" >}}

Close to the saddle point, we can locally linearize the system by choosing new coordinates $(\xi, \eta)$, such that the system is simply given by

$$
\begin{align}
\dot{\xi} &= \lambda_1 \xi \\\
\dot{\eta} &= \lambda_2 \eta,
\end{align}
$$

where $\lambda_{1/2}$ are the eigenvalues of the saddle point with $\lambda_1 < 0$ and $\lambda_2 > 0$. This way, we can calculate the local map $\Delta$ explicitly. 

A point $(1, \eta)$ on the cross-section $\Sigma$ moves to the point $(e^{\lambda_1 \tau}, \eta e^{\lambda_2 \tau})$ after time $\tau$. We want to determine the time $\tau^*$, when this point hits the second cross-section $\Pi$. Solving $(e^{\lambda_1 \tau}, \eta e^{\lambda_2 \tau}) = (\xi, 1)$ for $\tau$, we get that 

$$
\tau^* = - \frac{\ln{\eta}}{\lambda_1}.
$$

Inserting this into the coordinates, we obtain that the point $(1, \eta)$ in $\Sigma$ is mapped to the point $(\eta^{-\frac{\lambda_1}{\lambda_2}}, 1)$ in $\Pi$. This gives us our first local map. 

$$
\Delta: \xi = \eta^{-\frac{\lambda_1}{\lambda_2}}.
$$

To define the global map, we can make use of the $\beta(p)$ function we defined previously. We know that the point $(0, 1) \in \Pi$ is mapped to the point $(1, \beta(p)) \in \Sigma$ since this point lies on the unstable manifold. We can Taylor the map around $\xi = 0$ to obtain

$$
Q: \eta = \beta + a \xi + O(\xi^2)
$$

where $a$ is the first-order coefficient. Note that $a$ has to be positive, since the orbits cannot intersect. 

Now, we can write the full Poincaré map for small $|\eta|$

$$
P: \eta \mapsto \beta + a \eta^{-\frac{\lambda_2}{\lambda_2}} + \dots
$$

To prove that the system has a limit cycle, we need to show that the Poincaré map has a fixed point, $P(\eta) = \eta$. Note that the qualitative behavior of the map depends on two quantities: $\beta(p)$ and the relative magnitude of the eigenvalues $\lambda_1$ and $\lambda_2$. To compare the eigenvalues, we can define 

$$\sigma\_0 := \lambda\_1(0) + \lambda\_2(0),$$

which is the so-called saddle quantity. In our numerical example we had $\beta(p) > 0$ and $\sigma\_0 < 0$ above the bifurcation point, but those quantities might be different in other systems. Here is a visualization of the Poincaré map where you can adjust the values of $\beta(p)$ and $\sigma\_0$. Try to find such values for which a fixed point exists!

<!-- Plots of P where you can change beta? -->
{{< plotly id="poincareMap" >}}
{{< slider id="betaSlider" min="-0.5" max="0.5" step="0.01" value="0.35" >}}
{{< slider id="sigmaSlider" min="-0.5" max="0.5" step="0.01" value="-0.5" >}}

If $\sigma\_0 < 0$, the fixed point exists for $\beta > 0$, and if $\sigma\_0 > 0$, the fixed point exists for $\beta < 0$. This proves the existence of a unique limit cycle, which bifurcates from the homoclinic orbit!

The arguments above can be summarized in the following theorem {{< cite "kuznetsov_elements_1998" 234 >}}:

> **Andronov-Leontovich Theorem**
>
> Consider a two-dimensional system
> $$ \dot{\mathbf{x}} = f(\mathbf{x}, p) $$
> with smooth $f$ which has at $p = 0$ a saddle equilibrium point $\mathbf{x}_0 = 0$ with eigenvalues $\lambda_1(0) < 0 < \lambda_2(0)$ and a homoclinic orbit $\Gamma_0$. Assume that the following genericity conditions hold:
> * $\sigma_0 = \lambda_1(0) + \lambda_2(0) \neq 0$
> * $\beta(0) \neq 0$
> 
> Then, for all sufficiently small $|p|$, there exists a neighborhood $U_0$ of $\Gamma_0 \cup \mathbf{x}\_0$ in which a unique limit cycle $L_\beta$ bifurcates from $\Gamma_0$. Moreover, the cycle is stable and exists for $\beta > 0$ if $\sigma_0 < 0$ and is unstable and exists for $\beta < 0$ if $\sigma_0 > 0$. 

---

# Appendix

## Numerical system
The system from the example is given by the ODE {{< cite "strogatz_nonlinear_2019" 266 >}}

$$
\begin{align}
\dot{x} &= y \\\
\dot{y} &= -p y + x - x^2 + xy
\end{align}
$$

The system of equations bifurcates at $p \approx 0.86456$. For the sake of example, we shifted the parameter to a nice value by defining $\tilde{p} := p - 0.06456$. 