import {Sprite, Timeline, TimelineKeyframe} from '@theatrejs/theatrejs';

import {Aseprite} from './index.js';

/**
 * Creates Aseprite spritesheets.
 * @template {string} T The generic type of the tags.
 *
 * @example
 *
 * const spritesheet = new Spritesheet(aseprite);
 * spritesheet.animate(tag, loop);
 * spritesheet.tick(timetick);
 *
 * const sprite = spritesheet.sprite;
 */
class Spritesheet {

    /**
     * Stores the Aseprite module manager.
     * @type {Aseprite<T>}
     * @private
     */
    $aseprite;

    /**
     * Stores the current sprite.
     * @type {Sprite}
     * @private
     */
    $sprite;

    /**
     * Stores the timeline.
     * @type {Timeline}
     * @private
     */
    $timeline;

    /**
     * Gets the current sprite.
     * @type {Sprite}
     * @public
     */
    get sprite() {

        return this.$sprite;
    }

    /**
     * Creates a new Aseprite spritesheet.
     * @param {Aseprite<T>} $aseprite The Aseprite module manager.
     */
    constructor($aseprite) {

        this.$aseprite = $aseprite;
    }

    /**
     * Animates an Aseprite tag.
     * @param {T} $tag The given tag.
     * @param {boolean} [$loop] The loop status.
     * @public
     */
    animate($tag, $loop = true) {

        const sprites = this.$aseprite.getSprites($tag);

        if (sprites.size === 0) {

            return new Timeline();
        }

        let timecode = 0;

        const keyframes = Array.from(sprites.entries()).map(([$sprite, $duration]) => {

            const timelinekeyframe = new TimelineKeyframe({

                $onEnter: () => {

                    this.$sprite = $sprite;
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
