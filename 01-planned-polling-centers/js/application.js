;(function(global, $) {
  /* Config
  ----------------------------------------------- */
  var STAGE_SCALE = 900/920;
  var BUBBLE_SCALE = 4;
  var COLORS = {
    positive: {normal: "#609A00", hover: "#6EB000"},
    negative: {normal: "#C24900", hover: "#D45000"}
  }
  var DATA = [
    ["Badakshan", 662.792, 144.392, 279, 279],
    ["Badghis", 236.507, 248.293, 129, 129],
    ["Baghlan", 556.509, 199.707, 231, 218],
    ["Balkh", 432.028, 169.709, 319, 319],
    ["Bamyan", 453.56, 264.776, 166, 166],
    ["Daikondi", 383.623, 320.729, 157, 163],
    ["Farah", 150.843, 408.277, 163, 157],
    ["Faryab", 295.747, 204.588, 207, 189],
    ["Ghazni", 474.855, 368.192, 348, 272],
    ["Ghor", 307.391, 305.335, 238, 222],
    ["Helmand", 263.299, 465.583, 107, 129],
    ["Hirat", 135.531, 300.654, 450, 456],
    ["Juzjan", 370.732, 141.096, 122, 122],
    ["Kabul", 556.508, 278.701, 518, 518],
    ["Kandahar", 335.091, 510.971, 241, 209],
    ["Kapisa", 593.229, 263.777, 89, 81],
    ["Khost", 610.697, 347.788, 157, 104],
    ["Kunar", 685.147, 259.51, 112, 90],
    ["Kunduz", 536.956, 146.433, 165, 170],
    ["Laghman", 620.083, 272.726, 126, 102],
    ["Logar", 549.386, 327.494, 72, 61],
    ["Nangarhar", 685, 318.263, 505, 377],
    ["Nimroz", 154.005, 510.402, 44, 42],
    ["Nuristan", 664.969, 240.487, 44, 47],
    ["Paktia", 572.499, 340.411, 165, 127],
    ["Paktika", 539.956, 395.467, 277, 190],
    ["Panjshir", 601.667, 230.07, 95, 75],
    ["Parwan", 528.743, 263.454, 151, 151],
    ["Samangan", 479.464, 199.707, 96, 96],
    ["Sar-i-pul", 378.841, 221.118, 136, 130],
    ["Takhar", 593.72, 162.664, 203, 203],
    ["Uruzgan", 390.786, 384.056, 49, 42],
    ["Wardak", 492.432, 292.262, 91, 150],
    ["Zabul", 429.972, 411.762, 41, 30]
  ];
  
  /* Application
  ----------------------------------------------- */
  var App = (function() {
    var container, svg, tooltip, WIDTH = 900, HEIGHT = 650;
    /* Public interface
    ----------------------------------------------- */
    return {
      init: function(el) {
        container = $(el);
        loadBackground();
        createSvg();
        createTooltip();
        DATA.forEach(function(row) {
          drawProvinceBubbles(row);
        });
      }
    }
    
    /* Private interface
    ----------------------------------------------- */
    function loadBackground() {
      var img = container.find("img");
      container.css({width: WIDTH, height: HEIGHT, background: "url('"+img.attr("src")+"') top left no-repeat"});
      img.remove();
    }
    
    function createSvg() {
      svg = Raphael(container[0], WIDTH, HEIGHT);
      $(container).css({position: "relative"});
      $(container).find("svg").css({position: "absolute", top: 0, left: 0, zIndex: 1});
    }
    
    function createTooltip() {
      tooltip = $('<div class="vis_tooltip"><div class="tt_bg"></div><div class="tt_text"><h3 rel="name">&nbsp;</h3><table><tr><td>Opened in 2009:</td><td rel="2009"></td></tr><tr><td>Planned for 2010:</td><td rel="2010"></td></tr><tr><td>Difference:</td><td rel="diff"></td></tr></table></div>');
      tooltip.css({
        display: "none",
        position: "absolute",
        width: 180,
        height: 115,
        fontSize: "12px",
        zIndex: 10,
        overflow: "hidden"
      })
      .find(".tt_text").css({
        position: "relative",
        zIndex: 2,
        padding: 10
      }).end()
      .find("table").css({
        width: "100%",
        padding: 0
      }).end()
      .find("table td:even").css({
        padding: "0 5px 0 0",
        lineHeight: 1
      }).end()
      .find("table td:odd").css({
        textAlign: "right",
        lineHeight: 1
      }).end()
      .find("h3").css({
        fontSize: "12px",
        margin: "0 0 8px 0",
        padding: 0
      });
      container.append(tooltip);
      var bgcontainer = tooltip.find(".tt_bg");
      bgcontainer.css({
        position: "absolute",
        top: 0,
        left: 0
      });

      var background = Raphael(bgcontainer[0], 178, 115);
      var bgx = 2, bgy = 2, bgw = 176, bgh = 96, cr = 50, cc = 35, cl = 20, ch = 15;
      background.path("M"+bgx+" "+bgy+" L"+bgw+" "+bgy+" L"+bgw+" "+bgh+" L"+cr+" "+bgh+" L"+cc+" "+(bgh+ch)+" L"+cl+" "+bgh+" L"+bgx+" "+bgh+" L"+bgx+" "+bgy).attr({fill: "#fff", "stroke-width": 1.2, stroke: "rgba(0,0,0,0.25)"})
    }

    function drawProvinceBubbles(row) {
      var data = parseData(row);
      var diff = data["2010"] - data["2009"];
      var label = (diff >= 0) ? "+" + diff : diff;
      var textsize = Math.abs(diff)/2;
      var radius = Math.sqrt(Math.abs(diff)/Math.PI) * BUBBLE_SCALE;
      var col = (diff >= 0) ? COLORS.positive : COLORS.negative;

      if (radius != 0) {
        var shadow = svg.circle(data.x, data.y, radius + 1.6).attr({
          fill: "rgba(0, 0, 0, 0.2)",
          "stroke-width": 0,
        });
        var province = svg.circle(data.x, data.y, radius).attr({
          fill: col.normal,
          stroke: "#f8f8f1",
          "stroke-width": 1.5
        });

        if (radius > 9) {
          var label = svg.text(data.x-1, data.y, label).attr({
            "font-size": textsize,
            "letter-spacing": -10,
            "font-family": "inherit",
            fill: "#fff"
          });
          while (label.getBBox().width > 2*radius - radius/5 - 2) {
            label.attr({"font-size": label.attr("font-size")*0.9});
          }
        }

        var overlay = svg.circle(data.x, data.y, radius).attr({
          fill: "#fff", // "transparent" fails in Firefox (no mouse events!)
          stroke: "#fff",
          opacity: 0.01,
          "stroke-width": 1.5
        });
        
        overlay.mouseover(function() {
          shadow.animate({scale: 1.1}, 300);
          province.animateWith(shadow, {fill: col.hover, scale: 1.1}, 300);
          overlay.animateWith(shadow, {scale: 1.1}, 300);
          showTooltip(data.x, data.y - radius, data);
        });
        overlay.mouseout(function() {
          shadow.animate({scale: 1}, 200);
          province.animateWith(shadow, {fill: col.normal, scale: 1}, 200);
          overlay.animateWith(shadow, {scale: 1}, 200);
          hideTooltip(data.y - radius);
        });
      }
    }
    
    function parseData(row) {
      return {
        name: row[0],
        x:    row[1] * STAGE_SCALE,
        y:    row[2] * STAGE_SCALE,
        2009: row[3],
        2010: row[4],
      }
    }
    
    function showTooltip(x, y, data) {
      tooltip.stop(false, true);
      x = x - 34;
      y = y - tooltip.height() - 2;
      
      var diff = data["2010"] - data["2009"];
      if (diff > 0) diff = "+"+diff;
      
      tooltip.css({left: x+"px", top: y-8+"px", opacity: 0, display: "block"})
             .find("[rel=name]").text(data.name).end()
             .find("[rel=2009]").text(data["2009"]).end()
             .find("[rel=2010]").text(data["2010"]).end()
             .find("[rel=diff]").text(diff);
      tooltip.animate({top: y, opacity: 1}, 300);
    }
    
    function hideTooltip(y) {
      tooltip.stop(false, true);
      y = y - tooltip.height()-2;
      tooltip.animate({top: y - 8, opacity: 0}, 200, function() {
        tooltip.css({display: "none"});
      });
    }
  })();
  
  // Export
  global.App = App;
})(window, jQuery);

/* Start Application
----------------------------------------------- */
$(function(){
  App.init("#canvas");
});