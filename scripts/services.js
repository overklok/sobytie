const TAGLINK_CLASSES = {
    ITEM: "topbar__nav-item",
    ITEM_ACTIVE: "topbar__nav-item_active"
};

const TAG_ITEM_CLASS = "svclink";

$(document).ready(function() {
    initAllTaglinks();

    $('.grid').each(function(index, item) {
        console.log(item.id);

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
}

function highlightTaglink($taglink) {
    $("." + TAGLINK_CLASSES.ITEM_ACTIVE).removeClass(TAGLINK_CLASSES.ITEM_ACTIVE);
    $taglink.addClass(TAGLINK_CLASSES.ITEM_ACTIVE);
}

function filterTags(tag) {
    if (tag === "*") {
        $("." + TAG_ITEM_CLASS).show();
    } else {
        $("." + TAG_ITEM_CLASS + ":not([data-tag='" + tag + "'])").hide();
        $("." + TAG_ITEM_CLASS + "[data-tag='" + tag + "']").show();
    }

    $('.grid').masonry('layout')
}