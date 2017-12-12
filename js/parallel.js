var margin = {top: 30, right: 100, bottom: 10, left: 20},
    width2 = 800 - margin.left - margin.right,
    height2 = 300 - margin.top - margin.bottom;

var x = d3.scalePoint().range([5, 710]).padding(.1),
    y = {},
    dragging = {};

var line = d3.line(),
    axis = d3.axisLeft(),
    foreground;

var svg2 = d3.select("#parallel-chart").append("svg")
    .attr("width", 760)
    .attr("height", height2 + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svg3 = d3.select("#logos").append("svg")
    .attr("width", width2 + margin.left + margin.right)
    .attr("height", 220)
    .append("g")
    .attr("class", "svg3")
    .attr("transform", "translate(" + margin.left + "," + 10 + ")");

d3.csv("data/candy_nutrition_facts.csv", function(error, candy) {

    // Extract the list of dimensions and create a scale for each.
    x.domain(dimensions = d3.keys(candy[0]).filter(function(d) {
        return d !== "ITEM" && d !== "Producer" && d !== "SERVING (bars)" && (y[d] = d3.scaleLinear()
            .domain([d3.min(candy, function(p) { return +p[d]; }), d3.max(candy, function(p) { return +p[d]; })])
            .range([height2, 0]));
    }));


    svg3.selectAll("rect")
        .data(candy)
        .enter()
        .append("rect")
        .attr("class", "logos")
        .attr("width", "120")
        .attr("height", "40")
        .attr("x", function(d, i){
            return(i * 120 % 720);
        })
        .attr("y", function(d, i){
            if (i<6) {return(0);}
            else if (i<12) {return(40);}
            else if (i<18) {return(80);}
            else if (i<24) {return(120);}
            else if (i<30) {return(160);}
        })
        .on('mouseover', function(d){
            hovered = d;
            d3.select("#space-filler").remove();
            return highlightLine();
        })
        .on('mouseout', function(d){
            svg2.selectAll(".foreground path")
                .style("stroke", "#381102")
                .style("stroke-width", ".75")
                .style("opacity", ".5");
            spaceFiller();
            return d3.select("#nutrition-facts").remove();
        });

    svg3.selectAll("candy_name")
        .data(candy)
        .enter()
        .append("text")
        .text(function(d){
            c_name = d.ITEM;
            c_name2 = c_name.replace(/_/g, " ");
            return (c_name2);
        })
        .attr("class", "candy_name")
        .attr("x", function(d, i){
            return((60 + i * 120) % 720);
        })
        .attr("y", function(d, i){
            if (i<6) {return(22);}
            else if (i<12) {return(62);}
            else if (i<18) {return(102);}
            else if (i<24) {return(142);}
            else if (i<30) {return(182);}
        })
        .on('mouseover', function(d){
            hovered = d;
            d3.selectAll('.logos')
                .attr("fill-opacity", function(d){
                    if (d === hovered)
                        return 0.7;
                });
            d3.select("#space-filler").remove();
            return highlightLine();
        })
        .on('mouseout', function(d){
            svg2.selectAll(".foreground path")
                .style("stroke", "#381102")
                .style("stroke-width", ".75")
                .style("opacity", ".5");
            d3.selectAll('.logos')
                .attr("fill-opacity", 1);
            spaceFiller();
            return d3.select("#nutrition-facts").remove();
        });


    // Add blue foreground lines for focus.
    foreground = svg2.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(candy)
        .enter().append("path")
        .on('mouseover', function(d){
            hovered = d;
            d3.select("#space-filler").remove();
            return highlightLine();
        })
        .on('mouseout', function(d){
            svg2.selectAll(".foreground path")
                .style("stroke", "#381102")
                .style("stroke-width", ".75")
                .style("opacity", ".5");
            spaceFiller();
            return d3.select("#nutrition-facts").remove();
        })
        .attr("d", path);

    // Add a group element for each dimension.
    var g = svg2.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function(d) { return "translate(" + x(d) + ")"; });

    // Add an axis and title.
    g.append("g")
        .attr("class", "axis")
        .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .style("fill", "#5f5f5f")
        .style("font-size", 10)
        .text(function(d) { return d; });

    spaceFiller();

});

// Returns the path for a given data point.
function path(d) {
    return line(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
}

function highlightLine(){
    svg2.selectAll(".foreground path")
        .style("stroke", function(d){
            if (hovered === d)
                return "#381102"
        })
        .style("stroke-width", function(d){
            if (hovered === d)
                return "7"
        })
        .style("opacity", function(d){
            if (hovered === d)
                return "1"
        });

    d3.select(".col-sm-4")
        .append("div")
        .attr("id", "nutrition-facts")
        .html(function (d) {
            return ("<img src=img/" + hovered.ITEM + ".jpg class=picture2>"
                + "<br><div class='NF'>Nutrition Facts</div>"
                //+ "<br>Company: " + hovered.Producer
                + "<div class='SS'>Serving Size " + hovered["SERVING (g)"] + "g (" + hovered["SERVING (bars)"] + ")</div>"
                + "<div class='n_fact'>Amount Per Serving" +"</div>"
                + "<div class='n_fact'>Calories " + hovered["CALORIES"] +"g</div>"
                + "<div class='n_fact'>Total Fat " + hovered["FAT (g)"] +"g</div>"
                + "<div class='n_fact indented'>Saturated Fat " + hovered["SAT. FAT (g)"] +"g</div>"
                + "<div class='n_fact'>Sodium " + hovered["SODIUM (mg)"] +"mg</div>"
                + "<div class='n_fact'>Total Carbohydrate " + hovered["CARB. (g)"] +"g</div>"
                + "<div class='n_fact'>Calcium " + hovered["CALCIUM (mg)"] +"mg</div>"
                + "<div class='n_fact'>Protein " + hovered["PROTEIN (g)"] +"g</div>"
            )
        });
}

function spaceFiller() {
    d3.select(".col-sm-4")
        .append("div")
        .attr("id", "space-filler")
        .html(function (d) {
            return ("<img src=img/instructions.jpg class=picture2>"
                + "<br><div class='NF'>Nutrition Facts</div>"
                + "<div class='SS'>Serving Size</div>"
                + "<div class='n_fact'>Amount Per Serving</div>"
                + "<div class='n_fact'>Calories</div>"
                + "<div class='n_fact'>Total Fat</div>"
                + "<div class='n_fact indented'>Saturated Fat</div>"
                + "<div class='n_fact'>Sodium</div>"
                + "<div class='n_fact'>Total Carbohydrate</div>"
                + "<div class='n_fact'>Calcium</div>"
                + "<div class='n_fact'>Protein</div>"
            )
        });
}