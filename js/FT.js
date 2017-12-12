
var forcewidth = 600,
    forceheight = 600;

var forcesvg = d3.select("#FT-force").append("svg")
    .attr("width", $("body").width()/2)
    .attr("height", forceheight);

var forcelegend = d3.select("#FT-info").append("svg")
    .attr("width", $("body").width()/2)
    .attr("height", 350);

var forceInstructions = d3.select("#force-instructions").append("svg")
    .attr("width", $("body").width()/2)
    .attr("height", 48);


// Load data
d3.json("data/fairtrade.json", function(data) {

    console.log("data flying in here: ", data);

    var instructions = forceInstructions.selectAll("force-instruct")
        .data(data.nodes)
        .attr("class", "force-instruct");

    var force = d3.forceSimulation(data.nodes)
        .force("charge", d3.forceManyBody().strength(-100))
        .force("link", d3.forceLink(data.links).distance(100))
        .force("center", d3.forceCenter().x($("body").width()/6 + 100).y((forceheight - 90)/2));

    // 2a) DEFINE 'NODES' AND 'EDGES'
    var link = forcesvg.selectAll(".link")
        .attr("class", "link")
        .data(data.links)
        .enter().append("line")
        .attr("stroke", "#B5B4B2")
        .attr("stroke-opacity", ".7")
        .attr('marker-end','url(#arrowhead)')
        .attr("stroke-width", function(d) { return d.weight; });

    var node = forcesvg.selectAll(".node")
        .data(data.nodes)
        .enter().append("image")
        .attr("class", "node")
        .attr('xlink:href', function(d){
            return 'img/icons/' + d.icon;
        })
        .attr('height', '38')
        .attr('width', '38')
        .on("click", function(d, index) {
            console.log(index);
            if(index > 3)
                return console.log("negativo");
            else
                var currentSelect = d.name;
            d3.select("#ImprovedLives").style("display", "none");
            d3.select("#FairTrade").style("display", "none");
            d3.select("#Environment").style("display", "none");
            d3.select("#QualityProducts").style("display", "none");

            d3.select("#" + currentSelect).style("display", "block");
            d3.select("#" + currentSelect+"list").style("visibility", "visible");
        })
        .on("mouseover", function(d, index){
            if(index > 3)
                return console.log("negativo");
            else if (index === 0){
                d3.selectAll(".node-label")
                    .style("opacity", 1);
            }
            else {
                var curr = index + 1;
                d3.selectAll(".node-label")
                    .style("opacity", function (d) {
                        if (d.hover === curr)
                            return 1;
                        else
                            return 0;
                    })
            }
        })
        .on("mouseout", function(){
            d3.selectAll(".node-label")
                .style("opacity", 0)
        })
        .call(d3.drag()
            .on("start", dragStarted)
            .on("drag", dragging)
            .on("end", dragEnded));

    var label = forcesvg.selectAll(".node-label")
        .data(data.nodes)
        .enter().append("text")
        .attr("class", "node-label")
        .attr("x", function(d){return d.x + 10;})
        .attr("y", function(d){return d.y + 40;})
        .attr("text-anchor", "middle")
        .style("opacity", 0)
        .attr("fill", "#414140")
        .text(function(d) {
            if (d.section === "3")
                return d.name;
            else
                return "";
        });

    forceInstructions
        .append("text")
        .attr("x", 0)
        .attr("y", 15)
        .text("Click on one of the colored icons in the diagram to find out more");

    instructions.enter()
        .append("text")
        .attr("x", function(d,i) {
            return (i - 1) * 150 + 30;
        })
        .attr("y", 40)
        .text(function(d, i) {
            if(i > 0 && i < 4)
                return d.name;
            else
                return "";
        });

    instructions.enter()
        .append("image")
        .attr("x", function(d,i) {
            return (i - 1) * 150;
        })
        .attr("y", 25)
        .attr('xlink:href', function(d, i){
            if(i > 0 && i < 4)
                return 'img/icons/' + d.icon;
            else
                return "img/icons/blank-01.png";
        })
        .attr('height', '20')
        .attr('width', '20');


    var forceLegendLabels = forcelegend.selectAll("force-legend")
        .data(data.nodes)
        .enter().append("text")
        .attr("class", "force-legend")
        .style("font-size", "12px")
        .attr("x", function(d, i){
            if(i < 7)
                return 50;
            else
                return 280;
        })
        .attr("y", function(d, i){
            if(i < 7){
                return i * 25 + 65;
            }
            else
                return i * 25 + 65 - 175;
        })
        .text(function(d) { return d.name; })


    var forceLegendImages = forcelegend.selectAll("legend-image")
        .data(data.nodes)
        .enter().append("image")
        .attr("class", "legend-image")
        .attr('xlink:href', function(d){
            return 'img/icons/' + d.icon;
        })
        .attr("x", function(d, i){
            if(i < 7)
                return 20;
            else
                return 250;
        })
        .attr("y", function(d, i){
            if(i < 7){
                return i * 25 + 50;
            }
            else
                return i * 25 + 50 - 175;
        })
        .attr('height', '20')
        .attr('width', '20');


    function dragStarted() {
        if (!d3.event.active) force.alphaTarget(0.6).restart();
        d3.event.subject.fx = d3.event.subject.x;
        d3.event.subject.fy = d3.event.subject.y;
    }

    function dragging() {
        d3.event.subject.fx = d3.event.x;
        d3.event.subject.fy = d3.event.y;
    }

    function dragEnded() {
        if (!d3.event.active) force.alphaTarget(0);
        d3.event.subject.fx = null;
        d3.event.subject.fy = null;
    }


    node.append("title")
        .text(function(d) { return d.name; });


    force.on("tick", function() {

        // Update node coordinates
        node
            .attr("x", function(d) { return d.x - 25; })
            .attr("y", function(d) { return d.y - 10; });

        // Update edge coordinates
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        label
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y + 45; });
    });

});