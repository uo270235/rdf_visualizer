/**
 * @module managers/DiagramManager
 */
import * as d3 from 'd3';
import $ from 'jquery';

/**
 * Aplica un zoom al nodo especificado en el diagrama.
 * @param {string} nodeId - El ID del nodo al que se debe aplicar el zoom.
 */
export function zoomToNode(nodeId) {
  const container = document.getElementById('diagramContainer');
  const svg = d3.select('svg[id^="mermaid-"]');
  const node = svg.select(`#${nodeId} > rect`);

  if (!node.empty()) {
    const bbox = node.node().getBBox();
    const margin = 20;
    const viewBoxX = bbox.x - margin;
    const viewBoxY = bbox.y - margin;
    const viewBoxWidth = bbox.width + 2 * margin;
    const viewBoxHeight = bbox.height + 2 * margin;

    svg
      .transition()
      .duration(750)
      .attr(
        'viewBox',
        `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`,
      )
      .on('end', () => console.log('Zoom aplicado a ' + nodeId));

    container.style.maxHeight = 'none';
    container.style.transform = 'none';
  } else {
    console.log('Nodo no encontrado: ' + nodeId);
  }
}

/**
 * Simula un clic en el nodo especificado.
 * @param {string} nodeId - El ID del nodo en el que se debe simular el clic.
 */
export function clickToNode(nodeId) {
  console.log('click');

  var safeNodeId = nodeId.replace(/^:/, '\\:');

  var event = $.Event('click', {
    data: { idB: nodeId },
  });

  $('#' + safeNodeId).trigger(event);
}

/**
 * Resalta el nodo especificado en el diagrama.
 * @param {string} prevNodeId - El ID del nodo previamente resaltado.
 * @param {string} nodeId - El ID del nodo a resaltar.
 * @param {string} color - El color con el que resaltar el nodo.
 */
export function highlightNode(prevNodeId, nodeId, color) {
  const svg = d3.select('svg[id^="mermaid-"]');

  if (prevNodeId != '') {
    prevNodeId = prevNodeId.replace(/:/g, '\\:');

    let prevNode = svg.select(`#${prevNodeId} > rect.outer.title-state`);
    if (!prevNode.empty()) {
      prevNode.attr('style', `fill: ${'#ECECFF'} !important;`);
      console.log('Color cambiado a ' + color + ' en el nodo: ' + prevNodeId);
    } else {
      console.log('Nodo no encontrado: ' + prevNodeId);
    }
  }

  if (nodeId != '') {
    nodeId = nodeId.replace(/:/g, '\\:');

    const node = svg.select(`#${nodeId} > rect.outer.title-state`);
    if (!node.empty()) {
      node.attr('style', `fill: ${color} !important;`);
      console.log('Color cambiado a ' + color + ' en el nodo: ' + nodeId);
    } else {
      console.log('Nodo no encontrado: ' + nodeId);
    }
  }
}
