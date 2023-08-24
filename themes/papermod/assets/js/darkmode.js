import {getCSSColor} from '/js/modules/design/colors.js'
import Plotly from 'plotly.js-dist-min';

const darkTemplate = {
  'template.layout': {
    annotationdefaults: {arrowcolor: '--content'},
    autotypenumbers: 'strict',
    colorscale: {
      diverging: [
        [0, '#c25144'],
        [0.1111111111111111, '#cc7866'],
        [0.2222222222222222, '#d69d86'],
        [0.3333333333333333, '#deb89e'],
        [0.4444444444444444, '#e7dbbc'],
        [0.5555555555555556, '#dde6c9'],
        [0.6666666666666666, '#bed9c5'],
        [0.7777777777777778, '#97c9c0'],
        [0.8888888888888888, '#77bcbc'],
        [1.0, '#4daab7'],
      ],
      sequential: [
        [0.0, '#370d24'],
        [0.1111111111111111, '#5b1e27'],
        [0.2222222222222222, '#8b342b'],
        [0.3333333333333333, '#aa4f2e'],
        [0.4444444444444444, '#c66731'],
        [0.5555555555555556, '#df8440'],
        [0.6666666666666666, '#e3ab76'],
        [0.7777777777777778, '#e7d2ab'],
        [0.8888888888888888, '#e6ebd2'],
        [1.0, '#e0fced'],
      ],
      sequentialminus: [
        [0.0, '#370d24'],
        [0.1111111111111111, '#5b1e27'],
        [0.2222222222222222, '#8b342b'],
        [0.3333333333333333, '#aa4f2e'],
        [0.4444444444444444, '#c66731'],
        [0.5555555555555556, '#df8440'],
        [0.6666666666666666, '#e3ab76'],
        [0.7777777777777778, '#e7d2ab'],
        [0.8888888888888888, '#e6ebd2'],
        [1.0, '#e0fced'],
      ],
    },
    colorway:
        ['--blue', '--orange', '--green', '--red', '--yellow', '--purple'],
    font: {color: '--content'},
    geo: {
      bgcolor: '--theme',
      lakecolor: '--theme',
      landcolor: '--theme',
      subunitcolor: '#506784',
    },
    mapbox: {style: 'dark'},
    paper_bgcolor: '--theme',
    plot_bgcolor: '--theme',
    polar: {
      angularaxis: {
        gridcolor: '--tertiary',
        linecolor: '#506784',
      },
      bgcolor: '--code-bg',
      radialaxis: {
        gridcolor: '#506784',
        linecolor: '#506784',
      },
    },
    scene: {
      xaxis: {
        gridcolor: '#506784',
        linecolor: '#506784',
        showbackground: false,
        zerolinecolor: '#C8D4E3',
      },
      yaxis: {
        gridcolor: '#506784',
        linecolor: '#506784',
        showbackground: false,
        zerolinecolor: '#C8D4E3',
      },
      zaxis: {
        gridcolor: '#506784',
        linecolor: '#506784',
        showbackground: false,
        zerolinecolor: '#C8D4E3',
      },
    },
    shapedefaults: {line: {color: '--content'}},
    sliderdefaults: {
      bgcolor: '#C8D4E3',
      bordercolor: '#161a1d',
      borderwidth: 1,
      tickwidth: 0,
    },
    ternary: {
      aaxis: {
        gridcolor: '#506784',
        linecolor: '#C8D4E3',
      },
      baxis: {
        gridcolor: '#506784',
        linecolor: '#C8D4E3',
      },
      bgcolor: '--code-bg',
      caxis: {
        gridcolor: '#506784',
        linecolor: '#C8D4E3',
      },
    },
    updatemenudefaults: {bgcolor: '#506784', borderwidth: 0},
    xaxis: {
      gridcolor: '#506784',
      linecolor: '#506784',
      zerolinecolor: '#C8D4E3',
    },
    yaxis: {
      gridcolor: '#506784',
      linecolor: '#506784',
      zerolinecolor: '#C8D4E3',
    },
  },
};

const lightTemplate = {
  'template.layout': {
    annotationdefaults: {arrowcolor: '--content'},
    autotypenumbers: 'strict',
    colorscale: {
      diverging: [
        [0, '#c25144'],
        [0.1111111111111111, '#cc7866'],
        [0.2222222222222222, '#d69d86'],
        [0.3333333333333333, '#deb89e'],
        [0.4444444444444444, '#e7dbbc'],
        [0.5555555555555556, '#dde6c9'],
        [0.6666666666666666, '#bed9c5'],
        [0.7777777777777778, '#97c9c0'],
        [0.8888888888888888, '#77bcbc'],
        [1.0, '#4daab7'],
      ],
      sequential: [
        [0.0, '#e0fced'],
        [0.1111111111111111, '#e6ebd2'],
        [0.2222222222222222, '#e7d2ab'],
        [0.3333333333333333, '#e3ab76'],
        [0.4444444444444444, '#df8440'],
        [0.5555555555555556, '#c66731'],
        [0.6666666666666666, '#aa4f2e'],
        [0.7777777777777778, '#8b342b'],
        [0.8888888888888888, '#5b1e27'],
        [1.0, '#370d24'],
      ],
      sequentialminus: [
        [0.0, '#e0fced'],
        [0.1111111111111111, '#e6ebd2'],
        [0.2222222222222222, '#e7d2ab'],
        [0.3333333333333333, '#e3ab76'],
        [0.4444444444444444, '#df8440'],
        [0.5555555555555556, '#c66731'],
        [0.6666666666666666, '#aa4f2e'],
        [0.7777777777777778, '#8b342b'],
        [0.8888888888888888, '#5b1e27'],
        [1.0, '#370d24'],
      ],
    },
    colorway:
        ['--blue', '--orange', '--green', '--red', '--yellow', '--purple'],
    font: {
      color: '--content',
    },
    geo: {
      bgcolor: 'white',
      lakecolor: 'white',
      landcolor: '#E5ECF6',
      subunitcolor: 'white',
    },
    mapbox: {style: 'light'},
    paper_bgcolor: 'white',
    plot_bgcolor: 'white',
    polar: {
      angularaxis: {
        gridcolor: '#EEEEEE',
        linecolor: '#444444',
      },
      bgcolor: 'white',
      radialaxis: {
        gridcolor: '#EEEEEE',
        linecolor: '#444444',
      },
    },
    scene: {
      xaxis: {
        color: '#444',
        showbackground: false,
      },
      yaxis: {
        color: '#444',
        showbackground: false,
      },
      zaxis: {
        color: '#444',
        showbackground: false,
      },
    },
    shapedefaults: {line: {color: '--content'}},
    ternary: {
      aaxis: {
        gridcolor: '#EEEEEE',
        linecolor: '#444444',
      },
      baxis: {
        gridcolor: '#EEEEEE',
        linecolor: '#444444',
      },
      bgcolor: 'white',
      caxis: {
        gridcolor: '#EEEEEE',
        linecolor: '#444444',
      },
    },
    xaxis: {
      gridcolor: '#EEEEEE',
      linecolor: '#444444',
      zerolinecolor: '#444444',
    },
    yaxis: {
      gridcolor: '#EEEEEE',
      linecolor: '#444444',
      zerolinecolor: '#444444',
    },
  },
};

/**
 * Replace all instances of strings representing CSS variables like '--red' by
 * the corresponding value from the CSS. Modifies the object in-place.
 */
function evalColors(obj) {
  for (var key in obj) {
    let value = obj[key];
    // Replace values in arrays, like ['--red', '--blue']
    if (Array.isArray(value)) {
      obj[key] = value.map((elt) => {
        if (typeof elt === 'string' && elt.startsWith('--')) {
          return getCSSColor(elt);
        }
        return elt;
      });
    }
    // Recursion
    if (typeof value === 'object' && value !== null) {
      evalColors(value);
    } else if (obj.hasOwnProperty(key)) {
      // Process values which are simple strings
      if (typeof value === 'string' && value.startsWith('--')) {
        let color = getCSSColor(value);
        obj[key] = color;
      }
    }
  }
  return obj;
}

let templateEvalued = {
  light: false,
  dark: false,
};

/**
 * Return a Plotly template for the current theme (light or dark).
 */
function getTemplate() {
  let theme = localStorage.getItem('pref-theme');
  let template = theme == 'dark' ? darkTemplate : lightTemplate;
  if (!templateEvalued[theme]) {
    evalColors(template);
    templateEvalued[theme] = true;
  }
  return template;
}

/**
 * Update the Plotly template based on the current theme (light or dark) in the
 * whole document.
 */
function setPlotlyTemplate() {
  let template = getTemplate();
  let plotlyPlots = document.querySelectorAll('.js-plotly-plot');

  for (let plot of plotlyPlots) {
    Plotly.relayout(plot, template);
  };
};


let themeButton = document.getElementById('theme-toggle');
themeButton.addEventListener('click', () => {
  if (document.body.className.includes('dark')) {
    document.body.classList.remove('dark');
    theme = 'light';
    localStorage.setItem('pref-theme', 'light');
  } else {
    document.body.classList.add('dark');
    theme = 'dark';
    localStorage.setItem('pref-theme', 'dark');
  }
  setPlotlyTemplate();
});

setPlotlyTemplate();