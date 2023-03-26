import numpy as np
import streamlit as st
from plotly.subplots import make_subplots
import plotly.graph_objects as go


def get_branches_fig(x_linespace, branches, branches_stable, points, are_stable_points, range_min, range_max):
    stable_line_style = dict(color='blue', width=3)
    unstable_line_style = dict(color='blue', width=3, dash='dash')
    
    filtered_points = get_filtered_points(points, are_stable_points, range_min, range_max)
    arrows = get_arrows(points, are_stable_points, range_min, range_max)
    
    fig = make_subplots(rows=2, cols=1, row_heights=[0.7, 0.3])
    
    # Create all traces of the first subplot
    for branch, stable in zip(branches, branches_stable):
        line_style = stable_line_style if stable else unstable_line_style
        fig.add_trace(go.Scatter(x=x_linespace, y=branch,
                      mode='lines', 
                      line=line_style), row=1, col=1)
        
    # Create all traces of the second subplot
    fig.add_trace(go.Scatter(x=x, y=np.zeros_like(x),
                      mode='lines', 
                      line=dict(color='red', width=3)), row=2, col=1)

    for point, is_stable in filtered_points:
        point_color = "green" if is_stable else "orange"
        fig.add_trace(go.Scatter(x=[point], y=[0], mode='markers', marker=dict(color=point_color, size=12)), 
                      row=2, col=1)

    fig.update_layout(annotations=arrows)
    fig.update_layout(showlegend=False)
    fig.update_layout(height=600)    
    
    return fig


def generate_horizontal_arrow(point, right=True, arrow_size=0.1, color='rgb(255,51,0)'):
    x = point
    
    x_start = x - arrow_size / 2 if right else x + arrow_size / 2
    x_end = x + arrow_size / 2 if right else x - arrow_size / 2
    
    arrow = go.layout.Annotation(dict(
                            x= x_end,
                            y= 0,
                            xref="x", yref="y2",
                            text="",
                            showarrow=True,
                            axref = "x", ayref='y',
                            ax= x_start,
                            ay= 0,
                            arrowhead=1,
                            arrowwidth=2.5,
                            arrowcolor='red',)
                            )
    return arrow


def get_filtered_points(points, are_stable_points, range_min, range_max):
    grouped_points = zip(points, are_stable_points)
    sorted_points = sorted(grouped_points, key=lambda x: x[0])
    filtered_points = filter(lambda x: x[0] < range_max and x[0] > range_min, sorted_points)
    result = [(point, is_stable) for point, is_stable in filtered_points]
    return result
    
    
def get_arrows(points, are_stable_points, range_min, range_max):
    filtered_points = get_filtered_points(points, are_stable_points, range_min, range_max)
    arrows = []
    
    for indx, (point, is_stable) in enumerate(filtered_points):
        
        if indx == 0:
            arrow_point = (range_min + point) / 2
            arrows.append(generate_horizontal_arrow(arrow_point, is_stable, 0.1, "blue"))
            
        if indx != len(filtered_points) - 1:
            next_point = filtered_points[indx + 1][0]
            arrow_point = (point + next_point) / 2
            arrows.append(generate_horizontal_arrow(arrow_point, not is_stable, 0.1, "blue"))
            
        elif indx == len(filtered_points) - 1:
            arrow_point = (point + range_max) / 2
            arrows.append(generate_horizontal_arrow(arrow_point, not is_stable, 0.1, "blue"))
    
    return arrows

st.title(" Pitchfork bifurcation ")
st.header(" Introduction")

st.write(r"""The appeareance of a non-equivalent phase portrairt uppon parameter variation is called a 
Bifurcation. In this page we introduce the pitchfork bifurcation, which is one of the main examples of 
this topic. Consider the ordinary differential equation:""")
st.latex(r"x' = px - x ^ 3")
st.write(r"""with $p \in \mathbb{R}$. As you can see the beheaviour of the system is different for
$p > 0$ and for $p \leq 0$. In the first case we have 3 equilibria, at $-\sqrt{p}$, $0$ and $\sqrt{p}$),
being $0$ the only unstable one. In the second case there is only one equilibria at $0$ and is stable.
""")

st.write(r"""You can vary the values of $p$ in the plot below and see how the stability diagram changes.
""")

x_resolution = 10000
x_max = 2.0
arrow_size = 0.1

#streamlit_style = """
#			<style>
#
#			html, body, [class*="css"]  {
#			font-family: 'Roboto', sans-serif;
#            font-size: 16px
#			}
#			</style>
#			"""
#st.markdown(streamlit_style, unsafe_allow_html=True)

param_p = st.slider(r"Value of the parameter $p$", min_value=-2.0, max_value=2.0, step=0.02)

x = np.linspace(-x_max, x_max, x_resolution)

stable_branch = np.asarray([0 if i <= x_resolution / 2 else None for i in range(x_resolution)])
unstable_branch = np.asarray([0 if i > x_resolution / 2 else None for i in range(x_resolution)])

upper_branch = np.asarray([np.sqrt(i) if i >= 0 else None for i in x])
lower_branch = np.asarray([-np.sqrt(i) if i >= 0 else None for i in x])


branches = [stable_branch, unstable_branch, upper_branch, lower_branch]

stable_points = [0]
are_stable_points = [True] if param_p < 0 else [False]

if param_p >= 0:
    stable_points += [np.sqrt(param_p), -np.sqrt(param_p)]
    are_stable_points += [True, True]

fig = get_branches_fig(x, branches, [True, False, True, True], stable_points, are_stable_points, -2, 2)
fig.add_shape(
    go.layout.Shape(
        type="line",
        x0=param_p,
        y0=-3,
        x1=param_p,
        y1=3,
        line=dict(color="Red", width=1),
    ),row=1,col=1)



fig.add_trace(go.Scatter(x=param_p*np.ones_like(stable_points), y=stable_points,
                      mode='markers', 
                      line=dict(color='green', width=3)), row=1, col=1)

for point, is_stable in zip(stable_points, are_stable_points):
        point_color = "green" if is_stable else "orange"
        fig.add_trace(go.Scatter(x=[param_p], y=[point], mode='markers', marker=dict(color=point_color, size=10)), 
                      row=1, col=1)


fig.update_layout(width = 700, height = 700,)

st.plotly_chart(fig)

st.header("Mathematical description")

st.write(r"""For explicitly solving this problem the first thing that we have to do is compute the 
equilibria depending on the parameter $p$. This points era exactly the solution to:
""")

st.latex(r"0 = px - x ^ 3")

st.write(r""" $x = 0$ is always a solution of the previous equation and $x = \pm \sqrt{p}$ 
are also two different solutions if $p > 0$. These solutions are exactly the branches that apear i
in the previous plot. 
""")

st.write(r""" For computing the stability of the branches we have to differentiate the right hand side
of our differential equation:
""")

st.latex(r"\frac{\mathrm{d} (px - x ^ 3)}{\mathrm{d} x} = p - 2x ^ 2")

st.write(r""" Evaluationg the last expression at $x = 0$ we obtain $p$ which is negative (then the 
equilibria is stable) for $p < 0$ and is positive (then the equilibria is unstable) for $p >0$.

Evaluationg the same expression at $x = \pm \sqrt{p}$ we obtain the value $p$ which corresponds
in both cases to a stable equilibria because this equilibria only exits for $p > 0$.
""")

