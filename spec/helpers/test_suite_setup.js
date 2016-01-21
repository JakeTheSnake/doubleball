$('body').append('<div id="fixture"></div>');
$('#fixture').append('<div id="canvas-container"></div>');
$('#fixture').hide();

window.requestAnimationFrame = function() { }