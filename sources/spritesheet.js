import {Sprite, Timeline, TimelineKeyframe} from '@theatrejs/theatrejs';

import {Aseprite} from './index.js';

/**
 * Creates Aseprite spritesheets.
 * @template {string} T The generic type of the tags.
 *
 * @example
 *
 * const spritesheet = new Spritesheet(aseprite);
 * spritesheet.animate({$tag, $loop, $onFrame});
 * spritesheet.tick(timetick);
 */
class Spritesheet {

    /**
     * @callback typehandlerframe A handler called when a frame is being entered.
     * @param {Sprite} $sprite The sprite of the frame entered.
     * @returns {void}
     * @protected
     *
     * @memberof Spritesheet
     */

    /**
     * Stores the Aseprite module manager.
     * @type {Aseprite<T>}
     * @private
     */
    $aseprite;

    /**
     * Stores the timeline.
     * @type {Timeline}
     * @private
     */
    $timeline;

    /**
     * Creates a new Aseprite spritesheet.
     * @param {Aseprite<T>} $aseprite The Aseprite module manager.
     */
    constructor($aseprite) {

        this.$aseprite = $aseprite;
    }

    /**
     * Animates an Aseprite tag.
     * @param {Object} $parameters The given parameters.
     * @param {boolean} [$parameters.$loop] The loop status.
     * @param {typehandlerframe} $parameters.$onFrame Called when a frame is being entered.
     * @param {T} $parameters.$tag The given tag.
     * @public
     */
    animate({$loop = true, $onFrame, $tag}) {

        const sprites = this.$aseprite.getSprites($tag);

        if (sprites.size === 0) {

            return new Timeline();
        }

        let timecode = 0;

        const keyframes = Array.from(sprites.entries()).map(([$sprite, $duration]) => {

            const timelinekeyframe = new TimelineKeyframe({

                $onEnter: () => {

                    $onFrame($sprite);
                },
                $timecode: timecode
            });

            timecode += $duration;

            return timelinekeyframe;
        });

        if ($loop === true) {

            keyframes.push(new TimelineKeyframe({

                $onEnter: ($timeline) => {

                    $timeline.seekTimecode(0);
                },
                $timecode: timecode
            }));
        }

        this.$timeline = new Timeline(keyframes);
        this.$timeline.seekTimecode(0);
    }

    /**
     * Updates the spritesheet by one tick update.
     * @param {number} $timetick The tick duration (in ms).
     * @public
     */
    tick($timetick) {

        this.$timeline.tick($timetick);
    }
}

export {

    Spritesheet
};

export default Spritesheet;
