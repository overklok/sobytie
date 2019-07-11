const EVENTCARD_CLASSES = {
    BLOCK: "eventcard",
    BTN_CLOSE: "eventcard__button-close"
};

const CAL_CLASSES = {
    BLOCK: "cal",
    EVENT: "cal__event",

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

$(document).ready(function() {
    initAllCals();
    initAllEventcards();
});

function initAllCals() {
    $("." + EVENTCARD_CLASSES.BLOCK).hide();

    var $events = $("." + CAL_CLASSES.EVENT);

    $events.click(function(evt) {
        /// Get current Event and parent Calendar

        // ":first" is just to ensure if proper object has been selected
        var $event = $(evt.target);
        var $cal = $event.parents("." + CAL_CLASSES.BLOCK + ":first");

        if (!$cal[0]) return;

        /// Get Eventcard ID current Event links to and corresponding Eventcard

        var eventcard_id = $event.data("eventcard-id");
        var $eventcard = $cal.find("." + EVENTCARD_CLASSES.BLOCK + "[data-id=" + eventcard_id + "]");

        /// Get Column container for current Event

        var $event_col = $event.parent("." + CAL_CLASSES.COLUMN);

        if (!$eventcard[0] || !$event_col[0] || !$event_col[0]) return;

        /// Get child index of current Column container

        var col_idx = $event_col.index();

        /// Get day (and its column) responsible to current Event in table heading

        var $cal__col_day = $cal.find("." + CAL_CLASSES.COLUMN_DAY + ":eq(" + col_idx + ")");
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

        /// Hide Calendar, show Eventcard, add background to the heading of the column

        $cal.find("." + CAL_CLASSES.TABLE_WRAP).hide();
        $eventcard.show();

        $col_day.prepend("<div class=" + CAL_CLASSES.BG + "></div>");
    });
}

function initAllEventcards() {
    $eventcard_close_btns = $("." + EVENTCARD_CLASSES.BTN_CLOSE);

    $eventcard_close_btns.click(function (evt) {
        evt.preventDefault();

        var $btn = $(evt.target);

        // ":first" is just to ensure if proper object has been selected
        var $eventcard = $btn.parents("." + EVENTCARD_CLASSES.BLOCK + ":first");
        var $cal = $btn.parents("." + CAL_CLASSES.BLOCK + ":first");

        // Remove possible status classes for ALL elements which has it
        $cal.find("." + CAL_CLASSES.COL_CLOSED).removeClass(CAL_CLASSES.COL_CLOSED);
        $cal.find("." + CAL_CLASSES.COL_CANCELLED).removeClass(CAL_CLASSES.COL_CANCELLED);

        // Remove all backgrounds of table's heading
        $cal.find("." + CAL_CLASSES.BG).remove();

        $eventcard.hide();
        $cal.find("." + CAL_CLASSES.TABLE_WRAP).show();
    });
}