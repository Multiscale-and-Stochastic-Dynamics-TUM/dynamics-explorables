export {getXYFromClick};

function getXYFromClick(plot, event) {
  //!!!returns false if clickout of bounds
  let element = plot.querySelector(['g.xy']).querySelector(['rect']);
  let l_margin = element.x.baseVal.value;
  let t_margin = element.y.baseVal.value;
  let width = element.width.baseVal.value;
  let height = element.height.baseVal.value;

  let x_click = event.offsetX;
  let y_click = event.offsetY;

  if (x_click < l_margin || x_click > l_margin + width || y_click < t_margin ||
      y_click > t_margin + height) {
    return false;
  };  // not reacting out of border clicks
  // getting parameters of the axis on data
  let fig_layout = plot.layout;
  let x_lim = fig_layout.xaxis.range;
  let y_lim = fig_layout.yaxis.range;

  let x_coord = (x_click - l_margin) / width * (x_lim[1] - x_lim[0]) + x_lim[0];
  let y_coord =
      (y_click - t_margin) / height * (y_lim[0] - y_lim[1]) + y_lim[1];
  // reminder, the axis are reverted in respect to coordinates on the page
  let point = [x_coord, y_coord];
  return point;
};