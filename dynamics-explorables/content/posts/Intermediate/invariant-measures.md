---
title: "Invariant Measures"
date: 2023-05-01T13:50:24+02:00
draft: false
js: invariant-measures
---

In this page we ilustrate an example of invariant measures first consider the map  
<!-- more -->
$$f(x) = \begin{cases} 
      2x & x \in [0, 1/2] \\\
      \\\
      x - \frac{1}{2} & x \in (1/2, 1] 
   \end{cases}$$

Remember that a measure $\mu$ is invariant if $\mu(A) = \mu(f ^ {-1} (A)) \quad \forall A \in \mathcal{F}$. For 
this example we will consider only intervals as set $A$. Now choose the edges of the interval and you can visualize the slected interval in {{< span style="color:orange" text="orange" >}} and the preimage in {{< span style="color:purple" text="purple" >}}:


{{< input id="inputIntervalStart" min="0.0" max="1.0" step="0.1">}}
{{< input id="inputIntervalEnd" min="0.0" max="1.0" step="0.1">}}

{{< plotly id="plotlyMap">}}

{{< button id="stepButtonDrawInterval" text="Draw Interval">}}
{{< button id="stepButtonDrawPreimage" text="Draw Preimage">}}



We claim that the measure defined by Lebesgue measure multiplied with the function $h(x)$ is an invariant measure, where:

$$h(x) = \begin{cases} 
      4 / 3& x \in [0, 1/2] \\\
      \\\
      2 / 3 & x \in (1/2, 1] 
   \end{cases}$$

It is easy to check that the area corresponding to the original interval $A$ weighted with the function $h(x)$ showed in {{< span style="color:cyan" text="cyan" >}} is exactly the same that the total area of the preimage. Pres the button "Calculate Measure" after drawing the interval and the preimage to visualize this. Morover we display a numeric value corresponding to the area of the region as you can see the two areas are equal up to rounding errors.


{{< plotly id="plotlyMeasure">}}

{{< button id="stepButtonComputeMeasure" text="Calculate Measure">}}
{{< button id="stepButtonReset" text="Reset Graphics">}}