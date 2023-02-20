import streamlit as st
import pandas as pd
import numpy as np
import plotly as pl
import plotly.express as px
import plotly.graph_objects as go
import time
import mpld3
import streamlit.components.v1 as components
from streamlit_image_coordinates import streamlit_image_coordinates
from streamlit_plotly_events import plotly_events
from utils.dynamical_systems_general import *


st.set_page_config(
    page_title="Stable & Unstable Manifolds",
)
st.title("Stable & Unstable Manifolds")

fig_1, ax_1 = set_plot()


lw = 2

x_steps = np.linspace(-10,10,250)
lin_steps = np.linspace(-10,10,2)

dt = 0
time_dir = st.radio("Time",("Direct","Reverce"))

if time_dir == 'Direct':
    dt = 0.01
else:
    dt = -0.01


Es_p, = ax_1.plot(*ex1_5_Es(lin_steps), linewidth= lw, label = "Stable Eigenspace/Manifold", color = "red")
Eu_p, = ax_1.plot(*ex1_5_Eu(lin_steps), linewidth= lw, label = "Unstable Eigenspace", color = "blue")
#Ws_p, = ax_1.plot(*ex1_5_Ws(y_steps), linewidth= lw)
Wu_p, = ax_1.plot(*ex1_5_Wu(x_steps), linewidth= lw, label = "Unstable Manifold", color = "blue")

#point = np.array([-2,-2])

pts = {
    "On_Stable": ex1_5_Ws(4),
    "On_Unstable": ex1_5_Wu(-2),
    "Neither": np.array([1,2.2])
}

pt_choice = st.radio("Point",(list(pts.keys())))
#pt_choice = "On_Staple"
point = pts[pt_choice]
#point = ex1_5_Wu(-2)
point_p, = ax_1.plot(*point,"o")

trajectory = [[point[0]],[point[1]]]
trajectory_p, = ax_1.plot(*trajectory, label = "trajectory")

ax_1.set_xlim([-5.5,5.5])
ax_1.set_ylim([-5.5,5.5])
ax_1.legend()
st_plot = st.pyplot(fig_1)

def start_pts():
    global point, point_p, st_plot
    for i in range(100):
        point=iterate_pt(ex1_5, point, dt)
        trajectory[0].append(point[0])
        trajectory[1].append(point[1])
        point_p.set_data(point)
        trajectory_p.set_data(trajectory)
        st_plot.pyplot(fig_1)
        time.sleep(0.0005)

st.button(label = "start", key="start_btn", on_click=start_pts, args=None, kwargs=None)

def plot_clicked():
    st.write("hi")