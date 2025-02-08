import {AABB, Sprite, Vector2} from '@theatrejs/theatrejs';

/**
 * Creates Aseprite module managers.
 * @template {string} TypeGeneric The generic type of the tags.
 *
 * @example
 *
 * const aseprite = new Aseprite(textureColor, data);
 * aseprite.getSprites(tag);
 */
class Aseprite {

    /**
     * @template {string} TypeGeneric The generic type of the tags.
     * @typedef {Object} TypeAseprite An Aseprite JSON data.
     * @property {Array<TypeAsepriteFrame>} TypeAseprite.frames The Aseprite JSON frames data.
     * @property {TypeAsepriteMeta<TypeGeneric>} TypeAseprite.meta The Aseprite JSON meta data.
     * @protected
     *
     * @memberof Aseprite
     */

    /**
     * @typedef {Object} TypeAsepriteFrame An Aseprite JSON frame data.
     * @property {number} TypeAsepriteFrame.duration The duration.
     * @property {string} TypeAsepriteFrame.filename The file name.
     * @property {Object} TypeAsepriteFrame.frame The frame.
     * @property {number} TypeAsepriteFrame.frame.x The x position of the frame.
     * @property {number} TypeAsepriteFrame.frame.y The y position of the frame.
     * @property {number} TypeAsepriteFrame.frame.w The width of the frame.
     * @property {number} TypeAsepriteFrame.frame.h The height of the frame.
     * @property {boolean} TypeAsepriteFrame.rotated The rotated status.
     * @property {Object} TypeAsepriteFrame.spriteSourceSize The sprite source size.
     * @property {number} TypeAsepriteFrame.spriteSourceSize.x The x position of the sprite source.
     * @property {number} TypeAsepriteFrame.spriteSourceSize.y The y position of the sprite source.
     * @property {number} TypeAsepriteFrame.spriteSourceSize.w The width of the sprite source.
     * @property {number} TypeAsepriteFrame.spriteSourceSize.h The height of the sprite source.
     * @property {Object} TypeAsepriteFrame.sourceSize The sprite size.
     * @property {number} TypeAsepriteFrame.sourceSize.w The width of the source.
     * @property {number} TypeAsepriteFrame.sourceSize.h The height of the source.
     * @property {boolean} TypeAsepriteFrame.trimmed The trimmed status.
     * @protected
     *
     * @memberof Aseprite
     */

    /**
     * @template {string} TypeGeneric The generic type of the tags.
     * @typedef {Object} TypeAsepriteMeta An Aseprite JSON meta data.
     * @property {string} TypeAsepriteMeta.app The app meta data.
     * @property {string} TypeAsepriteMeta.format The format meta data.
     * @property {string} TypeAsepriteMeta.image The image meta data.
     * @property {string} TypeAsepriteMeta.scale The scale meta data.
     * @property {Object} TypeAsepriteMeta.size The size meta data.
     * @property {number} TypeAsepriteMeta.size.w The size width meta data.
     * @property {number} TypeAsepriteMeta.size.h The size height meta data.
     * @property {string} TypeAsepriteMeta.version The version meta data.
     * @property {Array<TypeAsepriteFrameTag<TypeGeneric>>} TypeAsepriteMeta.frameTags The Aseprite JSON tags meta data.
     * @protected
     *
     * @memberof Aseprite
     */

    /**
     * @template {string} TypeGeneric The generic type of the tags.
     * @typedef {Object} TypeAsepriteFrameTag An Aseprite JSON tag meta data.
     * @property {TypeGeneric} TypeAsepriteFrameTag.name The name.
     * @property {number} TypeAsepriteFrameTag.from The first frame.
     * @property {number} TypeAsepriteFrameTag.to The last frame.
     * @property {string} TypeAsepriteFrameTag.direction The animation direction.
     * @property {string} TypeAsepriteFrameTag.color The color.
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
     * @type {Map.<TypeGeneric, Map<Sprite, number>>}
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
     * @param {TypeAseprite<TypeGeneric>} $data The Aseprite JSON data.
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
     * @param {TypeGeneric} $tag The given tag.
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
