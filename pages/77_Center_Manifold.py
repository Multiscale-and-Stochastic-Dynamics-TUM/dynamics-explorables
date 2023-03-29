import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import time
import streamlit.components.v1 as components
from streamlit_plotly_click_anywhere import streamlit_plotly_click_anywhere

from utils.manifolds_utils import *
from page_elements.manifolds_elements.manifolds_text import *
from page_elements.manifolds_elements.manifolds_widgets import *

st.set_page_config(
    page_title="70",
    layout = "wide"
)
st.title("70")