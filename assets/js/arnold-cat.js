import Plotly from 'plotly.js-dist-min'

function transform(triangle) {
  return triangle.map(([x, y]) => [2 * x + y, x + y]);
}

function mod(triangle) {
  return triangle.map(([x, y]) => [x % 1, y % 1]);
}

/**
 * Transforms triangle coordinates from [[x1, y1], [x2, y2], ...] into
 * {x: [x1, x2, ...], y: [y1, y2, ...]}
 */
function unzipCoordinates(triangle) {
  return {
    x: triangle.map(x => x[0]), y: triangle.map(x => x[1])
  }
}

var plotlyDiv = document.getElementById('plotlyDiv');

var triangles = [
  [[0., 0.], [1., 0.5], [1., 1.], [0., 0.]],
  [[1., 1.], [2., 1.], [2., 1.5], [1., 1.]],
  [[2., 1.], [3., 2.], [2., 1.5], [2., 1.]],
  [[1., 0.5], [2., 1.], [1., 1.], [1., 0.5]]
];

var trianglesMod = [
  [[0., 0.], [1., 0.5], [1., 1.], [0., 0.]],
  [[0., 0.], [1., 0.], [1., 0.5], [0., 0.]],
  [[0., 0.], [1., 1.], [0., 0.5], [0., 0.]],
  [[0., 0.5], [1., 1.], [0., 1.], [0., 0.5]]
];

var unitSquare = [
  [[0., 0.], [1., 0.], [1., 1.], [0., 1.], [0., 0.]], [[0., 0.]], [[0., 0.]],
  [[0., 0.]]
];

var frames = [];

frames.push({
  name: 'frame0',
  data: unitSquare.map(unzipCoordinates),
});

frames.push({
  name: 'frame1',
  data: unitSquare.map(transform).map(unzipCoordinates),
});

frames.push({
  name: 'frame2',
  data: triangles.map(unzipCoordinates),
});

frames.push({
  name: 'frame3',
  data: trianglesMod.map(unzipCoordinates),
});

const layout = {
  margin: {l: 40, r: 20, t: 20, b: 30},
  xaxis: {
    title: 'x',
    range: [0, 2],
    scaleanchor: 'y',
  },
  yaxis: {
    title: 'y',
    range: [0, 2],
  },
  paper_bgcolor: '#ffffff00',
};

const config = {
  displayModeBar: false,
  responsive: true,
};

var initialData = [];
for (var i = 0; i < 4; i++) {
  initialData.push({
    x: frames[0].data[i].x,
    y: frames[0].data[i].y,
    mode: 'lines',
    fill: 'toself',
    showlegend: false,
    line: {simplify: false}
  })
};

Plotly.newPlot(plotlyDiv, initialData, layout, config).then(function() {
  // Add the frames so we can animate them:
  Plotly.addFrames(plotlyDiv, frames);
});

var currentFrame = 0;

function startAnimation(groupOrFrames) {
  Plotly.animate(plotlyDiv, groupOrFrames, {
    transition: {duration: 500, easing: 'cubic-in-out'},
    frame: {
      duration: 500,
      redraw: false,
    },
    mode: 'immediate'
  });
}

const stepButton = document.getElementById('stepButton');

stepButton.addEventListener('click', () => {
  currentFrame = (currentFrame + 1) % 4;
  startAnimation([`frame${currentFrame}`]);
});