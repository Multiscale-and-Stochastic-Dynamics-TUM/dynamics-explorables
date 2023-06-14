# Dynamics Explorables

A website with explorable explanations of famous models in dynamical systems. 

## Development notes

### Installing all the things

The website is built using [Hugo](https://gohugo.io/), a fast static-site generator. You will need to install it if you want to build the project locally. For Debian systems, do 

```bash
sudo apt install hugo
```

For any other systems, refer to the official Hugo [installation guidelines](https://gohugo.io/installation/).

### Creating the website locally

To create the website, switch to the `dynamics-explorables` folder, install all npm libraries and start a Hugo server:

```bash
cd dynamics-explorables
npm install
npm run hugo-server
```

The website should open in your default browser.

## How to add new content

> 📝 The explanations here and the bash commands assume that you are in the `dynamics-explorables/dynamics-explorables` folder as this is the Hugo root folder.

All explorables should be located a subfolder of `content/posts`, for example, `content/posts/Basics`. Creating a post directly in `content/posts` and not in a subfolder can cause errors! It is best to create a new file with Hugo as it will use a template and auto-insert YAML. To create a file with the name "my-very-own-explorable" in the Basics category, do

```bash
hugo new posts/Basics/my-very-own-explorable.md
```

This will create a new post with the title "My very own explorable" in the `content/posts/Basic` folder. Note that this is a Markdown file: you can use typical Markdown for bold text, italics, code, links and so on. The name of the file should be written in `kebab-case` as the name of the file is parsed to create the title automatically.

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
# ... other YAML properties ...
js: "my_script"
---
```

Do not include the extension of the file. Hugo templates will automatically load the script. 

To use any libraries inside js, include them like this: 

```javascript
import Plotly from 'plotly.js-dist-min'
```

and add the corresponding library to npm. 
### How to add interactive input elements

You cannot add html into markdown directly; the only way to add any html is to use [shortcodes](https://gohugo.io/content-management/shortcodes/). We have pre-defined shortcodes for common input elements like  input elements buttons, sliders, radio-buttons and checkboxes. For example, to add a slider, do 

```
{{< slider id="MySlider" min="0.0" max="2.0" step="0.1" value="1.3" >}}
```

This will create a slider from 0 to 2 with a step of 0.1 which starts at the value of 1.3. The slider has the id `MyName` which you can then reference from Javascript. Additionally, the shortcode automatically creates a label with the automatically-generated id `MyNameLabel`. A common workflow is to update the label whenever the user moves the slider:

```javascript
const slider = document.getElementById('MyName');
const label = document.getElementById('MyNameLabel');
label.innerHTML = `x = ${slider.value}`;

slider.oninput = () => {
  label.innerHTML = `x = ${slider.value}`;
  /* do other things with the value */
}
```

The `oninput` funciton triggers immediately before the user lifts the mouse button. If you have some expensive computation that you only want to trigger whenever the user lifts the mouse button, use 

```javascript
slider.addEventListener('change', (event) => {
    /* your event */
})
```

The two functions can be combined. 

### Notes on adding Latex

To add Latex, you can use the usual commands `$ ... $` and `$$ ... $$`. However, to enter the blank line macro `\\` (used, for example, to separate rows of a matrix), you need to use a triple backslash like this: `\\\`. See [here](https://docs.mathjax.org/en/latest/input/tex/html.html#interactions-with-content-management-systems) for more details. 