import numpy as np
import streamlit as st
from plotly.subplots import make_subplots
import plotly.graph_objects as go


mesh_size = 50

st.title("Hopf bifurcation")

st.header(" Introduction")

st.write(r"""Consifer a smooth two-dimensional one-parameter ODE: is topologically equivalent to""")
st.latex(r"x' = f(x, p) \qquad x \in \mathbb{R}^2, \quad p\in \mathbb{R}")

st.write(r"""which satisfies the conditions $f(0, 0)=0$ and the jacobian $\text{D}_x f(0, p)$ has a complex conjugate pair of eigenvalues that have real part
equal to zero. Then this system is topologically to one of the two following ODEs: """)
         
st.latex(r"""
\begin{pmatrix}
y_1'  \\
y_2' 
\end{pmatrix} = 

\begin{pmatrix}
p & -1  \\
1 & p  \\
\end{pmatrix}
\begin{pmatrix}
y_1  \\
y_2 
\end{pmatrix}

\pm

(y_1^2 + y_2 ^ 2)

\begin{pmatrix}
y_1  \\
y_2 
\end{pmatrix} 

""")


st.write(r"""That are called subcritical (with the + sign) and supercritical (with the - sign) Hopf bifurcations.""")

st.header("Supercritical Hopf bifurcation")

st.write(r"""Here we present the 3D stability diagram of the supercritical hopf bifurcation as well as 2D plots of the eigenvalues of the Jacobian. 
Try different values of the parameter $p$ and see how the beheaviour of the systems changes.""")


param_p = st.slider(r"$\text{Value of the parameter } p$", min_value=-4.0, max_value=4.0, step=0.05, label_visibility='hidden')

x = np.outer(np.linspace(-4, 4, mesh_size), np.ones(mesh_size))
y = x.copy().T

x = x.reshape(-1)
y = y.reshape(-1)

z = []

for indx in range(mesh_size ** 2):
    x_val = x[indx]
    y_val = y[indx]
    z.append(x_val ** 2 + y_val ** 2)
        
fig = go.Figure(data=[go.Mesh3d(x=x,
                   y=y,
                   z=z,
                   opacity=0.5,
                   color='blue'
                  )])


fig.add_trace(go.Mesh3d(x=x,
                   y=y,
                   z=param_p * np.ones_like(x),
                   opacity=0.2,
                   color='red'
                  ))

stable_line_style = dict(color='blue', width=5)
unstable_line_style = dict(color='blue', width=5, dash='dash')

fig.add_trace(go.Scatter3d(x=[0, 0], y=[0, 0],z=[0, 15], mode='lines', 
                      line=unstable_line_style))

fig.add_trace(go.Scatter3d(x=[0, 0], y=[0, 0],z=[0, -15], mode='lines', 
                      line=stable_line_style))


if param_p > 0:
    x_intersection = np.sqrt(param_p)*np.cos(np.linspace(0, 2*np.pi, 10000))
    y_intersection = np.sqrt(param_p)*np.sin(np.linspace(0, 2*np.pi, 10000))
    z_intersection = param_p * np.ones_like(x_intersection)
    fig.add_trace(go.Scatter3d(x=x_intersection, y=y_intersection,z=z_intersection, mode='lines', 
                      line=dict(color='orange', width=10)))

else:
    x_intersection = [0]
    y_intersection = [0]
    z_intersection = [param_p]
    fig.add_trace(go.Scatter3d(x=x_intersection, y=y_intersection,z=z_intersection, mode='markers', 
                      marker=dict(color='orange', size=5)))


fig.update_layout(
    scene = dict(
        xaxis = dict(nticks=4, range=[-5,5],),
                     yaxis = dict(nticks=4, range=[-5,5],),
                     zaxis = dict(nticks=4, range=[-5,5],),),
    width=700,
    margin=dict(r=20, l=10, b=10, t=10))


camera = dict(
    up=dict(x=1, y=0, z=0),
    center=dict(x=0, y=0, z=0),
    eye=dict(x=0.5, y=2.5, z=1.0)
)

fig.update_layout(scene_camera=camera)
fig.update_layout(showlegend=False)
fig.update_layout(width = 700, height = 700) 

st.plotly_chart(fig)


# plot of eigenvalues and 2D stability"

st.write(r"""As you can see the eigenvalues cross the imaginary axes in $p=0$. Also the stability changes from one point for negative velues of$p$ 
to a circle of radius $\sqrt{p}$ for positive values of $p$.""")

Df = np.asarray([[param_p, -1], [1, param_p]])

lambda1, lambda2 = np.linalg.eig(Df)[0]

theta=np.linspace(0, 5*np.pi, 2000)
if param_p > 0:
    r=0.05*np.sqrt(param_p)*theta

else:
    r=0.05*np.sqrt(-param_p)*theta

theta1 = np.linspace(0, np.pi, 2000)

fig = make_subplots(rows=1, cols=2, subplot_titles=("Eigenvalues", "2D-Stability Diagram"))

axes_linespace = np.linspace(-10, 10, 10000)
fig.add_trace(go.Scatter(x=np.zeros_like(axes_linespace), y=axes_linespace, mode='lines', line=dict(color='black', width=3)), row=1, col=1)
fig.add_trace(go.Scatter(x=axes_linespace, y=np.zeros_like(axes_linespace), mode='lines', line=dict(color='black', width=3)), row=1, col=1)
fig.add_trace(go.Scatter(x=np.zeros_like(axes_linespace), y=axes_linespace, mode='lines', line=dict(color='black', width=3)), row=1, col=2)
fig.add_trace(go.Scatter(x=axes_linespace, y=np.zeros_like(axes_linespace), mode='lines', line=dict(color='black', width=3)), row=1, col=2)

fig.add_trace(go.Scatter(x=[lambda1.real], y=[lambda1.imag], mode='markers',
                         marker=dict(color='purple', size=10)), 
                         row=1, col=1)

fig.add_trace(go.Scatter(x=[lambda2.real], y=[lambda2.imag], mode='markers',
                         marker=dict(color='purple', size=10)), 
                         row=1, col=1)

if param_p > 0:
    fig.add_trace(go.Scatter(x=np.sqrt(param_p) * np.cos(theta1), y=np.sqrt(param_p)*np.sin(theta1),
                          mode='lines', 
                          line=dict(color='orange', width=3)), row=1, col=2)
    fig.add_trace(go.Scatter(x=np.sqrt(param_p) * np.cos(theta1), y=-np.sqrt(param_p)*np.sin(theta1),
                          mode='lines', 
                          line=dict(color='orange', width=3)), row=1, col=2)

else:
    fig.add_trace(go.Scatter(x=[0], y=[0], mode='markers', marker=dict(color='orange', size=12)), 
                      row=1, col=2)

fig.add_trace(go.Scatter(x=r*np.cos(theta), y=r*np.sin(theta),
                      mode='lines', 
                      line=dict(color='green', width=3)), row=1, col=2)

fig.update_layout(width = 700, height = 500)
fig.update_xaxes(range=[-4.5,4.5])
fig.update_yaxes(range=[-4.5,4.5])
fig.update_layout(showlegend=False)
st.plotly_chart(fig)

st.header("Mathematical description")

st.write(r"""Now we will analyze the dynamics of the Hopf bifurcation. Denote by $l_1$ the sign of the cubic term, which is called the first Lyapunov 
coefficient.""")
         

st.latex(r"""
\begin{pmatrix}
y_1'  \\
y_2' 
\end{pmatrix} = 

\begin{pmatrix}
p & -1  \\
1 & p  \\
\end{pmatrix}
\begin{pmatrix}
y_1  \\
y_2 
\end{pmatrix}

+ l_1

(y_1^2 + y_2 ^ 2)

\begin{pmatrix}
y_1  \\
y_2 
\end{pmatrix} 

""")

st.write(r"""Consider the complexification $z = y_1 + i y_2 \in \mathbb{C}$ and compute:""")  

st.latex(r"""z' = y_1' + i y_2' = p(y_1 + i y_2) + i(y_1 + i y_2) + l_1(y_1 + i y_2)(y_1^2 + y_2 ^ 2)""")

st.write(r"""Which gives us the ODE:""")  

st.latex(r"""z' = (p + i)z + l_1 z |z|^2""")

st.write(r"""Using $z = r e^{i \varphi}$ and substituting:""")  

st.latex(r"""z' = r' e^{i \varphi} + i r \varphi' e^{i \varphi} = re^{i \varphi}(q + i + l_1 r^2)""")

st.write(r"""Wich gives us the polar form:""")  

st.latex(r"""
    \begin{cases}
      r' = r(q + l_1 r^2)\\
      \varphi' = 1
    \end{cases}
    """)

st.write(r"""Then we obtain the diagrams showned before for $l_1 < 0$.""")  