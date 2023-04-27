---
title: "Arnold's cat map"
date: 2023-04-06T11:03:16+02:00
draft: false
js: arnold-cat
cover:
    image: "https://images.unsplash.com/photo-1511044568932-338cba0ad803?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    alt: "The cat has nothing to do with the topic, but it's cute."
    caption: Photo by <a href="https://unsplash.com/ja/@ludemeula?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Ludemeula Fernandes</a> on <a href="https://unsplash.com/de/fotos/9UUoGaaHtNE?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
---

Arnold's cat map is a discrete map $g: \mathbb{T} \rightarrow \mathbb{T}$ from a torus to itself defined by:

$$ g(x, y) = \begin{pmatrix} 2 & 1 \\\ 1 & 1 \end{pmatrix}
\begin{pmatrix} x \\\ y \end{pmatrix} \mod 1 $$

The action of the Arnold's map can be split into two steps. First, the matrix stretches the unit square, then the mod operation places all pieces outside of the unit square back into the square. You can see the steps in action by clicking the "step" button!

{{< plotly id="plotlyDiv">}}
{{< button id="stepButton" text="Step">}}
