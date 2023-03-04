import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go

from utils.dynamical_systems_general import *

def mk_time_radio():
    time_radio = {
    "Direct": 0.01,
    "Reverce": -0.01
    }
    time_choice = st.radio("Time",list(time_radio.keys()))
    dt = time_radio[time_choice]
    return dt

def mk_full_figure():
    x_steps = np.linspace(-10,10,250)
    lin_steps = np.linspace(-10,10,2)
        ###setting manifolds and elements of the graphs
    Es = ex1_5_Es(lin_steps)# "Stable Eigenspace/Manifold"
    Eu = ex1_5_Eu(lin_steps)# "Unstable Eigenspace"
    Wu = ex1_5_Wu(x_steps)# "Unstable Manifold"

    layout = go.Layout(xaxis=dict(title="x",range=(-10, 10) ),yaxis=dict(title="y", range=(-10, 10)))
    fig = go.Figure(layout = layout)

    ###adding elements to the graphs
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
    return fig

def add_trajectory_to_fig(pt_trajectory, fig, n_trace, n_it=100):

    mv_point = fig.add_trace(
        go.Scatter(
            x = pt_trajectory[0:1,0],
            y = pt_trajectory[0:1,1],
            name = "Tracked Point",
            mode="markers",
            marker=dict(color="black", size=8),
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
                        marker=dict(color="black", size=8)
                    )
                ],
                traces=[3]
            )
            for i_fr in range(1,n_it)
        ]
    )

    return fig, mv_point