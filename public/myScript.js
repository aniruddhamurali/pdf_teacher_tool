
var url = 'ap_test_solutions.pdf';  //file included in public folder

// Loaded via <script> tag, create shortcut to access PDF.js exports.
var pdfjsLib = window['pdfjs-dist/build/pdf'];

// The workerSrc property shall be specified.
//Worker spawns in separate thread. Don't load it from HTML or face the "setting up fake worker" warning in console
//But note that if you leave in the next line and don't match the versions (ie using my own build of pdf.js but this worker is from mozilla CDN, then the versions don't match and there is an error rendering.)
//pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js'; //I assume we can also load our own file from bower_components. Strangley, though this seems to work with this line completely commented out.
//replace above with path ../bower_components/pdfjs-dist/build/pdf.worker.js or replace pdf.js path in index.html with Mozilla's matching CDN version

//The upshot of all of the above is that the worker.js build version and the pdf.js build version (reverenced in index.html) must match. Don't use a CDN for one and your own build for the other.
pdfjsLib.GlobalWorkerOptions.workerSrc = '../bower_components/pdfjs-dist/build/pdf.worker.js';

// Asynchronous download or loading of PDF. Use of JS promises in this library. Might want to get more familiar with this syntax
var loadingTask = pdfjsLib.getDocument(url);
loadingTask.promise.then(function(pdf) {
  console.log('PDF loaded');

  // Fetch the first page or any other page for that matter
  var pageNumber = 1; //obviously try changing the page number
  pdf.getPage(pageNumber).then(function(page) {
    console.log('Page loaded');

    var scale = 1.5;  //play with the scale here
    var viewport = page.getViewport(scale);

    // Prepare canvas using PDF page dimensions
    var canvas = document.getElementById('the-canvas');
    var context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render PDF page into canvas context
    var renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    var renderTask = page.render(renderContext);
    renderTask.then(function () {

      //let's draw a circle on the canvas on top of the pdf just as proof of concept
      console.log('Page rendered');
      context.beginPath();
      context.arc(100,75,50,0,2*Math.PI);
      context.stroke();
    });
  });
}, function (reason) {
  // PDF loading error
  console.error(reason);
});
