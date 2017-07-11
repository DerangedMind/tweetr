$(function() {

  function textChanged(event) {
    let countRemaining = 140 - this.value.length
    let counter = $(this).siblings('.counter')

    counter.text(countRemaining)
    if (countRemaining < 0) {
      counter.addClass('over-limit')
    }
    else {
      counter.removeClass('over-limit')
    }
  }

  $('.new-tweet textarea').on('input', textChanged)

})