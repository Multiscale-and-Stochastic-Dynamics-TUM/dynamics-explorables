---
title: "Introduction"
date: 2023-05-04T16:18:08+02:00
draft: false
js: false
cover:
    image: ""
    alt: ""
    caption: ""
keywords: []
---

This website aims to give students of different levels of learning a first contact with Dynamic Systems. Here you will find different posts that show in a simple and interactive way some concept of the field. 

The first concept that we introduce here is the definition of dynamical system: 
a **dynamical system** is a triplet $(\mathcal{X} , \mathcal{T} , \phi_t)$, where $\mathcal{X}$ is the phase space (or state space), $\mathcal{T}$ is the time set (or time domain) which can be continuos or discrete and
$\phi_t: X → X$ for $t \in \mathcal{T}$ is the family of evolution operators satisfying:
* $\phi_0 = \text{Id}$, 
* $\phi_t \circ \phi_s = \phi_{t + s} \quad \forall s, t \in \mathcal{T}$.

An example of dynamical system arises from solving a linear ordinary differential equation (ODE). For instance take $\mathcal{X} = \mathbb{R} ^2$ , $\mathcal{T} = \mathbb{R}$, $A \in \mathbb{R} ^ {2 \times 2}$ and consider

$$ \phi_t(x) =  e ^ {tA}x = \sum_{k = 0} ^ {\infty} \frac{(tA)^ k }{k!}x, \qquad x \in \mathbb{R} ^ {2} $$
It is stric forward to check that $\phi_t$ fulfills the two conditiones mentioned avobe. 

