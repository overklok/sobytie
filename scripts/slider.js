const SLIDER_FNS = {
    STEPS: "steps",
    FADE: "fade",
    SLIDE: "slide"
};

const SLIDER_CLASSES = {
    BLOCK: "slider",
    ITEM: "slider__item",
    BULLETWRAP: "slider__bulletwrap",
    BULLET: "slider__bullet",
    BULLET_ACTIVE: "slider__bullet_active"
};

function Timer(fn, t) {
    var timerObj = setInterval(fn, t);

    this.stop = function() {
        if (timerObj) {
            clearInterval(timerObj);
            timerObj = null;
        }
        return this;
    };

    // start timer using current settings (if it's not already running)
    this.start = function() {
        if (!timerObj) {
            this.stop();
            timerObj = setInterval(fn, t);
        }
        return this;
    };

    // start with new interval, stop current interval
    this.reset = function(newT) {
        t = newT;
        return this.stop().start();
    };

    this.restart = function() {
        return this.stop().start();
    };
}

$(document).ready(function() {
    initAllSliders();
});

function initAllSliders() {
    var sliders = $("." + SLIDER_CLASSES.BLOCK);

    sliders.each(function (idx, slider) {
        initSlider($(slider));
    });
}

function initSlider($slider) {
    var slides = $slider.find("." + SLIDER_CLASSES.ITEM);
    var bullets = [];

    var bulletwrap = $("<div class='" + SLIDER_CLASSES.BULLETWRAP + "'></div>");

    slides.each(function (idx, slide) {
        var $slide = $(slide);

        $slide.data("id", idx);

        var bullet = $("<div class='" + SLIDER_CLASSES.BULLET + "' data-linkto='" + idx + "'></div>");

        if (idx === 0) {
            bullet.addClass(SLIDER_CLASSES.BULLET_ACTIVE);
            $slide.show();
        } else {
            $slide.hide();
        }

        bulletwrap.append(bullet);
        bullets.push(bullet);
    });

    $slider.append(bulletwrap);

    if (slides.length > 0) {
        runSlider($slider, slides, bullets);
    }
}

function runSlider($slider, slides, bullets) {
    var delay = Number($slider.data("delay")),
        dur = Number($slider.data("dur")),
        fn = $slider.data("fn");

    if (!fn) fn = SLIDER_FNS.FADE;

    var $bullet_active = $slider.find("." + SLIDER_CLASSES.BULLET_ACTIVE);

    var idx = Number($bullet_active.data("linkto"));

    if (idx == null || Number.isNaN(idx)) {
        throw new Error("Valid bullet not found");
    }

    if (dur < 0) dur = 0;
    if (delay < 0) delay = 0;

    if (dur > delay) dur = 0;

    if (dur === 0) {dur = 1; fn = SLIDER_FNS.STEPS;}

    if (delay && dur) {
        timer = new Timer(function() {
            idx = idx === slides.length ? 0 : idx + 1;   // reset idx
            slideTo($slider, slides, timer, idx, fn, dur);        // pass to next
        }, delay);
    }

    $.each(bullets, function(idx, $bullet) {
        $bullet.click(function(evt) {
            timer.restart();
            slideTo($slider, slides, timer, idx, fn, dur);
        });
    })
}

function slideTo($slider, slides, timer, idx_to, fn, dur) {
    var $bullet_active = $slider.find("." + SLIDER_CLASSES.BULLET_ACTIVE);
    var $bullet_new = $slider.find("." + SLIDER_CLASSES.BULLET + "[data-linkto='" + idx_to + "']");

    if (!$bullet_active[0] || !$bullet_new[0]) {
        return;
    }

    var idx_from = Number($bullet_active.data("linkto"));

    console.log(idx_from, idx_to);

    if (idx_from === idx_to) {
        timer.restart();
        return;
    }

    var $slide_from = $(slides[idx_from]),
        $slide_to = $(slides[idx_to]);

    $bullet_active.removeClass(SLIDER_CLASSES.BULLET_ACTIVE);
    $bullet_new.addClass(SLIDER_CLASSES.BULLET_ACTIVE);

    switch (fn) {
        case SLIDER_FNS.FADE: {
            $slide_from.fadeOut(dur);
            $slide_to.fadeIn(dur);
            break;
        }
        case SLIDER_FNS.SLIDE: {
            $slide_to.show();
            $slide_to.css({"left": "-100%"});
            $slide_to.animate({left: "0"}, dur);

            $slide_from.animate({left: "100%"}, dur, function() {
                $slide_from.hide();
                $slide_from.css({"left": "0"});
            });
            break;
        }
        default: {
            $slide_from.hide();
            $slide_to.show();
            break;
        }
    }
}