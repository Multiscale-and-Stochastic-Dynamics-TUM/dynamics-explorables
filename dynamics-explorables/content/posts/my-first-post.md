---
title: "My First Post"
date: 2023-04-01T20:06:16+02:00
draft: false
js: "my-first-post"
---

## Hello, world! 👋

Here is some text. Let's try some Latex: 

$$ i \hbar \partial_t \ket{\phi} = \mathcal{H} \ket{\phi}$$

and here is some inline Latex: $\pi = e = \hbar = c = 1$.

We can write some code too:

```julia
using DynamicalSystems

x = 0:0.1:1
a = sin.(x)

function helloworld()
    println("I am printing stuff")
end
```

{{< plotly id="plotlyDiv" >}}