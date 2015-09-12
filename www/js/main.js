/*jslint plusplus:true*/

/* jshint strict: true, -W097, unused:false, undef:true */
/*global window, document, d3, $, io, navigator, setTimeout */

var chart_data = [];
/*Creation of the d3 ScatterPlot*/
var splot_dataset = [];
var chart_counter = 0;
//shifting of line graph
var xshift = -1;

//Creation of the d3 Chart
var chart_data = [];

//Creation of d3 LineGraph with an initial value
var chart_data_line = [10];

//Creation of the d3 ScatterPlot
var isPurged = 0;
var chart_purge_time = 0;

//Set the height of the gauge
var gauge = document.getElementById("gauge");
gauge.setAttribute("style", "height:" + 0.20 * window.innerHeight + "px");

//Create a JSON style object for the margin
var margin = {
    top: 10,
    right: 20,
    bottom: 20,
    left: 20
};

var height = 0.5 * window.innerHeight;

//Scatterplot-Selects the specified DOM element for appending the svg 
var chart_svg = d3.select("#chart").append("svg").attr("id", "container1").attr("width", window.innerWidth).attr("height", 0.6 * height).append("g");
chart_svg.attr("transform", "translate(25," + margin.top + ")");
var x1 = d3.scale.linear().domain([0, 5000]).range([0, 100000]);
var y1 = d3.scale.linear().domain([0, 200]).range([0.5 * height, 0]);

//Add X Axis grid lines
chart_svg.selectAll("line.y1")
    .data(y1.ticks(10))
    .enter().append("line")
    .attr("class", "y")
    .attr("x1", 0)
    .attr("x2", 100000)
    .attr("y1", y1)
    .attr("y2", y1)
    .style("stroke", "rgba(8, 16, 115, 0.2)");

//This is for the Scatterplot X axis label
chart_svg.append("text").attr("fill", "red").attr("text-anchor", "end").attr("x", 0.5 * window.innerWidth).attr("y", 0.55 * height).text("Periods");

var x1Axis = d3.svg.axis().scale(x1).orient("top").tickPadding(0).ticks(1000);
var y1Axis = d3.svg.axis().scale(y1).orient("left").tickPadding(0);
chart_svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + y1.range()[0] + ")").call(x1Axis);
chart_svg.append("g").attr("class", "y axis").call(y1Axis);


chart_purge_time = Math.round(((window.innerWidth * 40) / 969) - 2);

function purgeData() {
    'use strict';
    chart_counter = 0;
    xshift = -1;
    chart_data_line = [10];
    splot_dataset = [];
    //Remove all of the nodes from the charts
    chart_svg.selectAll("#chart_graph").remove();
    //Data has been purged
    isPurged = 1;
}

function plot() {
    /*-------------------------------For the Line Graph-------------------------------*/
    'use strict';
    chart_data.unshift(chart_counter);
    //Add new element to the end of the array
    splot_dataset.push(chart_data);
    //Empty heart rate data array
    chart_data = [];
    chart_counter++;
    //Draw Line Graph && Draw circles
    chart_svg.selectAll("circle").data(splot_dataset).enter().append("svg").attr("id", "chart_graph").append("circle")
        .attr("cx", function (d, i) {
            return x1(d[0]);
        }).attr("cy", function (d) {
            return y1(d[1]);
        }).attr("r", 3).attr("class", "dot")
        .style("fill", function (d) {
            if (d[1] > 100) {
                return "red";
            } else if ((d[1] > 59) && (d[1] < 101)) {
                return "green";
            } else {
                return "white";
            }
        }).attr("stroke", "black").attr("stroke-width", 1);
    //Handle purging data
    if ((chart_purge_time === chart_counter) || (chart_counter > chart_purge_time)) {
        purgeData();
    }
}

function onConnected(message) {
    //Apache Cordova Notification
    navigator.notification && navigator.notification.alert(
        "Great Job!",  // message
        "",                     // callback
        'You are Connected!',            // title
        'Ok'                  // buttonName
    );
}

function onCelsius(celsius) {
    chart_data.push(celsius);
    plot();
    $("#feedback_log").text(Date().substr(0, 21) + ' : ' + celsius);
    $('#gauge > span').text(celsius);
}

// Attempt to connect to server/Intel IoT platform
function connect(){
    try {
        var socket = io.connect("http://" + window.location.host);
        socket.on("connected", onConnected);
        socket.on("celsius", onCelsius);
    } catch (e) {
        (navigator.notification || window).alert(
            "Server Not Available!",  // message
            "",                     // callback
            'Connection Error!',            // title
            'Ok'                  // buttonName
        );
    }
}

connect();
