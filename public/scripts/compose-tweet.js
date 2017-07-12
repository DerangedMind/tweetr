$(function () {
  $('#compose-btn').on('click', function () {
    $('section.new-tweet').slideToggle()
    $('.new-tweet textarea').focus()
  })
})