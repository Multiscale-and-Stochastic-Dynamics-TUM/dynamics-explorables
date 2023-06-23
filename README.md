# Dynamics Explorables

A website with explorable explanations of famous models in dynamical systems. 

🚧 Under construction 🚧

## Development notes

### Installing all the things

The website is built using [Hugo](https://gohugo.io/), a fast static-site generator. You will need to install it if you want to build the project locally. For Debian systems, do 

```bash
sudo apt install hugo
```

For any other systems, refer to the official Hugo [installation guidelines](https://gohugo.io/installation/).

Furthermore, install npm if it is not installed already:
```bash
sudo apt install npm
```

### Creating the website locally

To create the website, install all npm libraries and start a Hugo server:

```bash
npm install
npm run hugo-server
```

The website should open in your default browser.

## How to add new content

All explorables should be located in the folder `content/posts`. It is best to create a new file with Hugo as it will use a template and auto-insert YAML. To create a file with the name "my-very-own-explorable", do

```bash
hugo new posts/my-very-own-explorable.md
```

This will create a new post with the title "My very own explorable" in the `content/posts` folder. Note that this is a Markdown file: you can use typical Markdown for bold text, italics, code, links and so on.

### How to include a Plotly div

To include a Plotly div, use a plotly [shortcode](https://gohugo.io/content-management/shortcodes/). In your Markdown file, write:

```
{{< plotly id="plotlyDiv" >}}
```

This creates a new div with the id `plotlyDiv` which you can then reference from Javascirpt. 

### How to add a Javascript file

Create a new Javascript file in `/assets/js`. Let's say you name it `my_script.js`. To include the file into your markdown page, add the name of the Javascript file into the YAML of the page. Your full YAML should look like:

```
---
title: "My very own explorable"
date: 2023-04-01T20:06:16+02:00
draft: false
js: "my_script"
---
```

Do not include the extension of the file. Hugo templates will automatically load the script. 

To use any libraries inside js, include them like this: 

```javascript
import Plotly from 'plotly.js-dist-min'
```

and add the corresponding library to npm. 

### Notes on adding Latex

To add Latex, you can use the usual commands `$ ... $` and `$$ ... $$`. However, to enter the blank line macro `\\` (used, for example, to separate rows of a matrix), you need to use a triple backslash like this: `\\\`. See [here](https://docs.mathjax.org/en/latest/input/tex/html.html#interactions-with-content-management-systems) for more details. 