const TAGLINK_CLASSES = {
    ITEM: "topbar__nav-item",
    ITEM_ACTIVE: "topbar__nav-item_active"
};

const TAG_ITEM_CLASS = "svclink";

const TAG_ITEM_CONTAINER_CLASS = "blk-services";
const TAG_ITEM_CONTAINER_HEADING_CLASS = "blk-services__heading";

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
});

function initAllTaglinks() {
    $("." + TAGLINK_CLASSES.ITEM).click(onTaglinkClick);
}

function onTaglinkClick(evt) {
    evt.preventDefault();

    var $taglink = $(evt.target);
    highlightTaglink($taglink);

    filterTags($taglink.data("svclink-tag"));
    describeTagItemContainerHeadings($taglink.data("desc"))
}

function highlightTaglink($taglink) {
    $("." + TAGLINK_CLASSES.ITEM_ACTIVE).removeClass(TAGLINK_CLASSES.ITEM_ACTIVE);
    $taglink.addClass(TAGLINK_CLASSES.ITEM_ACTIVE);
}

function filterTags(tag) {
    if (tag === "*") {
        var all = $("." + TAG_ITEM_CLASS);

        all.show();
        all.attr("data-vis", "1");
    } else {
        var irrelevant  = $("." + TAG_ITEM_CLASS + ":not([data-tag='" + tag + "'])"),
            relevant    = $("." + TAG_ITEM_CLASS + "[data-tag='" + tag + "']");

        irrelevant.hide();
        relevant.show();
        irrelevant.attr("data-vis", "0");
        relevant.attr("data-vis", "1");
    }

    ensureEmptyTagItemContainers();

    $('.grid').masonry('layout');
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