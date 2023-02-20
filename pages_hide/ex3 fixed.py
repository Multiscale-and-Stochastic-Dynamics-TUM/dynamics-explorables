from  scipy import *
import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
import time
from utils.ut_ex3 import *
from utils.dynamical_systems_general import *

col1, col2 = st.columns([1, 1])

with col1:
    alfa = st.slider(r"alpha", min_value=-10.0, max_value=10.0, step=1.0, value = 1.0)
    beta = st.slider(r"beta", min_value=-20.0, max_value=20.0, step=1.0, value = 10.0)

with col2:
    a = st.slider(r"a", min_value=-5.0, max_value=5.0, step=1.0, value = 1.0)
    b = st.slider(r"b", min_value=-20.0, max_value=20.0, step=1.0, value = 0.0)

args1 = {
    "alfa":1.0,
    "beta":19.0,
    "a":1.0,
    "b":-1.0
}

args2 = {
    "alfa":1.0,
    "beta":10.0,
    "a":1.0,
    "b":-10.0
}

args3 = {
    "alfa":alfa,
    "beta":beta,
    "a": a,
    "b": b
}

with col1:
    n_it = st.slider(r"n_it", min_value=0, max_value=3000, step=20, value = 3000)
    n_orbits = st.slider(r"n_orbits", min_value=1, max_value=50, step=1, value = 50)
    args = st.radio("Conditions",[args1, args2, args3])

with col2:
    sigma = st.slider(r"sigma", min_value=0.0, max_value=10.0, step=0.01, value = 1.0)
    dt = st.slider("dt", min_value=0.0, max_value=0.05, step=0.001, value = 0.001)
    orb_fl = st.radio("Show Orbits?",[0, 1])

r_state = np.random.RandomState(1235)
dW = np.sqrt(dt)*r_state.normal(size = (n_it,2))

f = gimme_f(**args)
g = gimme_g(sigma)
iterator = gimme_iterator(f, g, dt)

layout = go.Layout(xaxis=dict(title="x",range=(-5, 5) ),yaxis=dict(title="y", range=(-5, 5)))
fig = go.Figure(layout = layout)

orbits = []
for i in range(0,n_orbits):
    X_0 = np.random.normal(size = (2))
    orbit = make_orbit(iterator, X_0, dW, n_it)
    orbits.append(orbit)

#comm = """
    if orb_fl:
        fig.add_trace(
            go.Scatter(
                x = orbit[:,0],
                y = orbit[:,1],
                name = f"Orbit{i}",
                mode="lines",
                line=go.scatter.Line(),#color="blue"),
                showlegend=False)
        )
#"""

orbits = np.array(orbits)

fig.add_trace(
        go.Scatter(
            x = orbits[:,0,0],
            y = orbits[:,0,1],
            #name = f"Orbit{i}",
            mode="markers",
            #line=go.scatter.Line(color="white"),
            
            showlegend=False)
    )

fig.update(
    frames=[
        go.Frame(
            data=[
                go.Scatter(
                    x=(orbits[:, i_fr,0].flatten()),
                    y=(orbits[:, i_fr,1].flatten()),
                )
            ]
        )
        for i_fr in range(0,n_it)
    ]
)

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

def frame_args(duration):
    return {
            "frame": {"duration": duration},
            "mode": "immediate",
            "fromcurrent": True,
            "transition": {"duration": duration, "easing": "linear"},
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