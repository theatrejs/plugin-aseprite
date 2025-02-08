[![Copyright](https://img.shields.io/badge/©-deformhead-white.svg)](https://github.com/deformhead) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/theatrejs/plugin-aseprite/blob/master/LICENSE) [![Bundle Size (Gzipped)](https://img.shields.io/bundlejs/size/@theatrejs/plugin-aseprite@latest)](https://www.npmjs.com/package/@theatrejs/plugin-aseprite/v/latest) [![NPM Version](https://img.shields.io/npm/v/@theatrejs/plugin-aseprite/latest)](https://www.npmjs.com/package/@theatrejs/plugin-aseprite/v/latest)

# Aseprite Plugin

> *🛠️ A Plugin for Aseprite exported files.*

## Installation

```shell
npm install @theatrejs/plugin-aseprite --save
```

## Quick Start

> *⚠️ This example does not include the preloading of assets.*

```javascript
import {Stage} from '@theatrejs/theatrejs';
import * as PLUGIN_ASEPRITE from '@theatrejs/plugin-aseprite';

import asepriteDataHero from './hero-16x16.json';
import asepriteTextureHero from './hero-16x16.png';

const asepriteHero = new PLUGIN_ASEPRITE.Aseprite(asepriteTextureHero, asepriteDataHero);

class Level1 extends Stage {
    onCreate() {
        this.createActor(
            PLUGIN_ASEPRITE.FACTORIES.ActorWithSpritesheet({
                $aseprite: asepriteHero,
                $loop: true,
                $tag: 'idle'
            })
        );
    }
}
```

## With Preloading

```javascript
import {FACTORIES} from '@theatrejs/theatrejs';
import * as PLUGIN_ASEPRITE from '@theatrejs/plugin-aseprite';

import asepriteDataHero from './hero-16x16.json';
import asepriteTextureHero from './hero-16x16.png';

const asepriteHero = new PLUGIN_ASEPRITE.Aseprite(asepriteTextureHero, asepriteDataHero);

class Level1 extends FACTORIES.StageWithPreloadables([PLUGIN_ASEPRITE.FACTORIES.PreloadableAseprite(asepriteHero)]) {
    onCreate() {
        this.createActor(
            PLUGIN_ASEPRITE.FACTORIES.ActorWithSpritesheet({
                $aseprite: asepriteHero,
                $loop: true,
                $tag: 'idle'
            })
        );
    }
}
```

## Actor With Text

```javascript
import {FACTORIES} from '@theatrejs/theatrejs';
import * as PLUGIN_ASEPRITE from '@theatrejs/plugin-aseprite';

import asepriteDataFont from './font-16.json';
import asepriteTextureFont from './font-16.png';

const asepriteFont = new PLUGIN_ASEPRITE.Aseprite(asepriteTextureFont, asepriteDataFont);

class Level1 extends FACTORIES.StageWithPreloadables([PLUGIN_ASEPRITE.FACTORIES.PreloadableAseprite(asepriteFont)]) {
    onCreate() {
        this.createActor(
            PLUGIN_ASEPRITE.FACTORIES.ActorWithText({
                $font: asepriteFont,
                $text:
                'First line of text.\n' +
                'Second line of text.'
            })
        );
    }
}
```

## Actor With Text (Advanced Options)

```javascript
import {FACTORIES} from '@theatrejs/theatrejs';
import * as PLUGIN_ASEPRITE from '@theatrejs/plugin-aseprite';

import asepriteDataFont from './font-16.json';
import asepriteTextureFont from './font-16.png';

const asepriteFont = new PLUGIN_ASEPRITE.Aseprite(asepriteTextureFont, asepriteDataFont);

class Level1 extends FACTORIES.StageWithPreloadables([PLUGIN_ASEPRITE.FACTORIES.PreloadableAseprite(asepriteFont)]) {
    onCreate() {
        this.createActor(
            PLUGIN_ASEPRITE.FACTORIES.ActorWithText({
                $align: 'left',
                $anchor: 'center',
                $font: asepriteFont,
                $heightLines: 16,
                $spacingCharacters: 1,
                $text:
                'First line of text.\n' +
                'Second line of text.'
            })
        );
    }
}
```
