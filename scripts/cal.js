const FADE_TIME = 200;

const MOBILE_TO = 991.98; /* md */

const CLASS_SCHEDULE = "blk-schedule";
const CLASS_PAGECTRL_BACK = "pagectrl__back";
const CLASS_PAGECTRL_BACK_CAL = "pagectrl__back_cal";

const ID_EVENTCARD_M_WRAP = "eventcard-active";

const EVENTCARD_CLASSES = {
    BLOCK: "eventcard",
    BTN_CLOSE: "eventcard__button-close"
};

const CAL_CLASSES = {
    BLOCK: "cal",

    _SELECTABLE: "cal_selectable",

    EVENT: "cal__event",
    EVENT_LINK: "cal__event__link",
    EVENT_SELECTED: "cal__event_selected",

    TABLE_HEAD: "cal__table-head",
    TABLE_WRAP: "cal__table_wrap",
    DETAILS_WRAP: "cal__details_wrap",

    COLUMN: "cal__col",
    COLUMN_DAY: "cal__col_day",

    DAY: "cal__day",

    EVENT_CLOSED: "cal__event_closed",
    EVENT_CANCELLED: "cal__event_cancelled",

    COL_CLOSED: "cal__col_closed",
    COL_CANCELLED: "cal__col_cancelled",

    BG: "cal__bg"
};

const DATE_SELECTED_CONTENT_CLASS = "date-selected-content";
const DATE_SELECTED_PREFIX_CLASS = "date-selected-prefix";
const DATE_SELECTED_DEFAULT_CLASS = "date-selected-default";

const DATE_SELECTED_LOCKABLE_TARGET_ID = "calSelectLockable";
const DATE_SELECTED_LOCKABLE_TARGET_LOCKED_CLASS = "blk-service__step_inactive";

const BTN_CLASS = "btn";
const BTN_INACTIVE_CLASS = "btn-inactive";

var G_EVENTCARD_ACTIVE = undefined;
var G_IS_MOBILE = undefined;

$(document).ready(function() {
    initEvents();
    initAllEventcards();
    initBackClick();

    initSelectable();

    G_IS_MOBILE = ($(window).width() < MOBILE_TO);

    $(window).resize(onWindowResize);

    checkHash();
});

/**
 * Инциализировать календарь
 */
function initEvents() {
    $("." + EVENTCARD_CLASSES.BLOCK).hide();

    var $events = $("." + CAL_CLASSES.EVENT_LINK);

    $events.on('click', onEventClick);
}

/**
 * Иницализировать все карточки событий
 */
function initAllEventcards() {
    $eventcard_close_btns = $("." + EVENTCARD_CLASSES.BTN_CLOSE);

    $eventcard_close_btns.click(onEventcardCloseClick);
}

function initBackClick() {
    $("." + CLASS_PAGECTRL_BACK).click(function (evt) {
        if ($(evt.target).hasClass(CLASS_PAGECTRL_BACK_CAL))
        evt.preventDefault();

        closeActiveEventcard();
    })
}

function initSelectable() {
    $("." + DATE_SELECTED_PREFIX_CLASS).hide();

    $("." + CAL_CLASSES._SELECTABLE + " ." + CAL_CLASSES.EVENT_LINK).click(function(evt) {
        evt.preventDefault();

        var title = undefined;

        var $target = $(evt.target);
        var $event = $target.parent("." + CAL_CLASSES.EVENT);

        if ($event.hasClass(CAL_CLASSES.EVENT_SELECTED)) {
            $event.removeClass(CAL_CLASSES.EVENT_SELECTED);
        } else {
            $("." + CAL_CLASSES.EVENT_SELECTED).removeClass(CAL_CLASSES.EVENT_SELECTED);

            title = $event.data("title");

            if (title) {
                $event.addClass(CAL_CLASSES.EVENT_SELECTED);
            }
        }

        var $lockable = $("#" + DATE_SELECTED_LOCKABLE_TARGET_ID);

        if (title) {
            $("." + DATE_SELECTED_DEFAULT_CLASS).hide();
            $("." + DATE_SELECTED_PREFIX_CLASS).show();
            $("." + DATE_SELECTED_CONTENT_CLASS).show().text(title);

            $lockable.removeClass(DATE_SELECTED_LOCKABLE_TARGET_LOCKED_CLASS);
            $lockable.find("." + BTN_CLASS).removeClass(BTN_INACTIVE_CLASS);
        } else {
            $("." + DATE_SELECTED_CONTENT_CLASS).hide();
            $("." + DATE_SELECTED_PREFIX_CLASS).hide();
            $("." + DATE_SELECTED_DEFAULT_CLASS).show();

            $lockable.addClass(DATE_SELECTED_LOCKABLE_TARGET_LOCKED_CLASS);
            $lockable.find("." + BTN_CLASS).addClass(BTN_INACTIVE_CLASS);
        }
    });
}

function onWindowResize(evt) {
    var width = $(window).width();

    if (width >= MOBILE_TO) {
        if (G_IS_MOBILE === true) {
            G_IS_MOBILE = false;
            rebuildActiveEventcard();
        }
    } else {
        if (G_IS_MOBILE === false) {
            G_IS_MOBILE = true;
            rebuildActiveEventcard();
        }
    }
}

function checkHash() {
    if (window.location.hash.startsWith("#eventcard-")) {
        var eventcard_id = window.location.hash.split("eventcard-")[1];

        var eventcard = getEventcardById(eventcard_id);

        openEventcard(eventcard, null, true);
    }
}

function onEventClick(evt) {
    evt.preventDefault();

    /// Get current Event and parent Calendar

    // ":first" is just to ensure if proper object has been selected
    var $event = $(evt.target).parent("." + CAL_CLASSES.EVENT);

    /// Get Eventcard ID current Event links to and corresponding Eventcard
    var $eventcard = getEventcardByEvent($event);
    if (!$eventcard) return;

    openEventcard($eventcard, $event);
}

function onEventcardCloseClick(evt) {
    evt.preventDefault();

    var $btn = $(evt.target);

    // ":first" is just to ensure if proper object has been selected
    var $eventcard = $btn.parents("." + EVENTCARD_CLASSES.BLOCK + ":first");

    closeEventcard($eventcard);
}

function openEventcard($eventcard, $event, noscroll) {
    if (!$event) {
        $event = getEventByEventcard($eventcard);
    }

    /// Get Column container for current Event
    var $event_col = $event.parent("." + CAL_CLASSES.COLUMN);
    if (!$event_col[0]) return;

    /// Get child index of current Column container
    var col_idx = $event_col.index();

    /// Get day (and its column) responsible to current Event in table heading
    var $cal__col_day = $("." + CAL_CLASSES.COLUMN_DAY + ":eq(" + col_idx + ")");
    var $col_day = $cal__col_day.find("." + CAL_CLASSES.DAY);
    if (!$cal__col_day[0] || !$col_day[0]) return;

    /// Check if current Event has "closed" or "cancelled" status
    var is_closed = $event.hasClass(CAL_CLASSES.EVENT_CLOSED),
        is_cancelled = $event.hasClass(CAL_CLASSES.EVENT_CANCELLED);

    /// Apply the status to the heading of the table
    if (is_closed) {
        $cal__col_day.addClass(CAL_CLASSES.COL_CLOSED);
    } else if (is_cancelled) {
        $cal__col_day.addClass(CAL_CLASSES.COL_CANCELLED);
    }

    if (G_IS_MOBILE) {
        openEventcardMobile($eventcard, noscroll);
    } else {
        openEventcardFull($eventcard, $col_day);
    }

    G_EVENTCARD_ACTIVE = $eventcard;
    window.location.hash = "eventcard-" + $eventcard.data("id");
}

function closeEventcard($eventcard, noscroll) {
    if (G_IS_MOBILE) {
        closeEventcardMobile($eventcard);
    } else {
        closeEventcardFull($eventcard);
    }

    G_EVENTCARD_ACTIVE = undefined;
    window.location.hash = " ";

    if (!noscroll) {
        scrollToElement($("." + CLASS_SCHEDULE));
    }
}

function openEventcardFull($eventcard, $col_day) {
    /// Hide Calendar, show Eventcard, add background to the heading of the column
    $("." + CAL_CLASSES.TABLE_WRAP).fadeOut(FADE_TIME);

    $eventcard.fadeIn(FADE_TIME);

    $("<div class='" + CAL_CLASSES.BG + "'></div>")
        .hide().css({top: "110%"})
        .prependTo($col_day)
        .fadeIn(FADE_TIME).animate({top: "0"});
}

function openEventcardMobile($eventcard, noscroll) {
    var $pc_back = $("." + CLASS_PAGECTRL_BACK),
        $eventcard_wrap = $("#" + ID_EVENTCARD_M_WRAP);

    $("." + CLASS_SCHEDULE).hide();
    $pc_back.fadeIn(FADE_TIME);

    /// Hide Calendar, show Eventcard, add background to the heading of the column
    $("." + CAL_CLASSES.TABLE_WRAP).fadeOut(FADE_TIME);

    // $eventcard_wrap = $("#" + ID_EVENTCARD_M_WRAP);

    $eventcard = $eventcard.clone();

    $eventcard.find("." + EVENTCARD_CLASSES.BTN_CLOSE).click(onEventcardCloseClick);

    $eventcard_wrap.append($eventcard);
    $eventcard.fadeIn(FADE_TIME);

    if (!noscroll) {
        scrollToElement($eventcard_wrap);
    }
}

function closeEventcardFull($eventcard) {
    $("." + CLASS_SCHEDULE).show();

    $eventcard.fadeOut(FADE_TIME);
    $("." + CLASS_PAGECTRL_BACK).fadeOut(FADE_TIME);

    // Remove all backgrounds of table's heading
    $("." + CAL_CLASSES.BG).hide(0, function() {
        this.remove();

        // Remove possible status classes for ALL elements which has it
        $("." + CAL_CLASSES.COL_CLOSED).removeClass(CAL_CLASSES.COL_CLOSED);
        $("." + CAL_CLASSES.COL_CANCELLED).removeClass(CAL_CLASSES.COL_CANCELLED);
    });

    $("." + CAL_CLASSES.TABLE_WRAP).fadeIn(FADE_TIME);
}

function closeEventcardMobile($eventcard) {
    $("#" + ID_EVENTCARD_M_WRAP).empty();

    closeEventcardFull($eventcard);
}

function rebuildActiveEventcard() {
    if (G_EVENTCARD_ACTIVE) {
        var eventcard_id = G_EVENTCARD_ACTIVE.data("id");

        if (G_IS_MOBILE) {
            closeEventcardFull(G_EVENTCARD_ACTIVE);
        } else {
            closeEventcardMobile(G_EVENTCARD_ACTIVE);
        }

        openEventcard(getEventcardById(eventcard_id), null, true);
    }
}

function closeActiveEventcard() {
    if (G_EVENTCARD_ACTIVE) {
        closeEventcard(G_EVENTCARD_ACTIVE);
    }
}

function getEventcardById(eventcard_id) {
    var $eventcard = $("." + EVENTCARD_CLASSES.BLOCK + "[data-id=" + eventcard_id + "]");

    if (!$eventcard[0]) return;

    return $eventcard;
}

function getEventcardByEvent($event) {
    var eventcard_id = $event.data("eventcard-id");

    return getEventcardById(eventcard_id);
}

function getEventByEventcard($eventcard) {
    var eventcard_id = $eventcard.data("id");

    return $("." + CAL_CLASSES.EVENT + "[data-eventcard-id=" + eventcard_id + "]");
}

/**
 * Перемотать страницу к элементу
 *
 * @param $element
 */
function scrollToElement($element) {
    setTimeout(function() {
        $("body,html").animate({
            scrollTop: $element.offset().top
        }, FADE_TIME);
    }, FADE_TIME);
}