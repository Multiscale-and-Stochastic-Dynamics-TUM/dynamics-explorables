import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.figure_factory as ff
import time
import streamlit.components.v1 as components

from streamlit_plotly_click_anywhere import clickable_chart

from utils.manifolds_utils import *
from page_elements.manifolds_elements.manifolds_text import *
from page_elements.manifolds_elements.manifolds_widgets import *

state = st.session_state

#####configuration of page and staring variables#####
st.set_page_config(
    page_title="Stable & Unstable Manifolds",
    layout = "wide"
)
st.title("Stable & Unstable Manifolds")

if 'selected_point' not in state:
    state.selected_point = np.array([0,0])

if 'interractables_states' not in state:
    state.interractables_states = {
        "show_eigenspaces": False,
        "show_manifolds": False,
        "show_tragectory": False,
        "if_linear": True,
    }

#####Content Layout and Interractables#####
graph_container = st.container()
with graph_container:
    col1, col2 = st.columns([4,1])
    with col1:
        graph_space = st.empty()
        #TODO: trying to fix space, but the whole thing still jumps
    with col2:
        ###choice of conditions
        dt = mk_time_radio()
        flow, state.interractables_states["if_linear"] = mk_flow_radio()
        state.interractables_states["show_eigenspaces"] = st.checkbox("Show Eigenspaces", value=False)
        state.interractables_states["show_manifolds"] = st.checkbox("Show Manifolds", value=False, disabled = state.interractables_states["if_linear"])
        state.interractables_states["show_trajectory"] = st.checkbox("Show Trajectory", value=False)
        T = st.number_input("Duration", min_value=0.0, value = 2.0)

tab_intro, tab_linear, tab_eigenspaces, tab_general, tab_manifolds, tab_maps, tab_other = st.tabs(["Introduction", "Linear System", "Eigenspaces", 
"General System", "Manifolds", "A Word About Maps", "Other examples"])

#####Tabs and Text#####
with tab_intro:
    st.write(intro_text)

with tab_linear:
    st.write(linear_text_intro)
    with st.expander("Example details"):
        st.write(linear_example_text_def1)
        st.latex(linear_example_equation_gen)
        st.write(linear_example_text_def2)
        st.latex(linear_example_equation_lin)

with tab_eigenspaces:
    st.write(eigenspaces_text_intro)
    with st.expander("Example details"):
        st.write(eigenspaces_example_text_1)
        st.latex(eigenspaces_example_equation)
        st.write(eigenspaces_example_text_2)

with tab_general:
    st.write(general_text_intro)

with tab_manifolds:
    st.write(manifolds_text_1)
    st.latex(manifolds_equation_extention)
    st.write(manifolds_text_2)
    with st.expander("Example details"):
        st.write(manifolds_example_text)
        st.latex(manifolds_example_equation)
    st.write(manifolds_example_text_regularity)

with tab_maps:
    st.write(maps_text_intro)
    
#####graph stuff#####
fig = mk_figure()
n_it = abs(int(T/dt))

if state.interractables_states["show_eigenspaces"]:
    Es_kwargs = {"name":"Stable Eigenspace"}
    if state.interractables_states["show_manifolds"]:
        Es_kwargs["name"] = "Stable Eigenspace/Manifold"
    add_Es_to_fig(fig, **Es_kwargs)
    add_Eu_to_fig(fig)

if state.interractables_states["show_manifolds"]:
    if not state.interractables_states["show_eigenspaces"]:
        add_Es_to_fig(fig, name = "Stable Manifold")
    add_Wu_to_fig(fig)

point = state.selected_point
pt_trajectory = create_trajectory(flow, point, dt, n_it)
if state.interractables_states["show_trajectory"]:
    add_trajectory_to_fig(fig, pt_trajectory)
add_animated_point_to_fig(fig, pt_trajectory)

with graph_space:
    plot_selected_point = clickable_chart(fig)

if len(plot_selected_point)!=0:
    plot_selected_point_transformed = np.array(plot_selected_point)
    if np.sum(state.selected_point != plot_selected_point_transformed):
        state.selected_point = plot_selected_point_transformed

        #This is fucking retarded TODO: change something to rerender only parts of the components that matter, lookup st.emply, st.addrows etc.
        #the code apparently also runs two times because of the update and then the rerun
        st.experimental_rerun()

###TODO:

### For optimisation:
### make a wrapper here to rerun when needed, with emptying containers; 
### select_traces ?
### trace.visible ?
### delete traces as list items ?

### For code:
### Chage the imports so that devs wouldn't be getting confused

### For Content:
### Other examples?