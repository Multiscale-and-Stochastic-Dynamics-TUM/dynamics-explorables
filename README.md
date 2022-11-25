# Dynamics Explorables

A website with explorable explanations of famous models in dynamical systems. 

🚧 Under construction 🚧

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
