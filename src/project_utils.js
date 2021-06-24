(function() {

  var project_utils = window.project_utils || {};
  window.project_utils = project_utils;


  var local_variables = {
      event: [], tc: [],
      svg_line: null, container: null,
      x_accessor: function(d) {return d[0]; },
      y_accessor: function(d) {return d[1]; },
      custom_focus: 'default', custom_movement: 'default',
      playback: {el: null}
    };

  project_utils.custom = {};
  project_utils.movement = {};
  project_utils.statedict = {};
  project_utils.utils = {};
  project_utils.data = [];
  project_utils.statedict = {current_state: "idle", current_id: -1};
  project_utils.time = {min: 0, max: 0, current: 0, step: 1, previous: 0, offset: 0};
  project_utils.mouse = {scope: "focus"};
  project_utils.object = {update: function() {}, offsetX: 0, offsetY: 0, dragging: "absolute"};
  project_utils.event = {register: function() {}, call: function() {}};

  project_utils.custom.line = {
            'default': {'mark': 'svg:path', 'style': {'stroke': 'black', 'stroke-width': 3}, 'interpolate': 'linear'},
            'monotone': {'mark': 'svg:path', 'style': {'stroke': 'black', 'stroke-width': 3}, 'interpolate': 'monotone'}
  }

  project_utils.custom.point = {
            'default': {'mark': 'svg:circle', 'style': {'stroke': 'black', 'stroke-width': 3},
            'attr_static': {'cx': -10, 'cy': -10, 'r': 4},
            'attr': {'cx': local_variables.x_accessor, 'cy': local_variables.y_accessor, 'r': 4}
                      }}

  
  local_variables.svg_line = d3.svg.line()
                      .x(local_variables.x_accessor)
                      .y(local_variables.y_accessor)
                      .interpolate(project_utils.custom.line[local_variables.custom_movement].interpolate);



project_utils.initialize = function(container) {

  project_utils.time.offset = project_utils.time.offset ? project_utils.time.offset: 0;
  local_variables.container = d3.select(container);
}

project_utils.movement.display = function(d, i, c) {

  if(project_utils.statedict.current_state == "drag" && project_utils.statedict.current_id == i)
    return;

  
  local_variables.gproject_utils = local_variables.container.insert("g", ":first-child")
                               .attr("class", "gproject_utils")

  if(typeof c != "undefined" && c != 0) {
    local_variables.gproject_utils.classed(c, true);
  } else {
    local_variables.gproject_utils.classed("focus", true);
  }

  project_utils.line_Movement = local_variables.gproject_utils.selectAll(".line_Movement")
                  .data([project_utils.data[i]])
                .enter().append("path")
                  .attr("class", "line_Movement")
                  .attr("d", local_variables.svg_line.interpolate(project_utils.custom.line[local_variables.custom_movement].interpolate))

  project_utils.pointmovement  = local_variables.gproject_utils.selectAll(".pointmovement")
                    .data(project_utils.data[i])
                  .enter().append(project_utils.custom.point[local_variables.custom_focus].mark)
                    .attr("class", "pointmovement")
                    .attr(project_utils.custom.point[local_variables.custom_focus].attr);

  return project_utils.movement.display_update(d, i);
}

project_utils.movement.display_update = function(d, i) {

  project_utils.line_Movement.data([project_utils.data[i]])
                  .transition()
                  .duration(0)
                  .attr("d", local_variables.svg_line);

  project_utils.pointmovement.data(project_utils.data[i])
                    .transition()
                    .duration(0)
                    .attr(project_utils.custom.point[local_variables.custom_focus].attr);

  return project_utils.line_Movement;
}


project_utils.movement.remove = function(d, i) {
  if(project_utils.statedict.current_state != "drag")
    d3.selectAll(".gproject_utils.focus").remove();
}



})()


