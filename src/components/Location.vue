<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import mapboxgl from 'mapbox-gl'
import type { Map } from 'mapbox-gl'

// Location: 40°43'34.7"N 73°57'18.7"W (converted to decimal: 40.726306, -73.955194)
const officeLocation: [number, number] = [-73.955194, 40.726306]
const locationLink = 'https://www.google.com/maps?q=40.726306,-73.955194'
const locationText = 'Near Messerole & Dobbin in Greenpoint / Williamsburg Brooklyn'

const copied = ref(false)

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(locationLink)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

// Mapbox public token
const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiaGFueXUiLCJhIjoiVlkydzdOYyJ9.sPeGQYjdfhCZomSePFamfg'

const mapContainer = ref<HTMLDivElement | null>(null)
let map: Map | null = null

onMounted(() => {
  if (!mapContainer.value || !mapboxToken) {
    console.warn('Mapbox token not set.')
    return
  }

  mapboxgl.accessToken = mapboxToken

  // Site color palette
  const colors = {
    bgPrimary: '#FFF9F0',      // Cream background
    borderPrimary: '#99B292',   // Green accent
    textPrimary: '#163F00',     // Dark green text
    divider: '#FFCF8A',         // Yellow/orange divider
    heroText: '#0C343D'         // Dark blue-green
  }

  // Use light style as base, then customize colors
  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/light-v11',
    center: officeLocation,
    zoom: 15,
    attributionControl: false
  })

  // Comprehensive color customization to match site theme
  map.on('load', () => {
    if (!map) return

    // Background/land color - cream
    if (map.getLayer('landcover')) {
      map.setPaintProperty('landcover', 'fill-color', colors.bgPrimary)
    }
    if (map.getLayer('landcover-underground')) {
      map.setPaintProperty('landcover-underground', 'fill-color', colors.bgPrimary)
    }

    // Water - soft cream tint
    if (map.getLayer('water')) {
      map.setPaintProperty('water', 'fill-color', colors.bgPrimary)
    }
    if (map.getLayer('waterway')) {
      map.setPaintProperty('waterway', 'line-color', colors.borderPrimary)
      map.setPaintProperty('waterway', 'line-opacity', 0.4)
    }

    // Buildings - soft yellow/orange with transparency
    const buildingLayers = [
      'building',
      'building-top',
      'building-extrusion',
      'building-outline'
    ]
    buildingLayers.forEach(layerId => {
      if (map?.getLayer(layerId)) {
        if (layerId === 'building-outline') {
          map.setPaintProperty(layerId, 'line-color', colors.divider)
          map.setPaintProperty(layerId, 'line-opacity', 0.3)
        } else {
          map.setPaintProperty(layerId, 'fill-color', colors.divider)
          map.setPaintProperty(layerId, 'fill-opacity', 0.25)
        }
      }
    })

    // Roads - green accent colors
    const roadLayers = [
      'road-street',
      'road-primary',
      'road-secondary',
      'road-tertiary',
      'road-trunk',
      'road-motorway'
    ]
    roadLayers.forEach(layerId => {
      if (map?.getLayer(layerId)) {
        const isMajor = layerId.includes('motorway') || layerId.includes('trunk') || layerId.includes('primary')
        map.setPaintProperty(layerId, 'line-color', colors.borderPrimary)
        map.setPaintProperty(layerId, 'line-opacity', isMajor ? 0.6 : 0.4)
      }
    })

    // Road casings (borders)
    const roadCasingLayers = [
      'road-street-casing',
      'road-primary-casing',
      'road-secondary-casing'
    ]
    roadCasingLayers.forEach(layerId => {
      if (map?.getLayer(layerId)) {
        map.setPaintProperty(layerId, 'line-color', colors.textPrimary)
        map.setPaintProperty(layerId, 'line-opacity', 0.2)
      }
    })

    // Parks and green spaces - green with low opacity
    if (map.getLayer('landuse-park')) {
      map.setPaintProperty('landuse-park', 'fill-color', colors.borderPrimary)
      map.setPaintProperty('landuse-park', 'fill-opacity', 0.15)
    }
    if (map.getLayer('landuse-cemetery')) {
      map.setPaintProperty('landuse-cemetery', 'fill-color', colors.borderPrimary)
      map.setPaintProperty('landuse-cemetery', 'fill-opacity', 0.1)
    }

    // Transit - green accent
    if (map.getLayer('transit-line')) {
      map.setPaintProperty('transit-line', 'line-color', colors.borderPrimary)
      map.setPaintProperty('transit-line', 'line-opacity', 0.5)
    }

    // Labels - dark green text
    const labelLayers = [
      'poi-label',
      'road-label',
      'waterway-label',
      'place-label'
    ]
    labelLayers.forEach(layerId => {
      if (map?.getLayer(layerId)) {
        map.setPaintProperty(layerId, 'text-color', colors.textPrimary)
        map.setPaintProperty(layerId, 'text-halo-color', colors.bgPrimary)
      }
    })
  })

  // Add custom marker with site colors
  const markerElement = document.createElement('div')
  markerElement.className = 'custom-marker'
  markerElement.style.width = '24px'
  markerElement.style.height = '24px'
  markerElement.style.borderRadius = '50%'
  markerElement.style.backgroundColor = '#99B292' // --color-border-primary
  markerElement.style.border = '3px solid #FFF9F0' // --color-bg-primary
  markerElement.style.boxShadow = '0 2px 8px rgba(22, 63, 0, 0.3)' // --color-text-primary with opacity
  markerElement.style.cursor = 'pointer'

  new mapboxgl.Marker({ element: markerElement })
    .setLngLat(officeLocation)
    .addTo(map)

  // Add custom controls
  map.addControl(new mapboxgl.NavigationControl(), 'top-right')
})

onUnmounted(() => {
  if (map) {
    map.remove()
  }
})
</script>

<template>
  <section class="section">
    <div class="text-box text-box-left">
      <h3>In-Person</h3>
      <p>My practice is fully in-person. Office is near Messerole & Dobbin in Greenpoint / Williamsburg Brooklyn</p>
      <p>5-minute walk from the Nassau Avenue G Train, and a 20-minute walk from the Bedford Avenue L Train</p>
      <p>Virtual sessions are available when illness, travel, or emergencies prevent us from being in-person.</p>
      <div ref="mapContainer" class="map-container"></div>
      <div class="location-link-container">
        <a :href="locationLink" target="_blank" rel="noopener noreferrer" class="location-link">
          {{ locationText }}
        </a>
        <button @click="copyLink" class="button" :class="{ copied: copied }">
          <span v-if="!copied">Copy link</span>
          <span v-else>Copied!</span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 400px;
  margin-top: 30px;
  border: 1px solid var(--color-border-primary);
  background-color: var(--color-bg-primary);
  overflow: hidden;
  border-radius: 2px;
}

.map-container :deep(.mapboxgl-map) {
  font-family: var(--font-body);
}

.map-container :deep(.mapboxgl-canvas) {
  outline: none;
}

:deep(.mapboxgl-ctrl-logo) {
  display: none;
}

:deep(.mapboxgl-ctrl-attrib) {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: var(--font-size-small);
  padding: 0.25rem 0.5rem;
}

:deep(.mapboxgl-ctrl-group) {
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border-primary);
}

:deep(.mapboxgl-ctrl-group button) {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
}

:deep(.mapboxgl-ctrl-group button:hover) {
  background-color: var(--color-border-divider);
}

.location-link-container {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.location-link {
  flex: 1;
  min-width: 200px;
  color: var(--color-text-primary);
  text-decoration: none;
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.5;
  word-break: break-all;
  padding: 8px 0;
  text-decoration: underline;
  text-decoration-color: transparent;
  text-underline-offset: 2px;
  transition: text-decoration-color 0.2s;
}

.location-link:hover {
  text-decoration-color: var(--color-border-primary);
}

</style>

