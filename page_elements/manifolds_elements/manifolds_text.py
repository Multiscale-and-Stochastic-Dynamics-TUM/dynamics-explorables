intro_text = '''
Welcome to the section about stable and unstable manifolds,
an important structure in the phase space that helps to understand dynamics around the equilibrium points (if the point satisfies certain conditions).
First the idea will be introcuced on the linear systems in tabs "Linear System" and "Eigenspaces" and generalised in "General System" and "Manifolds".

Or you can interract immediately with the example above.
You can click the graph to put a point on the phase space and evolve it by clicking "Play".
You can choose if you want to flow the time normally or in reverce by clicking one of the radio buttons on the right.
If you to open all options, press "I know what I am doing" button.

TODO: "I know what I am doing" button
'''

linear_intro_text = r'''
In this section let us consider a continuous-time dynamical system $\dot x = f(x)$ with an eqilibrium point $x_*$ (WLOG $x_*$ is located at the origin).
As seen previously linearisation is a good starting point to analise a given dynamical system.
Linearisation of the system at $x_*$ is a system of the form: $\dot X = AX$, where $A$ is the matrix $A = Df(x_*)$.
If the matrix $A$ has no eigenvalues with the real parts equal to zero, the point $x_*$ is called hyperbolic.

In the demonstration above we have an exaple of a two dimentional linearised system with a hyperbolic eqilibrium.
You can put initial point by clicking the phase space and evolving it by pressing "Play". 
Try to find several initial conditions and see if there are any patterns for the trajectories.'''

example_system_def_text_1 = r'''The system we look at in the example is:'''
example_system_equation = r'''\begin{pmatrix} \dot x \\ \dot y \end{pmatrix} = \begin{pmatrix} x \\ -y + x^2 \end{pmatrix},'''
example_system_def_text_2 = r'''with equilibrium at the origin. The jacobian at the origin is the following matrix:'''
example_system_lin_equation = r'''
Df (\bold{0}) = \begin{pmatrix}  
1 & 0\\
0 & -1
\end{pmatrix}
'''

eigenspaces_intro_text = r'''It is not that easy to immedeately tell how the initial placement affects the tragectory of the point.
Luckely, since we have a hyperbolyc equilibrium, we can put a bit more structure on the phase space.
For that let us analyse the matrix $A$. 
From ode theory we know that a general solution to a first order homogeneous linear ode is $x(t) = Ce^{At}$ (with C,initial condition)
and the phase space can be represented as a direct sum of eigenspaces, $E_i$, corresponding to the eigenvalues, $\lambda_i$, of the matix $A$.

Hence, if we have a point that is non-zero only in one of the eigenspaces, it stays in that eigenspace and changes with the rate $e^{\lambda_i t}$.
That means that if $Re(\lambda_i)<0$ then the trajectory converges to the origin for $t \to \infty$. If $Re(\lambda_i)>0$, 
the trajectory diverges, but $x(t) = x_0 e^{At} = x_0 e^{\lambda_i t}\to 0$ as $t \to -\infty$.

Let us call the eigenspace (???sum of eigenspaces with $Re(\lambda_i)<0$ ???) with trajectories converging to origin in positive time a stable eigenspace, $E_s:=\{x_0: x_0 e^{At} \to 0,$ as $t \to \infty\}$,
and the other one unstable eigenspace: $E_u:=\{x_0: x_0 e^{At} \to 0,$ as $t \to -\infty\}$. Let us mark those on the exaple demo (button "Show eigenspaces"). 
Check if the trajectory stays in the eigenspaces if the startinig point is in the eigenspace and inf the convergences are correct (for that reverce time).
Also try putting points close to the eigenspaces and see how they evolve.

TODO: "Show eigenspaces" button
'''

example_system_eigenspaces_text_1 = r'''
In the example, we have two distinct eigenvalues $\lambda_1 = 1$ and $\lambda_2 = -1$.
The general sollution is:
'''
example_system_eigenspaces_equation = r'''\begin{pmatrix} x \\ y \end{pmatrix} = c_1 e^{\lambda_1 t} \begin{pmatrix} 1 \\ 0 \end{pmatrix} + c_2 e^{\lambda_2 t} \begin{pmatrix} 0 \\ 1 \end{pmatrix}'''

example_system_eigenspaces_text_2 = r'''
So the stable stable and unstable eigenspaces are $span(\begin{pmatrix} 0 \\ 1 \end{pmatrix})$ and $span(\begin{pmatrix} 1 \\ 0 \end{pmatrix})$ respectively.
'''

general_intro_text = r'''
TODO: aaaaaaaaaaaaaaaaaaaa
'''

manifolds_intro_text = r'''
TODO: Text
'''

blah= """blahblahblah blahblahblah blahblahblah blahblahblah v blahblahblah blahblahblah blahblahblah blahblahblah blahblahblah
blahblahblahblahblahblah blahblahblah blahblahblah blahblahblah blahblahblah blahblahblah v blahblahblah
blahblahblah blahblahblah blahblahblah v blahblahblah v blahblahblah blahblahblah blahblahblah blahblahblah  blahblahblah blahblahblah blahblahblah
blahblahblah blahblahblah blahblahblah blahblahblah blahblahblah v blahblahblah  blahblahblah blahblahblahblahblahblah blahblahblah v
blahblahblahblahblahblah v  v blahblahblah v blahblahblah blahblahblahblahblahblah v blahblahblahblahblahblah blahblahblah
blahblahblah  blahblahblah blahblahblah v v blahblahblah blahblahblah blahblahblahblahblahblah blahblahblah blahblahblah blahblahblah"""
