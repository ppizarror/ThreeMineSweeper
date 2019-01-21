# Docdash
[![npm package](https://img.shields.io/npm/v/docdash.svg)](https://www.npmjs.com/package/docdash) [![license](https://img.shields.io/npm/l/docdash.svg)](LICENSE.md)

Counlty Docdash is a fork of Docdash. It is a a clean, responsive documentation template theme for JSDoc 3. This repository includes several fixes and additions to Docdash.

![docdash-screenshot](https://cloud.githubusercontent.com/assets/447956/13398144/4dde7f36-defd-11e5-8909-1a9013302cb9.png)


## Example
See http://clenemt.github.io/docdash/ for a sample demo. :rocket:

## Install

```bash
$ npm install docdash
```

## Usage
Clone repository to your designated `jsdoc` template directory, then:

```bash
$ jsdoc entry-file.js -t path/to/docdash
```

## Usage (npm)
In your projects `package.json` file add a new script:

```json
"script": {
  "generate-docs": "node_modules/.bin/jsdoc -c jsdoc.json"
}
```

In your `jsdoc.json` file, add a template option.

```json
"opts": {
  "template": "node_modules/docdash"
}
```

## Sample `jsdoc.json`
See the config file for the [fixtures](fixtures/fixtures.conf.json) or the sample below.

```json
{
    "tags": {
        "allowUnknownTags": false
    },
    "source": {
        "include": "../js",
        "includePattern": ".js$",
        "excludePattern": "(node_modules/|docs)"
    },
    "plugins": [
        "plugins/markdown"
    ],
    "opts": {
        "template": "assets/template/docdash/",
        "encoding": "utf8",
        "destination": "docs/",
        "recurse": true,
        "verbose": true
    },
    "templates": {
        "cleverLinks": false,
        "monospaceLinks": false
    }
}
```

## Options
Docdash supports the following options:

```
{
    "docdash": {
        "static": [false|true],         // Display the static members inside the navbar
        "sort": [false|true],           // Sort the methods in the navbar
        "disqus": "",                   // Shortname for your disqus (subdomain during site creation)
		"openGraph": {                  // Open Graph options (mostly for Facebook and other sites to easily extract meta information)
			"title": "",                // Title of the website
			"type": "website",          // Type of the website
			"image": "",                // Main image/logo
			"site_name": "",            // Site name
			"url": ""                   // Main canonical URL for the main page of the site
		},
		"meta": {                       // Meta information options (mostly for search engines that have not indexed your site yet)
			"title": "",                // Also will be used as postfix to actualy page title, prefixed with object/document name
			"description": "",          // Description of overal contents of your website
			"keyword": ""               // Keywords for search engines
		},
        "search": [false|true],         // Display seach box above navigation which allows to search/filter navigation items
        "collapse": [false|true],       // Collapse navigation by default except current object's navigation of the current page
        "typedefs": [false|true],       // Include typedefs in menu
        "removeQuotes": [none|all|trim],// Remove single and double quotes, trim removes only surrounding ones
        "scripts": []                   // Array of external (or relative local copied using templates.default.staticFiles.include) scripts to inject into HTML
    }
}
```

Place them anywhere inside your `jsdoc.json` file.

## Thanks
Thanks to [lodash](https://lodash.com) and [minami](https://github.com/nijikokun/minami).

## License
Licensed under the Apache License, version 2.0. (see [Apache-2.0](LICENSE.md)).
