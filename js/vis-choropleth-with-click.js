/*
var $window = $(window),
    $stickyEl = $('#portfolio'),
    elTop = $stickyEl.offset().top;

$window.scroll(function() {
    $stickyEl.toggleClass('sticky', $window.scrollTop() > elTop);
});

CSS
#portfolio.sticky {
    z-index: 999;
    position: fixed;
    top: 0;
}

*/

var margin = { top: 10, right: 10, bottom: 10, left: 40 };

var width9 = 920 - margin.left - margin.right;
var height9 = 400 - margin.top - margin.bottom;

var svg = d3.select("#map-area").append("svg")
    .attr("width", width9 + margin.left + margin.right)
    .attr("height", height9 + margin.top + margin.bottom)
    .attr("transform", "translate(" + 80 + "," + 0 + ")");

var svg8 = d3.select("#barchart-area").append("svg")
    .attr("width", 300 + margin.left + margin.right)
    .attr("height", height9 + margin.top + margin.bottom);

var color = d3.scaleThreshold()
    .range(["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"]);

queue()
    .defer(d3.json, "data/world-countries.json")
    .defer(d3.csv, "data/cocoa_exports.csv")
    .defer(d3.csv, "data/cocoa_imports.csv")
    .defer(d3.csv, "data/chocolate_exports.csv")
    .defer(d3.csv, "data/chocolate_imports.csv")
    .await(function(error, mapTopJson, cocoaExportData, cocoaImportData, chocolateExportData, chocolateImportData){

        worldMap = topojson.feature(mapTopJson, mapTopJson.objects.countries1).features;

        cocoaExportData.forEach(function(d){
            d.val = +d.val;
        });
        chocolateExportData.forEach(function(d){
            d.val = +d.val;
        });
        cocoaImportData.forEach(function(d){
            d.val = +d.val;
        });
        chocolateImportData.forEach(function(d){
            d.val = +d.val;
        });

        cocoa_Ex = cocoaExportData;
        cocoa_Im = cocoaImportData;
        chocolate_Ex = chocolateExportData;
        chocolate_Im = chocolateImportData;

        updateChoropleth();
    });

function updateChoropleth(selected2) {

    d3.selectAll(".barchart-parts").remove();
    d3.select("#space-filler2").remove();

    if (selected2 === undefined)
        selected = "Cocoa Exports";
    else
        selected = selected2;
    DataByCountryID = {};
    tt_data = {};

    if (selected === "Cocoa Exports")
        worldData = cocoa_Ex.filter(function(d){return (d.other_country === "ALL")});
    else if (selected === "Cocoa Imports")
        worldData = cocoa_Im.filter(function (d) {return (d.other_country === "ALL")});
    else if (selected === "Chocolate Exports")
        worldData = chocolate_Ex.filter(function (d) {return (d.other_country === "ALL")});
    else if (selected === "Chocolate Imports")
        worldData = chocolate_Im.filter(function (d) {return (d.other_country === "ALL")});

    worldData.forEach(function(d){DataByCountryID[d.focus_country] = d;});
    worldData.forEach(function(d){tt_data[d.focus_country] = d});

    color.domain([1, 5, 10, 25, 50, 100, 500, 1000]);

    var tool_tip = d3.tip()
        .attr("class", "d3-tip")
        .html(function(d) {
            code = d.id;
            if(tt_data[code] !== undefined)
                return(d.properties.name + "<br>" + selected + ": $" + tt_data[code].val.toLocaleString());
            else
                return(d.properties.name + "<br>No Data");
        });
    svg.call(tool_tip);

    projection = d3.geoEquirectangular()
        .translate([width9/2, height9/2 + 50])
        .scale(150);

    var path = d3.geoPath()
        .projection(projection);

    var testMap = svg.selectAll("path")
        .data(worldMap);

    testMap.enter().append("path")
        .merge(testMap)
        .attr("class", function(d){
            code = d.id;
            if (selected === "Cocoa Exports")
                worldData2 = cocoa_Ex.filter(function(d){return (d.focus_country === code)});
            else if (selected === "Cocoa Imports")
                worldData2 = cocoa_Im.filter(function (d) {return (d.focus_country === code)});
            else if (selected === "Chocolate Exports")
                worldData2 = chocolate_Ex.filter(function (d) {return (d.focus_country === code)});
            else
                worldData2 = chocolate_Im.filter(function (d) {return (d.focus_country === code)});
            if(worldData2.length > 1)
                return "clickable map";
            else
                return "unclickable map";
        })
        .on('mouseover', tool_tip.show)
        .on('mouseout', tool_tip.hide)
        .on('click', function(d){
            code = d.id;
            byCountryChoropleth(code, d.properties.name);
        })
        .attr("stroke", "lightgrey")
        .attr("d", path);

    svg.selectAll(".map").transition().duration(800)
        .style("fill", function(d){
            code = d.id;
            if(DataByCountryID[code] !== undefined)
                return color(DataByCountryID[code].val/1000000);
            else
                return "#eeeeee";
        });

    var colorList = ["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"];
    //var labelList = [0, 1, 10, 50, 100, 250, 500, 1000, 2500, 5000];
    var labelList = [0, 1, 5, 10, 25, 50, 100, 500, 1000];

    var rects = svg.selectAll(".bars")
        .data(colorList);

    rects.enter().append("rect")
        .attr("class", "bars")
        .merge(rects)
        .attr("height", 20)
        .attr("width", 20)
        .attr("x", width9/12)
        .attr("y", function(d, i){
            return(375 - i*20);
        })
        .style("fill", function(d){
            return d;
        });

    var labels = svg.selectAll(".label")
        .data(labelList);

    labels.enter().append("text")
        .attr("class", "label")
        .merge(labels)
        .attr("x", width9/12+25)
        .attr("y", function(d, i){
            return(398 - i*20);
        })
        .text(function(d){
            return(Math.round(d) + " Million")
        });

    d3.select(".map-title")
        .html(selected + " By Country ($)");

    bar_title = svg8.append("text")
        .attr("x", "205")
        .attr("y", "35")
        .style("text-anchor", "middle")
        .attr("class", "bar_title barchart-parts");


    key = svg8.append("text")
        .attr("x", 205)
        .attr("y", 340)
        .attr("class", "key barchart-parts")
        .style("text-anchor", "middle");

    labels.exit().remove();
    rects.exit().remove();
    testMap.exit().remove();

    spaceFiller2();
}

function byCountryChoropleth(code_2, country_name){

    if (selected === "Cocoa Exports")
        worldData = cocoa_Ex.filter(function(d){return (d.focus_country === code_2)});
    else if (selected === "Cocoa Imports")
        worldData = cocoa_Im.filter(function (d) {return (d.focus_country === code_2)});
    else if (selected === "Chocolate Exports")
        worldData = chocolate_Ex.filter(function (d) {return (d.focus_country === code_2)});
    else if (selected === "Chocolate Imports")
        worldData = chocolate_Im.filter(function (d) {return (d.focus_country === code_2)});

    if(worldData.length > 1) {

        d3.select("#space-filler2").remove();
        svg8
            .attr("height", height9 + margin.top + margin.bottom);

        DataByCountryID = {};
        worldData.forEach(function (d) {
            DataByCountryID[d.other_country] = d;
        });

        sortedWorldData = worldData.sort(function(a, b){
            return (b.val - a.val)
        });

        topTraders = [];
        for (var j = 1; j < 6; j++)
            topTraders.push(sortedWorldData[j]);

        bar_title
            .text(country_name + "'s Top " + selected);

        key
            .text("Total Trade ($ Millions)");

        var bars = svg8.selectAll(".barchart")
            .data(topTraders);

        bars.enter().append("rect")
            .attr("class", "barchart barchart-parts")
            .merge(bars)
            .attr("x", "85")
            .attr("y", function(d, index) {
                return (index * 50 + 50);
            })
            .transition().duration(800)
            .attr("fill", "#381102")
            .attr("width", function(d){
                return (d.val/topTraders[0].val*250)
            })
            .attr("height", "40");

        svg8.selectAll("rect")
            .attr("class", function(d){
                code = d.other_country;
                if (selected === "Cocoa Exports")
                    worldData3 = cocoa_Ex.filter(function(d){return (d.focus_country === code)});
                else if (selected === "Cocoa Imports")
                    worldData3 = cocoa_Im.filter(function (d) {return (d.focus_country === code)});
                else if (selected === "Chocolate Exports")
                    worldData3 = chocolate_Ex.filter(function (d) {return (d.focus_country === code)});
                else
                    worldData3 = chocolate_Im.filter(function (d) {return (d.focus_country === code)});
                if(worldData3.length > 1)
                    return "clickable barchart barchart-parts";
                else
                    return "unclickable barchart barchart-parts";
            });

        svg8.selectAll("rect")
            .on('click', function(d){
                destination = worldMap.filter(function(c){
                    return c.id === d.other_country
                });
                return (byCountryChoropleth(d.other_country, destination[0].properties.name));
            });

        var barchart_countries = svg8.selectAll(".barchart_countries")
            .data(topTraders);

        barchart_countries.enter().append("text")
            .attr("class", "barchart_countries barchart-parts")
            .merge(barchart_countries)
            .text(function(d){
                destination = worldMap.filter(function(c){
                    return c.id === d.other_country
                });
                return (destination[0].properties.name);
            })
            .attr("x", "75")
            .attr("y", function(d, index){
                return(75 + index * 50);
            })
            .style("text-anchor", "end");

        var barchart_values = svg8.selectAll(".barchart_values")
            .data(topTraders);

        barchart_values.enter().append("text")
            .attr("class", "barchart_values barchart-parts")
            .merge(barchart_values)
            .transition().duration(800)
            .text(function(d){
                return ("$" + d.val.toLocaleString());
            })
            .attr("x", function(d){
                if (d.val/topTraders[0].val*250 > 100)
                    return (80 + d.val/topTraders[0].val*250);
                else
                    return (90 + d.val/topTraders[0].val*250);
            })
            .attr("y", function(d, index){
                return(75 + index * 50);
            })
            .style("text-anchor", function(d){
                if (d.val/topTraders[0].val*250 > 100)
                    return ("end");
                else
                    return ("start");
            })
            .style("fill", function(d){
                if (d.val/topTraders[0].val*250 > 100)
                    return ("white");
                else
                    return ("black");
            });

        var x = d3.scaleLinear()
            .range([0, 250])
            .domain([0, topTraders[0].val/1000000]);

        var xAxis = d3.axisBottom()
            .scale(x);

        svg8.append("g")
            .attr("class", "x-axis axis barchart-parts")
            .attr("transform", "translate(85," + (300) + ")");

        svg8.select(".x-axis").call(xAxis);

        bar_title.exit().remove();
        key.exit().remove();
        bars.exit().remove();
        barchart_countries.exit().remove();
        barchart_values.exit().remove();
        //arcs.exit().remove();
    }
}

function spaceFiller2() {
    svg8
        .attr("height", 0);
    d3.select(".col-sm-3")
        .append("div")
        .attr("id", "space-filler2")
        .html(function(d){
            return("<ul>" +
                "<li>Select which category you are interested in</li>" +
                "<li>Hover over a country to see its total exports/imports</li>" +
                "<li>Click countries to see their largest trade partners</li><ul><li>(Only the top 25 countries for each category can be selected)</li></ul>" +
                "<li>Click the bars on the barchart that appears to change your selected country</li>" +
                "</ul>")
        });
}