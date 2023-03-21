### Content form:
### <Tab>_<Optional: example>_<type>_<definer>
### Example: If the content should be in collapsable "math details", "example" if yes, skip if in main section
### Type: "text" is should be st.write, "equation" if st.latex formnula representation 
### Definer: a short key to distinguish from other elements

intro_text = '''
Welcome to the section about stable and unstable manifolds,
an important structure in the phase space that helps to understand dynamics around the equilibrium points (if the point satisfies certain conditions).
First the idea will be introcuced on the linear systems in tabs "Linear System" and "Eigenspaces" and generalised in "General System" and "Manifolds".

Otherwise, you can interract immediately with the example above.
You can click the graph to put a point on the phase space and evolve it by clicking "Play".
You can change parameters of the demo using inputs to the right.
'''

linear_text_intro = r'''
In this section let us consider a continuous-time ($\Tau$) dynamical system $\dot x = f(x)$, generating flow $\phi_t(\cdot)$, with an eqilibrium point $x_*$ (WLOG $x_*$ is located at the origin).
As seen previously linearisation is a good starting point to analise any given dynamical system.
Linearisation of the system at $x_*$ is a system of the form: $\dot X = AX$, where $A$ is the matrix $A = Df(x_*)$.
If the matrix $A$ has no eigenvalues with the real parts equal to zero, the point $x_*$ is called hyperbolic.

In the demonstration above we have an example of a two dimentional linearised system with a hyperbolic eqilibrium.
You can put a point by clicking the phase space and evolve it by pressing "Play". 
Try different initial conditions and see if their trajectories (orbits) follow any patterns.
'''
linear_example_text_def1 = r'''The system we look at in the example is:'''
linear_example_equation_gen = r'''\begin{pmatrix} \dot x \\ \dot y \end{pmatrix} = \begin{pmatrix} x \\ -y + x^2 \end{pmatrix},'''
linear_example_text_def2 = r'''with the equilibrium at the origin. The jacobian at the origin is the following matrix:'''
linear_example_equation_lin = r'''
Df (\bold{0}) = \begin{pmatrix}  
1 & 0\\
0 & -1
\end{pmatrix}
'''

eigenspaces_text_intro = r'''It is not that easy to immedeately tell how the initial placement affects the tragectory of the point.
Luckely, since we have a hyperbolyc equilibrium, we can put a bit more structure on the phase space.
For that let us analyse the matrix $A$. 

From ode theory we know that a general solution to a first order homogeneous linear ode is $\psi_t(x_0) = x_0e^{At}$ (with x_0, initial condition)
and the phase space can be represented as a direct sum of eigenspaces, $E_i(0)$, corresponding to the eigenvalues, $\lambda_i$, of the matix $A$.
Hence, if we have a point that is non-zero only in one of the eigenspaces, then its trajectory stays in that eigenspace and $x$ changes with the rate $e^{\lambda_i t}$.
That means that if $Re(\lambda_i)<0$ then the trajectory converges to the origin as $t \to \infty$. If $Re(\lambda_i)>0$, 
the trajectory diverges going forwards in time, but $\psi_t(x_0) = x_0 e^{At} = x_0 e^{\lambda_i t}\to 0$ as $t \to -\infty$.

Let us call the eigenspace (??? sum of eigenspaces with $Re(\lambda_i)<0$ ???) in which trajectories converge to the origin (equilibrium point) going forwards in time a stable eigenspace, $E_s(x_*):=\{x_0: x_0 e^{At} \to 0,$ as $t \to \infty\}$,
and the other one unstable eigenspace: $E_u(x_*):=\{x_0: x_0 e^{At} \to 0,$ as $t \to -\infty\}$. Let us mark those in the exaple demo (button "Show Eigenspaces"). 

A set such that an orbit of any point from the set is contained in that set is called invariant
(???if the orbit is contained in the set only forwards in time, the set is called forward-invariant, likewise backward-infariant???).
Check if the eigenspaces are invariant sets (at least for some points); and if the tragectories converge propperly (for that try flowing the time backwards too).
Also try putting points close to but not on the eigenspaces and see how they evolve.
'''

eigenspaces_example_text_1 = r'''
In the example, we have two distinct eigenvalues $\lambda_1 = 1$ and $\lambda_2 = -1$.
The general sollution is:
'''
eigenspaces_example_equation = r'''\begin{pmatrix} x \\ y \end{pmatrix} = c_1 e^{\lambda_1 t} \begin{pmatrix} 1 \\ 0 \end{pmatrix} + c_2 e^{\lambda_2 t} \begin{pmatrix} 0 \\ 1 \end{pmatrix}
'''
eigenspaces_example_text_2 = r'''
So the stable stable and unstable eigenspaces are $E_s(0) = span(\begin{pmatrix} 0 \\ 1 \end{pmatrix})$ and $E_u(0) = span(\begin{pmatrix} 1 \\ 0 \end{pmatrix})$ respectively.
'''

general_text_intro = r'''
The same idea as eigenspaces applyes to a general system, however, the higher order terms locally deform the geometry.??????
You can now switch to the initial system (the linearisation of which we were exploring so far) by chaging "System" radiobutton. Try several initial conditions.
For example look at the trajectories with $x_0$ in the eigenspaces and near them.
'''

manifolds_text_1 = r'''
The intuition about this local deformation gives us a hint that sets 
with a property that tragectories within those sets $\textbf{\textit{converge forwards/backwards in time to the equilibrium point}}$
exist in the phase space. They also can be represented as graphs, or ${\textit{manifolds}}$, over the respective eigenspaces of the linearised system.
We will call them local stable, $W^s_{loc}(x_*)$, and unstable, $W^u_{loc}(x_*)$, manifolds. Their existance and uniqueness can be proven using Banach fixed-point theorem.
The manifolds can be made $\textbf{\textit{invariant}}$ by extending them under the flow $\phi_t$ of a given dynamical system to their global counterparts, i.e
'''
manifolds_equation_extention = r'''
W^{s,t}(x_*) = \bigcup_{t\in\Tau}\phi_t(W^{s,t}_{loc}(x_*)).
'''
manifolds_text_2 = r'''
The button "Show Manifolds" visualises manifolds on the phase space.
See if the properties hold by checking the tragectories (make sure that you are in the "general system" mode).
'''
manifolds_example_text = r'''In particular the representation as graphs often helps to find the manifold 
(or at least approximate it as a polinomial). In the case of the demo the stable manifold coincides with the stable eigenspace,
but unstable manifold is s graph of $h(x) = \frac{1}{3}x^2$
'''
manifolds_example_equation = r'''
W^s_{loc}(0) = E_s(0) = \big\{ (x,y)\in\mathbb{R}^2: x=0 \big\};\\

W^u_{loc}(0) = \big\{ (x,y)\in\mathbb{R}^2: y = \frac{1}{3}x^2 \big\}
'''

#Besides the propetis above they also inherit some regularity from the system.

maps_text_intro = r'''Same concept holds for maps. The definition for a hyperbolic point obviosly should be adjusted, however.
Let us have a system given by $x_{n+1} = g(n)$ with fixed point $x_*$ and jacobian $Dg(x_*)$. 
We call $x_*$ hyperbolic if the jacobian has no multipliers (eigenvalues), $\mu_i$, on the unit circle, i.e. $|\mu_i| \neq 0$. 
'''

blah= """blahblahblah blahblahblah blahblahblah blahblahblah v blahblahblah blahblahblah blahblahblah blahblahblah blahblahblah
blahblahblahblahblahblah blahblahblah blahblahblah blahblahblah blahblahblah blahblahblah v blahblahblah
blahblahblah blahblahblah blahblahblah v blahblahblah v blahblahblah blahblahblah blahblahblah blahblahblah  blahblahblah blahblahblah blahblahblah
blahblahblah blahblahblah blahblahblah blahblahblah blahblahblah v blahblahblah  blahblahblah blahblahblahblahblahblah blahblahblah v
blahblahblahblahblahblah v  v blahblahblah v blahblahblah blahblahblahblahblahblah v blahblahblahblahblahblah blahblahblah
blahblahblah  blahblahblah blahblahblah v v blahblahblah blahblahblah blahblahblahblahblahblah blahblahblah blahblahblah blahblahblah"""
