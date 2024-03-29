---
title: "Pitchfork"
date: 2023-04-13T10:44:26+02:00
draft: false
js: pitchfork
keywords: ["bifurcation"]
---

The appearance of a non-equivalent phase portrait upon parameter variation is called a 
bifurcation. In this page, we introduce the pitchfork bifurcation, which is one of the main examples of 
this topic. Consider the ordinary differential equation:

$$x' = px - x ^ 3$$

With $p \in \mathbb{R}$. As you can see the behavior of the system is different for
$p > 0$ and for $p \leq 0$. In the first case we have 3 equilibria, at $-\sqrt{p}$, $0$ and $\sqrt{p}$),
with $0$ being the only unstable one. In the second case, there is only one equilibrium at $0$ and is stable.

You can vary the values of $p$ in the plot below and see how the stability diagram changes.

{{< slider id="parampSlider" min="-2.0" max="2.0" step="0.1" value="-1.3" >}}
{{< plotly id="plotlyPitchfork" height="30%" >}}
{{< plotly id="plotlyStability" height="30%" >}}

