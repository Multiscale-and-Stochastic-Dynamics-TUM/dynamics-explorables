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

This website aims to give students at different levels of learning first contact with dynamical systems. Here you will find posts that illustrate various concepts from the field in a simple and interactive way.

Intuitively speaking, a dynamical system is a system which changes with time. The time can be a continuous variable, like in a swinging pendulum, or a discrete one, like in a traffic light, but it has to be the only independent variable of the system. The phase space $\mathcal{X}$ is the collection of all possible states of the system. For example, for the traffic light, $\mathcal{X}$ is equal to red, yellow and green.

The evolution function  tells how the dynamical system evolves with time. If we knew the evolution function of a given system, we could predict its state at any time in the future from the current state. For some real-world systems, this is indeed possible: for example, we can predict the motion of the planets with high accuracy far into the future. On the other hand, we cannot predict the weather more than a few days in advance. We will explore the theoretical reasons for why weather prediction is so hard in the chapter on chaos.


The first concept that we introduce here is the definition of a dynamical system: 
a **dynamical system** is a triplet $(\mathcal{X} , \mathcal{T} , \phi_t)$, where $\mathcal{X}$ is the phase space (or state space), $\mathcal{T}$ is the time set (or time domain) which can be continuous or discrete and
$\phi_t: X → X$ for $t \in \mathcal{T}$ is the family of evolution operators satisfying:
* $\phi_0 = \text{Id}$, 
* $\phi_t \circ \phi_s = \phi_{t + s} \quad \forall s, t \in \mathcal{T}$.

An example of dynamical system arises from solving a linear ordinary differential equation (ODE). For instance take $\mathcal{X} = \mathbb{R} ^2$ , $\mathcal{T} = \mathbb{R}$, $A \in \mathbb{R} ^ {2 \times 2}$ and consider

$$ \phi_t(x) =  e ^ {tA}x = \sum_{k = 0} ^ {\infty} \frac{(tA)^ k }{k!}x, \qquad x \in \mathbb{R} ^ {2} $$
It is straight forward to check that $\phi_t$ fulfills the two conditions mentioned above.

