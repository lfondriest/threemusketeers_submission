

d3.csv("data/icons.csv",function(data) {

    var width2 = 200,
        height2 = 150;

    var testIcons = data;
    console.log(data);

    testIcons.forEach(function (d) {
        d.row = +d.row;
        d.col = +d.col;
    });
    console.log(testIcons);

    farms = d3.select("#farm-icon").append("svg")
        .attr("width", width2)
        .attr("height", height2)
        .attr("class", "farm-graphic");

    farmers = d3.select("#farmers-icon").append("svg")
        .attr("width", width2)
        .attr("height", height2)
        .attr("class", "farmer-graphic");

    children = d3.select("#children-icon").append("svg")
        .attr("width", width2)
        .attr("height", height2)
        .attr("class", "children-graphic");

    education = d3.select("#education-icon").append("svg")
        .attr("width", width2)
        .attr("height", height2)
        .attr("class", "education-graphic");

    icons();

    function icons() {

        console.log(testIcons)

        farms.selectAll(".farm-graphic")
            .data(testIcons)
            .enter()
            .append("image")
            .attr("class", "img")
            .attr('xlink:href', function (d, i) {
                if (i > 17) {
                    return 'img/icons/cocooa-icon-grey-01.png';
                }
                else {
                    return 'img/icons/cocooa-icon-red-02-01.png';
                }
            })
            .attr('height', '38')
            .attr('width', '38')
            .attr("x", function (d) {
                return d.col * 38-38;
            })
            .attr("y", function (d) {
                return d.row * 38;
            });

        farmers.selectAll(".farmer-graphic")
            .data(testIcons)
            .enter()
            .append("image")
            .attr("class", "img")
            .attr('xlink:href', function (d, i) {
                    if (i > 18) {
                        return 'img/icons/farmer-icon-grey.png';
                    }
                    else {
                        return 'img/icons/farmer-icon-red-01.png';
                    }
            })
            .attr('height', '38')
            .attr('width', '38')
            .attr("x", function (d) {
                return d.col * 38-38;
            })
            .attr("y", function (d) {
                return d.row * 38;
            });

        children.selectAll(".children-graphic")
            .data(testIcons)
            .enter()
            .append("image")
            .attr("class", "img")
            .attr('xlink:href', function (d, i) {
                if (i > 13)
                    return 'img/icons/children-icon-grey-01.png';
                else
                    return 'img/icons/children-icon-color-01.png';
            })
            .attr('height', '38')
            .attr('width', '38')
            .attr("x", function (d) {
                return d.col * 38 -38;
            })
            .attr("y", function (d) {
                return d.row * 38;
            });

        education.selectAll("education-graphic")
            .data(testIcons)
            .enter()
            .append("image")
            .attr("class", "img")
            .attr('xlink:href', function (d, i) {
                    if (i < 8)
                        return 'img/icons/education-icon-red-01.png';
                    else
                        return 'img/icons/education-icon-grey-01.png';
            })
            .attr('height', '38')
            .attr('width', '38')
            .attr("x", function (d) {
                return d.col * 38 -38;
            })
            .attr("y", function (d) {
                return d.row * 38;
            });
    }
})
