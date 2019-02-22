var $form = $('form#test-form'),
    url = '****Your Google sheets request link****'

$('#submit-form').on('click', function(e) {
  e.preventDefault();
  var jqxhr = $.ajax({
    url: url,
    method: "GET",
    dataType: "json",
    data: $form.serializeObject()
  }).success(
    alert('Thanks for the submission');
  );
})
