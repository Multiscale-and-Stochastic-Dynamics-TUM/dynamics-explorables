---
title: "Hopf"
date: 2023-04-17T11:37:45+02:00
draft: false
js: hopf
---

Consifer a smooth two-dimensional one-parameter ODE: is topologically equivalent to:
$x' = f(x, p) \qquad x \in \mathbb{R}^2, \quad p\in \mathbb{R}$

which satisfies the conditions $f(0, 0)=0$ and the jacobian $\text{D}_x f(0, p)$ has a complex conjugate pair of eigenvalues that have real part
equal to zero. Then this system is topologically to one of the two following ODEs:
         
$$
\begin{pmatrix}
y_1'  \\
y_2' 
\end{pmatrix} = 
\begin{pmatrix}
p & -1  \\
1 & p  \\
\end{pmatrix}
\begin{pmatrix}
y_1  \\
y_2 
\end{pmatrix}
\pm
(y_1^2 + y_2 ^ 2)
\begin{pmatrix}
y_1  \\
y_2 
\end{pmatrix} 
$$


That are called subcritical (with the plus sign) and supercritical (with the minus sign) Hopf bifurcations.

Here we present the 3D stability diagram of the supercritical hopf bifurcation as well as 2D plots of the eigenvalues of the Jacobian. 
Try different values of the parameter $p$ and see how the beheaviour of the systems changes.

{{< plotly id="plotlyHopf">}}
{{< slider id="parampSlider" min="-2.0" max="2.0" step="0.1" value="-1.3" >}}
{{< plotly id="plotlyMultiplot">}}

