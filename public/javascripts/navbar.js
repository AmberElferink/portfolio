window.onload = adapt;
window.onresize = adapt;
function adapt() {
  var contentPlacement = $('#navbar').position().top + $('#navbar').height();
  $('#headerImage').css('margin-top',contentPlacement);
}
