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
{{< plotly id="plotlyDiv">}}
{{< button id="linPlayButton" text="Play" >}}
{{< button id="linResetButton" text="Reset" >}}
{{< textfield id = "setPointX" name = "setPoint" label = "x:" width = "63px">}}
{{< textfield id = "setPointY" name = "setPoint" label = "y:" width = "63px">}}

{{< radio_button id = "time_forwards" name = "time" value = 5 label = "Forwards">}}
{{< radio_button id = "time_backwards" name = "time" value = -5 label = "Backwards">}}
{{< radio_button id = "sys_lin" name = "system" value = "linear" label = "Linear">}}
{{< radio_button id = "sys_gen" name = "system" value = "general" label = "General">}}

{{< checkbox id = "showTrajectory" name = "plotElements" value = true label = "Show Trajectory">}}
{{< checkbox id = "showEigenspaces" name = "plotElements" value = true label = "Show Eigenspaces">}}
{{< checkbox id = "showManifolds" name = "plotElements" value = true label = "Show Manifolds">}}
{{< checkbox id = "showStreamlines" name = "plotElements" value = false label = "Show Streamlines">}}

Let us first consider a time-continuous linear system, $\dot X = AX$, where $A$ is a matrix with an equilibrium point $x_*$ at the origin. Further, assume that $A$ has no eigenvalues with zero real parts. In general, equilibrium points close to which the system (or its linearization) has this property are called **hyperbolic**. The widget above gives an example of such a system. Click on the phase-space to place a point (initial condition) and evolve it by pressing "Play" or just "{{< span id="trajectoryText" style="cursor:pointer" text="Show trajectory" >}}" if you do not want to waste your time with animations. Also, try to identify any patterns. You might also need to observe what happens if the point is propagated backwards in time (click the respective "Backwards" radio button for that).

As one might have noticed, the system has defined directions of {{< span text="convergence" >}} and/or {{< span text="divergence" >}}. The reason for this are the "nice" eigenvalues of $A$ (one can study the explicit solution of the ODE and see that more precisely). Those directions will be called {{< span text="stable" >}} and {{< span text="unstable" >}} **eigenspaces**, respectively ($E_s$ and $E_u$). Let us visualize them by clicking {{< span id="eigenspacesText" style="cursor:pointer" text="\"Show Eigenspaces\"">}} checkbox (or the text in quotes). These eigenspaces have a property called **invariance**, which means that all trajectories starting in an eigenspace are fully contained in it (backwards and forwards). Also, the eigenspaces give a bit more information about the structure of the system. You can check the invariance as well as convergence in the {{< span text="forwards" >}}/{{< span text="backwards" >}} time propagation for the {{< span text="stable" >}}/{{< span text="unstable" >}} eigenspace by sampling a few points on the eigenspaces (text fields for the x- any y-coordinates might be of help).

Considering a general system with an equilibrium at $x_\*$, we can look at its linearization near $x_*$, with $A = Df (x_\*)$ the Jacobian matrix. Again, we call the equilibrium point $x_\*$ a hyperbolic equilibrium point if $Df (x_\*)$ satisfies the condition above ($Re(\lambda_i)\neq 0$). In fact, so far in the demo we were looking at the linearization of another non-linear system. You can switch to that system by clicking the {{< span id="generalText" style="cursor:pointer" text="\"General\"">}} radiobutton. Try checking how the trajectories change.

Although the trajectories do change slightly, the general dynamics stays the same (see the "Equivalence" section). The higher order terms locally deform the geometry. The eigenspaces get "deformed" too. That suggests that similar structures as in the linearization of the system might be present for general system itself. They can be represented as graphs or **manifolds** over the eigenspaces and are called {{< span text="stable" >}} and {{< span text="unstable" >}} (local) manifolds ($W_{loc}^s$ and $W_{loc}^u$), respectively. Let us visualize them by clicking {{< span id="manifoldsText" style="cursor:pointer" text="\"Show Manifolds\"">}}. Notice that they indeed look like graphs over the respective eigenspaces and posses the same properties, i.e., the manifolds are invariant and have the same modes of convergence as the eigenspaces.

The same idea applies to the discrete systems; however, the requirement for the Jacobian to be "nice" is that it has no multipliers (eigenvalues) with magnitude one ($|\lambda|\neq 1$).

### Math Details
The system we looked at in the example is a continuous-time two dimensional system generated by the following ODE:
$$\begin{pmatrix} \dot x \newline \dot y \end{pmatrix} = \begin{pmatrix} x \newline -y + x^2 \end{pmatrix},$$
with the equilibrium, $x_\*$, at the origin. The Jacobian at the origin is the matrix $Df (\textbf{0})$:
$$Df (\textbf{0}) = \begin{pmatrix}
1 & 0\newline
0 & -1
\end{pmatrix}$$
The eigenvalues of $Df (\textbf{0})$ are $\lambda_1 = 1$ and $\lambda_2 = -1$, with the corresponding eigenspaces $E_u = \begin{pmatrix} 1, 0 \end{pmatrix}^T$ (which coincidentally matches the x-axis) and $E_s = \begin{pmatrix} 0, 1 \end{pmatrix}^T$ (y-axis).
The solution of the ODE given by the linearized system is:
$$\begin{pmatrix} x \newline y \end{pmatrix} = c_1 e^{\lambda_1 t} E_u + c_2 e^{\lambda_2 t} E_s,$$
hence the observed dynamics.

The manifolds are given by the following sets:
$$W_{loc}^s(0) = E_s(0) = \set{ (x,y)\in\mathbb{R}^2: x=0 };$$
$$W_{loc}^u(0) = \set{ (x,y)\in\mathbb{R}^2: y = \frac{1}{3}x^2 }.$$
Notice that they are the graphs over the respective eigenspaces.

The local manifolds can be extended to their global counterparts under the flow:
$$W^{s,u}(x_\*) = \bigcup_{t\in T}\phi_t(W_{loc}^{s,u}(x_\*)),$$
what makes them "truly" invariant.


{{< plotly2 id = "popOut">}}