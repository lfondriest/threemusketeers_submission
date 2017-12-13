var width5 = 500,
    height5 = 500;

var testIcons = [1, 2, 3, 4, 5];

var donutwidth = 600,
    donutheight = 600;

var svg4 = d3.select("#chord-chart").append("svg")
    .attr("class", "svg4")
    .attr("width", donutwidth)
    .attr("height", donutheight);

var donutContainer = svg4.append("g")
    .attr("class", "donut-chart")
    .attr("transform", "translate(" + donutwidth / 2 + "," + donutheight / 2 + ")");


var donutOuterRadius = donutheight / 2 - 180,
    donutInnerRadius = donutOuterRadius + 500 / 4;

var pie = d3.pie()
    .padAngle(.02)
    .value(function(d) {return d.proportion});

var arc5 = d3.arc()
    .outerRadius(donutOuterRadius)
    .innerRadius(donutInnerRadius);

var arc6 = d3.arc()
    .outerRadius(donutOuterRadius)
    .innerRadius(donutInnerRadius + 20);



loadData();

/** load data */
function loadData() {
    donutVis();
};


/** donut chart */
function donutVis () {
    d3.csv("data/donutData.csv", function (data) {

        var donutData = data;

        var donutColor = d3.scaleOrdinal()
            .range(["#67000d", "#7a0047", "#c6635a", "#fee0d2", "#6b4656", "#d04046", "#aa0544", "#ac052f"]);

        var labels = donutContainer.selectAll(".donut-labeling")
            .data(pie(donutData))
            .enter().append("g");

        var chart = donutContainer.selectAll(".donut-path")
            .data(pie(donutData))
            .enter().append("path")
            .attr("class", "donut-path");


        chart.attr("fill", function(d) { return donutColor(d.data.who);})
            .attr("d", arc5)
            .on("mouseover", function (d, i) {
                d3.selectAll(".donut-path")
                    .style("opacity", .1);
                d3.select(this)
                    .style("opacity", 1)
                    .attr("fill", function(d) { return donutColor(d.data.who);})
                    .transition()
                    .duration(200)
                    .attr("d", arc6);
                d3.select("#percentage" +i)
                    .transition()
                    .duration(500)
                    .style("opacity", 1);
                d3.select("#who-label" +i)
                    .transition()
                    .duration(500)
                    .style("opacity", 1);
                d3.selectAll(".center-label")
                    .transition()
                    .duration(400)
                    .style("opacity", 0);
                d3.selectAll(".dollar-center")
                    .transition()
                    .duration(600)
                    .style("opacity", 0);
            })
            .on("mouseout", function (d, i) {
                d3.selectAll(".donut-path")
                    .style("opacity", 1)
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("d", arc5);
                d3.select("#percentage" +i)
                    .transition()
                    .duration(500)
                    .style("opacity", 0);
                d3.select("#who-label" +i)
                    .transition()
                    .duration(500)
                    .style("opacity", 0);
                d3.selectAll(".center-label")
                    .transition()
                    .duration(600)
                    .style("opacity", 1);
                d3.selectAll(".dollar-center")
                    .transition()
                    .duration(600)
                    .style("opacity", .15);
            });


        labels.append("text")
            .attr("id", function(d, i) { return "percentage"+i;})
            .style("opacity", 0)
            .attr("dx", "0")
            .attr("dy", ".1em")
            .attr("stroke", "#381102")
            .style("text-anchor", "middle")
            .text(function(d) { return d.data.proportion + "%"});


        labels.append("text")
            .attr("class", "donut-labeling")
            .attr("id", function(d, i) { return "who-label"+i;})
            .style("opacity", 0)
            .attr("dx", "0")
            .attr("dy", "1.3em")
            .style("text-anchor", "middle")
            .attr("fill", "#381102")
            .text(function(d) {
                return d.data.who;});

        donutContainer.append("image")
            .attr("class", "dollar-center")
            .attr('xlink:href', "img/icons/money-01.png" )
            .style("opacity", ".15")
            .attr('height', '230px')
            .attr('width', '230px')
            .attr("x", -115)
            .attr("y", -115);
        donutContainer.append("text")
            .attr("class", "center-label")
            .style("opacity", 1)
            .attr("dx", "0")
            .attr("dy", "-.4em")
            .style("text-anchor", "middle")
            .text("How is the price of the");
        donutContainer.append("text")
            .attr("class", "center-label")
            .style("opacity", 1)
            .attr("dx", "0")
            .attr("dy", "1.2em")
            .style("text-anchor", "middle")
            .text("chocolate bar split up?");


        jQuery(document).ready(function( $ ) {
            $('span').counterUp({
                delay: 10, // the delay time in ms
                time: 3000 // the speed time in ms
            });

        });

    });
}




