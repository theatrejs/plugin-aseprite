import {Actor, Preloadable, Timeline, TimelineKeyframe, Vector2} from '@theatrejs/theatrejs';

import {Aseprite} from './index.js';

/**
 * @module FACTORIES
 */

/**
 * Prepares an actor with spritesheet.
 * @template {string} T The generic type of the tags.
 * @param {Object} $parameters The given parameters.
 * @param {Aseprite<T>} $parameters.$aseprite The Aseprite module manager.
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
 * Prepares an actor with text.
 * @param {Object} $parameters The given parameters.
 * @param {('center' | 'left' | 'right')} [$parameters.$align] The horizontal alignment.
 * @param {('bottom' | 'bottom-left' | 'bottom-right' | 'center' | 'left' | 'right' | 'top' | 'top-left' | 'top-right')} [$parameters.$anchor] The anchor position.
 * @param {Aseprite<string>} $parameters.$font The Aseprite module manager of the font (with the Aseprite tags corresponding to the characters used in the text).
 * @param {number} [$parameters.$heightLines] The height of the lines.
 * @param {number} [$parameters.$spacingCharacters] The spacing between the characters.
 * @param {string} $parameters.$text The text to use (with '\n' being a special character controlling the carriage return).
 * @returns {typeof Actor}
 *
 * @memberof module:FACTORIES
 */
function ActorWithText({$align = 'left', $anchor = 'center', $font, $heightLines = 16, $spacingCharacters = 1, $text}) {

    /**
     * @ignore
     */
    class ActorWithText extends Actor {

        /**
         * Stores the characters.
         * @type {Array<Actor>}
         * @private
         */
        $characters;

        /**
         * Called just before removing the actor.
         * @public
         */
        onBeforeRemove() {

            [...this.$characters].forEach(($characters) => {

                this.stage.removeActor($characters);
            });
        }

        /**
         * Called when the actor is being created.
         * @public
         */
        onCreate() {

            this.$characters = [];

            let widthText = 0;

            const rows = $text.split('\n').map(($row) => {

                let widthRow = 0;

                const row = Array.from($row).map(($character) => {

                    const sprites = Array.from($font.getSprites($character));

                    const heightCharacter = Math.max(...sprites.map(([$sprite]) => ($sprite.sizeTarget.y)));
                    const widthCharacter = Math.max(...sprites.map(([$sprite]) => ($sprite.sizeTarget.x)));

                    widthRow += widthCharacter;

                    return {

                        $character: $character,
                        $heightCharacter: heightCharacter,
                        $widthCharacter: widthCharacter
                    };
                });

                widthRow += ($row.length - 1) * $spacingCharacters;

                if (widthRow > widthText) {

                    widthText = widthRow;
                }

                return {

                    $heightRow: $heightLines,
                    $row: row,
                    $widthRow: widthRow
                };
            });

            const text = {

                $heightText: rows.length * $heightLines,
                $rows: rows,
                $widthText: widthText
            };

            let anchorLeft;
            let anchorTop;

            switch($anchor) {

                case 'bottom': {

                    anchorLeft = - (text.$widthText / 2);
                    anchorTop = text.$heightText;

                    break;
                }

                case 'bottom-left': {

                    anchorLeft = 0;
                    anchorTop = text.$heightText;

                    break;
                }

                case 'bottom-right': {

                    anchorLeft = - text.$widthText;
                    anchorTop = text.$heightText;

                    break;
                }

                case 'left': {

                    anchorLeft = 0;
                    anchorTop = text.$heightText / 2;

                    break;
                }

                case 'right': {

                    anchorLeft = - text.$widthText;
                    anchorTop = text.$heightText / 2;

                    break;
                }

                case 'top': {

                    anchorLeft = - (text.$widthText / 2);
                    anchorTop = 0;

                    break;
                }

                case 'top-left': {

                    anchorLeft = 0;
                    anchorTop = 0;

                    break;
                }

                case 'top-right': {

                    anchorLeft = - text.$widthText;
                    anchorTop = 0;

                    break;
                }

                case 'center':
                default: {

                    anchorLeft = - (text.$widthText / 2);
                    anchorTop = text.$heightText / 2;
                }
            }

            let left = anchorLeft;
            let top = anchorTop;

            text.$rows.forEach(({$row, $widthRow}) => {

                switch($align) {

                    case 'center': {

                        left += (text.$widthText - $widthRow) / 2;

                        break;
                    }

                    case 'right': {

                        left += (text.$widthText - $widthRow);

                        break;
                    }

                    case 'left':
                    default: {

                        break;
                    }
                }

                $row.forEach(({$character, $heightCharacter, $widthCharacter}) => {

                    const character = this.stage.createActor(

                        ActorWithSpritesheet({

                            $aseprite: $font,
                            $loop: true,
                            $tag: $character
                        })
                    )
                    .setVisible(this.visible)
                    .setZIndex(this.zIndex)
                    .translate(new Vector2(left + Math.ceil($widthCharacter / 2), top + Math.ceil($heightCharacter / 2)));

                    this.$characters.push(character);

                    left += $spacingCharacters + $widthCharacter;
                });

                left = anchorLeft;
                top -= $heightLines;
            });
        }

        /**
         * Called when the visible status is being set.
         * @param {boolean} $visible The visible status set.
         * @public
         */
        onSetVisible($visible) {

            this.$characters.forEach(($character) => {

                $character.setVisible($visible);
            });
        }

        /**
         * Called when the z-index is being set.
         * @param {number} $zIndex The z-index set.
         * @public
         */
        onSetZIndex($zIndex) {

            this.$characters.forEach(($character) => {

                $character.setZIndex($zIndex);
            });
        }

        /**
         * Called when the actor is being translated.
         * @param {Vector2} $vector The translation applied.
         * @public
         */
        onTranslate($vector) {

            this.$characters.forEach(($character) => {

                $character.translate($vector);
            });
        }
    }

    return ActorWithText;
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
    }

    return PreloadableAseprite;
}

export {

    ActorWithSpritesheet,
    ActorWithText,
    PreloadableAseprite
};
