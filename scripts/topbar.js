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

const TOPBAR_MENU_OPEN_CLASS = "topbar__menu-open";
const TOPBAR_MENU_TITLE_CLASS = "topbar__menu-title";

/* SEARCH */
const TOPBAR_SEARCH_CLASS = "topbar__search";
const TOPBAR_SEARCH_COLLAPSED_CLASS = "topbar__search_collapsed";

const TOPBAR_SEARCH_SWITCH_CLASS = "topbar__search-switch";

const TOPBAR_SEARCH_ICON_CLASS = "topbar__search-icon";
const TOPBAR_SEARCH_ICON_OPENED_CLASS = "search_opened";

const TOPBAR_SEARCH_INPUT_ID = "topbar-search-input";

/* MISC */
const SECTION_TO_DIM_ID = "stories";
const CONTAINER_DIMMED_CLASS = "container_dimmed";

const LOADABLE_LIST_CLASS = "loadable-list";
const NOT_LOADED_CLASS = "not-loaded";

const FADE_TIME = 300;

var TOPBAR_MENU_OPEN_TITLE_DEFAULT = undefined;

$(document).ready(function() {
    initTopbarMenu();
    initTopbarMenuItems();
    initTopbarBtn();
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
        var target = $(evt.target);

        if (target.val()) {
            $("." + TOPBAR_BTN_CLASS).removeClass(TOPBAR_BTN_HIDDEN_CLASS);
        } else {
            // $("." + TOPBAR_BTN_CLASS).addClass(TOPBAR_BTN_HIDDEN_CLASS);
        }
    });
}

function initTopbarMenuItems() {
    $("." + TOPBAR_MENU_CLASS).click(function (evt) {
        evt.preventDefault();

        var $target = $(evt.target);

        var tag = $target.data("story-tag");

        if (tag) {
            var item_num = filterStories(tag);
            setLoadingClasses(item_num > 0);
            onMenuSwitchClick($target);
            setTopbarMenuTitle(tag !== "*" ? $target.text() : null);
        }
    });
}

function initTopbarBtn() {
    $("." + TOPBAR_BTN_CLASS).click(function (evt) {
        evt.preventDefault();

        var qry = $("#" +TOPBAR_SEARCH_INPUT_ID).val();

        if (qry != null) {
            var item_num = filterStories(null, qry);
            setLoadingClasses(item_num > 0);
        }
    })
}

function onMenuSwitchClick($target) {
    var $relevant = $target.parents("." + TOPBAR_MENU_CLASS);
    var $pane = $relevant.parents("." + TOPBAR_PANE_CLASS);

    var $icon = $relevant.find("." + TOPBAR_MENU_ICON_CLASS);

    var $section = $("#" + SECTION_TO_DIM_ID);

    if ($relevant.hasClass(TOPBAR_MENU_COLLAPSED_CLASS)) {
        $relevant.removeClass(TOPBAR_MENU_COLLAPSED_CLASS);
        $icon.addClass(TOPBAR_MENU_ICON_OPENED_CLASS);
        $section.addClass(CONTAINER_DIMMED_CLASS);
    } else {
        $relevant.addClass(TOPBAR_MENU_COLLAPSED_CLASS);
        $icon.removeClass(TOPBAR_MENU_ICON_OPENED_CLASS);
        $section.removeClass(CONTAINER_DIMMED_CLASS);
    }

    clearIrrelevantItems($pane, TOPBAR_MENU_CLASS, TOPBAR_MENU_COLLAPSED_CLASS);
}

function onSearchSwitchClick($target) {
    $relevant = $target.parents("." + TOPBAR_SEARCH_CLASS);
    $pane = $relevant.parents("." + TOPBAR_PANE_CLASS);
    $btn = $("." + TOPBAR_BTN_CLASS);
    $input = $("#" + TOPBAR_SEARCH_INPUT_ID);

    $icon = $relevant.find("." + TOPBAR_SEARCH_ICON_CLASS);

    if ($relevant.hasClass(TOPBAR_SEARCH_COLLAPSED_CLASS)) {
        $relevant.removeClass(TOPBAR_SEARCH_COLLAPSED_CLASS);
        $icon.addClass(TOPBAR_SEARCH_ICON_OPENED_CLASS);

        $input.focus();

        if ($input.val()) {
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

function setTopbarMenuTitle(text) {
    // сохранить заголовок меню по умолчанию
    if (TOPBAR_MENU_OPEN_TITLE_DEFAULT == null) {
        TOPBAR_MENU_OPEN_TITLE_DEFAULT = $("." + TOPBAR_MENU_OPEN_CLASS + " > ." + TOPBAR_MENU_TITLE_CLASS).text();
    }

    if (text != null) {
        $("." + TOPBAR_MENU_OPEN_CLASS + " > ." + TOPBAR_MENU_TITLE_CLASS).text(text);
    } else {
        $("." + TOPBAR_MENU_OPEN_CLASS + " > ." + TOPBAR_MENU_TITLE_CLASS).text(TOPBAR_MENU_OPEN_TITLE_DEFAULT);
    }
}

function setLoadingClasses(on) {
    var $loadable = $("." + LOADABLE_LIST_CLASS);

    if (!$loadable.hasClass(NOT_LOADED_CLASS) || $loadable.data("loaded") === "1") {
        $loadable.data("loaded", "1");
    }

    var list_loaded = $loadable.data("loaded") === "1";

    if (!on) {
        $loadable.removeClass(NOT_LOADED_CLASS);
    } else {
        if (list_loaded) {
            $loadable.addClass(NOT_LOADED_CLASS);
        }
    }
}