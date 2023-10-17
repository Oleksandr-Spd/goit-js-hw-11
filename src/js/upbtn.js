document.addEventListener('DOMContentLoaded', function () {
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) $('a#move_up').fadeIn(200);
    else $('a#move_up').fadeOut(400);
  });
  $('a#move_up').click(function () {
    $('body,html').animate(
      {
        scrollTop: 0,
      },
      800
    );
    return false;
  });
});
