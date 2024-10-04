import {Preloadable} from '@theatrejs/theatrejs';

import {Aseprite} from './index.js';

/**
 * @module FACTORIES
 */

/**
 * Prepares a preloadable Aseprite module.
 * @param {Aseprite<string>} $aseprite The preloadable Aseprite module.
 * @returns {typeof Preloadable}
 *
 * @memberof module:FACTORIES
 */
function PreloadableAseprite($aseprite) {

    return class extends Preloadable {

        /**
         * Stores the preloadable assets.
         * @type {Array<string>}
         * @public
         * @static
         */
        static preloadables = [$aseprite.textureColor];
    };
}

export {

    PreloadableAseprite
};
