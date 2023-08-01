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
{{< slider id="streamlinesSlider" min="0.5" max="0.9" step="0.02" value="0.5" >}}

(the numerical example is taken from {{< cite "strogatz_nonlinear_2019" 266 >}} with some modifications)

Previously, a bifurcation occurred when a critical point changed its stability under the variation of a parameter. This is not the case here. The system of ODEs has two critical points, one at the origin $\mathbf{x}_1 = (0, 0)$ and one at $\mathbf{x}_2 = (1, 0)$. However, both points do not change their stability: $\mathbf{x}_1$ remains a saddle and $\mathbf{x}_2$ remains an unstable focus for all values of $p$. 

And yet, the phase plot changes qualitatively as the parameter changes. Here is the same phase plot, but with the {{<span text="stable" >}} and {{<span text="unstable" >}} manifolds of $\mathbf{x}_1$ marked. Can you find the value of $p$ at which a bifurcation occurs?

<!-- Same phase plot but with stable/unstable manifold in red -->
{{< plotly id="manifolds" >}}
{{< slider id="manifoldsSlider" min="0.5" max="0.9" step="0.02" value="0.5" >}}

At $p = 0.8$, the stable and unstable manifolds meet and form a single orbit. Our visualization makes this sudden jump very apparent: at $p = 0.78$, the {{<span text="stable" >}} manifold spirals to the critical point at $\mathbf{x}_2 = (1, 0)$, but at $p = 0.8$, it gets caught by the critical point at the origin, $\mathbf{x}_1 = (0, 0)$. An orbit like this which starts at a critical point and returns back to it is called a homoclinic orbit. Similarly, a heteroclinic orbit is a trajectory which starts at one critical point and converges to another one. In fact, for $p < 0.8$, the stable manifold is a heterocliic orbit since it starts at $\mathbf{x}_2$ and ends at $\mathbf{x}_1$.

{{< figure src="/images/homo-heteroclinic_orbit.png" caption="**Left**: heteroclinic orbit, **right**: homoclinic orbit" width=400 alt="An image of a hetero- and homoclinic orbit" align="center" >}}

If we push the slider even further to $p > 0.8$, something interesting happens. The {{<span text="unstable" >}} manifold splits from the homoclinic orbit and instead spirals to a limit cycle, visible as an oval-ish shape in the middle of the plot. Here's the vector space at $p = 0.9$ with the limit cycle marked in {{<span style="color:orange" text="orange" >}}:

{{< plotly id="limitCycle" >}}

It turns out, that there is nothing special about our system in particular that produces this limit cycle. In fact, the limit cycle appears in a wide variety of two-dimensional ODEs which undergo a homoclinic bifurcation. 

To explore this effect, we will zoom in closely to the saddle point at $\mathbf{x}_1$. We will also bend and wiggle the system around the origin to make the stable and unstable manifolds locally parallel to the axes. The mathematical details of this coordinate change are described in {{< cite "kuznetsov_elements_1998" 64-66 >}}.

{{< plotly id="zoomInOut" cols=2 height="80%" >}}

Let's reiterate what we know about this zoomed-in system. At $p = 0.8$, the manifolds meet and form a single homoclinic orbit. If we step aside from $p = 0.8$, the manifolds split, but they will still remain close to each other (given that the RHS is sufficiently smooth). To quantify this idea of "close", let's draw a vertical line $\Sigma$ at $x = 1$, perpendicular to the {{< span text="stable" >}} manifold, and find the point where the unstable manifold intersects this line for the first time. The signed distance from the stable manifold to the intersection point will be called $\beta(p)$. 

{{< plotly id="beta" height="60%" >}}
{{< slider id="betaSlider" min="0.75" max="0.85" step="0.01" value="0.75" >}}

For $p = 0.02??$, the distance is equal to $\beta(p) = 0.02??$. 

You might notice that this construction is very similar to a [Poincaré map]({{< ref "poincare-map" >}}), in that we take an orbit, draw a cross-section to this orbit and look at how nearby trajectories return to this cross-section. Indeed, Poincaré maps will play a key role in the following. If we construct such a map and show that the map has a fixed point, i.e., a point which returns to itself after a full revolution, then this fixed point must correspond to a limit cycle of the system. 

We will construct the Poincaré map in two steps: using a local and a global mapping. To define the local mapping, let's draw another cross-section $\Pi$, this time, perpendicular to the {{< span text="unstable" >}} manifold:

{{< plotly id="secondCrossection" >}}

We will define the Poincaré map $P$ as a composition of a local map $\Delta: \Sigma \rightarrow \Pi$, which evolves the points close to the saddle point, and a global map $Q: \Pi \rightarrow Q$, which does a big loop outside of our local view.

$$
P = Q \circ \Delta
$$

{{< plotly id="localGlobalMapAnim" >}}
{{< button text="Local map" >}}

Close to the saddle point, we can locally linearize the system by choosing new coordinates $(\xi, \eta)$, such that the system is simply given by

$$
\begin{align}
\dot{\xi} &= \lambda_1 \xi \\\
\dot{\eta} &= \lambda_2 \eta,
\end{align}
$$

where $\lambda_{1/2}$ are the eigenvalues of the saddle point. This way, we can calculate the local map $\Delta$ explicitly. A point $(1, \eta)$ on the cross-section $\Sigma$ moves to $(e^{\lambda_1 \tau}, \eta e^{\lambda_2 \tau})$ after time $\tau$. We want to determine the time $\tau^*$, when this point hits the second cross-section $\Pi$. Solving $(e^{\lambda_1 \tau}, \eta e^{\lambda_2 \tau}) = (\xi, 1)$ for $\tau$, we get that 

$$
\tau^* = - \frac{\ln{\eta}}{\lambda_1}.
$$

Inserting this into the coordinates, we obtain that the point $(1, \eta)$ in $\Sigma$ is mapped to the point $(\eta^{-\frac{\lambda_1}{\lambda_2}}, 1)$ in $\Pi$. This gives us our first local map. 

$$
\Delta: \xi = \eta^{-\frac{\lambda_1}{\lambda_2}}.
$$

To define the global map, we can make use of the $\beta$ function we defined previously. (? how to explain this transition?)

$$
Q: \eta = \beta + a \xi + O(\xi^2).
$$

Therefore, the full Poincaré map can be written for small $|\eta|$ as 

$$
P: \eta \mapsto \beta + a \eta^{-\frac{\lambda_2}{\lambda_2}} + \dots
$$

<!-- Plots of P where you can change beta? -->


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