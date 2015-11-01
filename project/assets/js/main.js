$(function () {

  'use strict';

  // Navbar fadein
  // --------------------------------------------------
  $('.navbar').removeClass('animated');

  // Responsive navigation
  // --------------------------------------------------
  $('.navbar-nav-toggle, .navbar-nav a').on('click', function () {
//    if ($('.navbar').css('z-index') === '4') {
      $('.navbar-nav').slideToggle();
      $('.navbar').toggleClass('open');
//    }
  });

  // Wait for background images to load
  // --------------------------------------------------
  $('.background-image').each(function () {
    var $this = $(this),
        $imgToPreLoad = $('<img/>'),
        backgroundUrl = $this.css('background-image').replace(/^url\(["']?/, '').replace(/["']?\)$/, '');

    $imgToPreLoad.on('load', function () {
      $this.attr('data-loaded', 'true');
    });

    $imgToPreLoad[ 0 ].src = backgroundUrl;
  });

  var $body = $('body');

  // Animate header
  // --------------------------------------------------
  if ($body.hasClass('home')) {
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
  $body.on('click', '.contact-toggle', function (event) {
    event.preventDefault();
    $body.toggleClass('open');
  });

  // Detect fixed navbar position
  // --------------------------------------------------
  fixedTopBar();

  $('.container .review').each(function () {
    if ($(this).height() > 100) {
      var $readMoreLink = $('<a href="#"/>')
          .text('Читать полностью')
          .click(function (e) {
            e.preventDefault();
            $(this).parent().siblings('.short').removeClass('short')
          });
      $(this)
          .append($('<p class="readMore">').append($readMoreLink))
          .find('.content').append('<p class="gradient">&nbsp;</p>')
          .addClass('short')
    }
  });

  //animation
  var main = new TimelineMax(),
      $udobno = $('#udobno'),
      $vigodno = $('#vigodno'),
      $legko = $('#legko'),
      $repeatAnimationIcon = $('#repeatAnimation');

  if (isMobile.any()) {
    $body.addClass('mobile');
  } else {
    main
        .add(sideMove($udobno, 'left'))
        .add(udobno())
        .add(sideMove($vigodno, 'right'))
        .add(vigodno())
        .add(sideMove($legko, 'left'))
        .add(legko())
        .set($('.monitorFeature:eq(3)'), {css: {display: 'block'}});
  }

  function sideMove(jqObj, direction) {
    var tl = new TimelineLite(),
        splitTxt = new SplitText(jqObj.selector, {type: 'chars'}),
        chars = splitTxt.chars,
        shift = direction == 'left' ? -200 : 200;
    tl.set(jqObj.parent('.monitorFeature'), {css: {display: 'block'}, immediateRender: false});
    for (var i = 0; i < chars.length; ++i) {
      tl.from(chars[i], 1.2, {autoAlpha: 0, x: shift}, 0.2 * (direction == 'left' ? i : (chars.length - i)))
    }
    tl.to(jqObj, 1.5, {top: 10, ease: Elastic.easeOut});
    return tl;
  }

  function hideBlockOnComplete(timeline, $block) {
    var delayBeforeHide = '+=1.5';
    timeline
        .to($block, 0.5, {rotationX: -360, autoAlpha: 0, y: '+=50'}, delayBeforeHide)
        .set($block.parent('.monitorFeature'), {css: {display: 'none'}}, delayBeforeHide);
  }

  function udobno() {
    var tl = newTimeLine(),
        shiftSign = 1,
        splitTxt = new SplitText('#allSubjOnePoint', {type: 'chars, words'}),
        words = splitTxt.words,
        chars = splitTxt.chars,
        $subjListBlock = $('#subjectList1'),
        $subjList = $subjListBlock.find('div'),
        i;
    for (i = 0; i < words.length; ++i) {
      shiftSign = (i % 2 == 0) ? 1 : -1;
      tl.from(words[i], 1, {autoAlpha: 0, y: 300 * shiftSign, ease: Bounce.easeOut}, 0.1 * shiftSign * i);
    }
    for (i = 0; i < chars.length; ++i) {
      tl.to(chars[i], 0.5, {y: 30, scaleX: 0.1, opacity: 0}, 3 - Math.random());
    }
    tl.fromTo($subjListBlock, 5, { top: 400 }, { top: -400, ease: Linear.easeNone});
    tl.staggerFrom($subjList, 1, {autoAlpha: 0, x: 200, ease: Back.easeOut.config(5)}, 0.2, '-=4.5');
    tl.staggerTo($subjList, 1.2, {autoAlpha: 0}, 0.2, '-=3');
    hideBlockOnComplete(tl, $udobno);
    return tl;
  }

  function vigodno() {
    var tl = newTimeLine(),
        $groups = $('#miniGroupLessons'),
        $groupsCheap = $('#miniGroupCheaper'),
        $ruble = $('.rubleSvg'),
        $rublesGroup = [$ruble],
        $student = $('.studentSvg'),
        $studentGroup = [$student],
        $monitorFeature = $student.parent('.monitorFeature'),
        hidden = {autoAlpha: 0};

    tl
        .from($groups, 0.6, hidden)
        .to($groups, 0.7, {x: -143, y: -50, scale: 0.7});
    tl
        .from($groupsCheap, 1, hidden)
        .to($groupsCheap, 0.4, {x: 125, y: -50, scale: 0.8});
    tl.addLabel('icons', 1.4);

    var i,
        rubleCount = 12;
    for (i = 0; i < rubleCount; ++i) {
      var $groupRuble = $ruble.clone().appendTo($monitorFeature);
      TweenLite.set($groupRuble, {
        left: 70 + Math.cos(2 * Math.PI * i / rubleCount) * 15 + '%',
        top: 165 + Math.sin(2 * Math.PI * i / rubleCount) * 50
      });
      $rublesGroup.push($groupRuble);
    }

    for (i = 0; i < 3; ++i) {
      var $groupStudent = $student.clone().appendTo($monitorFeature);
      $studentGroup.push($groupStudent);
    }
    TweenLite.set($studentGroup[1], {x: -50, autoAlpha: 0});
    TweenLite.set($studentGroup[2], {x: 50, autoAlpha: 0});
    TweenLite.set($studentGroup[3], {y: -80, autoAlpha: 0});

    tl.from($student, 0.5, {autoAlpha: 0, top: 150, left: 50}, 'icons');
    tl.staggerFrom($rublesGroup, 0.5, {autoAlpha: 0, top: 200, left: 520}, 0.1, 'icons');
    tl.addLabel('icons1');
    tl.staggerTo($studentGroup.slice(1), 2, {autoAlpha: 1}, 0.3, 'icons1');
    tl.staggerTo($rublesGroup.slice(1), 2, {autoAlpha: 0, scaleY: 0.1}, 0.1, 'icons1');

    hideBlockOnComplete(tl, $vigodno);
    return tl;
  }

  function legko() {
    var tl = newTimeLine(),
        easy1 = $('#easy1'),
        easy2 = $('#easy2'),
        easy3 = $('#easy3'),
        fromHiddenAndScale = {autoAlpha: 0, scale: 3, ease: Cubic.easeOut};

    tl.from(easy1, 2, fromHiddenAndScale);
    tl.to(easy1, 0.5, {top: 250});
    tl.from(easy2, 2, fromHiddenAndScale);
    tl.to(easy2, 0.5, {top: 172});
    tl.from(easy3, 2, fromHiddenAndScale);
    hideBlockOnComplete(tl, $legko);
    return tl;
  }

  function newTimeLine() {
    return new TimelineLite();
  }

  $repeatAnimationIcon.on({
    'click': function () {
      $(this).parent().hide();
      main.restart();
    },
    'mouseenter': function () {
      TweenLite.from(this, 1, {rotation: -360});
    }
  });
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
      introHeight = $intro.outerHeight();

  $window.on('resize', function () {
    introHeight = $intro.outerHeight();
  });

  $window.on('scroll', function () {

    var scrollTop = $window.scrollTop(),
        positionYAxisDivider = 2.5,
        copyFadePercent = 1 - scrollTop / introHeight,
        overlayFadePercent = 0.6 + scrollTop / introHeight / 10;

    if (scrollTop <= introHeight && $intro.attr('data-loaded') === 'true') {
      var shiftBottom = {
        '-webkit-transform': 'translateY(' + scrollTop / positionYAxisDivider + 'px)',
        '-ms-transform': 'translateY(' + scrollTop / positionYAxisDivider + 'px)',
        'transform': 'translateY(' + scrollTop / positionYAxisDivider + 'px)',
        'opacity': copyFadePercent
      };
      $copy.css(shiftBottom);
      $('.features_block').css('opacity', Math.pow(shiftBottom.opacity, 2));
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


var actionHandler = function ($submittedElement) {
    $submittedElement
        .removeAttr('disabled')
        .text($submittedElement.data('original-text'));
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

    setTimeout(actionHandler, 2000, $submit)
  // Send ajax request
  //$.ajax({
  //  url: 'http://backend.ege-eysk.ru/contact-form',
  //  type: 'post',
  //  data: $form.serialize(),
  //  success: function () {
  //    actionHandler($submit)
  //  }
  //});
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

    setTimeout(actionHandler, 2000, $submit)

    // Send ajax request
  //$.ajax({
  //  url: 'http://backend.ege-eysk.ru/email/subscribe',
  //  type: 'post',
  //  data: $form.serialize(),
  //  success: function () {
  //    actionHandler($submit)
  //  }
  //});
}