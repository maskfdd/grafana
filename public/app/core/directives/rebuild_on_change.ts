///<reference path="../../headers/common.d.ts" />

import angular from 'angular';
import _ from 'lodash';
import $ from 'jquery';

import coreModule from '../core_module';

function getBlockNodes(nodes) {
  var node = nodes[0];
  var endNode = nodes[nodes.length - 1];
  var blockNodes;

  for (var i = 1; node !== endNode && (node = node.nextSibling); i++) {
    if (blockNodes || nodes[i] !== node) {
      if (!blockNodes) {
        blockNodes = $([].slice.call(nodes, 0, i));
      }
      blockNodes.push(node);
    }
  }

  return blockNodes || nodes;
}

function rebuildOnChange($animate) {

  return {
    multiElement: true,
    terminal: true,
    transclude: true,
    priority: 600,
    restrict: 'E',
    link: function(scope, elem, attrs, ctrl, transclude) {
      var childScope, previousElements;
      var uncompiledHtml;

      function cleanUp() {
        if (childScope) {
          childScope.$destroy();
          childScope = null;
          elem.empty();
        }
      }

      scope.$watch(attrs.property, function rebuildOnChangeAction(value, oldValue) {
        if (value || attrs.showNull) {
          // if same value and we have childscope
          // ignore this double event
          if (value === oldValue && childScope) {
            return;
          }

          cleanUp();
          transclude(function(clone, newScope) {
            childScope = newScope;
            $animate.enter(clone, elem.parent(), elem);
          });

        } else {
          cleanUp();
        }
      });
    }
  };
}

coreModule.directive('rebuildOnChange', rebuildOnChange);
