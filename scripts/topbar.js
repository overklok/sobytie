const TOPBAR_CLASSES = {
    MAIN: "topbar",
    PANE: "topbar__pane",
    BTN: "topbar__btn",
    BTN_HIDDEN: "topbar__btn_hidden",

    MENU: {
        MAIN: "topbar__menu",
        COLLAPSED: "topbar__menu_collapsed",
        SWITCH: "topbar__menu-switch",
        ICON: "topbar__menu-burger",
        ICON_OPENED: "burger_opened",
        OPEN: "topbar__menu-open",
        TITLE: "topbar__menu-title"
    },

    SEARCH: {
        MAIN: "topbar__search",
        COLLAPSED: "topbar__search_collapsed",
        SWITCH: "topbar__search-switch",
        ICON: "topbar__search-icon",
        ICON_OPENED: "search_opened"
    }
};

/* SEARCH */
const TOPBAR_SEARCH_INPUT_ID = "topbar-search-input";

/* MISC */
const SECTION_TO_DIM_ID = "stories";
const CONTAINER_DIMMED_CLASS = "container_dimmed";

const LOADABLE_LIST_CLASS = "loadable-list";
const NOT_LOADED_CLASS = "not-loaded";

const FADE_TIME = 300;

var TOPBAR_MENU_OPEN_TITLE_DEFAULT = undefined;

if (!filterFunc) {
    var filterFunc = function () {
        console.warn("No filtering function has been defined")
    };
}

$(document).ready(function() {
    initTopbarPane();
    initTopbarMenuItems();
    initTopbarBtn();
});

function initTopbarPane() {
    var $pane = $("." + TOPBAR_CLASSES.PANE);

    // Menu
    if ($("." + TOPBAR_CLASSES.MENU.MAIN).length) {
        clearIrrelevantItems($pane, TOPBAR_CLASSES.MENU.MAIN, TOPBAR_CLASSES.MENU.COLLAPSED);
        checkMenuIconState($pane);

        $("." + TOPBAR_CLASSES.MENU.SWITCH).click(function (evt) {
            onMenuSwitchClick($(evt.target));
        });
    }

    // Search
    $("." + TOPBAR_CLASSES.SEARCH.SWITCH).click(function(evt) {
        onSearchSwitchClick($(evt.target));
    });

    $("#" + TOPBAR_SEARCH_INPUT_ID).keyup(function(evt) {
        var target = $(evt.target);

        if (target.val()) {
            $("." + TOPBAR_CLASSES.BTN).removeClass(TOPBAR_CLASSES.BTN_HIDDEN);
        } else {
            // $("." + TOPBAR_CLASSES.BTN).addClass(TOPBAR_CLASSES.BTN_HIDDEN);
        }
    });
}

function initTopbarMenuItems() {
    $("." + TOPBAR_CLASSES.MENU.MAIN).click(function (evt) {
        evt.preventDefault();

        var $target = $(evt.target);

        var tag = $target.data("story-tag");

        if (tag) {
            var item_num = filterFunc(tag, "*");

            setLoadingClasses(item_num > 0);
            onMenuSwitchClick($target);
            setTopbarMenuTitle(tag !== "*" ? $target.text() : null);
        }
    });
}

function initTopbarBtn() {
    $("." + TOPBAR_CLASSES.BTN).click(function (evt) {
        evt.preventDefault();

        var qry = $("#" +TOPBAR_SEARCH_INPUT_ID).val();

        if (qry != null) {
            var item_num = filterFunc(null, qry);
            setLoadingClasses(item_num > 0);
        }
    })
}

function onMenuSwitchClick($target) {
    var $relevant = $target.parents("." + TOPBAR_CLASSES.MENU.MAIN);
    var $pane = $relevant.parents("." + TOPBAR_CLASSES.PANE);

    var $icon = $relevant.find("." + TOPBAR_CLASSES.MENU.ICON);

    var $section = $("#" + SECTION_TO_DIM_ID);

    if ($relevant.hasClass(TOPBAR_CLASSES.MENU.COLLAPSED)) {
        $relevant.removeClass(TOPBAR_CLASSES.MENU.COLLAPSED);
        $icon.addClass(TOPBAR_CLASSES.MENU.ICON_OPENED);
        $section.addClass(CONTAINER_DIMMED_CLASS);
    } else {
        $relevant.addClass(TOPBAR_CLASSES.MENU.COLLAPSED);
        $icon.removeClass(TOPBAR_CLASSES.MENU.ICON_OPENED);
        $section.removeClass(CONTAINER_DIMMED_CLASS);
    }

    clearIrrelevantItems($pane, TOPBAR_CLASSES.MENU.MAIN, TOPBAR_CLASSES.MENU.COLLAPSED);
}

function onSearchSwitchClick($target) {
    $relevant = $target.parents("." + TOPBAR_CLASSES.SEARCH.MAIN);
    $pane = $relevant.parents("." + TOPBAR_CLASSES.PANE);
    $btn = $("." + TOPBAR_CLASSES.BTN);
    $input = $("#" + TOPBAR_SEARCH_INPUT_ID);

    $icon = $relevant.find("." + TOPBAR_CLASSES.SEARCH.ICON);

    if ($relevant.hasClass(TOPBAR_CLASSES.SEARCH.COLLAPSED)) {
        $relevant.removeClass(TOPBAR_CLASSES.SEARCH.COLLAPSED);
        $icon.addClass(TOPBAR_CLASSES.SEARCH.ICON_OPENED);

        $input.focus();

        if ($input.val()) {
            $btn.removeClass(TOPBAR_CLASSES.BTN_HIDDEN);
        }
    } else {
        $relevant.addClass(TOPBAR_CLASSES.SEARCH.COLLAPSED);
        $icon.removeClass(TOPBAR_CLASSES.SEARCH.ICON_OPENED);
        $btn.addClass(TOPBAR_CLASSES.BTN_HIDDEN);
    }

    clearIrrelevantItems($pane, TOPBAR_CLASSES.SEARCH.MAIN, TOPBAR_CLASSES.SEARCH.COLLAPSED, true);
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
    $relevant = $pane.find("." + TOPBAR_CLASSES.MENU.MAIN);
    $icon = $relevant.find("." + TOPBAR_CLASSES.MENU.ICON);

    if ($relevant.hasClass(TOPBAR_CLASSES.MENU.COLLAPSED)) {
        $icon.removeClass(TOPBAR_CLASSES.MENU.ICON_OPENED);
    } else {
        $icon.addClass(TOPBAR_CLASSES.MENU.ICON_OPENED);
    }
}

function setTopbarMenuTitle(text) {
    // сохранить заголовок меню по умолчанию
    if (TOPBAR_MENU_OPEN_TITLE_DEFAULT == null) {
        TOPBAR_MENU_OPEN_TITLE_DEFAULT = $("." + TOPBAR_CLASSES.MENU.OPEN + " > ." + TOPBAR_CLASSES.MENU.TITLE).text();
    }

    if (text != null) {
        $("." + TOPBAR_CLASSES.MENU.OPEN + " > ." + TOPBAR_CLASSES.MENU.TITLE).text(text);
    } else {
        $("." + TOPBAR_CLASSES.MENU.OPEN + " > ." + TOPBAR_CLASSES.MENU.TITLE).text(TOPBAR_MENU_OPEN_TITLE_DEFAULT);
    }
}

function setLoadingClasses(on) {
    var $loadable = $("." + LOADABLE_LIST_CLASS);

    if (!$loadable.hasClass(NOT_LOADED_CLASS) || $loadable.data("loaded") === "1") {
        $loadable.data("loaded", "1");
    }

    var list_loaded = $loadable.data("loaded") === "1";

    if (on) {
        $loadable.removeClass(NOT_LOADED_CLASS);
    } else {
        if (list_loaded) {
            $loadable.addClass(NOT_LOADED_CLASS);
        }
    }
}