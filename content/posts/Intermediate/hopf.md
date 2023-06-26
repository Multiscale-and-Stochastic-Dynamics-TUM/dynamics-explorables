---
title: "Hopf"
date: 2023-04-17T11:37:45+02:00
draft: false
js: hopf
keywords: ["bifurcation"]
---

Consider a smooth two-dimensional one-parameter ODE: <!--more--> $x' = f(x, p)$, $x \in \mathbb{R}^2$,  $p\in \mathbb{R}$ which 
satisfies the conditions: $f(0, 0)=0$ and $\text{D}_x f(0, p)$ has a complex conjugate pair of eigenvalues that have real part
equal to zero. Then this system is topologically equivalent to one of the two following ODEs:
         
$$
\begin{pmatrix}
x_1'  \\\
x_2' 
\end{pmatrix} = 
\begin{pmatrix}
p & -1  \\\
1 & p  \\\
\end{pmatrix}
\begin{pmatrix}
x_1  \\\
x_2 
\end{pmatrix}
\pm
(x_1^2 + x_2 ^ 2)
\begin{pmatrix}
x_1  \\\
x_2 
\end{pmatrix} 
$$


that are called subcritical (with the plus sign) and supercritical (with the minus sign) Hopf bifurcations.

Here we present the 3D stability diagram of the supercritical Hopf bifurcation as well as 2D plots of the eigenvalues of the Jacobian. 
Try different values of the parameter $p$ and see how the behavior of the systems changes.

{{< plotly id="plotlyHopf">}}
{{< slider id="parampSlider" min="-2.0" max="2.0" step="0.1" value="-1.3" >}}

As you can see the eigenvalues cross the imaginary axes in $p=0$. Also the stability changes from one point for negative values of $p$ 
to a circle of radius $\sqrt{p}$ for positive values of $p$.

{{< plotly id="plotlyMultiplot">}}

