import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go

from utils.manifolds_utils import *

### For creationg widgets and adding elements to demos?

def mk_time_radio():
    time_modes = {
    "Forwards": 0.01,
    "Backwards": -0.01
    }
    time_choice = st.radio("Time",list(time_modes.keys()))
    dt = time_modes[time_choice]
    return dt

def mk_flow_radio():
    flow_modes = {
    "Linear": (ex1_5_lin_origin, True),
    "General": (ex1_5, False)
    }
    flow_choice = st.radio("System",list(flow_modes.keys()))
    flow, if_linear = flow_modes[flow_choice]
    return flow, if_linear

def mk_figure():
    layout = go.Layout(xaxis=dict(title="x",range=(-10, 10) ),yaxis=dict(title="y", range=(-10, 10)))
    fig = go.Figure(layout = layout)

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

def add_Eu_to_fig(fig, Eu = ex1_5_Eu):
    lin_steps = np.linspace(-10,10,2)
    Eu_graph = Eu(lin_steps)# "Unstable Eigenspace"
    fig.add_trace(
        go.Scatter(
            x = Eu_graph[0],
            y = Eu_graph[1],
            name = "Unstable Eigenspace",
            mode="lines",
            line=go.scatter.Line(color="red"),
            showlegend=True)
    )
    return fig
    

def add_Es_to_fig(fig, Es = ex1_5_Es, name = "Stable Eigenspace"):
    lin_steps = np.linspace(-10,10,2)
    Es_graph = Es(lin_steps)# "Stable Eigenspace/Manifold"
    fig.add_trace(
        go.Scatter(
            x = Es_graph[0],
            y = Es_graph[1],
            name = name,
            mode="lines",
            line=go.scatter.Line(color="blue"),
            showlegend=True)
    )
    return fig

def add_Wu_to_fig(fig, Wu = ex1_5_Wu):
    eigen_steps = np.linspace(-10,10,250)
    Wu_graph = Wu(eigen_steps)# "Unstable Manifold"
    fig.add_trace(
        go.Scatter(
            x = Wu_graph[0],
            y = Wu_graph[1],
            name = "Unstable Manifold",
            mode="lines",
            line=go.scatter.Line(color="orange"),
            showlegend=True)
    )
    return fig

def add_trajectory_to_fig(fig, pt_trajectory):
    trajectory_trace = fig.add_trace(
        go.Scatter(
            x = pt_trajectory[:,0],
            y = pt_trajectory[:,1],
            name = "Trajectory",
            mode="lines",
            marker=dict(color="black"),
            showlegend=True)
    )
    return fig


def add_animated_point_to_fig(fig, pt_trajectory, n_it=None):
    n_trace = len(fig.data)
    if not n_it:
        n_it = len(pt_trajectory)
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
                traces=[n_trace]
            )
            for i_fr in range(1,n_it)
        ]
    )
    return fig, mv_point

def checkbox_handler(container, fig, creator = None, args = None, kwargs = None):
    container.empty()
    add_Es_to_fig(fig)
    add_Eu_to_fig(fig)
    with container:
        st.plotly_chart(fig)
    return