from  matplotlib.pyplot import *
from  scipy import *

def gimme_iterator(f, g, dt):
    """
    f - "deterministic" finction
    g - function with the noises
    dt - time increment
    dW - noise thing  
    """
    def iterator(X,dW):
        return X + f(X)*dt + g(X)*dW
    return iterator 

def gimme_f(a,b,alfa,beta):   
    fx1 = np.array([alfa, -beta])
    fx2 = np.array([a, -b])
    fy1 = np.array([beta, alfa])
    fy2 = np.array([b, a])
    def f(X):
        norm_x = np.dot(X,X)
        fx = fx1 - norm_x*fx2
        fy = fy1 - norm_x*fy2
        return np.array([
            np.dot(fx,X),
            np.dot(fy,X)])
    return f
    
def gimme_g(sigma):     
    def g(X): 
        return np.array([sigma, sigma])
    return g

def make_orbit(iterator, X_0, dW, n_it):
    orbit = [X_0]
    for i in range(0,n_it):
        orbit.append(iterator(orbit[-1],dW[i-1]))
    return np.array(orbit)