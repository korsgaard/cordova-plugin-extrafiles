#!/usr/bin/env node

module.exports = function(ctx) {
  var path = require('path');
  var glob = ctx.requireCordovaModule('glob');
  var shelljs = ctx.requireCordovaModule('shelljs');
  var elementtree = ctx.requireCordovaModule('elementtree');

  shelljs.config.silent = false;
  shelljs.config.verbose = true;

  function copy(dest, src, action) {
    var cpopt = typeof shelljs.set === 'function' ? '-rn' : '-r';
    glob.sync(src).forEach(function(f) {
      shelljs.cp(cpopt, f, dest);
      if (action === 'move') shelljs.rm('-rf', f);
    });
  }

  function doit(element, dest, src, action) {
    dest = dest || '.';
    src = src || '.';
    var children = element.findall('./resource');
    if (!children.length && dest !== src) {
      if ((shelljs.test('-d', "platforms/android") && dest.indexOf('android') > -1) || (shelljs.test('-d', "platforms/ios") && dest.indexOf('ios') > -1)) {
        copy(dest, src, action);
      }
      return;
    }

    if ((shelljs.test('-d', "platforms/android") && dest.indexOf('android') > -1) || (shelljs.test('-d', "platforms/ios") && dest.indexOf('ios') > -1)) {
      shelljs.mkdir('-p', dest);
    }
    
    children.forEach(function(child) {
      var dest2 = child.attrib.dest || '.';
      var src2 = child.attrib.src || '.';
      var action = child.attrib.action  || 'copy';
      doit(child, path.resolve(dest, dest2), path.resolve(src, src2), action);
    });
  }

  var root = ctx.opts.projectRoot;
  doit(elementtree.parse(shelljs.cat('config.xml')), root, root, '');
};
