import {Actor, Preloadable, Vector2} from '@theatrejs/theatrejs';

import {Aseprite, Spritesheet} from './index.js';

/**
 * @module FACTORIES
 */

/**
 * Prepares an actor with spritesheet.
 * @template {string} TypeGeneric The generic type of the tags.
 * @param {Object} $parameters The given parameters.
 * @param {Aseprite<TypeGeneric>} $parameters.$aseprite The Aseprite module manager.
 * @param {boolean} [$parameters.$loop] The loop status.
 * @param {TypeGeneric} $parameters.$tag The given tag.
 * @returns {typeof Actor<string, string>}
 *
 * @memberof module:FACTORIES
 */
function ActorWithSpritesheet({$aseprite, $loop = true, $tag}) {

    /**
     * @ignore
     */
    class ActorWithSpritesheet extends Actor {

        /**
         * Stores the Aseprite spritesheet.
         * @type {Spritesheet<TypeGeneric>}
         * @private
         */
        $spritesheet;

        /**
         * Called when the actor is being created.
         * @public
         */
        onCreate() {

            this.$spritesheet = new Spritesheet(/** @type {Aseprite<TypeGeneric>} **/($aseprite));

            this.$spritesheet.animate($tag, $loop);
        }

        /**
         * Called when the actor is being updated by one tick update.
         * @param {number} $timetick The tick duration (in ms).
         * @public
         */
        onTick($timetick) {

            this.$spritesheet.tick($timetick);

            if (this.sprite !== this.$spritesheet.sprite) {

                this.setSprite(this.$spritesheet.sprite);
            }
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
 * @returns {typeof Actor<string, string>}
 *
 * @memberof module:FACTORIES
 */
function ActorWithText({$align = 'left', $anchor = 'center', $font, $heightLines = 16, $spacingCharacters = 1, $text}) {

    /**
     * @ignore
     */
    class ActorWithText extends Actor {

        /**
         * Called when the actor is being created.
         * @public
         */
        onCreate() {

            let widthText = 0;

            const rows = $text.split('\n').map(($row) => {

                let widthRow = 0;

                const row = Array.from($row).map(($character) => {

                    const sprites = Array.from($font.getSprites($character));

                    const widthCharacter = Math.max(...sprites.map(([$sprite]) => ($sprite.sizeTarget.x)));

                    widthRow += widthCharacter;

                    return {

                        $character: $character,
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

                top -= $heightLines;

                $row.forEach(({$character, $widthCharacter}) => {

                    this.stage.createActor(

                        ActorWithSpritesheet({

                            $aseprite: $font,
                            $loop: true,
                            $tag: $character
                        })
                    )
                    .setVisible(this.visible)
                    .setZIndex(this.zIndex)
                    .translate(new Vector2(left + Math.ceil($widthCharacter / 2), top + Math.ceil($heightLines / 2)))
                    .mimic(this);

                    left += $spacingCharacters + $widthCharacter;
                });

                left = anchorLeft;
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
        static preloadables = [$aseprite.texture];
    }

    return PreloadableAseprite;
}

export {

    ActorWithSpritesheet,
    ActorWithText,
    PreloadableAseprite
};
