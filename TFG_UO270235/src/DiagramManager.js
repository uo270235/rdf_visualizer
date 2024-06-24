import * as d3 from 'd3';
import $ from 'jquery';

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

    // Ajusta el viewBox del SVG
    svg
      .transition()
      .duration(750)
      .attr(
        'viewBox',
        `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`,
      )
      .on('end', () => console.log('Zoom aplicado a ' + nodeId));

    // Opcional: ajusta el tamaño del contenedor si es necesario
    container.style.maxHeight = 'none'; // Eliminar el maxHeight podría ayudar a ver todo el SVG
    container.style.transform = 'none'; // Considera eliminar las transformaciones mientras se hace zoom
  } else {
    console.log('Nodo no encontrado: ' + nodeId);
  }
}

export function clickToNode(nodeId) {
  console.log('click');

  var safeNodeId = nodeId.replace(/^:/, '\\:');

  var event = $.Event('click', {
    data: { idB: nodeId },
  });

  $('#' + safeNodeId).trigger(event);
}

export function highlightNode(prevNodeId, nodeId, color) {
  const svg = d3.select('svg[id^="mermaid-"]');

  if (prevNodeId != '') {
    prevNodeId = prevNodeId.replace(/^:/, '\\:');
    let prevNode = svg.select(`#${prevNodeId} > rect.outer.title-state`);
    if (!prevNode.empty()) {
      prevNode.attr('style', `fill: ${'#ECECFF'} !important;`); // Cambio directo en el atributo de estilo
      console.log('Color cambiado a ' + color + ' en el nodo: ' + prevNodeId);
    } else {
      console.log('Nodo no encontrado: ' + prevNodeId);
    }
  }

  nodeId = nodeId.replace(/^:/, '\\:');

  const node = svg.select(`#${nodeId} > rect.outer.title-state`);
  console.log(node);
  if (!node.empty()) {
    node.attr('style', `fill: ${color} !important;`); // Cambio directo en el atributo de estilo
    console.log('Color cambiado a ' + color + ' en el nodo: ' + nodeId);
  } else {
    console.log('Nodo no encontrado: ' + nodeId);
  }
}

/**
 * Trigger the specified event on the specified element.
 * @param  {Object} elem  the target element.
 * @param  {String} event the type of the event (e.g. 'click').
 */
