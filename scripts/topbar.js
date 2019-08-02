const TOPBAR_CLASS = "topbar";
const TOPBAR_PANE_CLASS = "topbar__pane";
const TOPBAR_BTN_CLASS = "topbar__btn";

const TOPBAR_BTN_HIDDEN_CLASS = "topbar__btn_hidden";

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

const TOPBAR_SEARCH_INPUT_ID = "topbar-search-input";

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

    $("#" + TOPBAR_SEARCH_INPUT_ID).keyup(function(evt) {
        var tgt = $(evt.target);

        if (tgt.val()) {
            $("." + TOPBAR_BTN_CLASS).removeClass(TOPBAR_BTN_HIDDEN_CLASS);
        } else {
            $("." + TOPBAR_BTN_CLASS).addClass(TOPBAR_BTN_HIDDEN_CLASS);
        }
    })
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

        if ($("#" + TOPBAR_SEARCH_INPUT_ID).val()) {
            $btn.removeClass(TOPBAR_BTN_HIDDEN_CLASS);
        }
    } else {
        $relevant.addClass(TOPBAR_SEARCH_COLLAPSED_CLASS);
        $icon.removeClass(TOPBAR_SEARCH_ICON_OPENED_CLASS);
        $btn.addClass(TOPBAR_BTN_HIDDEN_CLASS);
    }

    clearIrrelevantItems($pane, TOPBAR_SEARCH_CLASS, TOPBAR_SEARCH_COLLAPSED_CLASS, true);
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