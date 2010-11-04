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
    ["Badakshan", 652.792, 144.392, 232095, 40.1, 9],
    ["Badghis",   224.507, 236.293, 130669, 24.1, 4],
    ["Baghlan",   546.509, 199.707, 196892, 35.4, 8],
    ["Balkh",     426.028, 179.709, 291804, 31.3, 11],
    ["Bamyan",    440.56,  276.776, 121879, 39.3, 4],
    ["Daikondi",  383.623, 320.729, 144982, 40.3, 4],
    ["Farah",     218.843, 398.277, 106583, 35.6, 5],
    ["Faryab",    295.747, 204.588, 238427, 30.8, 9],
    ["Ghazni",    474.855, 368.192, 370255, 33.0, 11],
    ["Ghor",      307.391, 305.335, 206683, 37.8, 6],
    ["Helmand",   250.299, 470.583, 170236, 78.2, 8],
    ["Hirat",     135.531, 300.654, 474541, 34.2, 17],
    ["Juzjan",    367.732, 138.096, 126951, 35.1, 5],
    ["Kabul",     552.508, 278.701, 380774, 57.1, 33],
    ["Kandahar",  340.091, 506.971, 171470, 46.1, 11],
    ["Kapisa",    590.229, 274.777, 81995,  31.8, 4],
    ["Khost",     610.697, 347.788, 185142, 25.1, 5],
    ["Kunar",     685.147, 259.51,  122017, 23.3, 4],
    ["Kunduz",    536.956, 140.433, 230215, 29.1, 9],
    ["Laghman",   620.083, 272.726, 83873,  28.9, 4],
    ["Logar",     543.386, 330.494, 73638,  20.2, 4],
    ["Nangarhar", 649.17,  297.263, 366599, 28.7, 14],
    ["Nimroz",    154.005, 510.402, 34945,  18.8, 2],
    ["Nuristan",  662.969, 233.487, 79451,  21.6, 2],
    ["Paktia",    572.499, 340.411, 247424, 25.1, 5],
    ["Paktika",   530.956, 415.467, 262987, 36.7, 4],
    ["Panjshir",  601.667, 230.07,  47979,  27.7, 2],
    ["Parwan",    512.743, 263.454, 82665,  31.9, 6],
    ["Samangan",  464.464, 225.707, 104060, 43.9, 4],
    ["Sar-i-pul", 378.841, 221.118, 113588, 37.5, 5],
    ["Takhar",    586.72,  142.664, 251045, 31.4, 9],
    ["Uruzgan",   390.786, 384.056, 34283,  61.5, 3],
    ["Wardak",    492.432, 300.262, 98508,  31.6, 5],
    ["Zabul",     429.972, 411.762, 19346,  30.6, 3],
    ["Kuchi",     150,     150,     200249, 42.7, 10]
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
      tooltip = $('<div class="vis_tooltip"><div class="tt_bg"></div><div class="tt_text"><h3 rel="name">&nbsp;</h3><table><tr><td>Total No. of Seats:</td><td rel="seats"></td></tr><tr><td>Total No. of Votes:</td><td rel="total"></td></tr><tr class="green"><td>Votes for Winning Candidates:</td><td rel="winning"></td></tr><tr class="red"><td>Votes for Losing Candidates:</td><td rel="losing"></td></tr></table></div>');
      tooltip.css({
        display: "none",
        position: "absolute",
        width: 264,
        height: 125,
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

      var background = Raphael(bgcontainer[0], 262, 125);
      var bgx = 2, bgy = 2, bgw = 260, bgh = 106, cr = 50, cc = 35, cl = 20, ch = 15;
      background.path("M"+bgx+" "+bgy+" L"+bgw+" "+bgy+" L"+bgw+" "+bgh+" L"+cr+" "+bgh+" L"+cc+" "+(bgh+ch)+" L"+cl+" "+bgh+" L"+bgx+" "+bgh+" L"+bgx+" "+bgy).attr({fill: "#fff", "stroke-width": 1.2, stroke: "rgba(0,0,0,0.25)"})
    }

    function sector(cx, cy, r, startAngle, endAngle, fill) {
      startAngle += 90;
      endAngle += 90;
      var rad = Math.PI / 180,
      x1 = cx + r * Math.cos(-startAngle * rad),
      x2 = cx + r * Math.cos(-endAngle * rad),
      xm = cx + r / 2 * Math.cos(-(startAngle + (endAngle - startAngle) / 2) * rad),
      y1 = cy + r * Math.sin(-startAngle * rad),
      y2 = cy + r * Math.sin(-endAngle * rad),
      ym = cy + r / 2 * Math.sin(-(startAngle + (endAngle - startAngle) / 2) * rad),
      res = ["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(Math.abs(endAngle - startAngle) > 180), 1, x2, y2, "z"];
      res.middle = {x: xm, y: ym};
      return res;
    }

    function drawProvinceBubbles(row) {
      var data = parseData(row);
      var pieData = [data["winning"], 100-data["winning"]];
      var radius = 12;
      var angle = pieData[0]*3.6;       

      var col = [COLORS.positive, COLORS.negative];
      
      if (radius != 0) {
        var shadow = svg.circle(data.x, data.y, radius + 1.6).attr({
          fill: "rgba(0, 0, 0, 0.2)",
          "stroke-width": 0,
        });
        var winning = svg.path(sector(data.x, data.y, radius, 0, -angle)).attr({
          fill: col[0].normal,
          stroke: "#f8f8f1",
          "stroke-width": 1.5
        });
        var losing = svg.path(sector(data.x, data.y, radius, -angle, -360)).attr({
          fill: col[1].normal,
          stroke: "#f8f8f1",
           "stroke-width": 1.5
        });
        var overlay = svg.circle(data.x, data.y, radius).attr({
          fill: "#fff", // "transparent" fails in Firefox (no mouse events!)
          stroke: "#fff",
          opacity: 0.01,
          "stroke-width": 1.5
        });
        overlay.mouseover(function() {
          winning.attr({
            fill: col[0].hover
          });
          losing.attr({
            fill: col[1].hover
          });
          shadow.animate({scale: 1.1}, 300);
          winning.animateWith(shadow, {scale: 1.1}, 300);
          losing.animateWith(shadow, {scale: 1.1}, 300);
          overlay.animateWith(shadow, {scale: 1.1}, 300);
          showTooltip(data.x, data.y - radius, data);
        });
        overlay.mouseout(function() {
          winning.attr({
            fill: col[0].normal
          });
          losing.attr({
            fill: col[1].normal
          });
          shadow.animate({scale: 1}, 200);
          winning.animateWith(shadow, {scale: 1}, 200);
          losing.animateWith(shadow, {scale: 1}, 200);
          overlay.animateWith(shadow, {scale: 1}, 200);
          hideTooltip(data.y - radius);
        });
      }
    }

    function parseData(row) {
      return {
        name:    row[0],
        x:       row[1] * STAGE_SCALE,
        y:       row[2] * STAGE_SCALE,
        total:   row[3], 
        winning: row[4],
        seats:   row[5] 
      }
    }
    
    function showTooltip(x, y, data) {
      tooltip.stop(false, true);
      x = x - 34;
      y = y - tooltip.height() - 2;
            
      tooltip.css({left: x+"px", top: y-8+"px", opacity: 0, display: "block"})
             .find("[rel=name]").text(data.name).end()
             .find("[rel=seats]").text(data["seats"]).end()
             .find("[rel=total]").text(data["total"]).end()
             .find("[rel=winning]").text(Math.round(data["winning"])+"%").end()
             .find("[rel=losing]").text(100-Math.round(data["winning"])+"%").end()
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