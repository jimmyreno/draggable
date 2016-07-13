/*jslint browser: true*/
/*global $, jQuery, alert, console, this*/
(function ($) {

    'use strict';

    /**
     * The draggable plugin allows click-and-drag functionality on any element that is absolutely
     * positioned. The elements move by updating their absolutely positioned top and left values.
     * Elements trigger 'drag' events when moving. This events provides info on distance travelled.
     * The plugin is not touch-screen compatible.
     *
     * Example usage:
     *
     *      $('#my-draggable-element').draggable({mode: 'free'});
     *
     *      $('#my-draggable-element').on('drag', function(event, dragInfo) {
     *          .. do something with dragInfo
     *      });
     *
     * @param options
     *      mode: free | horizontal | vertical
     *
     * @returns {*|HTMLElement}
     */
    $.fn.draggable = function (options) {

        var defaults = { mode: 'free' },
            settings = $.extend(true, {}, defaults, options);

        $(this).each(function(i, el) {

            var touchDown = false,
                originalPosition = null,
                dragInfo = function(event) {
                    var x = event.originalEvent.x,
                        y = event.originalEvent.y,
                        dx,
                        dy;

                    dx = (x > originalPosition.x) ? 'right' : 'left';
                    dy = (y > originalPosition.y) ? 'down' : 'up';

                    return {
                        direction: {
                            x: dx,
                            y: dy
                        },
                        offset: {
                            x: x - originalPosition.x,
                            y: y - originalPosition.y
                        }
                    };
                };

            //console.log('creating draggable element: ');
            $(el).on('mousedown', function (event) {
                touchDown = true;
                originalPosition = {
                    x: event.originalEvent.x,
                    y: event.originalEvent.y
                };
                event.originalPosition = originalPosition;
            });

            $(el).on('mouseup mouseleave', function (e) {
                touchDown = false;
                originalPosition = null;
                if(event.dragged) {
                    event.preventDefault();
                }
            });

            $(el).on('mousemove', function (event, a, b) {
                if (!touchDown) {
                    return;
                }

                event.dragged = true;
                var info = dragInfo(event),
                    left = parseInt($(this)[0].style.left, 10),
                    top = parseInt($(this)[0].style.top, 10);

                // update position
                originalPosition = {
                    x: event.originalEvent.x,
                    y: event.originalEvent.y
                };

                if (settings.mode === 'vertical') {
                    $(el).css('top', (top + info.offset.y) + 'px');
                } else if (settings.mode === 'horizontal') {
                    $(el).css('left', (left + info.offset.x) + 'px');
                } else {
                    $(el).css('left', (left + info.offset.x) + 'px').css('top', (top + info.offset.y) + 'px');
                }
                $(el).trigger('drag', [{ x: info.offset.x, y: info.offset.y }]);
            });
        });

        return $(this);
    };

}(jQuery));
