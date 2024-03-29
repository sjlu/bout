Chart.defaults.global = {
  // Boolean - Whether to animate the chart
  animation: true,

  // Number - Number of animation steps
  animationSteps: 60,

  // String - Animation easing effect
  animationEasing: "easeOutQuart",

  // Boolean - If we should show the scale at all
  showScale: true,

  // Boolean - If we want to override with a hard coded scale
  scaleOverride: false,

  // ** Required if scaleOverride is true **
  // Number - The number of steps in a hard coded scale
  scaleSteps: null,
  // Number - The value jump in the hard coded scale
  scaleStepWidth: null,
  // Number - The scale starting value
  scaleStartValue: null,

  // String - Colour of the scale line
  scaleLineColor: "#666",

  // Number - Pixel width of the scale line
  scaleLineWidth: 1,

  // Boolean - Whether to show labels on the scale
  scaleShowLabels: true,

  // Interpolated JS string - can access value
  scaleLabel: "<%=value%>",

  // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
  scaleIntegersOnly: true,

  // Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
  scaleBeginAtZero: false,

  // String - Scale label font declaration for the scale label
  scaleFontFamily: "Lato, sans-serif",

  // Number - Scale label font size in pixels
  scaleFontSize: 16,

  // String - Scale label font weight style
  scaleFontStyle: "normal",

  // String - Scale label font colour
  scaleFontColor: "#313540",

  // Boolean - whether or not the chart should be responsive and resize when the browser does.
  responsive: true,

  // Boolean - Determines whether to draw tooltips on the canvas or not
  showTooltips: true,

  // Array - Array of string names to attach tooltip events
  tooltipEvents: ["mousemove", "touchstart", "touchmove"],

  // String - Tooltip background colour
  tooltipFillColor: "rgba(0,0,0,0.8)",

  // String - Tooltip label font declaration for the scale label
  tooltipFontFamily: "Lato, sans-serif",

  // Number - Tooltip label font size in pixels
  tooltipFontSize: 16,

  // String - Tooltip font weight style
  tooltipFontStyle: "normal",

  // String - Tooltip label font colour
  tooltipFontColor: "#fff",

  // String - Tooltip title font declaration for the scale label
  tooltipTitleFontFamily: "Lato, sans-serif",

  // Number - Tooltip title font size in pixels
  tooltipTitleFontSize: 16,

  // String - Tooltip title font weight style
  tooltipTitleFontStyle: "bold",

  // String - Tooltip title font colour
  tooltipTitleFontColor: "#fff",

  // Number - pixel width of padding around tooltip text
  tooltipYPadding: 12,

  // Number - pixel width of padding around tooltip text
  tooltipXPadding: 16,

  // Number - Size of the caret on the tooltip
  tooltipCaretSize: 8,

  // Number - Pixel radius of the tooltip border
  tooltipCornerRadius: 0,

  // Number - Pixel offset from point x to tooltip edge
  tooltipXOffset: 10,

  // String - Template string for single tooltips
  tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",

  // String - Template string for single tooltips
  multiTooltipTemplate: "<%= value %>",

  // Function - Will fire on animation progression.
  onAnimationProgress: function(){},

  // Function - Will fire on animation completion.
  onAnimationComplete: function(){}
};