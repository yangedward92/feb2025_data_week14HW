// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let sample_metadata = metadata.filter(row => row.id === parseInt(sample))[0]; // or use double equals
    console.log(sample_metadata);

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    let metadata_keys = Object.keys(sample_metadata);
    for (let i = 0; i < metadata_keys.length; i++) {
      
      let key = metadata_keys[i]; 
      let value = sample_metadata[key];

      panel.append("p").text(`${key}: ${value}`); //html
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let samp_data = samples.filter(row => row.id === sample)[0];
    console.log(samp_data)

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = samp_data.otu_ids;
    let otu_labels = samp_data.otu_labels;
    let sample_values = samp_data.sample_values;

    // Build a Bubble Chart
    let trace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: 'Picnic'
      }
    };
    let traces = [trace];

    let layout = {
      title: {
        text: 'Number of Bacteria Cultures per Sample'
      },
      yaxis: {
        title: {
          text: 'Number of Bacteria'
        }
      },
      xaxis: {
        title: {
          text: 'OTU ID'
        }
      },
      height: 600
    };
    // Render the Bubble Chart
    Plotly.newPlot('bubble', traces, layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let bar_ticks = otu_ids.map(x => `OTU: ${x} `);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let bar_trace = {
      y: bar_ticks.slice(0, 10).reverse(),
      x: sample_values.slice(0, 10).reverse(),
      type: 'bar',
      hovertext: otu_labels.slice(0, 10).reverse(),
      marker: {
        color: 'purple'
      },
      orientation: 'h'
    }

    // Data trace array
    let bar_traces = [bar_trace];

    // Apply a title to the layout
    let bar_layout = {
      title: {
        text: `Top 10 Bacteria Cultures Found`
      },
      xaxis: {
        title: {
          text: 'Number of Bacteria'
        }
      },
      height: 600
    }

    // Render the Bar Chart
    Plotly.newPlot('bar', bar_traces, bar_layout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    console.log(names)

    for (let i = 0; i < names.length; i++) {
      let name = names[i];

      dropdown.append("option").text(name); //creating option 
    }

    // Get the first sample from the list
    let first_sam = names[0]

    // Build charts and metadata panel with the first sample
    buildMetadata(first_sam);
    buildCharts(first_sam);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
