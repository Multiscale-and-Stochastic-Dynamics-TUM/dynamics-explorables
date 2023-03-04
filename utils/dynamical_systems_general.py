import numpy as np
import matplotlib as mpt
import pandas as pd

def iterate_pt(f, x, dt=0.001):
    return x+f(x)*dt

###stable/unstable manifold example
def ex1_5(x):
    return np.array([
        x[0],
        -x[1]+x[0]*x[0]
        ])

def ex1_5_lin_origin(x):
    return np.array([
        [1,0],
        [0,-1]
    ])

def ex1_5_Eu(x):
    return np.array([x,0*x])

def ex1_5_Es(y):
    return np.array([0*y,y])

def ex1_5_Wu(x):
    return np.array([x,1/3*x*x])

def ex1_5_Ws(y):
    return np.array([0*y,y])
