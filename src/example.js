(function() {
  var selects = $qa("[data-core='select']");
  toArr(selects).forEach(function(sel) {
    Select(sel);
  })
})();
