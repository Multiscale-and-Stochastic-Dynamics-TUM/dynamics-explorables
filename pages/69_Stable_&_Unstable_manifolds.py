import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import time
import streamlit.components.v1 as components
from streamlit_plotly_events import plotly_events
from streamlit_plotly_click_anywhere import streamlit_plotly_click_anywhere

from utils.dynamical_systems_general import *
from page_elements.manifolds_elements.manifolds_text import *
from page_elements.manifolds_elements.manifolds_widgets import *

###configuration of page and staring variables
st.set_page_config(
    page_title="Stable & Unstable Manifolds",
    layout = "wide"
)
st.title("Stable & Unstable Manifolds")

if 'selected_point' not in st.session_state:
    st.session_state.selected_point = np.array([0,0])

n_it=150

#####Content#####
graph_container = st.container()
tab_intro, tab_linear, tab_eigenspaces, tab_general, tab_manifolds, tab_maps = st.tabs(["Introduction", "Linear System", "Eigenspaces", "General System", "Manifolds", "A Word About Maps"])

with tab_intro:
    st.write(intro_text)

with tab_linear:
    st.write(linear_intro_text)
    with st.expander("Example details"):
        st.write(example_system_def_text_1)
        st.latex(example_system_equation)
        st.write(example_system_def_text_2)
        st.latex(example_system_lin_equation)

with tab_eigenspaces:
    st.write(eigenspaces_intro_text)
    with st.expander("Example details"):
        st.write(example_system_eigenspaces_text_1)
        st.latex(example_system_eigenspaces_equation)
        st.write(example_system_eigenspaces_text_2)

with tab_general:
    st.write(general_intro_text)

with tab_manifolds:
    st.write(manifolds_intro_text)

with graph_container:
    col1, col2 = st.columns([4,1])
    with col2:
        ###choice of conditions
        dt = mk_time_radio()


######graph stuff####################

fig = mk_full_figure()
point = st.session_state.selected_point

pt_trajectory = [point]
for i in range(n_it):
        nx_point=iterate_pt(ex1_5, pt_trajectory[-1], dt)
        pt_trajectory.append(nx_point)
pt_trajectory = np.array(pt_trajectory)

add_trajectory_to_fig(pt_trajectory, fig, n_trace = 3, n_it = n_it)

with graph_container:
    with col1:
        plot_selected_point = streamlit_plotly_click_anywhere(fig)

if len(plot_selected_point)!=0:
    plot_selected_point_transformed = np.array(plot_selected_point)
    if np.sum(st.session_state.selected_point != plot_selected_point_transformed):
        st.session_state.selected_point = plot_selected_point_transformed

        ##### This is fucking retarded TODO: change something to rerendering only parts of the components that matter, lookup st.emply, st.addrows etc
        st.experimental_rerun()