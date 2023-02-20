import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
import time
import mpld3
import streamlit.components.v1 as components
from streamlit_image_coordinates import streamlit_image_coordinates
from streamlit_plotly_events import plotly_events
from utils.dynamical_systems_general import *

###configuration of page and staring variables
st.set_page_config(
    page_title="Stable & Unstable Manifolds",
)
st.title("Stable & Unstable Manifolds")

col1, col2 = st.columns([1, 10])

x_steps = np.linspace(-10,10,250)
lin_steps = np.linspace(-10,10,2)
n_it=150

###choice of conditions
time_radio = {
    "Direct": 0.01,
    "Reverce": -0.01
}
time_choice = st.radio("Time",list(time_radio.keys()))
dt = time_radio[time_choice]

point_radio = {
    "On_Stable": ex1_5_Ws(4),
    "On_Unstable": ex1_5_Wu(-2),
    "Neither": np.array([1,2.2])
}
point_choice = st.radio("Point",list(point_radio.keys()))
point = point_radio[point_choice]

###setting manifolds and elements of the graphs
Es = ex1_5_Es(lin_steps)# "Stable Eigenspace/Manifold"
Eu = ex1_5_Eu(lin_steps)# "Unstable Eigenspace"
Wu = ex1_5_Wu(x_steps)# "Unstable Manifold"

pt_trajectory = [point]
for i in range(n_it):
        nx_point=iterate_pt(ex1_5, pt_trajectory[-1], dt)
        pt_trajectory.append(nx_point)
pt_trajectory = np.array(pt_trajectory)

layout = go.Layout(xaxis=dict(title="x",range=(-10, 10) ),yaxis=dict(title="y", range=(-10, 10)))
fig = go.Figure(layout = layout)

###adding elements to the graphs
mv_point = fig.add_trace(
    go.Scatter(
        x = [point[0]],
        y = [point[1]],
        name = "Tracked Point",
        mode="markers",
        marker=dict(color="purple", size=10),
        showlegend=True)
)

fig.update(
    frames=[
        go.Frame(
            data=[
                go.Scatter(
                    x=[pt_trajectory[i_fr, 0]],
                    y=[pt_trajectory[i_fr, 1]],
                    name = "Tracked Point",
                    mode="markers",
                    marker=dict(color="purple", size=10)
                )
            ]
        )
        for i_fr in range(1,n_it)
    ]
)

fig.add_trace(
    go.Scatter(
        x = Es[0],
        y = Es[1],
        name = "Stable Eigenspace/Manifold",
        mode="lines",
        line=go.scatter.Line(color="blue"),
        showlegend=True)
)

fig.add_trace(
    go.Scatter(
        x = Eu[0],
        y = Eu[1],
        name = "Unstable Eigenspace",
        mode="lines",
        line=go.scatter.Line(color="red"),
        showlegend=True)
)

fig.add_trace(
    go.Scatter(
        x = Wu[0],
        y = Wu[1],
        name = "Unstable Manifold",
        mode="lines",
        line=go.scatter.Line(color="orange"),
        showlegend=True)
)


play_button = {
    "args": [
        None,
        {
            "frame": {"duration": 0, "redraw": True},
            "fromcurrent": True,
            "transition": {
                "duration": 100,
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

selected_points = plotly_events(fig, click_event=True)
st.write(selected_points)

what = st.plotly_chart(fig)
