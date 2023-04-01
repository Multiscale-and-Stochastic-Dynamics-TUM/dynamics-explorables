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
    alfa = st.slider(r"alpha", min_value=-10.0, max_value=10.0, step=1.0)
    beta = st.slider(r"beta", min_value=-20.0, max_value=20.0, step=1.0, value = 10.0)
    n_it = st.slider(r"n_it", min_value=0, max_value=3000, step=20, value = 1000)
    n_orbits = st.slider(r"n_orbits", min_value=1, max_value=50, step=1, value = 10)

with col2:
    a = st.slider(r"a", min_value=-5.0, max_value=5.0, step=1.0, value = 1.0)
    b = st.slider(r"b", min_value=-5.0, max_value=5.0, step=1.0, value = 0.0)
    sigma = st.slider(r"sigma", min_value=0.0, max_value=10.0, step=0.01, value = 1.0)
    dt = st.slider("dt", min_value=0.0, max_value=0.05, step=0.001, value = 0.01)

f = gimme_f(a,b,alfa,beta)
g = gimme_g(sigma)
iterator = gimme_iterator(f, g, dt)

#r_state = np.random.RandomState(100)
#dW = np.sqrt(dt)*r_state.normal(size = (n_it,2))

layout = go.Layout(xaxis=dict(title="x",range=(-5, 5) ),yaxis=dict(title="y", range=(-10, 10)))
fig = go.Figure(layout = layout)

orbits = []
for i in range(0,n_orbits):
    X_0 = np.random.normal(size = (2))
    dW = np.sqrt(dt)*np.random.normal(size = (n_it,2))
    orbit = make_orbit(iterator, X_0, dW, n_it)
    orbits.append(orbit)

    fig.add_trace(
        go.Scatter(
            x = [orbit[0,0]],
            y = [orbit[0,1]],
            #name = f"Orbit{i}",
            #mode="lines",
            line=go.scatter.Line(color="white"),
            showlegend=False)
    )

    fig.add_trace(
        go.Scatter(
            x = orbit[:,0],
            y = orbit[:,1],
            name = f"Orbit{i}",
            mode="lines",
            line=go.scatter.Line(),#color="blue"),
            showlegend=False)
    )

st.plotly_chart(fig)