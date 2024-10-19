import {AABB, Sprite, Vector2} from '@theatrejs/theatrejs';

/**
 * Creates Aseprite module managers.
 * @template {string} T The generic type of the tags.
 *
 * @example
 *
 * const aseprite = new Aseprite(textureColor, data);
 * aseprite.getSprites(tag);
 */
class Aseprite {

    /**
     * @template {string} T The generic type of the tags.
     * @typedef {Object} typeaseprite An Aseprite JSON data.
     * @property {Array<typeasepriteframe>} typeaseprite.frames The Aseprite JSON frames data.
     * @property {typeasepritemeta<T>} typeaseprite.meta The Aseprite JSON meta data.
     * @protected
     *
     * @memberof Aseprite
     */

    /**
     * @typedef {Object} typeasepriteframe An Aseprite JSON frame data.
     * @property {number} typeasepriteframe.duration The duration.
     * @property {string} typeasepriteframe.filename The file name.
     * @property {Object} typeasepriteframe.frame The frame.
     * @property {number} typeasepriteframe.frame.x The x position of the frame.
     * @property {number} typeasepriteframe.frame.y The y position of the frame.
     * @property {number} typeasepriteframe.frame.w The width of the frame.
     * @property {number} typeasepriteframe.frame.h The height of the frame.
     * @property {boolean} typeasepriteframe.rotated The rotated status.
     * @property {Object} typeasepriteframe.spriteSourceSize The sprite source size.
     * @property {number} typeasepriteframe.spriteSourceSize.x The x position of the sprite source.
     * @property {number} typeasepriteframe.spriteSourceSize.y The y position of the sprite source.
     * @property {number} typeasepriteframe.spriteSourceSize.w The width of the sprite source.
     * @property {number} typeasepriteframe.spriteSourceSize.h The height of the sprite source.
     * @property {Object} typeasepriteframe.sourceSize The sprite size.
     * @property {number} typeasepriteframe.sourceSize.w The width of the source.
     * @property {number} typeasepriteframe.sourceSize.h The height of the source.
     * @property {boolean} typeasepriteframe.trimmed The trimmed status.
     * @protected
     *
     * @memberof Aseprite
     */

    /**
     * @template {string} T The generic type of the tags.
     * @typedef {Object} typeasepritemeta An Aseprite JSON meta data.
     * @property {string} typeasepritemeta.app The app meta data.
     * @property {string} typeasepritemeta.format The format meta data.
     * @property {string} typeasepritemeta.image The image meta data.
     * @property {string} typeasepritemeta.scale The scale meta data.
     * @property {Object} typeasepritemeta.size The size meta data.
     * @property {number} typeasepritemeta.size.w The size width meta data.
     * @property {number} typeasepritemeta.size.h The size height meta data.
     * @property {string} typeasepritemeta.version The version meta data.
     * @property {Array<typeasepriteframetag<T>>} typeasepritemeta.frameTags The Aseprite JSON tags meta data.
     * @protected
     *
     * @memberof Aseprite
     */

    /**
     * @template {string} T The generic type of the tags.
     * @typedef {Object} typeasepriteframetag An Aseprite JSON tag meta data.
     * @property {T} typeasepriteframetag.name The name.
     * @property {number} typeasepriteframetag.from The first frame.
     * @property {number} typeasepriteframetag.to The last frame.
     * @property {string} typeasepriteframetag.direction The animation direction.
     * @property {string} typeasepriteframetag.color The color.
     * @protected
     *
     * @memberof Aseprite
     */

    /**
     * Stores the sprites and their duration.
     * @type {Map<Sprite, number>}
     * @private
     */
    $sprites;

    /**
     * Stores the sprites and their duration by tags.
     * @type {Map.<T, Map<Sprite, number>>}
     * @private
     */
    $tags;

    /**
     * Stores the color texture source.
     * @type {string}
     * @private
     */
    $textureColor;

    /**
     * Gets the color texture source.
     * @type {string}
     * @public
     */
    get textureColor() {

        return this.$textureColor;
    }

    /**
     * Creates a new Aseprite module manager.
     * @param {string} $textureColor The color texture source.
     * @param {typeaseprite<T>} $data The Aseprite JSON file.
     */
    constructor($textureColor, $data) {

        this.$textureColor = $textureColor;

        this.$sprites = new Map();

        $data.frames.forEach(($frame) => {

            const sprite = new Sprite({

                $frameSource: new AABB(

                    new Vector2($frame.frame.x / $data.meta.size.w, $frame.frame.y / $data.meta.size.h),
                    new Vector2(($frame.frame.x + $frame.frame.w) / $data.meta.size.w, ($frame.frame.y + $frame.frame.h) / $data.meta.size.h)
                ),
                $sizeTarget: new Vector2($frame.frame.w, $frame.frame.h),
                $textureColor: $textureColor
            });

            this.$sprites.set(sprite, $frame.duration);
        });

        this.$tags = new Map();

        $data.meta.frameTags.forEach(($tag) => {

            const subset = Array.from(this.$sprites.entries())
            .slice($tag.from, $tag.to + 1);

            this.$tags.set($tag.name, new Map(subset));
        });
    }

    /**
     * Gets the sprites and their duration for the given tag.
     * @param {T} $tag The given tag.
     * @returns {Map<Sprite, number>}
     * @public
     */
    getSprites($tag) {

        if (this.$tags.size === 0) {

            return new Map();
        }

        if (this.$tags.has($tag) === false) {

            const first = Array.from(this.$tags.keys())[0];

            return this.$tags.get(first);
        }

        return this.$tags.get($tag);
    }
}

export {

    Aseprite
};

export default Aseprite;
