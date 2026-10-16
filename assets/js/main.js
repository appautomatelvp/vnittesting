$(document).ready(function() {
    // header
    header.init();

    setBackgroundElement();
    lazyloadFun();
    // swiper
    swiperInit();
    // bannerProjectTwenty();
    getTitleForm();
    numberCountUp();
    toggleFaqs();
    toggleCategory();
    // backToTop();
    loadViewMore();
    buttonHover();
    moveHtml();
    // height($('.about-5 .box-content-bot .leadership-item .caption'));
    height($('.about-6 .about-6-item'));
    cloud9Slide();
    Fancybox.bind("[data-fancybox]", {
        infinite: false,
        parentEl: document.forms[0], // Element containing main structure
        mainClass: 'fancybox-wrapper', // Custom class name or multiple space-separated class names for the container
    });
    Fancybox.bind("a.popup-link", {
        showLoading: true,
        type: "iframe",
        preload: true,
    });
    Fancybox.bind('[data-fancybox="single"]', {
        groupAttr: false,
    });
    animationJS();

    if ($('img[usemap]').length > 0) {
        $('map').imageMapResize();
    };
    loadMoreItem($('.recruitment-result .result-wrap .row>*'));
});

$(document).on("scroll", function() {
    header.scrollActive();
});

$(window).on("resize", function() {});

function LoadMoreProductAjax(pageurl) {
    $.ajax({
        url: pageurl,
        type: "POST",
        data: {
            isajax: true
        },
        success: function(data) {
            $('.product-list').append($(data).find('.ajaxresponseloadmore').html());
            return false;
        }
    });
}

function height(el) {
    var height = 0;
    $(el).each(function() {
        var thisHeight = $(this).height();
        if (thisHeight > height) {
            height = thisHeight;
        }
        setTimeout(() => {
            $(el).height(height);
        }, 100);
    });
}

let header = {
    scrollActive: function() {
        let height = $("header").height();
        if ($(window).scrollTop() > height) {
            $("header").addClass("active");
        } else {
            $("header").removeClass("active");
        }
        if ($(window).scrollTop() > 500) {
            $(".back-to-top").addClass("active");
        } else {
            $(".back-to-top").removeClass("active");
        }
    },
    mappingMenu: () => {
        let mainMenu = $("header .main-menu").mapping({
            mobileWrapper: "header .mobile-wrap",
            mobileMethod: "appendTo",
            desktopWrapper: "header .bottom-wrap",
            desktopMethod: "prependTo",
            breakpoint: 1279,
        });
        let infoTop = $("header .top-wrap .info-top").mapping({
            mobileWrapper: "header .mobile-wrap",
            mobileMethod: "appendTo",
            desktopWrapper: "header .top-wrap .language",
            desktopMethod: "insertBefore",
            breakpoint: 1279,
        });
    },
    menuMobile: () => {
        $("header .menu").on("click", function() {
            $(this).toggleClass("active");
            $("header .mobile-wrap").slideToggle();
        });
        $(".mobile-wrap .show-mega-mb").on("click", function() {
            $(this).toggleClass("active").parent().next().slideToggle();
        });
    },
    toggleMegaMenu: () => {
        $(".mobile-wrap .main-menu>li.has-mega>.mega-arrow").on("click", function(e) {
            e.preventDefault();
            $(this).toggleClass("active").next().slideToggle();
        });
    },
    toggleSearchBox: () => {
        let btn = $('header .button-search'),
            btnClose = $('header .search-wrap .btn-close'),
            searchBox = $('header .search-wrap'),
            bodyClass = $('body')
        btn.on('click', function() {
            searchBox.toggleClass('active');
            disableScroll();
        });
        btnClose.on('click', function() {
            searchBox.toggleClass('active');
            enableScroll();
        });

    },
    init: () => {
        header.scrollActive();
        header.mappingMenu();
        header.menuMobile();
        header.toggleMegaMenu();
        header.toggleSearchBox();
    },
};

function setBackgroundElement() {
    $("[setBackground]").each(function() {
        var background = $(this).attr("setBackground");
        $(this).css({
            "background-image": "url(" + background + ")",
            "background-size": "cover",
            "background-position": "center center",
        });
    });
}

function lazyloadFun() {
    var pictureObserver = lozad(".lozad-picture", {
        threshold: 0.1,
    });

    var observer = lozad(".lozad", {
        threshold: 0.1,
        enableAutoReload: true,
        load: function(el) {
            el.src = el.getAttribute("data-src");
        },
    });
    var backgroundObserver = lozad(".lozad-background", {
        threshold: 0.1,
    });

    pictureObserver.observe();
    observer.observe();
    backgroundObserver.observe();
}

function swiperInit() {
    let homeBanner = new Swiper(".home-banner .swiper", {
        loop: true,
        autoplay: {
            delay: 5000,
        },
        spaceBetween: 30,
        speed: 500,
        grid: {
            fill: "row",
        },
        navigation: {
            nextEl: ".home-banner .button-next",
            prevEl: ".home-banner .button-prev",
        },
        pagination: {
            el: ".home-banner .swiper-pagination",
            clickable: true,
        },
    });
    if ($('.home-banner').length > 0) {
        $('.home-banner').mouseenter(function() {
            homeBanner.autoplay.stop()
        })
        $('.home-banner').mouseleave(function() {
            homeBanner.autoplay.start()
        })
    }
    let home1Slide = new Swiper(".home-1 .swiper", {
        loop: true,
        direction: 'vertical',
        autoplay: {
            delay: 5000,
        },
        spaceBetween: 10,
        speed: 500,
        slidesPerView: 3,
    });
    let home3Slide = new Swiper(".home-3 .swiper", {
        loop: true,
        autoplay: {
            delay: 5000,
        },
        speed: 300,
        grid: {
            fill: "row",
        },
        spaceBetween: 20,
        navigation: {
            nextEl: ".home-3 .button-next",
            prevEl: ".home-3 .button-prev",
        },
        pagination: {
            el: ".home-3 .swiper-pagination",
            clickable: true,
        },
        on: {
            init: function() {
                lazyloadFun();
            },
        },
    });
    let home5Slide = new Swiper(".home-5 .swiper", {
        loop: true,
        autoplay: {
            delay: 5000,
        },
        speed: 500,
        slidesPerView: 1,
        spaceBetween: 30,
        observer: true,
        observeSlideChildren: true,
        observeParents: true,
        grid: {
            fill: "row",
        },
        navigation: {
            nextEl: ".home-5 .button-next",
            prevEl: ".home-5 .button-prev",
        },
        lazy: {
            loadPrevNext: true,
        },
        breakpoints: {
            576: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        },
        on: {
            init: function() {
                lazyloadFun();
            },
        },
    });
    let home7Slide = new Swiper(".home-7 .swiper", {
        autoplay: {
            delay: 3000,
        },
        loop: true,
        speed: 500,
        slidesPerView: 2,
        spaceBetween: 20,
        grid: {
            fill: "row",
        },
        navigation: {
            nextEl: ".home-7 .button-next",
            prevEl: ".home-7 .button-prev",
        },
        breakpoints: {
            576: {
                slidesPerView: 3,
            },
            768: {
                slidesPerView: 4,
            },
            1024: {
                slidesPerView: 5,
            },
        },
        on: {
            init: function() {
                lazyloadFun();
            },
        },
    });
    let home22Slide = new Swiper(".home-22 .main-slide-swiper .swiper", {
        speed: 500,
        slidesPerView: 1,
        spaceBetween: 30,
        grid: {
            fill: "row",
        },
        navigation: {
            nextEl: ".home-22 .main-slide-swiper .button-next",
            prevEl: ".home-22 .main-slide-swiper .button-prev",
        },
        breakpoints: {
            576: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        },
    });
    let about3ThumbSlide = new Swiper(".about-3 .mySwiper", {
        spaceBetween: 10,
        slidesPerView: 3,
        watchSlidesProgress: true,
        breakpoints: {
            576: {
                slidesPerView: 4,
            },
            768: {
                slidesPerView: 5,
            },
            1280: {
                slidesPerView: 6,
            },
            1366: {
                slidesPerView: 7,
            },
            1440: {
                slidesPerView: 8,
            },
        },
    });
    let about3Slide2 = new Swiper(".about-3 .mySwiper2", {
        spaceBetween: 10,
        // autoHeight: true,
        navigation: {
            nextEl: ".about-3 .button-next",
            prevEl: ".about-3 .button-prev",
        },
        thumbs: {
            swiper: about3ThumbSlide,
        },
    });
    let about6Slide = new Swiper(".about-6 .swiper", {
        // loop: true,
        // autoplay: {
        // 	delay: 5000,
        // },
        speed: 500,
        slidesPerView: 2,
        spaceBetween: 10,
        grid: {
            fill: "row",
        },
        navigation: {
            nextEl: ".about-6 .button-next",
            prevEl: ".about-6 .button-prev",
        },
        breakpoints: {
            576: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 40,
            },
            1280: {
                slidesPerView: 3,
                spaceBetween: 60,
            },
            1440: {
                slidesPerView: 3,
                spaceBetween: 90,
            },
        },
        on: {
            init: function() {
                lazyloadFun();
            },
        },
    });
    // Project Slide List
    if ($('.slide-project').length > 0) {
        $('.slide-project').each(function(index) {
            $(this).addClass('slide-project-' + index);
            let projectSlide = new Swiper(".slide-project-" + index + " .swiper", {
                loop: true,
                autoplay: {
                    delay: 5000,
                },
                centeredSlides: true,
                speed: 500,
                slidesPerView: 1,
                spaceBetween: 10,
                grid: {
                    fill: "row",
                },
                navigation: {
                    nextEl: ".slide-project-" + index + " .button-next",
                    prevEl: ".slide-project-" + index + " .button-prev",
                },
                scrollbar: {
                    el: ".slide-project-" + index + " .swiper-scrollbar",
                    hide: false,
                    draggable: true,
                },
                breakpoints: {
                    576: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 3,
                    },
                },
                on: {
                    init: function() {
                        lazyloadFun();
                    },
                },
            });
        })
    }
    if ($('.content-popup').length > 0) {
        $('.content-popup').each(function(index) {
            $(this).addClass('content-popup-' + index);
            let projectPopupThumbSlide = new Swiper(".content-popup-" + index + " .mySwiper", {
                spaceBetween: 10,
                slidesPerView: 3,
                watchSlidesProgress: true,
                observer: true,
                observeParents: true,
                breakpoints: {
                    576: {
                        slidesPerView: 4,
                    },
                    768: {
                        slidesPerView: 5,
                        direction: 'vertical',
                    },
                    1440: {
                        slidesPerView: 5,
                        spaceBetween: 5,
                        direction: 'vertical',
                    },
                    1500: {
                        slidesPerView: 6,
                        spaceBetween: 10,
                        direction: 'vertical',
                    },
                },
            });
            let projectPopupSlide = new Swiper(".content-popup-" + index + " .mySwiper2", {
                spaceBetween: 10,
                observer: true,
                observeParents: true,
                navigation: {
                    nextEl: ".content-popup-" + index + " .button-next",
                    prevEl: ".content-popup-" + index + " .button-prev",
                },
                thumbs: {
                    swiper: projectPopupThumbSlide,
                }
            });
        })
    }
    let shareholder2Slide = new Swiper(".shareholder-2 .swiper", {
        speed: 500,
        slidesPerView: 1,
        spaceBetween: 30,
        grid: {
            fill: "row",
        },
        navigation: {
            nextEl: ".shareholder-2 .button-next",
            prevEl: ".shareholder-2 .button-prev",
        },
        scrollbar: {
            el: ".shareholder-2 .swiper-scrollbar",
            hide: false,
            draggable: true,
        },
        breakpoints: {
            576: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 3,
            },
            1024: {
                slidesPerView: 4,
            },
        },
    });
    let shareholderDThumbSlide = new Swiper(".shareholder-dt .mySwiper", {
        spaceBetween: 10,
        slidesPerView: 5,
        watchSlidesProgress: true,
        breakpoints: {
            576: {
                slidesPerView: 6,
            },
            768: {
                slidesPerView: 8,
            },
            1024: {
                slidesPerView: 9,
            },
            1280: {
                slidesPerView: 10,
            },
            1366: {
                slidesPerView: 11,
            },
            1440: {
                slidesPerView: 12,
            },
            1550: {
                slidesPerView: 13,
            },
            1600: {
                slidesPerView: 14,
            },
        },
    });
    let shareholderDSlide = new Swiper(".shareholder-dt .mySwiper2", {
        spaceBetween: 10,
        navigation: {
            nextEl: ".shareholder-dt .button-next",
            prevEl: ".shareholder-dt .button-prev",
        },
        thumbs: {
            swiper: shareholderDThumbSlide,
        },
    });
    if ($('.shareholder-dt').length > 0) {
        let indexholderActive = $('.shareholder-dt .year-thumbs').length
        shareholderDSlide.slideTo(indexholderActive, 1000, true);
    }

    let shareholderDBoxSlide = new Swiper(".shareholder-dt .mySwiperBox", {
        spaceBetween: 10,
        slidesPerView: 1,
        grid: {
            fill: "row",
            rows: 3,
        },
        pagination: {
            el: ".shareholder-dt .swiper-pagination",
            clickable: true,
            renderBullet: function(index, className) {
                return '<span class="' + className + '">' + (index + 1) + "</span>";
            },
        },
        breakpoints: {
            576: {
                slidesPerView: 2,
                grid: {
                    rows: 3,
                },
            },
            768: {
                spaceBetween: 20,
                slidesPerView: 3,
                grid: {
                    rows: 3,
                },
            },
            1024: {
                slidesPerView: 3,
                grid: {
                    rows: 3,
                },
            },
            1280: {
                slidesPerView: 4,
                spaceBetween: 30,
                grid: {
                    rows: 3,
                },
            },
        },
    });
    let recruitment5Slide = new Swiper(".recruitment-5 .swiper", {
        spaceBetween: 10,
        slidesPerView: 1,
        grid: {
            fill: "row",
            rows: 3,
        },
        navigation: {
            nextEl: ".recruitment-5 .button-next",
            prevEl: ".recruitment-5 .button-prev",
        },
        breakpoints: {
            768: {
                grid: {
                    rows: 4,
                },
            },
            1024: {
                spaceBetween: 1,
                grid: {
                    rows: 7,
                },
            },
            1280: {
                spaceBetween: 1,
                grid: {
                    rows: 10,
                },
            },
        },
    });
    let hseq4Slide = new Swiper(".HSEQ-4 .swiper", {
        speed: 500,
        slidesPerView: 1,
        spaceBetween: 30,
        grid: {
            fill: "row",
        },
        navigation: {
            nextEl: ".HSEQ-4 .button-next",
            prevEl: ".HSEQ-4 .button-prev",
        },
        breakpoints: {
            576: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 3,
            },
            1024: {
                slidesPerView: 4,
            },
        },
    });
    let serviceDetailSlide = new Swiper(".service-detail .swiper", {
        speed: 500,
        slidesPerView: 1,
        spaceBetween: 5,
        grid: {
            fill: "row",
        },
        navigation: {
            nextEl: ".service-detail .button-next",
            prevEl: ".service-detail .button-prev",
        },
        breakpoints: {
            1024: {
                loop: true,
                slidesPerView: 1.4257142857,
                centeredSlides: true,
            },
        },
        on: {
            init: function() {
                lazyloadFun();
            },
        },
    });
    let serviceAccordion = new Swiper(".accordion-item .swiper", {
        speed: 500,
        slidesPerView: 2,
        spaceBetween: 1,
        observer: true,
        observeParents: true,
        grid: {
            fill: "row",
        },
        navigation: {
            nextEl: ".accordion-item .button-next",
            prevEl: ".accordion-item .button-prev",
        },
        breakpoints: {
            576: {
                slidesPerView: 3,
            },
            768: {
                slidesPerView: 4,
            },
            1024: {
                slidesPerView: 6,
            },
            1280: {
                slidesPerView: 7,
            },
        },
        on: {
            init: function() {
                lazyloadFun();
            },
        },
    });
}

function toggleFaqs() {
    if ($('.accordion-item').length > 0) {
        let title = $(".accordion-item .title"),
            content = $(".accordion-item .content");
        if ($(".accordion-item").hasClass("active")) {
            $(".accordion-item.active .content").show();
        }
        title.on("click", function() {
            if ($(this).parent().hasClass("active")) {
                $(".accordion-item").removeClass("active");
                content.slideUp();
            } else {
                $(".accordion-item").removeClass("active");
                content.slideUp();
                $(this).next().slideDown().parent().addClass("active");
            }
        });

    }
}

function toggleCategory() {
    if ($('.box-category').length > 0) {
        let title = $(".category-title");
        title.on("click", function() {
            $(this).toggleClass('active').next().slideToggle();
        });
    }
}

function backToTop() {
    let button = $(".back-to-top-link");
    button.on("click", function(e) {
        var noHashURL = window.location.href.replace(/#.*$/, "");
        window.history.replaceState("", document.title, noHashURL);
    });
}

function buttonHover() {
    $(".btn").on("mouseenter", function(e) {
        var parentOffset = $(this).offset(),
            relX = e.pageX - parentOffset.left,
            relY = e.pageY - parentOffset.top;
        $(this).find(".animate").css({
            top: relY,
            left: relX,
        });
    }).on("mouseout", function(e) {
        var parentOffset = $(this).offset(),
            relX = e.pageX - parentOffset.left,
            relY = e.pageY - parentOffset.top;
        $(this).find(".animate").css({
            top: relY,
            left: relX,
        });
    });
}

function scrollToSection() {
    let btnLink = $('a[href="#section-order-now"]');
    btnLink.bind("click", function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            let header = $("header").outerHeight();
            $("html, body").animate({
                scrollTop: $(hash).offset().top - header - 10,
            }, 0);
        }
    });
}

function numberCountUp() {
    // countUp
    var options = {
        useEasing: true,
        useGrouping: true,
        separator: ".",
        decimal: ".",
    };
    var statistics = $(".number-item .number span.count");

    function countStart() {
        // For each Statistic we find, animate it
        statistics.each(function(index) {
            // Find the value we want to animate (what lives inside the p tags)
            var value = $(statistics[index]).html();
            // Start animating
            var statisticAnimation = new CountUp(
                statistics[index],
                0,
                value,
                0,
                5,
                options
            );
            statisticAnimation.start();
        });
        // end countUp
    }

    ScrollReveal().reveal(".home-2, .about-1", {
        beforeReveal: countStart,
    });
}

function cloud9Slide() {
    if ($("#carousel").length > 0) {
        var showcase = $("#carousel"),
            title = $("#item-caption"),
            card = $("#carousel .cloud9-item");
        showcase.Cloud9Carousel({
            yOrigin: 250,
            // yRadius: 140,
            // mirror: {
            // 	gap: 12,
            // 	height: 0.2,
            // },
            buttonLeft: $("#nav > .left"),
            buttonRight: $("#nav > .right"),
            autoPlay: 1,
            bringToFront: true,
            frontItemClass: "active",
            // mouseWheel: true,
            xRadius: 460,
            yRadius: 320,
            // yRadius: 250,
            onRendered: rendered,
            onLoaded: function() {
                showcase.css("visibility", "visible");
                showcase.css("display", "none");
                showcase.fadeIn(1500);
            },
        });
        // showcase.Cloud9Carousel({
        // 	yOrigin: 290,
        // 	xRadius: 250,
        // 	yRadius: 250,
        // 	buttonLeft: $("#nav > .left"),
        // 	buttonRight: $("#nav > .right"),
        // 	autoPlay: 1,
        // 	autoPlayDelay: 3000,
        // 	bringToFront: true,
        // 	frontItemClass: "active",
        // 	// mouseWheel: true,
        // 	farScale: 1,
        // 	onRendered: rendered,
        // 	onLoaded: function () {
        // 		showcase.css("visibility", "visible");
        // 		showcase.css("display", "none");
        // 		showcase.fadeIn(1500);
        // 	},
        // });
        var tend = $(".home-22 .main-slide .cloud9-item:first-child h3.title").html(),
            des = $(".home-22 .main-slide .cloud9-item:first-child .desc").html(),
            dataHref = $(".home-22 .main-slide .cloud9-item:first-child .href").data('href');
        $(".home-22 .main-slide .content-slide .txt").html(tend);
        $(".home-22 .main-slide .content-slide .txt-desc").html(des);
        $(".home-22 .box-content>.button .btn.btn-main").attr('href', dataHref);

        card.on("click", function(e) {
            var tend = $(this).find(".title").html();
            var des = $(this).find(".desc").html();
            var dataHref = $(this).find(".href").data('href');
            $(".home-22 .main-slide .content-slide .txt").html(tend);
            $(".home-22 .main-slide .content-slide .txt-desc").html(des);
            $(".home-22 .box-content>.button .btn.btn-main").attr('href', dataHref);
        });

        function rendered(carousel) {
            var tend = $(".cloud9-item.active").find(".title").html(),
                des = $(".cloud9-item.active").find(".desc").html();
            dataHref = $(".cloud9-item.active").find(".href").data('href');
            title.find(".txt").html(tend);
            title.find(".txt-desc ").html(des);
            title.find(".btn-main ").attr('href', dataHref);
            // title.text( carousel.nearestItem().element.alt )
            // Fade in based on proximity of the item
            var c = Math.cos((carousel.floatIndex() % 1) * 2 * Math.PI);
            title.css("opacity", 0.5 + 0.5 * c);
        }

        //
        // Simulate physical button click effect
        //
        $("#nav > button").click(function(e) {
            var b = $(e.target).addClass("down");
            setTimeout(function() {
                b.removeClass("down");
            }, 80);
        });
        $(document).keydown(function(e) {
            //
            // More codes: http://www.javascripter.net/faq/keycodes.htm
            //
            switch (e.keyCode) {
                /* left arrow */
                case 37:
                    $('#nav > .left').click()
                    break

                    /* right arrow */
                case 39:
                    $('#nav > .right').click()
            }
        });
    }
}

function loadViewMore() {
    if ($('.view-more-list').length > 0) {
        $('.view-more-list').each(function(index) {
            let dataShow = $(this).data('show'),
                dataLoadMore = $(this).data('load-more');
            $(this).addClass('view-more-list-' + index);
            $('.view-more-list-' + index + ' > * ').slice(0, dataShow).show();
            $(this).next().find('a').on('click', function(e) {
                e.preventDefault();
                $('.view-more-list-' + index + ' > *:hidden').slice(0, dataLoadMore).slideDown();
                if ($('.view-more-list-' + index + ' > *:hidden').length == 0) {
                    $(this).hide();
                }
            });
        });
    }
}

function bannerProjectTwenty() {
    if ($('.twentytwenty-container').length > 0) {
        $('.twentytwenty-container').each(function(index) {
            let dataBefore = $(this).data('before')
            let dataAfter = $(this).data('after')
            $(".twentytwenty-container[data-orientation!='vertical']").twentytwenty({
                default_offset_pct: 0.5,
                before_label: dataBefore,
                after_label: dataAfter,
            });
        })
    }
}

function getTitleForm() {
    if ($('.open-tender-item').length > 0) {
        $('.open-tender-item .btn-open-form').on('click', function() {
            let dataTitle = $(this).attr('title');
            // console.log(dataTitle);
            $('.info-tender-section .main-title').text(dataTitle);
            $('.info-tender-section .form-group.info-tender input').val(dataTitle);
            $('.info-tender-section .form-group.info-company input').trigger('click')
        })
    }
}

function fbs_click(width, height) {
    let leftPosition, topPosition;
    leftPosition = (window.screen.width / 2) - ((width / 2) + 10);
    topPosition = (window.screen.height / 2) - ((height / 2) + 50);
    let windowFeatures = "status=no,height=" + height + ",width=" + width + ",resizable=no,left=" + leftPosition + ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY=" + topPosition + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no";
    let u = location.href;
    let t = document.title;
    window.open('http://www.facebook.com/sharer.php?u=' + encodeURIComponent(u) + '&t=' + encodeURIComponent(t), 'sharer', windowFeatures);
    return false;
}

function animationJS() {
    if ($('.animate').length > 0 && $(window).width() > 1279) {
        // Add animation 
        const callback = (entries) => {
            entries.forEach(
                (entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = entry.target.dataset.animate;
                        // console.log(entry.target.style.animation);
                    }
                }
            );
        }

        let observer = new IntersectionObserver(callback);
        const animationItems = document.querySelectorAll('.animate');
        animationItems.forEach(item => {
            observer.observe(item)
        });

        $('section').each(function(index) {
            // let $this = index;
            let hasAnimation = $(this).find('.animate').length
            if (hasAnimation > 0) {
                $(this).removeClass('overflow-hidden')
            } else {
                $(this).addClass('overflow-hidden')
            }
            // console.log($(this));
        })
    }
}

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {
    37: 1,
    38: 1,
    39: 1,
    40: 1
};

function preventDefault(e) {
    e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
    window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
        get: function() {
            supportsPassive = true;
        }
    }));
} catch (e) {}

var wheelOpt = supportsPassive ? {
    passive: false
} : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
function disableScroll() {
    window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
    window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

// call this to Enable
function enableScroll() {
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
    window.removeEventListener('touchmove', preventDefault, wheelOpt);
    window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}

function moveHtml() {
    $('.news-page .newspager').appendTo('.news-page .news-list.section-bot');
    $('.shareholder-page .oilPrice').appendTo('.shareholder-page #oil-price');
    $('.shareholder-page .goldPrice').appendTo('.shareholder-page #gold-price');
}

function loadMoreItem(el) {
    var list = el;
    var numToShow = 9;
    var button = $(".btn-load-more");
    var numInList = list.length;
    list.hide();
    if (numInList > numToShow) {
        button.show();
    }
    list.slice(0, numToShow).show();

    button.on('click', function() {
        var showing = list.filter(':visible').length;
        list.slice(showing - 1, showing + numToShow).fadeIn();
        var nowShowing = list.filter(':visible').length;
        if (nowShowing >= numInList) {
            button.hide();
        }
    });
}