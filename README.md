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
import {Actor} from '@theatrejs/theatrejs';

import * as PLUGINASEPRITE from '@theatrejs/plugin-aseprite';

import asepriteDataHero from './hero-16x16.json';
import asepriteTextureHero from './hero-16x16.png';

const spritesheetHero = new PLUGINASEPRITE.Aseprite(asepriteTextureHero, asepriteDataHero);

class Hero extends Actor {
    onCreate() {
        this.$timeline = spritesheetHero.createTimeline({$actor: this, $framerate: 8, $loop: true, $tag: 'idle'});
    }
    onTick($timetick) {
        this.$timeline.tick($timetick);
    }
}
```

## With Preloading

```javascript
import {FACTORIES} from '@theatrejs/theatrejs';

import * as PLUGINASEPRITE from '@theatrejs/plugin-aseprite';

import asepriteDataHero from './hero-16x16.json';
import asepriteTextureHero from './hero-16x16.png';

const spritesheetHero = new PLUGINASEPRITE.Aseprite(asepriteTextureHero, asepriteDataHero);

class Hero extends FACTORIES.ActorWithPreloadables([PLUGINASEPRITE.FACTORIES.PreloadableAseprite(spritesheetHero)]) {
    onCreate() {
        this.$timeline = spritesheetHero.createTimeline({$actor: this, $framerate: 8, $loop: true, $tag: 'idle'});
    }
    onTick($timetick) {
        this.$timeline.tick($timetick);
    }
}
```

## [API](https://theatrejs.github.io/plugin-aseprite/index.html)
