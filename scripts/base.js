/**
 * Базовый скрипт для динамических страниц
 */

// ====== BOOTSTRAP GLOBALS ====== //
const BS_COL_NUMBER = 12;

const BS_SIZES_FROM = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200
};

var BS_SIZE_CURRENT = undefined;

// ====== HEADERNAV GLOBALS ====== //

const HEADERNAV_CLASSES = {
    MAIN: "headernav",
    _COLLAPSED: "headernav_collapsed"
};

const HEADERSWITCH_CLASSES = {
    BURGER: "headerswitch__burger",
    BURGER_OPENED: "burger_opened"
};

const BODY_NOSCROLL_CLASS = "noscroll-xs";

$(document).ready(function() {
    $(window).resize(onWindowResize);
    onWindowResize();

    initHeadernavMenu();
});

function onWindowResize() {
    var width = $(window).width();

    $.each(BS_SIZES_FROM, function(key, value) {
        if (width > value) BS_SIZE_CURRENT = key;
    });

    $(window).trigger("bs-change", [BS_SIZE_CURRENT]);
}

function initHeadernavMenu() {
    $("." + HEADERSWITCH_CLASSES.BURGER).click(function() {
        switchHeadernavMenu();
    });

    initNoscrollForTouchscreen();
}

function initNoscrollForTouchscreen() {
    document.body.addEventListener('touchmove', function(evt) {
        if (BS_SIZE_CURRENT === "xs" && !isHeadernavMenuCollapsed()) {
            evt.preventDefault();
        }
    }, { passive: false });
}

function switchHeadernavMenu() {
    if (isHeadernavMenuCollapsed()) {
        openHeadernavMenu();
    } else {
        closeHeadernavMenu();
    }
}

function openHeadernavMenu() {
    $nav = $("." + HEADERNAV_CLASSES.MAIN);

    $nav.removeClass(HEADERNAV_CLASSES._COLLAPSED);
    $("." + HEADERSWITCH_CLASSES.BURGER).addClass(HEADERSWITCH_CLASSES.BURGER_OPENED);
    $("body").addClass(BODY_NOSCROLL_CLASS);
}

function closeHeadernavMenu() {
    $nav = $("." + HEADERNAV_CLASSES.MAIN);

    $nav.addClass(HEADERNAV_CLASSES._COLLAPSED);
    $("." + HEADERSWITCH_CLASSES.BURGER).removeClass(HEADERSWITCH_CLASSES.BURGER_OPENED);
    $("body").removeClass(BODY_NOSCROLL_CLASS);
}

function isHeadernavMenuCollapsed() {
    return $("." + HEADERNAV_CLASSES.MAIN).hasClass(HEADERNAV_CLASSES._COLLAPSED);
}