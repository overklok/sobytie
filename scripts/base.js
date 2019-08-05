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

const SUBSCRIBE_PROCEED_BUTTON_ID = "subscribeProceed";
const MODAL_LINKS_CLASS = "modal-links";
const MODAL_FORM_CLASS = "modal-form";
const MODAL_LINKS_HIDDEN_CLASS = "modal-links_hidden";
const MODAL_FORM_HIDDEN_CLASS = "modal-form_hidden";

$(document).ready(function() {
    $(window).resize(onWindowResize);
    onWindowResize();

    initHeadernavMenu();

    initModals();
});

function onWindowResize() {
    var width = $(window).width();

    $.each(BS_SIZES_FROM, function(key, value) {
        if (width > value) BS_SIZE_CURRENT = key;
    });

    $(window).trigger("bs-change", [BS_SIZE_CURRENT]);
}

function initModals() {
    $('.modal[data-timeout]').each(function(index, item) {
        var $item = $(item);

        var timeout = $item.data("timeout");

        if (timeout && typeof timeout === "number") {
            setTimeout(function() {
                $(item).modal();
            }, timeout);
        }
    });

    $("#" + SUBSCRIBE_PROCEED_BUTTON_ID).click(function() {
        $("." + MODAL_LINKS_CLASS).addClass(MODAL_LINKS_HIDDEN_CLASS);
        $("." + MODAL_FORM_CLASS).removeClass(MODAL_FORM_HIDDEN_CLASS);
    });
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