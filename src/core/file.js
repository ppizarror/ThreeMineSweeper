/**
 FILE
 File manager.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Get file extension.
 *
 * @function
 * @param {string} filename - File name.
 * @returns {string}
 */
function getFileExtension(filename) {
    return filename.match(/\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi)[0];
}

/**
 * Check if file is an image.
 *
 * @function
 * @param {string} $ext - File extension
 * @returns {boolean}
 */
function isImageFileExtension($ext) {
    return ['PNG', 'JPG', 'JPEG', 'GIF', 'TIF', 'ICO', 'TIFF', 'BMP', 'JPG', 'EPS', 'RAW', 'CR2', 'NEF', 'PCX', 'TGA', 'YUV', '3FR', 'ABR', 'AI', 'ANI', 'APX', 'AVW', 'BAY', 'BIP', 'BLP', 'BPG', 'IMG'].indexOf($ext.toUpperCase().replace('.', '')) !== -1;
}