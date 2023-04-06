---
title: "Arnold's cat map"
date: 2023-04-06T11:03:16+02:00
draft: false
js: arnold-cat
---

Arnold's cat map is a discrete map $g: \mathbb{T} \rightarrow \mathbb{T}$ from a torus to itself defined by:

$$ g(x, y) = \begin{pmatrix} 2 & 1 \\\ 1 & 1 \end{pmatrix}
\begin{pmatrix} x \\\ y \end{pmatrix} \mod 1 $$

The action of the Arnold's map can be split into two steps. First, the matrix stretches the unit square, then the mod operation places all pieces outside of the unit square back into the square. You can see the steps in action by clicking the "step" button!

{{< plotly id="plotlyDiv">}}
{{< button id="stepButton" text="Step">}}
