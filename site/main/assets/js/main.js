$(document).ready(function () {

    'use strict';

    // Navbar fadein
    // --------------------------------------------------
    $('.navbar').removeClass('animated');

    // Responsive navigation
    // --------------------------------------------------
    $('.navbar-nav-toggle, .navbar-nav a').on('click', function () {
        if ($('.navbar').css('z-index') === '4') {
            $('.navbar-nav').slideToggle();
            $('.navbar').toggleClass('open');
        }
    });

    // Wait for background images to load
    // --------------------------------------------------
    $('.background-image').each(function () {
        var $this = $(this),
            $preload = $('<img/>'),
            background = $this.css('background-image').replace(/^url\(["']?/, '').replace(/["']?\)$/, '');

        $preload.on('load', function () {
            $this.attr('data-loaded', 'true');
        });

        $preload[ 0 ].src = background;
    });


    // Animate header
    // --------------------------------------------------
    if ($('body').hasClass('home')) {
        headerAnimation();
    }


    // Handle contact form
    // --------------------------------------------------
    $('.contact-form').on('submit', contactFormHandler);

    // Handle subscription form
    // --------------------------------------------------
    $('.subscription-form').on('submit', subscriptionFormHandler);

    // Contact form toggle
    // --------------------------------------------------
    $('body').on('click', '.contact-toggle', function (event) {
        event.preventDefault();
        $('body').toggleClass('open');
    });

    // Detect fixed navbar position
    // --------------------------------------------------
    fixedTopBar();


    $('.hidden-text').on('click', function() {
        var phoneSpan = $(this);
        var smallPhoneText = $('<small/>').text(Base64.decode(phoneSpan.attr('data-text')));
        phoneSpan.removeClass('glyphicon glyphicon-phone')
            .parent().append(smallPhoneText)
            .end().unbind('click');
    })

});


//
// Wait for images to load, then enable smart-scroll
// --------------------------------------------------

$(window).on('load', function () {

    'use strict';

    $('#teachers .slider').flexslider({
        pauseOnHover: true,
        directionNav: false
    });

    $('nav').smartScroll({
        offset: $('.navbar').outerHeight()
    });
});


//
// Animate header copy on scroll
// --------------------------------------------------

function headerAnimation() {

    'use strict';

    var $window = $(window),
        $intro = $('.intro'),
        $copy = $('.intro-copy'),
        $overlay = $('.intro-overlay'),
        overlayColor = $overlay.css('background-color').match(/\d+/g),
        introHeight = $('.intro').outerHeight();

    $window.on('resize', function () {
        introHeight = $('.intro').outerHeight();
    });

    $window.on('scroll', function () {

        var scrollTop = $window.scrollTop(),
            copyFadePercent = 1 - scrollTop / introHeight,
            overlayFadePercent = 0.8 + scrollTop / introHeight / 10;

        if (scrollTop <= introHeight && $intro.attr('data-loaded') === 'true') {
            $copy.css({
                '-webkit-transform': 'translateY(' + scrollTop / 2.5 + 'px)',
                '-ms-transform': 'translateY(' + scrollTop / 2.5 + 'px)',
                'transform': 'translateY(' + scrollTop / 2.5 + 'px)',
                'opacity': copyFadePercent
            });

            $overlay.css('background-color', 'rgba(' + overlayColor[ 0 ] + ', ' + overlayColor[ 1 ] + ', ' + overlayColor[ 2 ] + ', ' + overlayFadePercent + ')');
        }

    });
}


//
// Add "scrolling" class to the navbar when not at top
// --------------------------------------------------

function fixedTopBar() {

    'use strict';

    var offset,
        $navbar = $('.navbar');

    $(window).on('scroll.happytodesign', function () {
        offset = $navbar.offset().top;
        if (offset > 10) {
            if ($navbar.attr('data-scrolling') !== 'true') {
                $navbar.attr('data-scrolling', 'true');
            }
        }
        else {
            $navbar.attr('data-scrolling', 'false');
        }
    }).trigger('scroll.happytodesign');
}


//
// Handle contact form submission
// --------------------------------------------------

function contactFormHandler(event) {

    'use strict';

    // Prevent default form submission
    event.preventDefault();

    // Cache form for later use
    var $form = $('.contact-form'),
        $submit = $form.find('[type="submit"]');

    $submit.attr('disabled', 'disabled')
        .data('original-text', $submit.text())
        .text($submit.data('loading-text'));

    // Send ajax request
    $.ajax({
        url: 'http://backend.ege-eysk.ru/contact-form',
        type: 'post',
        data: $form.serialize(),
        success: function () {
            $submit.removeAttr('disabled')
                .text($submit.data('original-text'));
        }
    });
}


//
// Handle subscription form submission
// --------------------------------------------------

function subscriptionFormHandler(event) {

    'use strict';

    // Prevent default form submission
    event.preventDefault();

    // Cache form for later use
    var $form = $('.subscription-form'),
        $submit = $form.find('[type="submit"]');

    $submit.attr('disabled', 'disabled')
        .data('original-text', $submit.text())
        .text($submit.data('loading-text'));

    // Send ajax request
    $.ajax({
        url: 'http://backend.ege-eysk.ru/email/subscribe',
        type: 'post',
        data: $form.serialize(),
        success: function () {
            $submit.removeAttr('disabled')
                .text($submit.data('original-text'));        }
    });
}