import numpy as np
import matplotlib as mpt

def iterate_pt(f, x, dt=0.001):
    return x+f(x)*dt


def set_plot(type = "usual", xap = 'zero', yap = 'zero'):
    """
    xap - x axis position \n
    yap - y axis position
    """
    fig, ax = mpt.pyplot.subplots()
    ax.grid(True, which='both')
    ax.spines['left'].set_position(yap)
    ax.spines['right'].set_color('none')
    ax.yaxis.tick_left()
    ax.spines['top'].set_color('none')
    ax.xaxis.tick_bottom()
    
    def usualt():
        ax.spines['bottom'].set_position(xap)
    def logt():
        ax.set_yscale('log')
    def no():
        1
    typer = {
        'usual': usualt,
        'log': logt,
        'no': no
            }
    
    typer[type]()
    return fig, ax


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
