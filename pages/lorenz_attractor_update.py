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
        lorenz_rhs, tspan, state, args=args, jac=lorenz_jac, max_step=0.02
    )
    return sol.t, sol.y


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

y0 = np.array([1., 1., 1.])
t0 = 0
tspan = (0, 50)
dt = 50

sigma = 10.0
rho = 28.0
beta = 8.0 / 3

t, points = lorenz_step(0, y0, dt, sigma, rho, beta)

num_points = points.shape[1]
num_color_slices = 10
init = 10
max_num_points = 200

df = pd.DataFrame(
    list(zip(t, points[0, :], points[1, :], points[2, :])),
    columns=["time", "x", "y", "z"],
)


fig = px.line_3d(
    x=df["x"][:init],
    y=df["y"][:init],
    z=df["z"][:init],
    range_x=(-30, 30),
    range_y=(-30, 30),
    range_z=(0, 60),
)


camera = dict(eye=dict(x=1.5, y=-1.5, z=0.6))
layout = go.Layout(
    scene=go.layout.Scene(aspectmode="cube"),
    showlegend=False,
)

line = go.scatter3d.Line(color = np.linspace(0, 1, max_num_points), 
                         cmin=0, cmax=1, colorscale="YlOrRd")

index_range = [(max(0, k - max_num_points), k)
                    for k in range(init, len(df))]

fig.update(
    frames=[
        go.Frame(
            data=[
                go.Scatter3d(
                    x=df["x"][start:end],
                    y=df["y"][start:end],
                    z=df["z"][start:end],
                    mode="lines",
                    line = line
                )
            ],
            layout=layout,
        )
        for start, end in index_range
    ]
)

fig.update_layout(layout)
fig.update_layout(scene_camera = camera)

play_button = {
    "args": [
        None,
        {
            "frame": {"duration": 10, "redraw": True},
            "fromcurrent": True,
            "transition": {
                "duration": 10,
                "easing": "quadratic-in-out",
            },
        },
    ],
    "label": "Play",
    "method": "animate",
}

pause_button = {
    "args": [
        [None],
        {
            "frame": {"duration": 0, "redraw": False},
            "mode": "immediate",
            "transition": {"duration": 0},
        },
    ],
    "label": "Pause",
    "method": "animate",
}

fig.update_layout(
    updatemenus=[{
        "buttons": [play_button, pause_button],
        "direction": "left",
        "pad": {"r": 10, "t": 87},
        "showactive": False,
        "type": "buttons",
        "x": 0.1,
        "xanchor": "right",
        "y": 0,
        "yanchor": "top"
    }]
)

st.plotly_chart(fig)