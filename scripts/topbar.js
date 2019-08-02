const TOPBAR_CLASS = "topbar";
const TOPBAR_PANE_CLASS = "topbar__pane";
const TOPBAR_BTN_CLASS = "topbar__btn";

/* MENU */
const TOPBAR_MENU_CLASS = "topbar__menu";
const TOPBAR_MENU_COLLAPSED_CLASS = "topbar__menu_collapsed";

const TOPBAR_MENU_SWITCH_CLASS = "topbar__menu-switch";

const TOPBAR_MENU_ICON_CLASS = "topbar__menu-burger";
const TOPBAR_MENU_ICON_OPENED_CLASS = "burger_opened";

/* SEARCH */
const TOPBAR_SEARCH_CLASS = "topbar__search";
const TOPBAR_SEARCH_COLLAPSED_CLASS = "topbar__search_collapsed";

const TOPBAR_SEARCH_SWITCH_CLASS = "topbar__search-switch";

const TOPBAR_SEARCH_ICON_CLASS = "topbar__search-icon";
const TOPBAR_SEARCH_ICON_OPENED_CLASS = "search_opened";

const FADE_TIME = 300;

$(document).ready(function() {
    initTopbarMenu();
});

function initTopbarMenu() {
    var $pane = $("." + TOPBAR_PANE_CLASS);

    clearIrrelevantItems($pane, TOPBAR_MENU_CLASS, TOPBAR_MENU_COLLAPSED_CLASS);
    checkMenuIconState($pane);

    $("." + TOPBAR_MENU_SWITCH_CLASS).click(function(evt) {
        onMenuSwitchClick($(evt.target));
    });

    // clearIrrelevantItems($pane, TOPBAR_SEARCH_SWITCH_CLASS, TOPBAR_SEARCH_COLLAPSED_CLASS);

    $("." + TOPBAR_SEARCH_SWITCH_CLASS).click(function(evt) {
        onSearchSwitchClick($(evt.target));
    });
}

function onMenuSwitchClick($target) {
    $relevant = $target.parents("." + TOPBAR_MENU_CLASS);
    $pane = $relevant.parents("." + TOPBAR_PANE_CLASS);

    $icon = $relevant.find("." + TOPBAR_MENU_ICON_CLASS);

    if ($relevant.hasClass(TOPBAR_MENU_COLLAPSED_CLASS)) {
        $relevant.removeClass(TOPBAR_MENU_COLLAPSED_CLASS);
        $icon.addClass(TOPBAR_MENU_ICON_OPENED_CLASS);
    } else {
        $relevant.addClass(TOPBAR_MENU_COLLAPSED_CLASS);
        $icon.removeClass(TOPBAR_MENU_ICON_OPENED_CLASS);
    }

    clearIrrelevantItems($pane, TOPBAR_MENU_CLASS, TOPBAR_MENU_COLLAPSED_CLASS);
}

function onSearchSwitchClick($target) {
    $relevant = $target.parents("." + TOPBAR_SEARCH_CLASS);
    $pane = $relevant.parents("." + TOPBAR_PANE_CLASS);
    $btn = $("." + TOPBAR_BTN_CLASS);

    $icon = $relevant.find("." + TOPBAR_SEARCH_ICON_CLASS);

    if ($relevant.hasClass(TOPBAR_SEARCH_COLLAPSED_CLASS)) {
        $relevant.removeClass(TOPBAR_SEARCH_COLLAPSED_CLASS);
        $icon.addClass(TOPBAR_SEARCH_ICON_OPENED_CLASS);
    } else {
        $relevant.addClass(TOPBAR_SEARCH_COLLAPSED_CLASS);
        $icon.removeClass(TOPBAR_SEARCH_ICON_OPENED_CLASS);
    }

    clearIrrelevantItems($pane, TOPBAR_SEARCH_CLASS, TOPBAR_SEARCH_COLLAPSED_CLASS, true);
}

function checkSearchBtn($target) {
    $relevant = $target.parents("." + TOPBAR_SEARCH_CLASS);
    $btn = $("." + TOPBAR_BTN_CLASS);

    if ($relevant.hasClass(TOPBAR_SEARCH_COLLAPSED_CLASS)) {
        // TODO: anim
        $btn.hide();
    } else {
        // TODO: anim
        $btn.show();
    }
}

function clearIrrelevantItems($pane, klass, collapsed_klass, nofade) {
    $relevant = $pane.find("." + klass);

    $irrelevant = $pane.find("> :not(." + klass + ")");

    if ($relevant.hasClass(collapsed_klass)) {
        if (nofade) $irrelevant.show();
        else        $irrelevant.fadeIn(FADE_TIME);
    } else {
        if (nofade) $irrelevant.hide();
        else        $irrelevant.fadeOut(FADE_TIME);
    }
}

function checkMenuIconState($pane) {
    $relevant = $pane.find("." + TOPBAR_MENU_CLASS);
    $icon = $relevant.find("." + TOPBAR_MENU_ICON_CLASS);

    if ($relevant.hasClass(TOPBAR_MENU_COLLAPSED_CLASS)) {
        $icon.removeClass(TOPBAR_MENU_ICON_OPENED_CLASS);
    } else {
        $icon.addClass(TOPBAR_MENU_ICON_OPENED_CLASS);
    }
}