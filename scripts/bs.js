/**
 * Скрипт, отвечающий за отслеживание ресайза экрана
 *
 * Размеры экрана фиксируются по Bootstrap
 */

const BS_COL_NUMBER = 12;

const BS_SIZES_FROM = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200
};

var BS_SIZE_CURRENT = undefined;

$(document).ready(function() {
    $(window).resize(onWindowResize);
    onWindowResize();
});

function onWindowResize() {
    var width = $(window).width();

    $.each(BS_SIZES_FROM, function(key, value) {
        if (width > value) BS_SIZE_CURRENT = key;
    });

    $(window).trigger("bs-change", [BS_SIZE_CURRENT]);
}