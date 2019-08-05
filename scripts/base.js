/**
 * Базовый скрипт для динамических страниц
 */

const HEADERNAV_CLASSES = {
    MAIN: "headernav",
    _COLLAPSED: "headernav_collapsed"
};

const HEADERSWITCH_CLASSES = {
    BURGER: "headerswitch__burger",
    BURGER_OPENED: "burger_opened"
};

const BODY_NOSCROLL_CLASS = "noscroll";

$(document).ready(function() {
    initHeadernavMenu();
});

function initHeadernavMenu() {
    $("." + HEADERSWITCH_CLASSES.BURGER).click(function() {
        switchHeadernavMenu();
    });
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