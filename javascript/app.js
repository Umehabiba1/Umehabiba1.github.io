const UIControllers = (function () {
    const e = {
      win: $(window),
      didScroll: !1,
      docElem: window.document.documentElement,
      tweetsWrapper: $("#tweets"),
      teamSliderPhotos: $(".team-list-images-inner.inline"),
    };
    return {
      selectors: e,
      getViewportH: function () {
        var t = e.docElem.clientHeight,
          i = window.innerHeight;
        return t < i ? i : t;
      },
      scrollY: function () {
        return window.pageYOffset || e.docElem.scrollTop;
      },
      getOffset: function (e) {
        var t = 0,
          i = 0;
        return (
          isNaN(e.offset().top) || (t += e.offset().top),
          isNaN(e.offset().left) || (i += e.offset().left),
          { top: t + 10, left: i }
        );
      },
      inViewport: function (e, t) {
        var i = e.outerHeight(),
          s = UIControllers.scrollY(),
          o = s + UIControllers.getViewportH(),
          n = UIControllers.getOffset(e).top;
        return n + i * (t = t || 0) <= o && n + i >= s;
      },
      scrollPage: function () {
        $("header, main > section, footer").each(function () {
          var e = $(this);
          UIControllers.inViewport(e)
            ? e.addClass("section-in section-been")
            : (e.addClass("section-init"), e.removeClass("section-in"));
        }),
          (e.didScroll = !1);
      },
      toggleNav: function (e) {
        var t = $("body"),
          i = $("#main-nav");
        e.hasClass("in")
          ? (e.removeClass("in"),
            t.removeClass("nav-open nav-children-open"),
            i.find(".page-link > i").removeClass("in"))
          : (e.addClass("in"), t.addClass("nav-open"));
      },
      navChildrenMobile: function (e) {
        var t = $("body"),
          i = $("#main-nav"),
          s = e.closest(".page-link").find(".children");
        e.hasClass("in")
          ? (e.removeClass("in"),
            t.removeClass("nav-children-open"),
            s.removeClass("in"))
          : (i.find(".page-link > i").removeClass("in"),
            e.addClass("in"),
            t.addClass("nav-children-open"),
            i.find(".page-link .children").removeClass("in"),
            s.addClass("in"));
      },
      scrollHandler: function () {
        e.didScroll ||
          ((e.didScroll = !0),
          setTimeout(function () {
            UIControllers.scrollPage();
          }, 100));
      },
      stickyNav: function () {
        var t = e.win.scrollTop(),
          i = $("#main-nav");
        t >= 150 && t < 400
          ? i.addClass("init")
          : t >= 400
          ? i.addClass("in")
          : i.removeClass("init in");
      },
      anchorLink: function (e) {
        $("html, body").animate(
          { scrollTop: $(e.data("anchor-target")).offset().top - 185 },
          1e3
        );
      },
      getTwitterTimeline: function () {
        var e = $("#tweets-list");
        $.ajax({
          url: object_name.themeDir + "/includes/twitter-app.php",
          type: "GET",
          success: function (t) {
            if (void 0 === t.errors || t.errors.length < 1) {
              var i = $('<div class="tweets"></div>');
              $.each(t, function (e, t) {
                var s = t.user.name,
                  o = t.user.screen_name,
                  n = t.favorite_count,
                  l = t.retweet_count,
                  a =
                    n > 0
                      ? '<li><i class="icon-heart"></i><span>' +
                        n +
                        "</span></li>"
                      : "",
                  r =
                    l > 0
                      ? '<li><i class="icon-refresh"></i><span>' +
                        l +
                        "</span></li>"
                      : "";
                i.append(
                  '<article class="tweet" data-tweet-id="' + e + '"></article>'
                );
                var c = i.find('article.tweet[data-tweet-id="' + e + '"]');
                c.append(
                  '<p class="author"><b>' +
                    s +
                    '</b> <a href="https://twitter.com/MethodsDigital" target="_blank">@' +
                    o +
                    "</a></p>"
                ),
                  c.append("<p>" + t.full_text + "</p>"),
                  (n > 0 || l > 0) &&
                    c.append('<ul class="tweet-stats">' + a + r + "</ul>");
              }),
                e.html(i);
            } else e.html("An unexpected error has occured.");
          },
          complete: function () {
            e.find(".tweets")
              .not(".slick-initialized")
              .slick({
                slide: ".tweet",
                rows: 0,
                infinite: !0,
                slidesToShow: 1,
                slidesToScroll: 1,
                swipeToSlide: !0,
                arrows: !0,
                prevArrow:
                  '<button class="slick-prev slick-arrow" aria-label="Previous" type="button" style=""><i class="icon-arrow-left"></i></button>',
                nextArrow:
                  '<button class="slick-next slick-arrow" aria-label="Next" type="button" style=""><i class="icon-arrow-right"></i></button>',
                dots: !1,
                mobileFirst: !0,
                responsive: [
                  { breakpoint: 767, settings: { slidesToShow: 3 } },
                ],
              });
          },
          error: function (t) {
            e.find(".errors").text("Request error");
          },
        });
      },
      toggleSearch: function (e) {
        var t = $("body");
        UIControllers.toggleOverlay(),
          e.hasClass("in")
            ? (e.removeClass("in"), t.removeClass("navsearch-in"))
            : (e.addClass("in"),
              t.addClass("navsearch-in"),
              $("#searchform").find('input[type="text"]').focus());
      },
      setNavActiveLink: function () {
        var e = $("header").attr("data-current-page"),
          t = $("#main-nav"),
          i = t.find('.page-link[data-page-name="' + e + '"]');
        i.length > 0 &&
          (t.find(".page-link").removeClass("active"), i.addClass("active"));
      },
      sliderPaging: function () {
        $("#home-header-slides").on(
          "init reInit beforeChange afterChange",
          function (e, t, i, s) {
            var o = (i || 0) + 1;
            $("body")
              .find('.slider-paging[data-slider="#' + e.target.id + '"]')
              .html(
                '<p class="p-heading">' +
                  (o < 10 ? "0" : "") +
                  o +
                  "/" +
                  (t.slideCount < 10 ? "0" : "") +
                  t.slideCount +
                  "</p>"
              );
          }
        );
      },
      sliders: function () {
        $(".team-list-bios.inline")
          .not(".slick-initialized")
          .slick({
            slide: ".team-member",
            rows: 0,
            infinite: !1,
            slidesToShow: 1,
            fade: !0,
            slidesToScroll: 1,
            arrows: !0,
            swipe: !1,
            prevArrow:
              '<button class="slick-prev slick-arrow" aria-label="Previous" type="button" style=""><i class="icon-arrow-left"></i></button>',
            nextArrow:
              '<button class="slick-next slick-arrow" aria-label="Next" type="button" style=""><i class="icon-arrow-right"></i></button>',
            dots: !1,
            asNavFor: e.teamSliderPhotos,
            responsive: [{ breakpoint: 767, settings: "unslick" }],
          }),
          e.teamSliderPhotos.on("init", function (e, t, i, s) {
            UIControllers.teamSliderLeftCover();
          }),
          e.teamSliderPhotos.not(".slick-initialized").slick({
            slide: ".team-member",
            rows: 0,
            infinite: !0,
            centerMode: !0,
            slidesToShow: 1,
            slidesToScroll: 1,
            swipeToSlide: !0,
            arrows: !0,
            prevArrow:
              '<button class="slick-prev slick-arrow" aria-label="Previous" type="button" style=""><i class="icon-arrow-left"></i></button>',
            nextArrow:
              '<button class="slick-next slick-arrow" aria-label="Next" type="button" style=""><i class="icon-arrow-right"></i></button>',
            dots: !1,
            mobileFirst: !0,
            responsive: [
              {
                breakpoint: 767,
                settings: {
                  slidesToShow: 2,
                  arrows: !1,
                  infinite: !1,
                  focusOnSelect: !0,
                  asNavFor: $(".team-list-bios.inline"),
                },
              },
              {
                breakpoint: 991,
                settings: {
                  slidesToShow: 3,
                  arrows: !1,
                  infinite: !1,
                  focusOnSelect: !0,
                  asNavFor: $(".team-list-bios.inline"),
                },
              },
            ],
          }),
          $(".team-list-bios.alt")
            .not(".slick-initialized")
            .slick({
              slide: ".team-member",
              rows: 0,
              infinite: !0,
              slidesToShow: 1,
              fade: !0,
              slidesToScroll: 1,
              arrows: !0,
              swipe: !1,
              prevArrow:
                '<button class="slick-prev slick-arrow" aria-label="Previous" type="button" style=""><i class="icon-arrow-left"></i></button>',
              nextArrow:
                '<button class="slick-next slick-arrow" aria-label="Next" type="button" style=""><i class="icon-arrow-right"></i></button>',
              dots: !1,
              asNavFor: $(".team-list-images-inner.alt"),
              responsive: [{ breakpoint: 767, settings: "unslick" }],
            }),
          $(".team-list-images-inner.alt")
            .not(".slick-initialized")
            .slick({
              slide: ".team-member",
              rows: 0,
              infinite: !0,
              centerMode: !0,
              slidesToShow: 1,
              slidesToScroll: 1,
              focusOnSelect: !0,
              asNavFor: $(".team-list-bios.alt"),
              swipeToSlide: !0,
              arrows: !0,
              prevArrow:
                '<button class="slick-prev slick-arrow" aria-label="Previous" type="button" style=""><i class="icon-arrow-left"></i></button>',
              nextArrow:
                '<button class="slick-next slick-arrow" aria-label="Next" type="button" style=""><i class="icon-arrow-right"></i></button>',
              dots: !1,
              mobileFirst: !0,
              responsive: [{ breakpoint: 767, settings: { slidesToShow: 3 } }],
            });
        var t = $(".c-customer-stories-list-tile"),
          i = $("#customer-stories-list-feat"),
          s = $("#c-customer-stories-list-full-w");
        i.on("init", function (e, t) {
          setTimeout(function () {
            i.slick("slickPrev");
          }, 0);
        }),
          i
            .not(".slick-initialized")
            .slick({
              slide: ".customer-story",
              rows: 0,
              fade: !1,
              infinite: !0,
              slidesToShow: 1,
              slidesToScroll: 1,
              swipeToSlide: !0,
              arrows: !0,
              prevArrow:
                '<button class="slick-prev slick-arrow" aria-label="Previous" type="button" style=""><i class="icon-arrow-left"></i></button>',
              nextArrow:
                '<button class="slick-next slick-arrow" aria-label="Next" type="button" style=""><i class="icon-arrow-right"></i></button>',
              dots: !1,
              mobileFirst: !0,
              responsive: [
                { breakpoint: 767, settings: { fade: !0, arrows: !1 } },
              ],
            }),
          t
            .on("init", function (e, t) {
              var i = $(this);
              UIControllers.cSSliderTitleHeights(i);
            })
            .on("beforeChange", function (e, t, s, o) {
              var n = s - o;
              1 == n || t.slideCount;
              1 == n || n == -1 * (t.slideCount - 1)
                ? i.slick("slickPrev")
                : i.slick("slickNext");
            }),
          t
            .not(".slick-initialized")
            .slick({
              rows: 2,
              slidesPerRow: 1,
              infinite: !1,
              slidesToShow: 2,
              slidesToScroll: 1,
              arrows: !0,
              dots: !1,
              prevArrow: $("#btn-cs-prev"),
              nextArrow: $("#btn-cs-next"),
              responsive: [{ breakpoint: 992, settings: { slidesToShow: 1 } }],
            }),
          s.on("init", function (e, t) {
            var i = $(this);
            UIControllers.cSSliderFWHeights(i);
          }),
          s
            .not(".slick-initialized")
            .slick({
              slide: ".customer-story",
              rows: 0,
              infinite: !0,
              slidesToShow: 1,
              slidesToScroll: 1,
              swipeToSlide: !0,
              arrows: !0,
              prevArrow:
                '<button class="slick-prev slick-arrow" aria-label="Previous" type="button" style=""><i class="icon-arrow-left"></i></button>',
              nextArrow:
                '<button class="slick-next slick-arrow" aria-label="Next" type="button" style=""><i class="icon-arrow-right"></i></button>',
              dots: !1,
            }),
          $(".c-testimonials-list")
            .not(".slick-initialized")
            .slick({
              slide: ".testimonial",
              rows: 0,
              speed: 900,
              fade: !0,
              infinite: !0,
              slidesToShow: 1,
              slidesToScroll: 1,
              swipeToSlide: !0,
              arrows: !0,
              prevArrow:
                '<button class="slick-prev slick-arrow" aria-label="Previous" type="button" style=""><i class="icon-arrow-left"></i></button>',
              nextArrow:
                '<button class="slick-next slick-arrow" aria-label="Next" type="button" style=""><i class="icon-arrow-right"></i></button>',
              dots: !1,
            }),
          $(".events-group__list")
            .not(".slick-initialized")
            .slick({
              slide: ".event",
              infinite: !1,
              rows: 0,
              slidesToShow: 1,
              slidesToScroll: 1,
              arrows: !0,
              prevArrow:
                '<button class="slick-prev slick-arrow" aria-label="Previous" type="button" style=""><i class="icon-arrow-left"></i></button>',
              nextArrow:
                '<button class="slick-next slick-arrow" aria-label="Next" type="button" style=""><i class="icon-arrow-right"></i></button>',
              dots: !1,
              mobileFirst: !0,
              responsive: [{ breakpoint: 767, settings: { slidesToShow: 3 } }],
            }),
          $(".c-block-text-image-gallery")
            .not(".slick-initialized")
            .slick({
              slide: ".slide",
              infinite: !0,
              rows: 0,
              fade: !0,
              slidesToShow: 1,
              slidesToScroll: 1,
              arrows: !0,
              prevArrow:
                '<button class="slick-prev slick-arrow" aria-label="Previous" type="button" style=""><i class="icon-arrow-left"></i></button>',
              nextArrow:
                '<button class="slick-next slick-arrow" aria-label="Next" type="button" style=""><i class="icon-arrow-right"></i></button>',
              dots: !1,
            }),
          $("#v-gallery")
            .not(".slick-initialized")
            .slick({
              slide: ".slide",
              infinite: !0,
              rows: 0,
              slidesToShow: 1,
              slidesToScroll: 1,
              arrows: !0,
              prevArrow:
                '<button class="slick-prev slick-arrow" aria-label="Previous" type="button" style=""><i class="icon-arrow-left"></i></button>',
              nextArrow:
                '<button class="slick-next slick-arrow" aria-label="Next" type="button" style=""><i class="icon-arrow-right"></i></button>',
              dots: !1,
            });
      },
      slidersResponsive: function () {
        $(
          ".c-testimonials-list, .team-list-bios, .team-list-images-inner, .events-group__list"
        ).slick("resize");
      },
      teamSliderLeftCover: function () {
        var t = e.teamSliderPhotos.find(".team-member.slick-current"),
          i = $("#slides-cover"),
          s = t.offset().left;
        (parPos = t.closest(".container").offset().left),
          i.css("width", s - parPos + "px");
      },
      cSSliderTitleHeights: function (e) {
        var t = [],
          i = e.find(".slick-slide .customer-story__content h3");
        $(window).width() > 767 &&
          (i.css("height", "auto"),
          (t = []),
          e
            .find(".slick-slide:not(.slick-cloned) .customer-story")
            .each(function () {
              t.push($(this).find(".customer-story__content h3").height());
            }),
          i.css("height", Math.max.apply(null, t) + "px"));
      },
      cSSliderFWHeights: function (e) {
        var t = [],
          i = e.find(".slick-slide");
        $(window).width() > 767 &&
          (i.css("height", "auto"),
          (t = []),
          i.each(function () {
            t.push($(this).height());
          }),
          i.css("height", Math.max.apply(null, t) + "px"));
      },
      toggleOverlay: function () {
        var e = $("#overlay");
        e.hasClass("in") ? e.removeClass("in") : e.addClass("in");
      },
      showOverlay: function () {
        $("#overlay").addClass("in");
      },
      hideOverlay: function () {
        $("#overlay").removeClass("in");
      },
      loadHomeVideo: function (e) {
        var t = $("#header-video"),
          i = t.find(".video-cover"),
          s = $(".h-video"),
          o = t.find(".h-video").get(0);
        const n = o.play();
        s.addClass("in"),
          null !== n &&
            n.catch(() => {
              o.play();
            }),
          i.fadeOut();
      },
      clientLogoFilters: function (e) {
        var t = $("#client-logos-filters"),
          i = $("#client-logos-list");
        return (
          e.is(":checked") &&
            (t.find('input[name="sector_filter"]').prop("checked", !1),
            e.prop("checked", !0)),
          $.ajax({
            url: t.attr("action"),
            data: t.serialize(),
            type: t.attr("method"),
            beforeSend: function (e) {
              i.addClass("loading");
            },
            success: function (e) {
              i.html(e).removeClass("loading");
            },
          }),
          !1
        );
      },
      careersBenefits: function (e) {
        var t = e.closest(".group"),
          i = e.next(".group__list");
        t.hasClass("in")
          ? (t.removeClass("in"), i.slideUp())
          : (t.addClass("in"), i.slideDown());
      },
      contactLocations: function (t) {
        var i = t.closest(".location"),
          s = i.attr("data-map-src"),
          o = $("#c-map-wrapper");
        i.hasClass("in") ||
          (e.win.width() > 767 &&
            (o.addClass("change"),
            setTimeout(function () {
              o.find(".map-image img").attr("src", s), o.removeClass("change");
            }, 300)),
          $("#c-accordion")
            .find(".group.in")
            .not(i)
            .removeClass("in")
            .find(".location__content")
            .slideUp());
      },
      lazyLoadImage: function (e) {
        var t = e.attr("data-ll-type"),
          i = e.attr("data-ll-src"),
          s = e.attr("data-ll-class"),
          o = e.attr("data-ll-alt") ? e.attr("data-ll-alt") : "";
        e.closest("section").hasClass("section-been") &&
          i &&
          ("el" === t
            ? e.append(
                '<img src="' + i + '" alt="' + o + '" class="' + s + '">'
              )
            : "bg" === t && e.css("background-image", 'url("' + i + '")'),
          e.removeAttr("data-ll-src data-ll-type data-ll-alt data-ll-class"));
      },
      processTabs: function (e) {
        var t = e.attr("data-step"),
          i = $(".process-steps__content"),
          s = e
            .closest(".c-block--process-tabs")
            .find(".process-bar .process-bar-inner"),
          o = s.attr("data-total-steps");
        e.hasClass("active") ||
          ($(".process-steps__nav")
            .find(".process-nav li a")
            .removeClass("active"),
          e.addClass("active"),
          i.find(".process-step-content").hide(),
          i.find('.process-step-content[data-step="' + t + '"]').fadeIn(),
          s.find("span").css("max-width", (t / o) * 100 + "%"));
      },
      loadCVideos: function (e) {
        var t = e.closest(".video-container"),
          i = t.find(".video-cover"),
          s = ($(".c-video-el"), t.find(".c-video-el").get(0));
        const o = s.play();
        null !== o &&
          o.catch(() => {
            s.play();
          }),
          i.fadeOut();
      },
    };
  })(),
  App = (function (e) {
    const t = { win: $(window) };
    return {
      init: function () {
        var i;
        t.win
          .on("load scroll", function () {
            e.scrollHandler(),
              $(".ll-image").each(function () {
                var t = $(this);
                setTimeout(function () {
                  e.lazyLoadImage(t);
                }, 500);
              });
          })
          .on("scroll", function () {
            e.stickyNav();
          })
          .on("load", function () {
            e.setNavActiveLink(), e.sliders();
          })
          .on("resize", function (t) {
            clearTimeout(i),
              (i = setTimeout(function () {
                if (
                  (e.slidersResponsive(),
                  e.selectors.teamSliderPhotos.find(
                    ".team-member.slick-current"
                  ).length > 0 && e.teamSliderLeftCover(),
                  $("#customer-stories-list-feat").length > 0)
                ) {
                  var t = $("#customer-stories-list");
                  e.cSSliderTitleHeights(t);
                }
                if ($("#c-customer-stories-list-full-w").length > 0) {
                  t = $("#c-customer-stories-list-full-w");
                  e.cSSliderFWHeights(t);
                }
              }, 250));
          }),
          $("#nav-toggle").on("click", function (t) {
            t.preventDefault();
            var i = $(this);
            e.toggleNav(i);
          }),
          $("#main-nav .page-link.has-children > i").on("click", function (i) {
            i.preventDefault();
            var s = $(this);
            t.win.width() < 992 && e.navChildrenMobile(s);
          }),
          $('a[data-target="anchor"]').on("click", function (t) {
            t.preventDefault();
            var i = $(this);
            e.anchorLink(i);
          }),
          $("#play-home-header").on("click", function (t) {
            t.preventDefault();
            var i = $(this);
            e.loadHomeVideo(i);
          }),
          $("#main-nav li.has-children")
            .on("mouseenter", function () {
              e.showOverlay();
            })
            .on("mouseleave", function () {
              e.hideOverlay();
            }),
          $('#client-logos-filters input[name="sector_filter"]').on(
            "change",
            function (t) {
              var i = $(this);
              e.clientLogoFilters(i);
            }
          ),
          $("#s-trigger, #close-search").on("click", function (t) {
            t.preventDefault();
            var i = $("#s-trigger");
            e.toggleSearch(i);
          }),
          $(".locations-list .location__heading")
            .on("click", function (t) {
              var i = $(this);
              e.contactLocations(i);
            })
            .keyup(function (t) {
              if (13 === event.keyCode) {
                var i = $(this);
                e.contactLocations(i);
              }
            }),
          $(".c-accordion-list .group__heading")
            .on("click", function (t) {
              t.preventDefault();
              var i = $(this);
              e.careersBenefits(i);
            })
            .keyup(function (t) {
              if (13 === event.keyCode) {
                t.preventDefault();
                var i = $(this);
                e.careersBenefits(i);
              }
            }),
          $(".process-steps__nav li a").on("click", function (t) {
            t.preventDefault();
            var i = $(this);
            e.processTabs(i);
          }),
          $(".c-block--video-section__play-btn").on("click", function (t) {
            t.preventDefault();
            var i = $(this);
            e.loadCVideos(i);
          });
      },
    };
  })(UIControllers);
App.init();
