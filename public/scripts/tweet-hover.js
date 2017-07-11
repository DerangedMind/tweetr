$(function () {
  $('.tweet').on('mouseenter', function () {
    $(this).find('footer span').removeClass('hidden')
  })

  $('.tweet').on('mouseleave', function () {
    $(this).find('footer span').addClass('hidden')
  })
})