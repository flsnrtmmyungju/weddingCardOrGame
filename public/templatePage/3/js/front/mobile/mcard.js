var mobileIndex = {
  init: function () {
    this.events();
    //        this.setSection();
    this.setSwiper();
    this.thumbnail();

    var _resize = function () {
      var _width = $('#top').width();
      $('.addition, #telephone').css('font-size', (Math.ceil((_width * 100) / 720) / 100) * 10);
    };

    _resize();

    $(window).resize(function () {
      //_resize();
    });

    $('#loading').fadeOut(500);

    if ($('.lazyload').length > 0) {
      $('.lazyload').lazyload();
    }

    try {
      if (typeof Kakao !== 'undefined') {
        // 사용할 앱의 JavaScript 키를 설정해 주세요.
        Kakao.init('f2f15d3b34f8a4552ebe75cbdf8e5f78');
      }
    } catch {}
  },

  events: function () {
    var self = this;
    $('#kakaonavi').bind('click', function () {
      self.navi();
    });

    $('body').on('click', '.save-action', function (e) {
      e.preventDefault();

      var form = $(this).parents('form');

      form.submit();
    });

    $('body').on('click', '.save-ajax', function (e) {
      e.preventDefault();

      var self = this;

      var form = $(this).parents('form');
      var bool_pass = mobileIndex.input_validate(form);
      if (bool_pass == false) {
        return false;
      }
      var param = $(form).serialize();

      $.ajax({
        type: 'POST',
        url: form.attr('action'),
        data: param,
        dataType: 'html',
        success: function (response) {
          if ($(self).hasClass('comment')) {
            $('.comment-list').append(response);
            $('html, body').animate({ scrollTop: $('.reply_wrap:last').offset().top });
          } else {
            var wrap = $(self).parents('.reply_wrap').find('.comment-child');
            wrap.append(response);

            $('.comment-reply-wrap').hide();
          }

          mobileIndex.clearInput();
        },
      });
    });

    $('.remove-ajax').bind('click', function (e) {
      e.preventDefault();

      var self = this;

      var form = $(self).parents('form');
      var bool_pass = mobileIndex.input_validate(form);
      if (bool_pass == false) {
        return false;
      } else {
        $(form).find('input[name="type"]').val('remove');
      }

      var param = $(form).serialize();
      $.ajax({
        type: 'POST',
        url: form.attr('action'),
        data: param,
        dataType: 'json',
        success: function (response) {
          if (response.passwd != 1) {
            alert('비밀번호를 확인해 주세요.');

            return false;
          }

          var _idx = $('#myModal [name="id"]').val();
          var _wrap = $('.edit-wrap:has(button[data="' + _idx + '"]):last');

          if ($(_wrap).hasClass('show')) {
            $('.reply_wrap:has(button[data="' + _idx + '"]):last').remove();
          } else {
            $(_wrap).remove();
          }

          $('.close[data-dismiss="modal"]').trigger('click');
          mobileIndex.clearInput();
        },
      });
    });

    $('.update-ajax').bind('click', function (e) {
      e.preventDefault();

      var self = this;
      var form = $(self).parents('form');
      var bool_pass = mobileIndex.input_validate(form);
      if (bool_pass == false) {
        return false;
      } else {
        $(form).find('input[name="type"]').val('update');
      }

      var param = $(form).serialize();
      $.ajax({
        type: 'POST',
        url: form.attr('action'),
        data: param,
        dataType: 'json',
        success: function (response) {
          if (response.passwd != 1) {
            alert('비밀번호를 확인해 주세요.');
            return false;
          }

          var _idx = $('#myModal [name="id"]').val();
          var title = $.trim($('#myModal [name="name"]').val());
          var comment = $.trim($('#myModal [name="contents"]').val());

          var _wrap = $('.edit-wrap:has(button[data="' + _idx + '"]):last');

          $(_wrap).find('.title:eq(0)').text(title);
          $(_wrap).find('.comment:eq(0)').text(comment);

          $('.close[data-dismiss="modal"]').trigger('click');

          mobileIndex.clearInput();
        },
      });
    });

    $('body').on('click', '.show_reply', function () {
      var parent = $(this).parents('.reply_wrap');
      $('.comment-reply-wrap').hide();
      $(parent).find('.comment-reply-wrap').show();
    });

    $('body').on('click', '.comment-update-btn', function (e) {
      var parent = $(this).parents('.edit-wrap').eq(0);

      var title = $.trim($(parent).find('.title:eq(0)').text());
      var comment = $.trim($(parent).find('.comment:eq(0)').text());

      comment = comment.replace(/<br>/, '\n');

      $('#myModal [name="id"]').val($(this).attr('data'));
      $('#myModal [name="name"]').val($(parent).find('.title:eq(0)').text());
      $('#myModal [name="contents"]').val($(parent).find('.comment:eq(0)').text());
      $('#myModal [name="passwd"]').val('');
    });

    $('.kakao_navi').bind('click', function () {
      mobileIndex.kakaoNavi(map_info.map_title, map_info.map_long, map_info.map_lat);
    });

    $('.carousel').swipe({
      swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
        if (direction == 'left') $(this).carousel('next');
        if (direction == 'right') $(this).carousel('prev');
      },
      allowPageScroll: 'vertical',
    });

    $('.toss_send_groom').bind('click', function () {
      var key = $(this).attr('key');
      var token = $(this).attr('token');

      if (key) {
        mobileIndex.postToss('/mcard/toss/' + key, { type: 'groom', _token: token });
      }
    });

    $('.toss_send_bride').bind('click', function () {
      var key = $(this).attr('key');
      var token = $(this).attr('token');

      if (key) {
        mobileIndex.postToss('/mcard/toss/' + key, { type: 'bride', _token: token });
      }
    });

    $('.copy_btn').on('click', function () {
      var idx = $(this).attr('idx');
      var category = $(this).attr('category');
      var account_number = $('#output' + category + 'Account_' + idx).text();

      copyToClipboard(account_number);

      //복사완료 문구
      toast_account(this, '복사되었습니다.', 1500);
    });
  },

  setSection: function (_list) {
    var top = $('#top');
    var gre = $('#gretting');
    var d = $('#direction');
    var gall = $('#gallary');
    var t = $('#toss');
    var g = $('#guestbook');
    var f = $('#footer');
    var gift = $('#gift');
    var movie = $('#movie');
    var account = $('#account');

    var list = _list.split('#');
    list.shift();
    list = '[' + list.toString() + ']';

    if (_list != null) {
      $('.col-md-6 #page-top').append(eval(list));
    }
  },

  postToss: function (url, param) {
    $.ajax({
      type: 'POST',
      url: url,
      data: param,
      dataType: 'json',
      success: function (response) {
        $('.post_toss_form').attr('action', response.url);

        $('.post_toss_form input[name="bankCode"]').val(response.bankCode);
        $('.post_toss_form input[name="accountNo"]').val(response.accountNo);

        $('.post_toss_form').submit();
      },
    });
  },

  clearInput: function () {
    $('[name="name"], [name="contents"], [name="passwd"]').val('');
  },

  input_validate: function (_form) {
    var inputs = $(_form).find('input, textarea');

    var len = inputs.size();

    for (var i = 0; i < len; i++) {
      if (inputs.eq(i).val() == '') {
        var message = '내용을 입력해 주세요.';
        if (inputs.eq(i).attr('placeholder') != undefined) {
          message = inputs.eq(i).attr('placeholder');
        }

        alert(message);

        return false;
      }
    }

    return true;
  },

  setKakaotalkLink: function () {
    var _href = location.href.toString();

    //_href = _href.replace(/www\./, '');

    if (typeof Kakao !== 'undefined') {
      var _title = $('meta[property="og:title"]').attr('content'); // 모바일 청첩장 타이틀
      var _desc = $('meta[property="og:description"]').attr('content'); // 설명
      var _date = $('meta[property="og:desc_date"]').attr('content'); // 예식날짜
      var _place = $('meta[property="og:desc_place"]').attr('content'); // 예식장소
      var _image = $('meta[property="og:image"]').attr('content'); // 이미지
      var _address = $('meta[property="og:desc_address"]').attr('content'); // 예식장 주소상세
      var _location = location.origin + '/mcard/map?lat=' + map_info.map_lat + '&lng=' + map_info.map_long + '&place=' + map_info.map_title + '&address=' + map_info.map_new_address;

      if (map_info.use_map == 'T') {
        // 카카오링크 버튼을 생성합니다. 처음 한번만 호출하면 됩니다.
        Kakao.Share.sendDefault({
          objectType: 'feed', // 카카오톡 링크 타입
          content: {
            title: _title + '\n' + _date, // 타이틀
            description: _place, // 상세정보
            imageUrl: _image, // 이미지
            link: {
              mobileWebUrl: _href, // 모바일 주소 걍 location.href
              webUrl: _href, // 웹 주소 걍 location.href
            },
            imageWidth: 800, // 이미지가로
            imageHeight: 600, // 이미지 세로
          },
          social: {
            likeCount: 0,
            commentCount: 0,
            sharedCount: 0,
          },
          buttons: [
            {
              title: '상세보기',
              link: {
                mobileWebUrl: _href,
                webUrl: _href,
              },
            },
            {
              title: '위치보기',
              link: {
                mobileWebUrl: _location,
                webUrl: _location,
              },
            },
          ],
        });
      } else {
        // 카카오링크 버튼을 생성합니다. 처음 한번만 호출하면 됩니다.
        Kakao.Share.sendDefault({
          objectType: 'feed', // 카카오톡 링크 타입
          content: {
            title: _title + '\n' + _date, // 타이틀
            description: _place, // 상세정보
            imageUrl: _image, // 이미지
            link: {
              mobileWebUrl: _href, // 모바일 주소 걍 location.href
              webUrl: _href, // 웹 주소 걍 location.href
            },
            imageWidth: 800, // 이미지가로
            imageHeight: 600, // 이미지 세로
          },
          social: {
            likeCount: 0,
            commentCount: 0,
            sharedCount: 0,
          },
          buttons: [
            {
              title: '상세보기',
              link: {
                mobileWebUrl: _href,
                webUrl: _href,
              },
            },
          ],
        });
      }
    } else {
      alert('카카오 라이브러리가 정상동작하지 않고 있습니다. 나중에 다시 시도해주세요.');
    }
  },

  kakaoNavi: function (_name, _x, _y) {
    if (typeof Kakao !== 'undefined') {
      Kakao.Navi.start({
        name: _name,
        x: parseFloat(_x),
        y: parseFloat(_y),
        coordType: 'wgs84',
      });
    } else {
      alert('카카오 라이브러리가 정상동작하지 않고 있습니다. 나중에 다시 시도해주세요.');
    }
  },

  setSwiper: function () {
    var swiper = new Swiper('.slide_gallgery .swiper-container', {
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      spaceBetween: 10,
    });
  },

  thumbnail: function () {
    var $thumb = $('.thumb');
    var thumb_w = $thumb.width();

    $thumb.height(thumb_w);

    $thumb.children('a').on('click', function () {
      var index = $(this).parent().index();

      $('.thumb_zoom').removeClass('hidden');

      var swiper = new Swiper('.thumb_swiper', {
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        spaceBetween: 10,
        initialSlide: index,
      });

      if (index == 0) {
        $('.swiper-wrapper').css('transform', 'translate3d(0px, 0px, 0px)');
      }

      return false;
    });

    $('.swiper_close').on('click', function () {
      $('.thumb_zoom').addClass('hidden');
    });
  },
};

function toast_account(select, msg, timer) {
  var $elem = $('<p>' + msg + '</p>');

  $('.toast').html($elem).show();

  $elem.slideToggle(100, function () {
    setTimeout(function () {
      $elem.fadeOut(function () {
        $(this).remove();
        $('.toast').css('bottom', '');
      });
    }, timer);
    return false;
  });

  $('.toast').stop().animate({ bottom: '5%' });
}

function copyToClipboard(text) {
  var aux = document.createElement('textarea');
  aux.value = text;
  document.body.appendChild(aux);
  aux.select();
  aux.setSelectionRange(0, 9999);
  document.execCommand('copy');
  document.body.removeChild(aux);
}

//계좌번호 팝업
function accOpen(name) {
  $('.' + name).show();
}
function accClose() {
  $('.account_pop').hide();
}

$(document).ready(function () {
  mobileIndex.init();
});
