;(function(global, $) {
  /* Config
  ----------------------------------------------- */
  var STAGE_SCALE = 900/920;
  var BUBBLE_SCALE = 4;
  var COLORS = {
    gray: "#AAA",
    blue: "#005B83",
    neutral: {normal: "#DDD", hover: "#AAA"},
    positive: {normal: "#609A00", hover: "#6EB000"},
    negative: {normal: "#C24900", hover: "#D45000"}
  }
  var DATA = [               
    ["Badakshan", 662.792,  144.392,  279,  274,  279,  277],
    ["Badghis",   231.507,  233.293,  129,  99,   129,  112],
    ["Baghlan",   556.509,  199.707,  231,  218,  218,  193],
    ["Balkh",     426.028,  179.709,  319,  312,  319,  297],
    ["Bamyan",    433.560,  274.776,  166,  162,  166,  166],
    ["Daikondi",  383.623,  320.729,  157,  156,  163,  157],
    ["Farah",     150.843,  408.277,  163,  124,  157,  153],
    ["Faryab",    295.747,  204.588,  207,  202,  189,  185],
    ["Ghazni",    474.855,  368.192,  348,  201,  272,  197],
    ["Ghor",      307.391,  305.335,  238,  225,  222,  215],
    ["Helmand",   263.299,  465.583,  107,  89,   129,  119],
    ["Hirat",     135.531,  300.654,  450,  414,  456,  438],
    ["Juzjan",    370.732,  141.096,  122,  120,  122,  100],
    ["Kabul",     556.508,  278.701,  518,  495,  518,  514],
    ["Kandahar",  335.091,  510.971,  241,  140,  209,  209],
    ["Kapisa",    591.229,  269.777,  89,   84,   81,   78],
    ["Khost",     600.697,  357.788,  157,  98,   104,  103],
    ["Kunar",     685.147,  259.510,  112,  102,  90,   85],
    ["Kunduz",    536.956,  146.433,  165,  157,  170,  157],
    ["Laghman",   620.083,  272.726,  126,  116,  102,  91],
    ["Logar",     549.386,  327.494,  72,   71,   61,   54],
    ["Nangarhar", 642.000,  303.263,  505,  491,  377,  375],
    ["Nimroz",    154.005,  510.402,  44,   35,   42,   37],
    ["Nuristan",  668.969,  240.487,  44,   20,   47,   32],
    ["Paktia",    572.499,  340.411,  165,  107,  127,  127],
    ["Paktika",   539.956,  395.467,  277,  90,   190,  184],
    ["Panjshir",  601.667,  230.070,  95,   93,   75,   75],
    ["Parwan",    518.743,  269.454,  151,  151,  151,  147],
    ["Samangan",  483.464,  194.707,  96,   93,   96,   96],
    ["Sar-i-pul", 378.841,  221.118,  136,  135,  130,  120],
    ["Takhar",    590.720,  142.664,  203,  202,  203,  190],
    ["Uruzgan",   390.786,  384.056,  49,   45,   42,   40],
    ["Wardak",    492.432,  300.262,  91,   78,   150,  147],
    ["Zabul",     429.972,  411.762,  41,   39,   30,   30],
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
      tooltip = $('<div class="vis_tooltip"><div class="tt_bg"></div><div class="tt_text"><h3 rel="name">&nbsp;</h3><table><tr class="gray"><td>Opened 2009:</td><td rel="2009_opened"></td></tr><tr class="gray"><td>Final Result 2009:</td><td rel="2009_final"></td></tr><tr><td>Planned 2010:</td><td rel="2010_planned"></td></tr><tr class="blue"><td>Opened 2010:</td><td rel="2010_opened"></td></tr><tr><td>Closed 2010:</td><td rel="diff"></td></tr></table></div>');
      tooltip.css({
        display: "none",
        position: "absolute",
        width: 180,
        height: 132,
        fontSize: "10px",
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
      }).end()
      .find(".gray").css({
        color: COLORS.gray
      }).end()
      .find(".blue").css({
        color: COLORS.blue
      }).end()
      .find(".green").css({
        color: COLORS.positive.normal
      }).end()
      .find(".red").css({
        color: COLORS.negative.normal
      });
      container.append(tooltip);
      var bgcontainer = tooltip.find(".tt_bg");
      bgcontainer.css({
        position: "absolute",
        top: 0,
        left: 0
      });

      var background = Raphael(bgcontainer[0], 178, 132);
      var bgx = 2, bgy = 2, bgw = 176, bgh = 113, cr = 50, cc = 35, cl = 20, ch = 15;
      background.path("M"+bgx+" "+bgy+" L"+bgw+" "+bgy+" L"+bgw+" "+bgh+" L"+cr+" "+bgh+" L"+cc+" "+(bgh+ch)+" L"+cl+" "+bgh+" L"+bgx+" "+bgh+" L"+bgx+" "+bgy).attr({fill: "#fff", "stroke-width": 1.2, stroke: "rgba(0,0,0,0.25)"})
    }

    function drawProvinceBubbles(row) {
      var data = parseData(row);
      var diff = data["2010_opened"] - data["2010_planned"];
      var label = (diff >= 0) ? "+" + diff : diff;
      var textsize = Math.abs(diff)/2;
      var radius = Math.sqrt(Math.abs(diff)/Math.PI) * BUBBLE_SCALE;
      if (radius < 5) {
        radius = 5;
      };
      var col = (diff >= 0) ? COLORS.positive : COLORS.negative;
      if (diff == 0) col = COLORS.neutral;
            
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
        "name":         row[0],
        "x":            row[1] * STAGE_SCALE,
        "y":            row[2] * STAGE_SCALE,
        "2009_opened":  row[3],
        "2009_final":   row[4],
        "2010_planned": row[5],
        "2010_opened":  row[6]
      }
    }
    
    function showTooltip(x, y, data) {
      tooltip.stop(false, true);
      x = x - 34;
      y = y - tooltip.height() - 2;
      
      var diff = data["2010_opened"] - data["2010_planned"];
      if (diff > 0) diff = "+"+diff;
      
      var col = (diff >= 0) ? COLORS.positive.normal : COLORS.negative.normal;
      if (diff == 0) col = "#555";

      tooltip.css({left: x+"px", top: y-8+"px", opacity: 0, display: "block"})
             .find("[rel=name]").text(data.name).end()
             .find("[rel=2009_opened]").text(data["2009_opened"]).end()
             .find("[rel=2009_final]").text(data["2009_final"]).end()
             .find("[rel=2010_planned]").text(data["2010_planned"]).end()
             .find("[rel=2010_opened]").text(data["2010_opened"]).end()
             .find("[rel=diff]").text(Math.abs(diff)).closest("tr").css({color: col})
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