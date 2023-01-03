import streamlit as st
import pandas as pd
import numpy as np
import time
import mpld3
import streamlit.components.v1 as components
from utils.dynamical_systems_general import *


st.set_page_config(
    page_title="Stable & Unstable Manifolds",
)
st.title("Stable & Unstable Manifolds")

fig_1, ax_1 = set_plot()
lw = 2

x_steps = np.linspace(-10,10,500)
y_steps = np.linspace(-10,10,500)

dt = 0
time = st.radio("Time",("Direct","Reverce"))

if time == 'Direct':
    dt = 0.01
else:
    dt = -0.01


Es_p, = ax_1.plot(*ex1_5_Es(y_steps), linewidth= lw, label = "Stable Eigenspace/Manifold", color = "red")
Eu_p, = ax_1.plot(*ex1_5_Eu(x_steps), linewidth= lw, label = "Unstable Eigenspace", color = "blue")
#Ws_p, = ax_1.plot(*ex1_5_Ws(y_steps), linewidth= lw)
Wu_p, = ax_1.plot(*ex1_5_Wu(y_steps), linewidth= lw, label = "Unstable Manifold", color = "blue")

#point = np.array([-2,-2])

pts = {
    "On_Staple": ex1_5_Ws(4),
    "On_Unstable": ex1_5_Wu(-2),
    "Neither": np.array([0.2,4])
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
#fig_html = mpld3.fig_to_html(fig_1)
#st_plot = components.html(fig_html, height=600)

def start_pts():
    global point, point_p
    for i in range(100):
        point=iterate_pt(ex1_5, point, dt)
        point_p.set_data(point)
        st_plot.pyplot(fig_1)
        #time.sleep(0.0000005)

st.button(label = "start", key="start_btn", on_click=start_pts, args=None, kwargs=None)

def plot_clicked():
    st.write("hi")

#st_plot.on_click(plot_clicked)
