const TAGLINK_CLASSES = {
    ITEM: "topbar__nav-item",
    ITEM_ACTIVE: "topbar__nav-item_active"
};

const TAG_ITEM_CLASS = "svclink";

const TAG_ITEM_CONTAINER_CLASS = "blk-services";
const TAG_ITEM_CONTAINER_HEADING_CLASS = "blk-services__heading";

var _TAG_CURRENT = undefined;
var _QRY_CURRENT = undefined;

// TODO: Save filter to window.location.hash

$(document).ready(function() {
    initAllTaglinks();

    $('.grid').each(function(index, item) {
        $("#" + item.id).masonry({
          // options
          itemSelector: '#' + item.id + ' > .grid-item',
          columnWidth: '#' + item.id + ' > .grid-item',
          gutter: '#' + item.id + ' > .gutter-sizer'
        });
    });

    $(window).on("bs-change", onBsChange);
});

function onBsChange(evt, bs_size) {

}

function initAllTaglinks() {
    $("." + TAGLINK_CLASSES.ITEM).click(onTaglinkClick);
}

function onTaglinkClick(evt) {
    evt.preventDefault();

    var $taglink = $(evt.target);
    highlightTaglink($taglink);

    filterFunc($taglink.data("svclink-tag"), "*");
    describeTagItemContainerHeadings($taglink.data("desc"))
}

function highlightTaglink($taglink) {
    $("." + TAGLINK_CLASSES.ITEM_ACTIVE).removeClass(TAGLINK_CLASSES.ITEM_ACTIVE);
    $taglink.addClass(TAGLINK_CLASSES.ITEM_ACTIVE);
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
            return $(obj).find('.svclink__title:first').text().toLowerCase().indexOf(qry.toLowerCase()) >=0;
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

    ensureEmptyTagItemContainers();
    $('.grid').masonry('layout');

    return $all.length - $relevant.length;
}

function describeTagItemContainerHeadings(description) {
    $("." + TAG_ITEM_CONTAINER_CLASS).each(function(index, item) {
        $(item).find("." + TAG_ITEM_CONTAINER_HEADING_CLASS).find("span.aux").remove();

        if (description) {
            $(item).find("." + TAG_ITEM_CONTAINER_HEADING_CLASS).append(
                '<span class="aux">' + description + '</span>'
            );
        }
    });
}

function ensureEmptyTagItemContainers() {
    $("." + TAG_ITEM_CONTAINER_CLASS).each(function(index, item) {
        if ($(item).find("." + TAG_ITEM_CLASS + "[data-vis=1]").length === 0) {
            $(item).hide();
        } else {
            $(item).show();
        }
    });
}