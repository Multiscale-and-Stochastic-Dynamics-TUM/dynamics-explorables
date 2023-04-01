# Dynamics Explorables

This branch contains our explorations of the Streamlit Python library as a basis framework for the website. We decided not to pursue this path further and instead switch to Javascript. To briefly summarize the reasoning, Streamlit does not work very well in situations when a plot needs to be updated multiple times per second. This makes it impossible to create smooth nice animations. 

## Development notes

### Installing all the things

We use [Poetry](https://python-poetry.org/) to manage Python environments and dependencies. To install Poetry on Linux, Windows or macOS, go to the [documentation](https://python-poetry.org/docs/#installation). Then, run the following commands:

 ```bash
 poetry shell
 poetry install
 ```

This creates a new python environment for the project and installs all packages. 

### Creating the website locally

To create the Streamlit website, activate the poetry shell using `poetry shell` if you haven't done so already and run:

```bash
streamlit run main.py
```

The website should open in your default browser automatically.

### Adding a new dependency

To add a new dependency, run:

```
poetry add <package name>
```

and commit the `poetry.lock` and `pyproject.toml` files. 
