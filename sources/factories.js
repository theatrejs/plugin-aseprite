import {Actor, Preloadable, Timeline, TimelineKeyframe} from '@theatrejs/theatrejs';

import {Aseprite} from './index.js';

/**
 * @module FACTORIES
 */

/**
 * Prepares an actor with spritesheet.
 * @template {string} T The generic type of the tags.
 * @param {Object} $parameters The given parameters.
 * @param {Aseprite<T>} $parameters.$aseprite The aseprite module manager.
 * @param {boolean} [$parameters.$loop] The loop status.
 * @param {T} $parameters.$tag The given tag.
 * @returns {typeof Actor}
 *
 * @memberof module:FACTORIES
 */
function ActorWithSpritesheet({$aseprite, $loop = false, $tag}) {

    /**
     * @ignore
     */
    class ActorWithSpritesheet extends Actor {

        /**
         * Stores the timeline.
         * @type {Timeline}
         * @private
         */
        $timeline;

        /**
         * Creates the timeline.
         * @returns {Timeline}
         * @private
         */
        $createTimeline() {

            const sprites = $aseprite.getSprites($tag);

            if (sprites.size === 0) {

                return new Timeline();
            }

            let timecode = 0;

            const keyframes = Array.from(sprites.entries()).map(([$sprite, $duration]) => {

                const timelinekeyframe = new TimelineKeyframe({

                    $onEnter: () => {

                        this.setSprite($sprite);
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

            return new Timeline(keyframes);
        }

        /**
         * Called when the actor is being created.
         * @public
         */
        onCreate() {

            this.$timeline = this.$createTimeline();
            this.$timeline.seekTimecode(0);
        }

        /**
         * Called when the actor is being updated by one tick update.
         * @param {number} $timetick The tick duration (in ms).
         * @public
         */
        onTick($timetick) {

            this.$timeline.tick($timetick);
        }
    }

    return ActorWithSpritesheet;
}

/**
 * Prepares a preloadable Aseprite module.
 * @param {Aseprite<string>} $aseprite The preloadable Aseprite module.
 * @returns {typeof Preloadable}
 *
 * @memberof module:FACTORIES
 */
function PreloadableAseprite($aseprite) {

    /**
     * @ignore
     */
    class PreloadableAseprite extends Preloadable {

        /**
         * Stores the preloadable assets.
         * @type {Array<string>}
         * @public
         * @static
         */
        static preloadables = [$aseprite.textureColor];
    };

    return PreloadableAseprite;
}

export {

    ActorWithSpritesheet,
    PreloadableAseprite
};
