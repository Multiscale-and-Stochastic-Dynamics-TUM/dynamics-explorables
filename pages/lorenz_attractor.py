import streamlit as st
import numpy as np
import scipy as sp
import plotly.graph_objects as go
import plotly.express as px
import matplotlib as mpl
import pandas as pd
import time


def lorenz_rhs(t, state, sigma, rho, beta):
    """The right hand-side of the Lorenz system."""
    x, y, z = state
    rhs = np.zeros(3)
    rhs[0] = sigma * (y - x)
    rhs[1] = x * (rho - z) - y
    rhs[2] = x * y - beta * z
    return rhs


def lorenz_jac(t, state, sigma, rho, beta):
    """The Jacobian of the Lorenz system."""
    x, y, z = state
    jac = np.zeros((3, 3))
    jac[0, :] = [-sigma, sigma, 0]
    jac[1, :] = [rho - z, -1, -x]
    jac[2, :] = [y, x, -beta]
    return jac


def lorenz_step(t, state, dt, sigma, rho, beta):
    """Evolves the ode from time t to t + dt.
    Returns a vector of time points in the interval (t, t + dt) and the corresponding solutions."""
    tspan = (t, t + dt)
    args = (sigma, rho, beta)
    sol = sp.integrate.solve_ivp(
        lorenz_rhs, tspan, state, args=args, jac=lorenz_jac, max_step=0.01
    )
    return sol.t, sol.y


def plot_lorenz_3d(sigma=10.0, rho=28, beta=8.0 / 3):
    y0 = np.array([1.0, 1.0, 1.0])
    dt = 100

    t, points = lorenz_step(0, y0, dt, sigma, rho, beta)

    num_points = points.shape[1]
    print(num_points)
    num_color_slices = 10

    colors = np.zeros_like(t)
    subcolors = np.array_split(colors, num_color_slices)
    for i, subarray in enumerate(subcolors):
        subarray.fill(i)

    cmap = mpl.cm.get_cmap("summer")
    colorcodes = cmap(np.linspace(0, 1, num_color_slices))
    # convert colors from arrays with values in 0-1 to a string with values in 0-255
    colorcodes = [
        f"rgb({int(color[0] * 255)}, {int(color[1] * 255)}, {int(color[2] * 255)})"
        for color in colorcodes
    ]

    colors = np.hstack(tuple(subcolors))

    df = pd.DataFrame(
        list(zip(t, points[0, :], points[1, :], points[2, :], colors)),
        columns=["time", "x", "y", "z", "colors"],
    )

    fig = px.line_3d(
        df,
        x="x",
        y="y",
        z="z",
        range_x=(-30, 30),
        range_y=(-30, 30),
        range_z=(0, 60),
        color="colors",
        color_discrete_sequence=colorcodes,
    )

    camera = dict(eye=dict(x=1.5, y=-1.5, z=0.6))
    fig.update_layout(
        scene_camera=camera, scene=go.Scene(aspectmode="cube"), showlegend=False
    )

    return fig


st.title("Lorenz attractor")

st.latex(
    r"""
         \begin{aligned}
         \dot{x} &=\sigma (y-x),\\
         \dot{y} &=x(\rho -z)-y,\\
         \dot{z} &=xy-\beta z.
         \end{aligned}
         """
)

col1, col2 = st.columns([1, 3])

with col1:
    sigma = st.slider("σ", min_value=0.0, max_value=20.0, step=0.01)
    rho = st.slider("ρ", min_value=26.0, max_value=30.0, step=0.01)
    beta = st.slider("β", min_value=2.0, max_value=4.0, step=0.01)

with col2:
    fig = plot_lorenz_3d(sigma, rho, beta)
    st.plotly_chart(fig)
