function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html(" ");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleData = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampNum = sampleData.filter(sampleObject => sampleObject.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var sampleResult = sampNum[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = sampleResult.otu_ids;
    var otu_labels = sampleResult.otu_labels;
    var sampValue = sampleResult.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    var xticks = sampValue.slice(0, 10).reverse();


    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: xticks,
      y: yticks,
      type: "bar",
      orientation: "h",
      text: otu_labels.slice(0, 10).reverse(),
    }

    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU-ids" }

    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);


    // 1. Create the trace for the bubble chart.

    // function colors(color){
    //   switch (color){
    //   case "1":
    //   return 

    //   }

    // }
    var bubbleData = [{
      x: otu_ids,
      y: sampValue,
      text: otu_labels,
      type: "bubble",
      mode: "markers",
      marker: {
        color: otu_ids,
        size: sampValue,
        colorscale: "Earth"
      }


    }

    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bubblechart Samples Values",
      xaxis: { title: "OTU-ids" },
      yaxis: { title: "sample values" }


    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });

    // var gaugedata = [
    //   {
    //     domain: { x: [0, 1], y: [0, 1] },
    //     value: 270,
    //     title: { text: "Belly Button Washing Frequency" },
    //     type: "indicator",
    //     mode: "gauge+number"
    //   }
    // ];
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    d3.json("samples.json").then((freqdata) => {
      console.log(freqdata);
      // Create a variable that holds the first sample in the array.
      var metaData = freqdata.metadata;
      var resultlist = metaData.filter(sampObj => sampObj.id == sample);
      // 2. Create a variable that holds the first sample in the metadata array.
      var results = resultlist[0];
      // 3. Create a variable that holds the washing frequency.
      var wfrequency = +results.wfreq;
      // console.log(wfreq);

      // 4. Create the trace for the gauge chart.
      var gaugeData = [{
        domain: { x: [0, 1], y: [0, 1] },
        value: wfrequency,
        title: { text: "Scrubs per week" },
        type: "indicator",
        mode: "gauge+number+delta",
        delta: { reference: 0 },
        gauge: {
          axis: { range: [null, 10] },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "darkgreen" }
          ],
          threshold: {
            line: { color: "black", width: 2 },
            thickness: 0.75,
            value: 2
          },
          bar: { color: "black" }
        }
      }
      ];

      //   // 5. Create the layout for the gauge chart.
      var gaugeLayout = {
        //title: {text:"Belly bottun Washing Frequency", font_size: 40, bold:"bold"},
        width: 500,
        height: 400,
        margin: { t: 25, r: 25, l: 0, b: 25 },


      };

      //   // 6. Use Plotly to plot the gauge data and layout.
      //   Plotly.newPlot();
      // });
      //  //var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
      Plotly.newPlot('gauge', gaugeData, gaugeLayout);
    });
  };

  // jpgcredit:https://www.ucsf.edu/news/2014/08/116526/do-gut-bacteria-rule-our-minds

