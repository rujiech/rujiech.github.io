// Change data paths here if the generated files move.
const DATA_PATHS = {
  wells: 'data/package_map_long.geojson',
  county: 'data/gaston_outline.geojson',
  zipPolygons: 'data/gaston_zipcodes.geojson',
  countySubdivisions: 'data/gaston_county_subdivisions.geojson',
  geologyTileMetadata: 'geology_tiles/root.json',
  // Change this path if you move the converted XYZ tiles.
  geologyTiles: 'public/geology-tiles/{z}/{x}/{y}.png'
};

const MAP_PANES = {
  geology: 'geologyPane',
  context: 'contextPane',
  county: 'countyPane'
};

// Dropdown options are defined here. Update labels here without changing the data values.
const PACKAGE_OPTIONS = [
  { value: 'Screening-First', label: 'Broad screening' },
  { value: 'Confirmation-First', label: 'Focused screening' },
  { value: 'Explanation-First', label: 'Simplified inputs' }
];

const DEFAULT_PACKAGE_VALUE = PACKAGE_OPTIONS[0].value;

const GEOLOGY_LEGEND_ITEMS = [
  ['CZab', 'Amphibolite and biotite gneiss'],
  ['CZbg', 'Mica schist'],
  ['CZbl', 'Blacksburg formation'],
  ['CZfv', 'Felsic metavolcanic rock'],
  ['CZg', 'Metamorphosed granitic rock'],
  ['CZms', 'Mica schist'],
  ['DOg', 'Granitic rock'],
  ['DOgb', 'Gabbro of Concord Plutonic Suite'],
  ['Mc', 'Cherryville granite'],
  ['OCg', 'Metamorphosed granitic rock'],
  ['PPmg', 'Foliated to massive granitic rock'],
  ['PzZq', 'Metamorphosed quartz diorite'],
  ['Zbt', 'Battleground formation']
].map(([code, name]) => ({ code, name }));

const BASEMAP = {
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
  options: {
    maxZoom: 16,
    attribution: 'Tiles &copy; Esri'
  }
};

const BASEMAP_REFERENCE = {
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
  options: {
    maxZoom: 16,
    attribution: 'Tiles &copy; Esri'
  }
};

// Change the no-exceedance point color here.
const NO_EXCEEDANCE_COLOR = '#50adb4';

// Cluster behavior is configured here, including the zoom threshold.
const CLUSTER_CONFIG = {
  disableClusteringAtZoom: 14,
  maxClusterRadius: 32
};

const WELL_DETAIL_ZOOM = 18;

const STATUS_STYLES = {
  Exceedance: {
    color: '#ffffff',
    fillColor: '#b42318',
    fillOpacity: 0.82,
    radius: 4,
    weight: 1
  },
  'No exceedance': {
    color: '#ffffff',
    fillColor: NO_EXCEEDANCE_COLOR,
    fillOpacity: 0.76,
    radius: 4,
    weight: 1
  }
};

const DEFAULT_POINT_STYLE = {
  color: '#ffffff',
  fillColor: '#59645f',
  fillOpacity: 0.75,
  radius: 4,
  weight: 1
};

const MAP_LABELS = {
  loading: 'Loading map data...',
  loaded: 'Map data loaded.',
  error: 'Map data could not be loaded. Check that the GeoJSON files are available.',
  searching: 'Searching for that location...',
  searchNotFound: 'No matching location was found.',
  geolocationUnavailable: 'Location access is not available in this browser.',
  geolocationDenied: 'Location access was denied.',
  geolocationFailed: 'Your location could not be determined.'
};

const map = L.map('map', {
  preferCanvas: true,
  scrollWheelZoom: true,
  zoomAnimation: true,
  fadeAnimation: true,
  markerZoomAnimation: true,
  zoomSnap: 0.25,
  zoomDelta: 0.5,
  wheelPxPerZoomLevel: 120
}).setView([35.31, -81.18], 11);

const packageSelect = document.getElementById('package-select');
const searchShell = document.getElementById('map-search-shell');
const searchPanel = document.getElementById('map-search-panel');
const searchToggle = document.getElementById('search-toggle');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const locateButton = document.getElementById('locate-button');
const layersToggle = document.getElementById('layers-toggle');
const refreshButton = document.getElementById('refresh-button');
const layersPanel = document.getElementById('map-layers-panel');
const layersClose = document.getElementById('layers-close');
const privateWellsToggle = document.getElementById('layer-private-wells');
const countySubdivisionsToggle = document.getElementById('layer-county-subdivisions');
const zipAreasToggle = document.getElementById('layer-zip-areas');
const geologyToggle = document.getElementById('layer-geology');
const layerPanelStatus = document.getElementById('layer-panel-status');
const mapStatus = document.getElementById('map-status');
const legendShell = document.getElementById('map-legend-shell');
const legendToggle = document.getElementById('legend-toggle');
const legendToggleIcon = legendToggle ? legendToggle.querySelector('.legend-toggle-icon') : null;
const legendContent = document.getElementById('map-legend-content');

let wellsData = null;
let countyLayer = null;
let basemapLayer = null;
let basemapReferenceLayer = null;
let zipPolygonData = null;
let municipalityPolygonData = null;
let searchResultLayer = null;
let userLocationMarker = null;
let userLocationCircle = null;
let wellClusterLayer = null;
let activeWellPopup = null;

map.on('popupopen', (event) => {
  if (event.popup.options.className !== 'well-popup') return;
  activeWellPopup = event.popup;
  refreshVisibleWellTooltips();
});
map.on('popupclose', (event) => {
  if (event.popup.options.className === 'well-popup') event.popup.getElement()?.remove();
  if (activeWellPopup !== event.popup) return;
  activeWellPopup = null;
  refreshVisibleWellTooltips();
});
let countySubdivisionsData = null;
let countySubdivisionsLayer = null;
let zipAreasLayer = null;
let geologyLayer = null;
let countyBounds = null;
let countyMaskFeature = null;
let geologyTileMetadata = null;
let activeSearchSelection = null;
const visibleContextLayers = {
  privateWells: true,
  countySubdivisions: false,
  zipAreas: false,
  geology: false
};
const demographicCache = {
  zip: new Map(),
  municipality: new Map()
};

function refreshVisibleWellTooltips() {
  if (!wellClusterLayer) return;

  wellClusterLayer.eachLayer((layer) => {
    if (typeof layer.getLatLng === 'function' && typeof layer._refreshWellTooltip === 'function') {
      layer._refreshWellTooltip();
    }
  });
}

function setStatus(message, shouldShow = true) {
  mapStatus.textContent = message;
  mapStatus.classList.toggle('is-hidden', !shouldShow);
}

function initializeLegend() {
  if (!legendShell || !legendToggle || !legendToggleIcon || !legendContent) return;
  legendShell.classList.remove('is-collapsed');
  legendToggle.setAttribute('aria-expanded', 'true');
  legendToggleIcon.textContent = '-';
  renderLegend();
}

function toggleLegend() {
  if (!legendShell || !legendToggle || !legendToggleIcon) return;
  const isCollapsed = legendShell.classList.toggle('is-collapsed');
  legendToggle.setAttribute('aria-expanded', String(!isCollapsed));
  legendToggleIcon.textContent = isCollapsed ? '+' : '-';
}

function clearSearchResultLayer() {
  if (searchResultLayer) {
    map.removeLayer(searchResultLayer);
    searchResultLayer = null;
  }
}

function clearSearchSummary() {
  activeSearchSelection = null;
}

function clearSearchSelection() {
  clearSearchResultLayer();
  clearSearchSummary();
}

function mapClickIsInsideSelectedGeography(latlng) {
  if (!activeSearchSelection?.feature || !latlng) return false;
  if (!['zipcode', 'municipality'].includes(activeSearchSelection.type)) return false;

  const clickedPoint = turf.point([latlng.lng, latlng.lat]);
  return turf.booleanPointInPolygon(clickedPoint, activeSearchSelection.feature);
}

function handleMapClickForSearchSelection(event) {
  if (!activeSearchSelection) return;
  if (mapClickIsInsideSelectedGeography(event.latlng)) return;
  clearSearchSelection();
}

function maybeClearSearchSelectionFromLatLng(latlng) {
  if (!activeSearchSelection) return;
  if (mapClickIsInsideSelectedGeography(latlng)) return;
  clearSearchSelection();
}

function clearUserLocationLayers() {
  if (userLocationMarker) {
    map.removeLayer(userLocationMarker);
    userLocationMarker = null;
  }
  if (userLocationCircle) {
    map.removeLayer(userLocationCircle);
    userLocationCircle = null;
  }
}

function getCountySubdivisionLegendMarkup() {
  return `
    <div class="legend-row">
      <span class="legend-swatch line county-subdivisions"></span>
      <span>County subdivisions</span>
    </div>
  `;
}

function getZipAreasLegendMarkup() {
  return `
    <div class="legend-row">
      <span class="legend-swatch line zip-areas"></span>
      <span>ZIP code areas</span>
    </div>
  `;
}

function getGeologyLegendMarkup() {
  if (!geologyTileMetadata) {
    return `
      <div class="legend-row legend-row-note">
        <span>Geologic formations legend is loading...</span>
      </div>
    `;
  }

  const mapUnitsLayer = geologyTileMetadata.layers?.find((layer) => layer.name === 'Map Units');
  const legendByCode = new Map(
    (mapUnitsLayer?.legend || [])
      .filter((item) => item?.label && item?.imageData)
      .map((item) => [item.label, item])
  );

  return GEOLOGY_LEGEND_ITEMS.map(({ code, name }) => {
    const swatch = legendByCode.get(code);
    if (!swatch) {
      return `
        <div class="legend-row geology-row">
          <span class="legend-swatch geology-fallback"></span>
          <span>${escapeHtml(code)} : ${escapeHtml(name)}</span>
        </div>
      `;
    }

    return `
      <div class="legend-row geology-row">
        <img
          class="legend-image-swatch"
          src="data:${swatch.contentType || 'image/png'};base64,${swatch.imageData}"
          alt=""
          width="${swatch.width || 20}"
          height="${swatch.height || 20}"
        />
        <span>${escapeHtml(code)} : ${escapeHtml(name)}</span>
      </div>
    `;
  }).join('');
}

function renderLegend() {
  if (!legendContent) return;

  const sections = [];

  if (visibleContextLayers.privateWells) {
    sections.push({
      key: 'base',
      title: 'Private wells',
      rows: `
        <div class="legend-row">
          <span class="legend-swatch exceedance"></span>
          <span>Exceedance</span>
        </div>
        <div class="legend-row">
          <span class="legend-swatch no-exceedance"></span>
          <span>No exceedance</span>
        </div>
      `
    });
  }

  if (visibleContextLayers.countySubdivisions) {
    sections.push({
      key: 'county-subdivisions',
      title: 'County subdivisions',
      rows: getCountySubdivisionLegendMarkup()
    });
  }

  if (visibleContextLayers.zipAreas) {
    sections.push({
      key: 'zip-areas',
      title: 'ZIP code areas',
      rows: getZipAreasLegendMarkup()
    });
  }

  if (visibleContextLayers.geology) {
    sections.push({
      key: 'geology',
      title: 'Geologic formations',
      rows: getGeologyLegendMarkup()
    });
  }

  legendContent.innerHTML = sections.map((section) => `
    <section class="legend-section" data-legend-section="${section.key}">
      <div class="legend-section-title">${escapeHtml(section.title)}</div>
      <div class="legend-section-rows">${section.rows}</div>
    </section>
  `).join('');
}

function setSearchExpanded(isExpanded) {
  if (!searchShell || !searchPanel || !searchToggle) return;

  searchShell.classList.toggle('is-collapsed', !isExpanded);
  searchPanel.hidden = !isExpanded;
  searchToggle.setAttribute('aria-expanded', String(isExpanded));
  searchToggle.setAttribute('aria-label', isExpanded ? 'Close search' : 'Open search');
  searchToggle.title = isExpanded ? 'Close search' : 'Open search';

  if (isExpanded) {
    requestAnimationFrame(() => {
      searchInput?.focus();
      searchInput?.select();
    });
  }
}

function setLayerPanelStatus(message = '') {
  if (!layerPanelStatus) return;
  layerPanelStatus.textContent = message;
}

function setLayersPanelExpanded(isExpanded) {
  if (!layersPanel || !layersToggle) return;

  layersPanel.hidden = !isExpanded;
  layersToggle.setAttribute('aria-expanded', String(isExpanded));
  layersToggle.setAttribute('aria-label', isExpanded ? 'Close map layers' : 'Open map layers');
  layersToggle.title = isExpanded ? 'Close layers' : 'Layers';

  if (isExpanded) {
    privateWellsToggle?.focus();
  }
}

function initializeMapPanes() {
  // Keep contextual overlays below wells while preserving the county outline above them.
  map.createPane(MAP_PANES.geology);
  map.createPane(MAP_PANES.context);
  map.createPane(MAP_PANES.county);

  map.getPane(MAP_PANES.geology).style.zIndex = 350;
  map.getPane(MAP_PANES.context).style.zIndex = 360;
  map.getPane(MAP_PANES.county).style.zIndex = 370;
}

function valueOrFallback(value) {
  const normalized = value === null || value === undefined ? '' : String(value).trim();
  if (normalized === '' || normalized.toUpperCase() === 'NA' || normalized.toUpperCase() === 'NULL') {
    return 'Not available';
  }
  return normalized;
}

function municipalityLabel(value) {
  const normalized = value === null || value === undefined ? '' : String(value).trim();
  if (normalized === '' || normalized.toUpperCase() === 'NA' || normalized.toUpperCase() === 'NULL') {
    return 'Unincorporated area';
  }
  return normalized;
}

function normalizeMunicipalityName(value) {
  return municipalityLabel(value)
    .replace(/^\d+\s*,\s*/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function municipalitySearchKey(value) {
  return normalizeMunicipalityName(value).toLowerCase();
}

function formatProbability(value) {
  if (value === null || value === undefined || String(value).trim() === '') {
    return 'Not available';
  }
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return valueOrFallback(value);
  }
  return `${(numeric * 100).toFixed(1)}%`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function arcgisColorToCss(color, alphaOverride = null) {
  if (!Array.isArray(color) || color.length < 3) {
    return alphaOverride === 0 ? 'transparent' : '#000000';
  }

  const [r, g, b, a = 255] = color;
  const alpha = alphaOverride ?? (a / 255);
  return alpha <= 0 ? 'transparent' : `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function sanitizeId(value) {
  return String(value || 'default').replace(/[^a-z0-9_-]+/gi, '-');
}

function featureIsInsideCounty(feature) {
  if (!countyMaskFeature || !window.turf) return true;
  if (feature?.geometry?.type !== 'Point') return true;
  return turf.booleanPointInPolygon(feature, countyMaskFeature);
}

function selectedPackageFeatures() {
  const selectedPackage = packageSelect?.value || DEFAULT_PACKAGE_VALUE;
  return wellsData.features.filter((feature) =>
    featureHasSelectedPackage(feature, selectedPackage) && featureIsInsideCounty(feature)
  );
}

function clipFeatureToCounty(feature) {
  if (!countyMaskFeature || !window.turf) return feature;
  if (!feature?.geometry || !/Polygon/.test(feature.geometry.type)) return feature;

  const clipped = turf.intersect(turf.featureCollection([countyMaskFeature, feature]));
  if (!clipped) return null;

  clipped.properties = { ...(feature.properties || {}), ...(clipped.properties || {}) };
  return clipped;
}

function clipFeatureCollectionToCounty(featureCollection) {
  if (!featureCollection || !Array.isArray(featureCollection.features)) return featureCollection;

  return {
    ...featureCollection,
    features: featureCollection.features
      .map((feature) => clipFeatureToCounty(feature))
      .filter(Boolean)
  };
}

function countyOuterRing(feature) {
  if (!feature?.geometry) return null;

  if (feature.geometry.type === 'Polygon') {
    return feature.geometry.coordinates?.[0] || null;
  }

  if (feature.geometry.type === 'MultiPolygon') {
    const rings = feature.geometry.coordinates
      .map((polygon) => polygon?.[0] || [])
      .filter((ring) => ring.length > 0);

    return rings.sort((a, b) => b.length - a.length)[0] || null;
  }

  return null;
}

function updateGeologyCountyClip() {
  const geologyPane = map.getPane(MAP_PANES.geology);
  const ring = countyOuterRing(countyMaskFeature);

  if (!geologyPane || !ring || ring.length < 3) return;

  const clipPath = `polygon(${ring.map(([lng, lat]) => {
    // Use layer-point coordinates so the clip mask moves with Leaflet's translated tile pane.
    const point = map.latLngToLayerPoint([lat, lng]);
    return `${point.x}px ${point.y}px`;
  }).join(', ')})`;

  geologyPane.style.clipPath = clipPath;
  geologyPane.style.webkitClipPath = clipPath;
}

function tooltipTemplate(properties) {
  const rows = [
    ['Municipality', municipalityLabel(properties.municipality)],
    ['ZIP code', valueOrFallback(properties.zipcode)],
    ['Predicted exceedance probability', formatProbability(properties.prob)]
  ];

  const rowHtml = rows.map(([label, value]) => `
    <div class="tooltip-row">
      <span class="tooltip-label">${escapeHtml(label)}</span>
      <span class="tooltip-value">${escapeHtml(value)}</span>
    </div>
  `).join('');

  return `
    <div class="tooltip-content">
      <div class="tooltip-title">Private well</div>
      ${rowHtml}
    </div>
  `;
}

function tooltipDirectionForLatLng(latlng) {
  const point = map.latLngToContainerPoint(latlng);
  const mapSize = map.getSize();

  if (point.y < 150) return 'bottom';
  if (point.x > mapSize.x - 220) return 'left';
  if (point.x < 220) return 'right';
  return 'top';
}

function bindResponsiveTooltip(layer, feature) {
  const refreshTooltip = () => {
    if (activeWellPopup) {
      layer.unbindTooltip();
      return;
    }
    const latlng = layer.getLatLng();
    const direction = tooltipDirectionForLatLng(latlng);
    const isPermanent = map.getZoom() >= WELL_DETAIL_ZOOM;

    layer.unbindTooltip();
    layer.bindTooltip(tooltipTemplate(feature.properties || {}), {
      className: 'well-tooltip',
      direction,
      offset: direction === 'top' ? [0, -8] : direction === 'bottom' ? [0, 8] : [8, 0],
      opacity: 1,
      sticky: !isPermanent,
      permanent: isPermanent
    });

    if (isPermanent) {
      layer.openTooltip();
    } else {
      layer.closeTooltip();
    }
  };

  layer._refreshWellTooltip = refreshTooltip;

  const syncTooltipMode = () => {
    if (!layer._map) return;
    refreshTooltip();
  };

  map.on('zoomend', syncTooltipMode);
  layer.on('remove', () => {
    map.off('zoomend', syncTooltipMode);
  });

  layer.on('mouseover', () => {
    if (activeWellPopup) return;
    if (layer.getTooltip()?.options?.permanent) return;
    refreshTooltip();
    layer.openTooltip();
  });

  layer.on('mouseout', () => {
    if (layer.getTooltip()?.options?.permanent) return;
    layer.closeTooltip();
  });

  layer.on('click', (event) => {
    L.DomEvent.stopPropagation(event);
    layer.closeTooltip();
    L.popup({className:'well-popup', minWidth:280, maxWidth:400})
      .setLatLng(layer.getLatLng())
      .setContent(tooltipTemplate(feature.properties || {}))
      .openOn(map);
    const latlng = layer.getLatLng();
    maybeClearSearchSelectionFromLatLng(latlng);
    const targetZoom = Math.max(map.getZoom(), 18);
    map.once('moveend', () => {
      refreshTooltip();
    });
    map.setView(latlng, targetZoom, { animate: true });
  });

  refreshTooltip();
}

function getPointStyle(feature) {
  const status = feature?.properties?.status;
  return STATUS_STYLES[status] || DEFAULT_POINT_STYLE;
}

function featureHasSelectedPackage(feature, selectedPackage) {
  return feature?.properties?.package_name === selectedPackage;
}

// Aggregate stats are computed here from actual child markers.
function clusterStats(markers) {
  const total = markers.length;
  const exceedCount = markers.reduce((count, marker) => {
    return count + (marker.feature?.properties?.status === 'Exceedance' ? 1 : 0);
  }, 0);
  return {
    total,
    exceedPercent: total > 0 ? (exceedCount / total) * 100 : 0
  };
}

function clusterTooltipHtml(stats) {
  return `
    <div class="cluster-tooltip">
      <div class="cluster-tooltip-row"><strong>Private wells:</strong> ${stats.total}</div>
      <div class="cluster-tooltip-row"><strong>Percent of wells exceeding threshold:</strong> ${stats.exceedPercent.toFixed(1)}%</div>
    </div>
  `;
}

function clusterColor(percent) {
  if (percent >= 50) return '#b42318';
  if (percent >= 20) return '#d58b27';
  return NO_EXCEEDANCE_COLOR;
}

function createClusterIcon(cluster) {
  const stats = clusterStats(cluster.getAllChildMarkers());
  const size = Math.max(30, Math.min(60, 24 + Math.sqrt(stats.total) * 4));
  const color = clusterColor(stats.exceedPercent);

  return L.divIcon({
    html: `
      <div class="cluster-badge" style="--cluster-color:${color}; width:${size}px; height:${size}px;"></div>
    `,
    className: 'cluster-icon-wrapper',
    iconSize: [size, size]
  });
}

function createWellClusterLayer(selectedPackage) {
  const filteredFeatures = wellsData.features.filter((feature) =>
    featureHasSelectedPackage(feature, selectedPackage) && featureIsInsideCounty(feature)
  );

  const clusterLayer = L.markerClusterGroup({
    maxClusterRadius: CLUSTER_CONFIG.maxClusterRadius,
    disableClusteringAtZoom: CLUSTER_CONFIG.disableClusteringAtZoom,
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false,
    iconCreateFunction: createClusterIcon
  });

  const geoJsonLayer = L.geoJSON(
    { type: 'FeatureCollection', features: filteredFeatures },
    {
      pointToLayer: (feature, latlng) => L.circleMarker(latlng, getPointStyle(feature)),
      onEachFeature: (feature, layer) => bindResponsiveTooltip(layer, feature)
    }
  );

  clusterLayer.addLayer(geoJsonLayer);

  clusterLayer.on('clustermouseover', (event) => {
    const stats = clusterStats(event.layer.getAllChildMarkers());
    event.layer.bindTooltip(clusterTooltipHtml(stats), {
      className: 'cluster-tooltip-shell',
      direction: 'top',
      offset: [0, -8],
      opacity: 1
    }).openTooltip();
  });

  clusterLayer.on('clustermouseout', (event) => {
    event.layer.closeTooltip();
  });

  clusterLayer.on('clusterclick', (event) => {
    if (event.originalEvent) {
      L.DomEvent.stop(event.originalEvent);
    }
    maybeClearSearchSelectionFromLatLng(event.layer.getLatLng());
    map.setView(event.layer.getLatLng(), map.getZoom() + 1, {
      animate: true
    });
  });

  return clusterLayer;
}

function updateVisiblePackage() {
  const selectedPackage = packageSelect.value;
  if (wellClusterLayer) {
    map.removeLayer(wellClusterLayer);
  }
  wellClusterLayer = createWellClusterLayer(selectedPackage);
  if (visibleContextLayers.privateWells) {
    map.addLayer(wellClusterLayer);
    wellClusterLayer.bringToFront();
  }
  requestAnimationFrame(() => {
    refreshVisibleWellTooltips();
  });
  renderLegend();
  updateStrategyPurpose();
}

function updateStrategyPurpose() {
  const strategy=ArsenicCore.strategies.find(s=>s.id===packageSelect.value);
  document.getElementById('strategy-purpose').textContent=strategy ? strategy.purpose+' '+strategy.tradeoff : '';
}
function populateDropdown() {
  packageSelect.innerHTML = '';
  PACKAGE_OPTIONS.forEach(({ value, label }) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    packageSelect.appendChild(option);
  });
  packageSelect.value = DEFAULT_PACKAGE_VALUE;
  updateStrategyPurpose();
}

function togglePrivateWellsLayer(shouldShow) {
  visibleContextLayers.privateWells = shouldShow;

  if (!wellClusterLayer) {
    renderLegend();
    return;
  }

  if (shouldShow) {
    if (!map.hasLayer(wellClusterLayer)) {
      map.addLayer(wellClusterLayer);
    }
    wellClusterLayer.bringToFront();
  } else if (map.hasLayer(wellClusterLayer)) {
    map.removeLayer(wellClusterLayer);
  }

  renderLegend();
}

function addBasemap() {
  basemapLayer = L.tileLayer(BASEMAP.url, BASEMAP.options).addTo(map);
  basemapLayer.bringToBack();
  basemapReferenceLayer = L.tileLayer(BASEMAP_REFERENCE.url, BASEMAP_REFERENCE.options).addTo(map);
}

function fitMapToData() {
  const layers = [];
  if (countyLayer) layers.push(countyLayer);
  if (wellClusterLayer) layers.push(wellClusterLayer);

  const group = L.featureGroup(layers);
  if (group.getLayers().length > 0) {
    const bounds = group.getBounds();
    map.fitBounds(bounds, {
      padding: [24, 24],
      maxZoom: 13
    });
  }
}

async function resetMapView() {
  clearSearchSelection();
  clearUserLocationLayers();
  setSearchExpanded(false);
  setLayersPanelExpanded(false);
  privateWellsToggle.checked = true;
  countySubdivisionsToggle.checked = false;
  zipAreasToggle.checked = false;
  geologyToggle.checked = false;
  togglePrivateWellsLayer(true);
  await toggleContextLayer('countySubdivisions', false);
  await toggleContextLayer('zipAreas', false);
  await toggleContextLayer('geology', false);
  updateVisiblePackage();
  fitMapToData();
  setStatus(MAP_LABELS.loaded, false);
}

let fileMapDataPromise;
async function loadJson(path) {
  if (location.protocol === 'file:') {
    fileMapDataPromise ||= new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'file-map-data.js';
      script.onload = resolve;
      script.onerror = () => reject(new Error('Unable to load bundled map data'));
      document.head.appendChild(script);
    });
    await fileMapDataPromise;
    if (!Object.hasOwn(window.ArsenicFileData, path)) throw new Error('Missing bundled map data');
    return window.ArsenicFileData[path];
  }
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}: ${response.status}`);
  }
  return response.json();
}

function countySubdivisionStyle() {
  return {
    pane: MAP_PANES.context,
    color: '#4f7f85',
    weight: 1.4,
    fillColor: '#a7c7cb',
    fillOpacity: 0.06
  };
}

function zipAreasStyle() {
  return {
    pane: MAP_PANES.context,
    color: '#7c6db0',
    weight: 1.25,
    dashArray: '5 4',
    fillColor: '#b8b1d8',
    fillOpacity: 0.04
  };
}

function searchHighlightStyle(type) {
  if (type === 'municipality') {
    return {
      pane: MAP_PANES.county,
      color: '#1e63b6',
      weight: 2.5,
      fillColor: '#1e63b6',
      fillOpacity: 0.08
    };
  }

  return {
    pane: MAP_PANES.county,
    color: '#1e63b6',
    weight: 2.5,
    dashArray: '6 4',
    fillColor: '#1e63b6',
    fillOpacity: 0.08
  };
}

function bindBoundaryTooltip(layer, title, detail) {
  layer.bindTooltip(
    `<div class="context-tooltip"><strong>${escapeHtml(title)}</strong><br>${escapeHtml(detail)}</div>`,
    {
      direction: 'top',
      offset: [0, -6],
      opacity: 1,
      sticky: true
    }
  );
}

function countySubdivisionsFeatureName(feature) {
  return feature?.properties?.county_subdivision || feature?.properties?.NAME || 'County subdivision';
}

function zipAreaFeatureName(feature) {
  return valueOrFallback(feature?.properties?.zipcode || feature?.properties?.ZCTA5CE20);
}

function municipalityFeatureName(feature) {
  return normalizeMunicipalityName(feature?.properties?.county_subdivision || feature?.properties?.NAME || 'Municipality');
}

function webMercatorToLatLngBounds(extent) {
  if (!extent) return null;

  const southWest = L.CRS.EPSG3857.unproject(L.point(extent.xmin, extent.ymin));
  const northEast = L.CRS.EPSG3857.unproject(L.point(extent.xmax, extent.ymax));
  return L.latLngBounds(southWest, northEast);
}

async function loadGeologyTileMetadata() {
  if (geologyTileMetadata) {
    return geologyTileMetadata;
  }

  geologyTileMetadata = await loadJson(DATA_PATHS.geologyTileMetadata);
  renderLegend();
  return geologyTileMetadata;
}

async function ensureMunicipalityPolygons() {
  if (!municipalityPolygonData) {
    municipalityPolygonData = clipFeatureCollectionToCounty(await loadJson(DATA_PATHS.countySubdivisions));
  }
  return municipalityPolygonData;
}

function addOverlayBelowWells(layer) {
  layer.addTo(map);
  if (wellClusterLayer) {
    wellClusterLayer.bringToFront();
  }
}

async function ensureCountySubdivisionsLayer() {
  if (!countySubdivisionsData) {
    countySubdivisionsData = await ensureMunicipalityPolygons();
  }

  if (!countySubdivisionsLayer) {
    countySubdivisionsLayer = L.geoJSON(countySubdivisionsData, {
      style: countySubdivisionStyle,
      onEachFeature: (feature, layer) => {
        bindBoundaryTooltip(layer, countySubdivisionsFeatureName(feature), 'County subdivision');
      }
    });
  }

  return countySubdivisionsLayer;
}

async function ensureZipAreasLayer() {
  if (!zipPolygonData) {
    zipPolygonData = clipFeatureCollectionToCounty(await loadJson(DATA_PATHS.zipPolygons));
  }

  if (!zipAreasLayer) {
    zipAreasLayer = L.geoJSON(zipPolygonData, {
      style: zipAreasStyle,
      onEachFeature: (feature, layer) => {
        bindBoundaryTooltip(layer, `ZIP ${zipAreaFeatureName(feature)}`, 'ZIP Code Area (ZCTA)');
      }
    });
  }

  return zipAreasLayer;
}

async function ensureGeologyLayer() {
  if (!geologyLayer) {
    const metadata = await loadGeologyTileMetadata();
    const tileBounds = webMercatorToLatLngBounds(metadata.fullExtent || metadata.initialExtent);

    // Raster tiles preserve the official ArcGIS Pro symbology from the cache images.
    // Unlike a FeatureServer renderer, the browser should not try to restyle Compact Cache tiles.
    geologyLayer = L.tileLayer(DATA_PATHS.geologyTiles, {
      pane: MAP_PANES.geology,
      minZoom: Number(metadata.minLOD ?? 10),
      maxZoom: Number(metadata.maxLOD ?? 16),
      minNativeZoom: Number(metadata.minLOD ?? 10),
      maxNativeZoom: Number(metadata.maxLOD ?? 16),
      bounds: tileBounds || countyBounds,
      opacity: 0.95,
      tms: false,
      noWrap: true,
      attribution: 'NC Geological Survey'
    });
  }

  return geologyLayer;
}

async function toggleContextLayer(toggleName, shouldShow) {
  // Layer toggle behavior is centralized here so more contextual layers can be added later.
  const config = {
    countySubdivisions: {
      ensure: ensureCountySubdivisionsLayer,
      legend: ['county-subdivisions', 'County subdivisions', 'county-subdivisions']
    },
    zipAreas: {
      ensure: ensureZipAreasLayer,
      legend: ['zip-areas', 'ZIP code areas', 'zip-areas']
    },
    geology: {
      ensure: ensureGeologyLayer,
      legend: ['geology', 'Geologic formations', 'geology'],
      onShown: () => {
        updateGeologyCountyClip();
      }
    }
  }[toggleName];

  if (!config) return;

  try {
    setLayerPanelStatus(shouldShow ? 'Loading layer...' : '');
    const layer = await config.ensure();
    visibleContextLayers[toggleName] = shouldShow;

    if (shouldShow) {
      if (!map.hasLayer(layer)) {
        addOverlayBelowWells(layer);
      }
      config.onShown?.();
      renderLegend();
      setLayerPanelStatus('');
      return;
    }

    if (map.hasLayer(layer)) {
      map.removeLayer(layer);
    }
    config.onHidden?.();
    renderLegend();
    setLayerPanelStatus('');
  } catch (error) {
    console.error(error);
    visibleContextLayers[toggleName] = false;
    renderLegend();
    setLayerPanelStatus('That layer could not be loaded right now.');
  }
}

async function geocodeQuery(query) {
  const searchQueries = [query];
  if (!/north carolina|nc|gaston/i.test(query)) {
    searchQueries.push(`${query}, Gaston County, North Carolina`);
    searchQueries.push(`${query}, North Carolina`);
  }

  for (const searchQuery of searchQueries) {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('limit', '1');
    url.searchParams.set('countrycodes', 'us');
    url.searchParams.set('q', searchQuery);

    const response = await fetch(url.toString(), {
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) continue;
    const results = await response.json();
    if (Array.isArray(results) && results.length > 0) {
      return results[0];
    }
  }

  return null;
}

function isZipCodeQuery(query) {
  return /^\d{5}$/.test(query.trim());
}

function findZipFeature(zipcode) {
  if (!zipPolygonData || !Array.isArray(zipPolygonData.features)) return null;
  return zipPolygonData.features.find((feature) => {
    const featureZip = feature?.properties?.zipcode;
    return String(featureZip || '').trim() === zipcode;
  }) || null;
}

function findMunicipalityFeature(query) {
  if (!municipalityPolygonData || !Array.isArray(municipalityPolygonData.features)) return null;

  const normalizedQuery = municipalitySearchKey(query);
  const exact = municipalityPolygonData.features.find((feature) => municipalitySearchKey(municipalityFeatureName(feature)) === normalizedQuery);
  if (exact) return exact;

  const startsWith = municipalityPolygonData.features.find((feature) => municipalitySearchKey(municipalityFeatureName(feature)).startsWith(normalizedQuery));
  if (startsWith) return startsWith;

  return municipalityPolygonData.features.find((feature) => municipalitySearchKey(municipalityFeatureName(feature)).includes(normalizedQuery)) || null;
}

function showGeographyHighlight(feature, type, label) {
  clearSearchResultLayer();
  clearUserLocationLayers();

  searchResultLayer = L.geoJSON(feature, {
    style: searchHighlightStyle(type)
  }).addTo(map);

  searchResultLayer.on('click', (event) => {
    if (event.originalEvent) {
      L.DomEvent.stopPropagation(event.originalEvent);
    }
  });

  const bounds = searchResultLayer.getBounds();
  if (bounds.isValid()) {
    map.fitBounds(bounds, {
      padding: [30, 30],
      maxZoom: 13
    });
  }

  const center = bounds.getCenter();
  searchResultLayer.bindTooltip(label, {
    direction: 'top',
    offset: [0, -8],
    opacity: 1,
    sticky: true
  });
  if (center) searchResultLayer.openTooltip(center);
}

function getGeometryDisplayLabel(selection) {
  return selection.type === 'municipality'
    ? municipalityFeatureName(selection.feature)
    : zipAreaFeatureName(selection.feature);
}

function countWellsWithinFeature(feature) {
  const featureCollection = turf.featureCollection([feature]);
  const points = selectedPackageFeatures();
  const matching = points.filter((point) => turf.booleanPointInPolygon(point, featureCollection.features[0]));
  const exceedCount = matching.filter((point) => point?.properties?.status === 'Exceedance').length;

  return {
    total: matching.length,
    exceedCount,
    exceedPercent: matching.length > 0 ? (exceedCount / matching.length) * 100 : null
  };
}

function formatCount(value) {
  return new Intl.NumberFormat('en-US').format(value);
}

function formatPercent(value) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return 'Data unavailable';
  }
  return `${value.toFixed(1)}%`;
}

function formatPopulation(value) {
  if (value === null || value === undefined || value === '' || Number.isNaN(Number(value))) {
    return 'Data unavailable';
  }
  return new Intl.NumberFormat('en-US').format(Number(value));
}

function formatIncome(value) {
  if (value === null || value === undefined || value === '' || Number.isNaN(Number(value))) {
    return 'Data unavailable';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(Number(value));
}

function searchSummaryTooltipHtml(title, rows, note = '') {
  return `
    <div class="tooltip-content">
      <div class="tooltip-title">${escapeHtml(title)}</div>
      ${rows.map(([label, value]) => `
        <div class="tooltip-row">
          <span class="tooltip-label">${escapeHtml(label)}</span>
          <span class="tooltip-value">${escapeHtml(value)}</span>
        </div>
      `).join('')}
      ${note ? `<div class="search-summary-note">${escapeHtml(note)}</div>` : ''}
    </div>
  `;
}

async function fetchZipDemographics(zipcode) {
  if (demographicCache.zip.has(zipcode)) {
    return demographicCache.zip.get(zipcode);
  }

  try {
    // ACS 2019-2023 5-year estimates are served from the 2023/acs/acs5 endpoint.
    const url = new URL('https://api.census.gov/data/2023/acs/acs5');
    url.searchParams.set('get', 'NAME,B01003_001E,B19013_001E');
    url.searchParams.set('for', `zip code tabulation area:${zipcode}`);
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`ZIP demographics request failed: ${response.status}`);
    const [header, row] = await response.json();
    const nameIndex = header.indexOf('NAME');
    const populationIndex = header.indexOf('B01003_001E');
    const incomeIndex = header.indexOf('B19013_001E');
    const result = {
      name: row?.[nameIndex] || '',
      population: row?.[populationIndex] ?? null,
      income: row?.[incomeIndex] ?? null
    };
    demographicCache.zip.set(zipcode, result);
    return result;
  } catch (error) {
    console.warn('ZIP demographics unavailable.', error);
    const fallback = { population: null, income: null };
    demographicCache.zip.set(zipcode, fallback);
    return fallback;
  }
}

async function fetchMunicipalityDemographics(geoid) {
  if (demographicCache.municipality.has(geoid)) {
    return demographicCache.municipality.get(geoid);
  }

  if (!geoid || geoid.length < 10) {
    return { population: null, income: null };
  }

  const state = geoid.slice(0, 2);
  const county = geoid.slice(2, 5);
  const subdivision = geoid.slice(5);

  try {
    // ACS 2019-2023 5-year estimates are served from the 2023/acs/acs5 endpoint.
    const url = new URL('https://api.census.gov/data/2023/acs/acs5');
    url.searchParams.set('get', 'NAME,B01003_001E,B19013_001E');
    url.searchParams.set('for', `county subdivision:${subdivision}`);
    url.searchParams.set('in', `state:${state} county:${county}`);
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`Municipality demographics request failed: ${response.status}`);
    const [header, row] = await response.json();
    const populationIndex = header.indexOf('B01003_001E');
    const incomeIndex = header.indexOf('B19013_001E');
    const result = {
      population: row?.[populationIndex] ?? null,
      income: row?.[incomeIndex] ?? null
    };
    demographicCache.municipality.set(geoid, result);
    return result;
  } catch (error) {
    console.warn('Municipality demographics unavailable.', error);
    const fallback = { population: null, income: null };
    demographicCache.municipality.set(geoid, fallback);
    return fallback;
  }
}

async function renderSearchSummary() {
  if (!activeSearchSelection || !searchResultLayer) {
    return;
  }

  const selection = activeSearchSelection;
  const stats = countWellsWithinFeature(selection.feature);
  const demographics = selection.type === 'municipality'
    ? await fetchMunicipalityDemographics(selection.feature?.properties?.geoid)
    : await fetchZipDemographics(zipAreaFeatureName(selection.feature));

  const headingLabel = selection.type === 'municipality' ? 'Municipality' : 'ZIP code';
  const displayName = getGeometryDisplayLabel(selection);
  const riskValue = stats.total > 0 ? formatPercent(stats.exceedPercent) : 'No private wells';
  const note = stats.total === 0 ? 'No private wells fall within the selected geography for the current package.' : '';
  const rows = [
    [headingLabel, displayName],
    ['Private wells', formatCount(stats.total)],
    ['Exceedance risk', riskValue],
    ['Population', formatPopulation(demographics.population)],
    ['Median household income', formatIncome(demographics.income)]
  ];

  activeSearchSelection.summary = {
    label: displayName,
    privateWells: stats.total,
    exceedanceRisk: riskValue,
    population: formatPopulation(demographics.population),
    medianHouseholdIncome: formatIncome(demographics.income)
  };

  const bounds = searchResultLayer.getBounds?.();
  const center = bounds?.isValid?.() ? bounds.getCenter() : searchResultLayer.getLatLng?.();

  searchResultLayer.unbindTooltip();
  searchResultLayer.bindTooltip(searchSummaryTooltipHtml(displayName, rows, note), {
    className: 'well-tooltip',
    direction: 'top',
    offset: [0, -8],
    opacity: 1,
    sticky: false,
    permanent: true
  });

  if (center) {
    searchResultLayer.openTooltip(center);
  } else if (typeof searchResultLayer.openTooltip === 'function') {
    searchResultLayer.openTooltip();
  }
}

async function handleSearch() {
  const query = searchInput.value.trim();
  if (!query) return;

  try {
    setStatus(MAP_LABELS.searching);
    if (isZipCodeQuery(query)) {
      const zipFeature = findZipFeature(query);
      if (zipFeature) {
        showGeographyHighlight(zipFeature, 'zip', `ZIP code ${zipAreaFeatureName(zipFeature)}`);
        activeSearchSelection = {
          type: 'zipcode',
          id: zipAreaFeatureName(zipFeature),
          name: zipAreaFeatureName(zipFeature),
          feature: zipFeature,
          summary: null
        };
        await renderSearchSummary();
        setStatus(MAP_LABELS.loaded, false);
        setSearchExpanded(false);
        return;
      }
    }

    await ensureMunicipalityPolygons();
    const municipalityFeature = findMunicipalityFeature(query);
    if (municipalityFeature) {
      showGeographyHighlight(municipalityFeature, 'municipality', municipalityFeatureName(municipalityFeature));
      activeSearchSelection = {
        type: 'municipality',
        id: municipalityFeature?.properties?.geoid || municipalityFeatureName(municipalityFeature),
        name: municipalityFeatureName(municipalityFeature),
        feature: municipalityFeature,
        summary: null
      };
      await renderSearchSummary();
      setStatus(MAP_LABELS.loaded, false);
      setSearchExpanded(false);
      return;
    }

    const result = await geocodeQuery(query);
    if (!result) {
      clearSearchResultLayer();
      clearSearchSummary();
      setStatus(MAP_LABELS.searchNotFound);
      return;
    }

    clearSearchResultLayer();
    clearSearchSummary();
    clearUserLocationLayers();

    const lat = Number(result.lat);
    const lon = Number(result.lon);

    searchResultLayer = L.circleMarker([lat, lon], {
      radius: 7,
      color: '#1e63b6',
      weight: 2,
      fillColor: '#ffffff',
      fillOpacity: 0.95
    }).addTo(map);

    searchResultLayer.on('click', (event) => {
      if (event.originalEvent) {
        L.DomEvent.stopPropagation(event.originalEvent);
      }
    });

    searchResultLayer.bindTooltip(valueOrFallback(result.display_name), {
      direction: 'top',
      offset: [0, -8],
      opacity: 1
    }).openTooltip();

    if (result.boundingbox && result.boundingbox.length === 4) {
      const [south, north, west, east] = result.boundingbox.map(Number);
      map.fitBounds([[south, west], [north, east]], {
        padding: [30, 30],
        maxZoom: 15
      });
    } else {
      map.setView([lat, lon], 15);
    }

    setStatus(MAP_LABELS.loaded, false);
    setSearchExpanded(false);
  } catch (error) {
    console.error(error);
    setStatus(MAP_LABELS.searchNotFound);
  }
}

function locateUser() {
  if (!navigator.geolocation) {
    setStatus(MAP_LABELS.geolocationUnavailable);
    return;
  }

  setStatus('Finding your location...');
  navigator.geolocation.getCurrentPosition(
    (position) => {
      clearSearchResultLayer();
      clearUserLocationLayers();

      const { latitude, longitude, accuracy } = position.coords;
      userLocationMarker = L.circleMarker([latitude, longitude], {
        radius: 7,
        color: '#1e63b6',
        weight: 2,
        fillColor: '#1e63b6',
        fillOpacity: 0.9
      }).addTo(map);

      userLocationCircle = L.circle([latitude, longitude], {
        radius: accuracy,
        color: '#1e63b6',
        weight: 1,
        fillColor: '#1e63b6',
        fillOpacity: 0.08
      }).addTo(map);

      userLocationMarker.bindTooltip('Your location', {
        direction: 'top',
        offset: [0, -8],
        opacity: 1
      }).openTooltip();

      map.setView([latitude, longitude], 16);
      setStatus(MAP_LABELS.loaded, false);
    },
    (error) => {
      if (error.code === 1) {
        setStatus(MAP_LABELS.geolocationDenied);
      } else {
        setStatus(MAP_LABELS.geolocationFailed);
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    }
  );
}

async function initializeMap() {
  try {
    setStatus(MAP_LABELS.loading);
    initializeLegend();
    initializeMapPanes();
    populateDropdown();
    addBasemap();

    const [countyData, zipData, loadedWellsData] = await Promise.all([
      loadJson(DATA_PATHS.county),
      loadJson(DATA_PATHS.zipPolygons),
      loadJson(DATA_PATHS.wells)
    ]);

    countyMaskFeature = countyData.features?.[0] || null;
    zipPolygonData = clipFeatureCollectionToCounty(zipData);
    wellsData = loadedWellsData;
    countyBounds = L.geoJSON(countyData).getBounds();

    countyLayer = L.geoJSON(countyData, {
      interactive: false,
      pane: MAP_PANES.county,
      style: {
        color: '#2d5f73',
        fillColor: '#dcece5',
        fillOpacity: 0.18,
        weight: 2
      }
    }).addTo(map);

    updateVisiblePackage();
    fitMapToData();
    map.on('zoomend moveend', refreshVisibleWellTooltips);
    map.on('move zoom resize', updateGeologyCountyClip);
    map.on('click', handleMapClickForSearchSelection);
    updateGeologyCountyClip();
    setStatus(MAP_LABELS.loaded, false);
  } catch (error) {
    console.error(error);
    setStatus(MAP_LABELS.error);
  }
}

packageSelect.addEventListener('change', updateVisiblePackage);
packageSelect.addEventListener('change', () => {
  if (activeSearchSelection) {
    renderSearchSummary();
  }
});
if (legendToggle) {
  legendToggle.addEventListener('click', toggleLegend);
}
if (searchToggle) {
  searchToggle.addEventListener('click', () => {
    const isExpanded = searchToggle.getAttribute('aria-expanded') === 'true';
    setSearchExpanded(!isExpanded);
  });
}
searchButton.addEventListener('click', handleSearch);
if (locateButton) {
  locateButton.addEventListener('click', locateUser);
}
if (refreshButton) {
  refreshButton.addEventListener('click', resetMapView);
}
if (layersToggle) {
  layersToggle.addEventListener('click', () => {
    const isExpanded = layersToggle.getAttribute('aria-expanded') === 'true';
    setLayersPanelExpanded(!isExpanded);
  });
}
if (layersClose) {
  layersClose.addEventListener('click', () => {
    setLayersPanelExpanded(false);
  });
}
countySubdivisionsToggle?.addEventListener('change', (event) => {
  toggleContextLayer('countySubdivisions', event.target.checked);
});
privateWellsToggle?.addEventListener('change', (event) => {
  togglePrivateWellsLayer(event.target.checked);
});
zipAreasToggle?.addEventListener('change', (event) => {
  toggleContextLayer('zipAreas', event.target.checked);
});
geologyToggle?.addEventListener('change', (event) => {
  toggleContextLayer('geology', event.target.checked);
});
searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleSearch();
  } else if (event.key === 'Escape') {
    setSearchExpanded(false);
    setLayersPanelExpanded(false);
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setSearchExpanded(false);
    setLayersPanelExpanded(false);
  }
});
document.addEventListener('click', (event) => {
  if (!searchShell || searchShell.contains(event.target)) return;
  setSearchExpanded(false);
  setLayersPanelExpanded(false);
});

initializeMap();


