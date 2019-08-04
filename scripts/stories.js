const TAG_ITEM_CLASS = "mcard";

const TAG_ITEM_CONTAINER_CLASS = "blk-stories__col";
const TAG_ITEM_ROW_CLASS = "blk-story-row";

var _TAG_CURRENT = undefined;
var _QRY_CURRENT = undefined;

$(document).ready(function() {
    initTagItemContainers();

    filterFunc("*");
});

function initTagItemContainers() {
    $containers = $("." + TAG_ITEM_CONTAINER_CLASS);

    $containers.each(function (index, item) {
        var $item = $(item);

        var classes = item.classList;

        $.each(classes, (function (index, klass) {
            var parts = klass.split("-");

            if (parts[0] === "col") {
                if (parts.length === 2) {$item.data("sz",       parts[1]); return;}
                if (parts[1] === "sm")  {$item.data("sz-sm",    parts[2]); return;}
                if (parts[1] === "md")  {$item.data("sz-md",    parts[2]); return;}
                if (parts[1] === "lg")  {$item.data("sz-lg",    parts[2]); return;}
                if (parts[1] === "xl")  {$item.data("sz-xl",    parts[2]);}
            }
        }));
    });
}

function filterFunc(tag, qry) {
    if (tag == null) tag = _TAG_CURRENT;
    if (tag == null) tag = "*";

    if (qry == null) qry = _QRY_CURRENT;
    if (qry == null) qry = "*";
    if (qry === "")  qry = "*";

    var $all = $("." + TAG_ITEM_CLASS);
    var $irrelevant, $relevant, $irr_on_rel = $();

    if (tag === "*") {
        $irrelevant = $();
        $relevant = $all;
    } else {
        $irrelevant = $("." + TAG_ITEM_CLASS + ":not([data-tag='" + tag + "'])");
        $relevant = $("." + TAG_ITEM_CLASS + "[data-tag='" + tag + "']");
    }

    if (qry && qry !== "*") {
        var ftr = function(obj) {
            var is_h2 = $(obj).find('h2:first').text().toLowerCase().indexOf(qry.toLowerCase()) >=0;
            var is_h3 = $(obj).find('h3:first').text().toLowerCase().indexOf(qry.toLowerCase()) >=0;

            return is_h2 || is_h3;
        };

        $irr_on_rel = $relevant.filter(function () {return !ftr(this)});
        $relevant = $relevant.filter(function () {return ftr(this)});
    }

    _TAG_CURRENT = tag;
    _QRY_CURRENT = qry;

    $irrelevant.hide();
    $irr_on_rel.hide();
    $relevant.show();

    $irrelevant.attr("data-vis", "0");
    $irr_on_rel.attr("data-vis", "0");
    $relevant.attr("data-vis", "1");

    $irrelevant.removeClass("non-invis");
    $irr_on_rel.removeClass("non-invis");
    $relevant.addClass("non-invis");

    ensureEmptyTagItemContainers();
    spreadTagItemRows();
    ensureEmptyTagItemRows();

    return $all.length - $relevant.length;
}

function ensureEmptyTagItemContainers() {
    $("." + TAG_ITEM_CONTAINER_CLASS).each(function(index, item) {
        if ($(item).find("." + TAG_ITEM_CLASS + "[data-vis=1]").length === 0) {
            $(item).hide();
            $(item).attr("data-vis", "0");
            $(item).removeClass("non-invis");
        } else {
            $(item).show();
            $(item).attr("data-vis", "1");
            $(item).addClass("non-invis");
        }
    });
}

function spreadTagItemRows() {
    $("." + TAG_ITEM_ROW_CLASS).each(function (index_r, row) {
        var $row = $(row);

        var $containers = $row.find("> ." + TAG_ITEM_CONTAINER_CLASS + "[data-vis=1]");

        var relevant_num    = $containers.length,
            irrelevant_num  = $row.find("> ." + TAG_ITEM_CONTAINER_CLASS).length;

        var sums = {
            "xl": 0,
            "lg": 0,
            "md": 0,
            "sm": 0,
            "xs": 0
        };

        var perks = {
            "xl": 0,
            "lg": 0,
            "md": 0,
            "sm": 0,
            "xs": 0
        };

        /// вычислить суммарное количество колонок
        $containers.each(function(index_c, container) {
            var $container = $(container);

            var sizes = getAllContainerSizes($container);

            $.each(sizes, function(key, value) {
                sums[key] += Number(value);
            });
        });

        /// вычислить надбавки по колонкам
        $containers.each(function(index_c, container) {
            var $container = $(container);

            var sizes = getAllContainerSizes($container);

            $.each(sizes, function(key, value) {
                /// остаток колонок
                var diff = BS_COL_NUMBER - sums[key];

                /// отрицательный остаток недопустим
                if (diff < 0) return;

                /// делим его между оставшимися элементами
                var perk = diff / relevant_num;

                /// проверить, является ли надбавка целым числом
                if (!Number.isInteger(perk)) {
                    console.warn("Non-(integer/positive) premium: ", perk);
                    perks[key] = 0;
                } else {
                    perks[key] = perk;
                }
            });
        });

        /// переназначить колоночные классы
        $containers.each(function(index_c, container) {
            var $container = $(container);

            var sizes = getAllContainerSizes($container);

            removeAllColumnClasses($container);

            $.each(sizes, function(key, value) {
                var sz = key === "xs" ? "" : key + "-";
                var val = Number(value) + perks[key];

                $container.addClass("col-" + sz + val);
            });
        });
    });
}

function ensureEmptyTagItemRows() {
    $("." + TAG_ITEM_ROW_CLASS).each(function(index, item) {
        if ($(item).find("." + TAG_ITEM_CONTAINER_CLASS + "[data-vis=1]").length === 0) {
            $(item).hide();
            $(item).attr("data-vis", "0");
            $(item).removeClass("non-invis");
        } else {
            $(item).show();
            $(item).attr("data-vis", "1");
            $(item).addClass("non-invis");
        }
    });
}

function removeAllColumnClasses($container) {
    var szs = ["sm", "md", "lg", "xl"];

    for (var c = 0; c <= 12; c++) {
        $.each(szs, function(index, sz) {
            $container.removeClass("col-" + sz + "-" + c);
        });

        $container.removeClass("col-" + c);
    }
}

function getAllContainerSizes($container) {
    var sizes = {
        "xl": $container.data("sz-xl"),
        "lg": $container.data("sz-lg"),
        "md": $container.data("sz-md"),
        "sm": $container.data("sz-sm"),
        "xs": $container.data("sz")
    };

    var skip = true;

    $.each(sizes, function(_key, _value) {
        var size = undefined;

        $.each(sizes, function(key, value) {
            /// пропустить размеры, идущие до BS_SIZE_CURRENT
            if (key !== _key && skip) return;
            skip = false;

            if (value) {
                size = value;
                skip = true;
            }
        });

        if (!size) size = BS_COL_NUMBER;

        sizes[_key] = size;
    });

    return sizes;
}