// @ts-nocheck
// This file wraps plain JS/DOM logic inside React (see note below) rather
// than being fully re-typed for TypeScript's strict mode. @ts-nocheck skips
// type-checking for this file only — a normal, common approach when
// integrating existing vanilla JS into a TS codebase under time pressure.
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Header from "@/components/Header";

// This page was built as a standalone OSM/Leaflet prototype and adapted into
// a React component. The map, routing, and UI logic run as plain DOM/JS
// inside useEffect (the same way you'd wire up any non-React JS library into
// React) rather than being rewritten as React state — this keeps the exact
// behavior that was already tested working.
//
// Setup required before this file will run:
//   npm install leaflet
//   npm install -D @types/leaflet

export default function RideBooking() {
  useEffect(() => {

  const map = L.map('map').setView([43.6532, -79.3832], 12); // Toronto default

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // ---- Fare formula (adjust to match your team's actual pricing) ----
  const FARE = { base: 3.5, perKm: 1.75, perMin: 0.35 };

  // ---- Cab type + superfast pickup ----
  const CAB_MULTIPLIERS = { normal: 1, luxury: 1.8 };
  const SUPERFAST_SURCHARGE = 10; // flat CAD charge
  let selectedCabType = 'normal';
  let superfastSelected = false;

  let routeLayer = null;
  let pickupMarker = null;
  let dropMarker = null;
  let pickupCoords = null;
  let dropCoords = null;
  let pickingMode = null; // null | 'pickup' | 'drop'

  // ---- Car tracking state ----
  let carMarker = null;
  let carRouteCoords = [];   // full list of [lat, lng] points along the route
  let carStepIndex = 0;
  let carIntervalId = null;
  const CAR_UPDATE_MS = 5000; // move the car every 5 seconds, like a live delivery tracker

  // stored so fuel cost can recalculate live when mileage/price inputs change
  let lastDistanceKm = null;
  let lastFareParts = null; // { base, distanceCharge, timeCharge, distanceKm, durationMin }

  const pickupInput = document.getElementById('pickup');
  const dropInput = document.getElementById('drop');
  const pickupPinBtn = document.getElementById('pickup-pin');
  const dropPinBtn = document.getElementById('drop-pin');
  const pickupRow = document.getElementById('pickup-row');
  const dropRow = document.getElementById('drop-row');
  const mapHint = document.getElementById('map-hint');
  const mapHintText = document.getElementById('map-hint-text');
  const mapWrap = document.getElementById('map-wrap');
  const statusEl = document.getElementById('status');
  const meterEl = document.getElementById('meter');

  // ---- Multiple stops (waypoints) ----
  const stopsContainer = document.getElementById('stops-container');
  const addStopBtn = document.getElementById('add-stop-btn');
  const MAX_STOPS = 3;
  let stops = []; // { id, row, input, pinBtn, marker, coords }
  let stopIdCounter = 0;

  const pinIconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>';

  function addStopRow() {
    if (stops.length >= MAX_STOPS) return;
    const id = 'stop-' + (stopIdCounter++);

    const wrap = document.createElement('div');
    wrap.className = 'field';
    wrap.innerHTML = `
      <label>Stop ${stops.length + 1}</label>
      <div class="stop-row-wrap">
        <div class="input-row" id="${id}-row">
          <input type="text" placeholder="Enter stop address" />
          <button class="pin-btn" title="Set stop on map">${pinIconSvg}</button>
        </div>
        <button class="remove-stop-btn" title="Remove stop">×</button>
      </div>
    `;
    stopsContainer.appendChild(wrap);

    const input = wrap.querySelector('input');
    const pinBtn = wrap.querySelector('.pin-btn');
    const row = wrap.querySelector('.input-row');
    const removeBtn = wrap.querySelector('.remove-stop-btn');

    const stop = { id, wrap, row, input, pinBtn, marker: null, coords: null };
    stops.push(stop);

    input.addEventListener('input', () => { stop.coords = null; row.classList.remove('pinned'); });
    pinBtn.addEventListener('click', () => togglePicking(id));
    removeBtn.addEventListener('click', () => removeStopRow(stop));

    addStopBtn.disabled = stops.length >= MAX_STOPS;
  }

  function removeStopRow(stop) {
    if (stop.marker) map.removeLayer(stop.marker);
    stop.wrap.remove();
    stops = stops.filter(s => s.id !== stop.id);
    // renumber remaining stop labels
    stops.forEach((s, i) => { s.wrap.querySelector('label').textContent = 'Stop ' + (i + 1); });
    addStopBtn.disabled = stops.length >= MAX_STOPS;
  }

  addStopBtn.addEventListener('click', addStopRow);

  // typing manually invalidates any map-set coordinate
  pickupInput.addEventListener('input', () => { pickupCoords = null; pickupRow.classList.remove('pinned'); });
  dropInput.addEventListener('input', () => { dropCoords = null; dropRow.classList.remove('pinned'); });

  pickupPinBtn.addEventListener('click', () => togglePicking('pickup'));
  dropPinBtn.addEventListener('click', () => togglePicking('drop'));

  function getPinBtnFor(field) {
    if (field === 'pickup') return pickupPinBtn;
    if (field === 'drop') return dropPinBtn;
    const stop = stops.find(s => s.id === field);
    return stop ? stop.pinBtn : null;
  }

  function togglePicking(which) {
    if (pickingMode === which) {
      pickingMode = null;
      clearPickingUI();
      return;
    }
    pickingMode = which;
    [pickupPinBtn, dropPinBtn, ...stops.map(s => s.pinBtn)].forEach(btn => {
      btn.classList.toggle('active', btn === getPinBtnFor(which));
    });
    mapHint.classList.add('visible');
    mapHintText.textContent = which === 'pickup' ? 'Tap the map to set pickup'
      : which === 'drop' ? 'Tap the map to set drop'
      : 'Tap the map to set this stop';
    mapWrap.classList.add('picking');
  }

  function clearPickingUI() {
    pickupPinBtn.classList.remove('active');
    dropPinBtn.classList.remove('active');
    stops.forEach(s => s.pinBtn.classList.remove('active'));
    mapHint.classList.remove('visible');
    mapWrap.classList.remove('picking');
  }

  map.on('click', async (e) => {
    // explicit mode wins if the user pressed a pin button
    let targetField = pickingMode;

    // otherwise, fall back to filling whichever field is empty —
    // this makes plain tapping work even without pressing a pin button first.
    // stops are only set explicitly via their own pin button, not by implicit tap.
    if (!targetField) {
      if (!pickupInput.value.trim()) targetField = 'pickup';
      else if (!dropInput.value.trim()) targetField = 'drop';
      else return; // both already set — press a pin button to explicitly override one
    }

    const latlng = e.latlng;
    const address = await reverseGeocode(latlng);

    if (targetField === 'pickup') {
      pickupCoords = { lat: latlng.lat, lng: latlng.lng };
      pickupInput.value = address;
      pickupRow.classList.add('pinned');
      if (pickupMarker) map.removeLayer(pickupMarker);
      pickupMarker = L.marker(latlng).addTo(map).bindPopup('Pickup').openPopup();
    } else if (targetField === 'drop') {
      dropCoords = { lat: latlng.lat, lng: latlng.lng };
      dropInput.value = address;
      dropRow.classList.add('pinned');
      if (dropMarker) map.removeLayer(dropMarker);
      dropMarker = L.marker(latlng).addTo(map).bindPopup('Drop').openPopup();
    } else {
      const stop = stops.find(s => s.id === targetField);
      if (stop) {
        stop.coords = { lat: latlng.lat, lng: latlng.lng };
        stop.input.value = address;
        stop.row.classList.add('pinned');
        if (stop.marker) map.removeLayer(stop.marker);
        stop.marker = L.marker(latlng).addTo(map).bindPopup('Stop').openPopup();
      }
    }

    pickingMode = null;
    clearPickingUI();
    updateDefaultHint();
  });

  // shows a helpful hint even before the user presses any pin button
  function updateDefaultHint() {
    if (pickingMode) return; // explicit picking mode has its own message
    if (!pickupInput.value.trim()) {
      mapHintText.textContent = 'Tap the map to set pickup';
      mapHint.classList.add('visible');
    } else if (!dropInput.value.trim()) {
      mapHintText.textContent = 'Tap the map to set drop';
      mapHint.classList.add('visible');
    } else {
      mapHint.classList.remove('visible');
    }
  }

  pickupInput.addEventListener('input', updateDefaultHint);
  dropInput.addEventListener('input', updateDefaultHint);
  updateDefaultHint(); // show hint on page load

  // ---------------------------------------------------------
  // SOS / Emergency panel
  // ---------------------------------------------------------
  const sosBtn = document.getElementById('sos-btn');
  const sosPanel = document.getElementById('sos-panel');
  const sosNote = document.getElementById('sos-note');
  const sosShareBtn = document.getElementById('sos-share-btn');

  sosBtn.addEventListener('click', () => {
    sosPanel.classList.toggle('visible');
    sosNote.textContent = '';
  });

  sosShareBtn.addEventListener('click', () => {
    // In production this would send live coordinates + trip details to an
    // emergency contact / support team via your backend. Kept as a simple
    // confirmation here since there's no real contact/backend wired up yet.
    const hasTrip = pickupInput.value.trim() && dropInput.value.trim();
    sosNote.textContent = hasTrip
      ? 'Trip status and location shared with your emergency contact.'
      : 'No active trip yet — location will be shared once a ride starts.';
  });

  async function reverseGeocode(latlng) {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=jsonv2`;
      const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
      const data = await res.json();
      return data.display_name || `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`;
    } catch {
      return `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`;
    }
  }

  async function geocode(address) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=ca`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    const data = await res.json();
    if (data.length === 0) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  }

  document.getElementById('get-route-btn').addEventListener('click', handleSearch);

  async function handleSearch() {
    const pickupText = pickupInput.value.trim();
    const dropText = dropInput.value.trim();

    if (!pickupText || !dropText) {
      setStatus('Enter both a pickup and drop location.', true);
      return;
    }

    setStatus('Locating addresses…');

    let pickup = pickupCoords;
    let drop = dropCoords;

    if (!pickup) pickup = await geocode(pickupText);
    if (!drop) drop = await geocode(dropText);

    if (!pickup) { setStatus(`Couldn't find "${pickupText}". Try adding a city or postal code.`, true); return; }
    if (!drop) { setStatus(`Couldn't find "${dropText}". Try adding a city or postal code.`, true); return; }

    // resolve any stop rows that have text entered (blank stop rows are skipped)
    const resolvedStops = [];
    for (const stop of stops) {
      const text = stop.input.value.trim();
      if (!text) continue;
      let coords = stop.coords;
      if (!coords) coords = await geocode(text);
      if (!coords) { setStatus(`Couldn't find stop "${text}". Try adding a city or postal code.`, true); return; }
      resolvedStops.push(coords);
    }

    if (pickupMarker) map.removeLayer(pickupMarker);
    if (dropMarker) map.removeLayer(dropMarker);
    pickupMarker = L.marker([pickup.lat, pickup.lng]).addTo(map).bindPopup('Pickup');
    dropMarker = L.marker([drop.lat, drop.lng]).addTo(map).bindPopup('Drop');

    const waypoints = [pickup, ...resolvedStops, drop];

    resetTripUI();
    setStatus('Calculating route…');
    await getRoute(waypoints);
    renderWeather(pickup, drop);
  }

  async function getRoute(waypoints) {
    const coordString = waypoints.map(p => `${p.lng},${p.lat}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson&steps=true`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!data.routes || data.routes.length === 0) {
        setStatus('No route found between these points.', true);
        return;
      }

      const route = data.routes[0];
      const distanceKm = route.distance / 1000;
      const durationMin = route.duration / 60;
      const baseFareAmount = FARE.base;
      const distanceCharge = distanceKm * FARE.perKm;
      const timeCharge = durationMin * FARE.perMin;

      // exact clock time of arrival = now + trip duration
      const arrivalDate = new Date(Date.now() + route.duration * 1000);
      const arrivalLabel = arrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (routeLayer) map.removeLayer(routeLayer);
      routeLayer = L.geoJSON(route.geometry, { style: { color: '#B9291F', weight: 5 } }).addTo(map);
      map.fitBounds(routeLayer.getBounds(), { padding: [40, 40] });

      document.getElementById('meter-distance').textContent = distanceKm.toFixed(2) + ' km';
      document.getElementById('meter-time').textContent = Math.round(durationMin) + ' min';
      document.getElementById('meter-arrival').textContent = 'By ' + arrivalLabel + ' (in ' + Math.round(durationMin) + ' min)';
      meterEl.classList.add('visible');

      // store the non-fuel fare parts; fuel cost (and therefore the total)
      // gets computed separately since mileage/fuel price can change live
      lastFareParts = { base: baseFareAmount, distanceCharge, timeCharge, distanceKm, durationMin };
      lastDistanceKm = distanceKm;
      updateFareDisplay();

      setStatus('');
      // a route with stops has multiple "legs" (one per segment) — flatten
      // every leg's turn-by-turn steps into a single ordered directions list
      const allSteps = [];
      route.legs.forEach(leg => allSteps.push(...leg.steps));
      renderDirections(allSteps);
      startCarTracking(route.geometry.coordinates, route.duration);

    } catch (err) {
      setStatus('Error fetching route. Check your connection.', true);
      console.error(err);
    }
  }

  function renderDirections(steps) {
    const list = document.getElementById('directions-list');
    list.innerHTML = '';
    steps.forEach((step, i) => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="step-num">${String(i + 1).padStart(2, '0')}</span><span>${buildInstruction(step)}</span>`;
      list.appendChild(li);
    });
  }

  function buildInstruction(step) {
    const type = step.maneuver.type;
    const modifier = step.maneuver.modifier;
    const roadName = step.name || 'the road';
    const distance = step.distance.toFixed(0);

    let action = 'Continue';
    if (type === 'depart') action = 'Start';
    else if (type === 'arrive') action = 'Arrive at destination';
    else if (type === 'turn') action = `Turn ${modifier}`;
    else if (type === 'roundabout') action = 'Enter roundabout and take exit';
    else if (type === 'merge') action = `Merge ${modifier}`;
    else if (type === 'fork') action = `Keep ${modifier} at the fork`;
    else if (type === 'end of road') action = `Turn ${modifier} at end of road`;

    return `${action} onto ${roadName} (${distance} m)`;
  }

  function setStatus(msg, isError = false) {
    statusEl.textContent = msg;
    statusEl.classList.toggle('error', isError);
  }

  // ---------------------------------------------------------
  // Live weather at pickup & drop — via Open-Meteo (free, no API key)
  // ---------------------------------------------------------
  async function fetchWeather(lat, lng) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`;
      const res = await fetch(url);
      const data = await res.json();
      return data.current_weather || null;
    } catch (err) {
      console.error('Weather fetch error:', err);
      return null;
    }
  }

  // maps WMO weather codes (used by Open-Meteo) to a simple icon + label
  function describeWeather(code) {
    if (code === 0) return { icon: '☀️', label: 'Clear' };
    if ([1, 2, 3].includes(code)) return { icon: '⛅', label: 'Partly cloudy' };
    if ([45, 48].includes(code)) return { icon: '🌫️', label: 'Fog' };
    if ([51, 53, 55, 56, 57].includes(code)) return { icon: '🌦️', label: 'Drizzle' };
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { icon: '🌧️', label: 'Rain' };
    if ([71, 73, 75, 77, 85, 86].includes(code)) return { icon: '❄️', label: 'Snow' };
    if ([95, 96, 99].includes(code)) return { icon: '⛈️', label: 'Thunderstorm' };
    return { icon: '🌡️', label: 'Weather' };
  }

  async function renderWeather(pickup, drop) {
    const weatherCard = document.getElementById('weather-card');
    weatherCard.classList.add('visible');

    const pickupEl = document.getElementById('weather-pickup');
    const dropEl = document.getElementById('weather-drop');
    pickupEl.textContent = 'Loading…';
    dropEl.textContent = 'Loading…';

    const [pickupWeather, dropWeather] = await Promise.all([
      fetchWeather(pickup.lat, pickup.lng),
      fetchWeather(drop.lat, drop.lng)
    ]);

    if (pickupWeather) {
      const info = describeWeather(pickupWeather.weathercode);
      pickupEl.textContent = `${info.icon} ${Math.round(pickupWeather.temperature)}°C · ${info.label}`;
    } else {
      pickupEl.textContent = 'Unavailable';
    }

    if (dropWeather) {
      const info = describeWeather(dropWeather.weathercode);
      dropEl.textContent = `${info.icon} ${Math.round(dropWeather.temperature)}°C · ${info.label}`;
    } else {
      dropEl.textContent = 'Unavailable';
    }
  }

  // ---------------------------------------------------------
  // Car tracking — simulates a driver moving along the route,
  // updating position every 5 seconds (like Swiggy/Zepto tracking)
  // ---------------------------------------------------------

  const carSvg = `
    <svg width="46" height="28" viewBox="0 0 60 36" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="30" cy="33.5" rx="24" ry="2" fill="rgba(0,0,0,0.2)"/>
      <rect x="23" y="0" width="6" height="7" rx="2" fill="#2A2622"/>
      <rect x="31" y="1" width="5" height="6" rx="2" fill="#2A2622"/>
      <rect x="16" y="8" width="28" height="2" rx="1" fill="#2A2622"/>
      <rect x="20" y="10" width="1.6" height="4" fill="#2A2622"/>
      <rect x="38" y="10" width="1.6" height="4" fill="#2A2622"/>
      <path d="M18,20 L23,10 Q26,8 30,8 L34,8 Q38,8 41,10 L46,20 Z" fill="#E5342A" stroke="#8A1F17" stroke-width="1"/>
      <path d="M20,19 L24,11 L36,11 L40,19 Z" fill="#2A2622"/>
      <line x1="30" y1="11" x2="30" y2="19" stroke="#E5342A" stroke-width="1.5"/>
      <rect x="6" y="20" width="48" height="10" rx="4" fill="#E5342A" stroke="#8A1F17" stroke-width="1"/>
      <rect x="50" y="23" width="4" height="3" rx="1" fill="#FFD9A8"/>
      <rect x="34" y="22" width="4" height="1.2" rx="0.6" fill="#8A1F17" opacity="0.6"/>
      <circle cx="16" cy="30" r="4.5" fill="#20201E"/>
      <circle cx="16" cy="30" r="2" fill="#8A8A86"/>
      <circle cx="46" cy="30" r="4.5" fill="#20201E"/>
      <circle cx="46" cy="30" r="2" fill="#8A8A86"/>
    </svg>
  `;

  const carIcon = L.divIcon({
    className: 'car-marker-wrap',
    html: `<span class="car-marker-inner">${carSvg}</span>`,
    iconSize: [46, 28],
    iconAnchor: [23, 26]
  });

  function startCarTracking(geoJsonCoords, totalDurationSeconds) {
    // stop any tracking from a previous route calculation
    stopCarTracking();

    // OSRM gives [lng, lat] pairs — Leaflet wants [lat, lng]
    const fullPath = geoJsonCoords.map(c => [c[1], c[0]]);

    // the car should take exactly as long as the "Estimated time" shown to
    // the user — so the number of 5-second hops is derived from the real
    // route duration instead of a fixed step count
    const updateSeconds = CAR_UPDATE_MS / 1000;
    const stepsForDuration = Math.max(2, Math.round(totalDurationSeconds / updateSeconds));

    carRouteCoords = sampleRoute(fullPath, stepsForDuration);
    carStepIndex = 0;

    if (carMarker) map.removeLayer(carMarker);
    carMarker = L.marker(carRouteCoords[0], { icon: carIcon }).addTo(map);

    document.getElementById('trip-status').classList.add('visible');
    updateTripStatusText();

    carIntervalId = setInterval(advanceCar, CAR_UPDATE_MS);
  }

  function stopCarTracking() {
    if (carIntervalId) {
      clearInterval(carIntervalId);
      carIntervalId = null;
    }
  }

  // reduces a full route (hundreds of points) down to N evenly spaced points
  function sampleRoute(fullPath, steps) {
    if (fullPath.length <= steps) return fullPath;
    const sampled = [];
    const interval = (fullPath.length - 1) / (steps - 1);
    for (let i = 0; i < steps; i++) {
      sampled.push(fullPath[Math.round(i * interval)]);
    }
    return sampled;
  }

  function advanceCar() {
    if (carStepIndex >= carRouteCoords.length - 1) {
      stopCarTracking();
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      document.getElementById('trip-status-text').innerHTML = `Car <strong>arrived</strong> at ${now}`;
      document.getElementById('cancel-ride-btn').style.display = 'none';
      showFeedback();
      return;
    }

    carStepIndex++;
    const nextPos = carRouteCoords[carStepIndex];

    // side-view car looks better flipped left/right than rotated —
    // face right (default) when moving east, flip when moving west
    const prevPos = carRouteCoords[carStepIndex - 1];
    const dLon = nextPos[1] - prevPos[1];
    const facingLeft = dLon < 0;

    carMarker.setLatLng(nextPos);
    const el = carMarker.getElement();
    if (el) {
      const inner = el.querySelector('.car-marker-inner');
      if (inner) inner.style.transform = facingLeft ? 'scaleX(-1)' : 'scaleX(1)';
    }
    updateTripStatusText();
  }

  function updateTripStatusText() {
    const remainingSteps = carRouteCoords.length - 1 - carStepIndex;
    const remainingSeconds = remainingSteps * CAR_UPDATE_MS / 1000;
    const mins = Math.floor(remainingSeconds / 60);
    const secs = Math.round(remainingSeconds % 60);
    const label = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    document.getElementById('trip-eta').textContent = label;
  }

  // ---------------------------------------------------------
  // Fuel cost estimate
  // ---------------------------------------------------------
  const mileageInput = document.getElementById('mileage');
  const fuelPriceInput = document.getElementById('fuel-price');
  const fuelCard = document.getElementById('fuel-card');

  function updateFareDisplay() {
    if (!lastFareParts) return;

    const mileage = parseFloat(mileageInput.value) || 0;
    const fuelPrice = parseFloat(fuelPriceInput.value) || 0;
    const litresRequired = mileage > 0 ? lastFareParts.distanceKm / mileage : 0;
    const fuelCost = litresRequired * fuelPrice;

    // ride fare (base + distance + time) scales with cab type; fuel and the
    // superfast surcharge are flat trip costs added on top
    const rideBaseTotal = lastFareParts.base + lastFareParts.distanceCharge + lastFareParts.timeCharge;
    const cabMultiplier = CAB_MULTIPLIERS[selectedCabType] || 1;
    const cabTypeExtra = rideBaseTotal * (cabMultiplier - 1);
    const superfastCharge = superfastSelected ? SUPERFAST_SURCHARGE : 0;

    const total = rideBaseTotal + cabTypeExtra + fuelCost + superfastCharge;

    document.getElementById('meter-fare').textContent = '$' + total.toFixed(2);
    document.getElementById('bd-base').textContent = '$' + lastFareParts.base.toFixed(2);
    document.getElementById('bd-distance').textContent = '$' + lastFareParts.distanceCharge.toFixed(2) + ' (' + lastFareParts.distanceKm.toFixed(2) + ' km × $' + FARE.perKm.toFixed(2) + ')';
    document.getElementById('bd-time').textContent = '$' + lastFareParts.timeCharge.toFixed(2) + ' (' + Math.round(lastFareParts.durationMin) + ' min × $' + FARE.perMin.toFixed(2) + ')';
    document.getElementById('bd-cabtype').textContent = selectedCabType === 'luxury'
      ? '+$' + cabTypeExtra.toFixed(2) + ' (Luxury, +80%)'
      : 'Included (Normal)';
    document.getElementById('bd-fuel').textContent = mileage > 0
      ? '$' + fuelCost.toFixed(2) + ' (' + litresRequired.toFixed(2) + ' L × $' + fuelPrice.toFixed(2) + ')'
      : '$0.00';
    document.getElementById('bd-superfast').textContent = superfastSelected
      ? '$' + SUPERFAST_SURCHARGE.toFixed(2)
      : 'Not selected';
    document.getElementById('bd-total').textContent = '$' + total.toFixed(2);

    document.getElementById('fuel-litres').textContent = mileage > 0 ? litresRequired.toFixed(2) + ' L' : '—';
    document.getElementById('fuel-cost').textContent = mileage > 0 ? '$' + fuelCost.toFixed(2) : '—';
    fuelCard.classList.add('visible');
  }

  // ---- Cab type selector ----
  const cabTypeButtons = document.querySelectorAll('.cab-type-btn');
  cabTypeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedCabType = btn.dataset.cab;
      cabTypeButtons.forEach(b => b.classList.toggle('active', b === btn));
      updateFareDisplay(); // live update if a route is already calculated
    });
  });

  // ---- Superfast pickup toggle ----
  const superfastToggle = document.getElementById('superfast-toggle');
  superfastToggle.addEventListener('change', () => {
    superfastSelected = superfastToggle.checked;
    updateFareDisplay();
  });

  // recalculate the whole fare (including fuel) live if the user tweaks
  // mileage or fuel price after a route already exists
  mileageInput.addEventListener('input', updateFareDisplay);
  fuelPriceInput.addEventListener('input', updateFareDisplay);

  // ---------------------------------------------------------
  // Cancel ride
  // ---------------------------------------------------------
  document.getElementById('cancel-ride-btn').addEventListener('click', cancelRide);

  function cancelRide() {
    stopCarTracking();
    if (carMarker) {
      map.removeLayer(carMarker);
      carMarker = null;
    }
    document.getElementById('trip-status-text').textContent = 'Ride cancelled.';
    document.getElementById('trip-status').classList.add('cancelled');
    document.getElementById('cancel-ride-btn').style.display = 'none';
  }

  // clears cancel/feedback state whenever a new search starts,
  // so leftover UI from a previous trip doesn't linger
  function resetTripUI() {
    const tripStatus = document.getElementById('trip-status');
    tripStatus.classList.remove('visible', 'cancelled');
    document.getElementById('cancel-ride-btn').style.display = 'inline-block';

    const feedbackCard = document.getElementById('feedback-card');
    feedbackCard.classList.remove('visible');
    document.getElementById('star-rating').style.display = 'flex';
    document.getElementById('feedback-comment').style.display = 'block';
    document.getElementById('feedback-comment').value = '';
    document.getElementById('submit-feedback-btn').style.display = 'inline-block';
    document.getElementById('feedback-thanks').style.display = 'none';

    selectedRating = 0;
    updateStars();
  }

  // ---------------------------------------------------------
  // Feedback / rating
  // ---------------------------------------------------------
  let selectedRating = 0;
  const starButtons = document.querySelectorAll('.star-btn');

  starButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedRating = parseInt(btn.dataset.value, 10);
      updateStars();
    });
  });

  function updateStars() {
    starButtons.forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.value, 10) <= selectedRating);
    });
  }

  function showFeedback() {
    document.getElementById('feedback-card').classList.add('visible');
  }

  document.getElementById('submit-feedback-btn').addEventListener('click', () => {
    if (selectedRating === 0) {
      setStatus('Please select a star rating before submitting.', true);
      return;
    }

    // In production this would POST { rating: selectedRating, comment } to your backend.
    console.log('Feedback submitted:', {
      rating: selectedRating,
      comment: document.getElementById('feedback-comment').value.trim()
    });

    document.getElementById('star-rating').style.display = 'none';
    document.getElementById('feedback-comment').style.display = 'none';
    document.getElementById('submit-feedback-btn').style.display = 'none';
    document.getElementById('feedback-thanks').style.display = 'block';
  });


    // cleanup when the component unmounts, so a second mount (e.g. React
    // StrictMode double-invoke in dev) doesn't leave a duplicate map/interval
    return () => {
      try { stopCarTracking(); } catch (e) {}
      try { map.remove(); } catch (e) {}
    };
  }, []);

  return (
    <>
      <Header />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');

  :root {
    --bg: #FFFFFF;
    --panel: #FFFFFF;
    --panel-alt: #F3F4F6;
    --accent: #E5342A;
    --accent-soft: rgba(229, 52, 42, 0.1);
    --teal: #B9291F;
    --text: #14140F;
    --text-muted: #6B7280;
    --border: #E5E7EB;
    --danger: #D97706;
  }

  * { box-sizing: border-box; }

  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    background: var(--bg);
    color: var(--text);
    font-family: 'Inter', sans-serif;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  .app {
    display: flex;
    height: calc(100vh - 72px);
    margin-top: 72px;
    width: 100%;
  }

  /* ---------- Left panel ---------- */
  .panel {
    width: 400px;
    min-width: 340px;
    height: 100%;
    overflow-y: auto;
    background: var(--panel);
    border-right: 1px solid var(--border);
    padding: 28px 24px 40px;
    display: flex;
    flex-direction: column;
    gap: 22px;
    transition: background-color 0.3s ease, border-color 0.3s ease;
  }

  .header-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .eyebrow {
    font-size: 0.72rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--accent);
    font-weight: 600;
  }

  h1 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.7rem;
    font-weight: 800;
    margin: 4px 0 0;
    letter-spacing: -0.01em;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .title-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: var(--accent-soft);
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .subtext {
    color: var(--text-muted);
    font-size: 0.88rem;
    margin: 0;
    line-height: 1.5;
  }

  /* ---------- Inputs ---------- */
  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .field label {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    font-weight: 600;
  }

  .input-row {
    display: flex;
    align-items: center;
    background: var(--panel-alt);
    border: 1.5px solid var(--border);
    border-radius: 14px;
    padding: 2px 4px 2px 14px;
    transition: border-color 0.15s ease, background-color 0.3s ease, box-shadow 0.15s ease;
    resize: both;
    overflow: auto;
    min-width: 220px;
    min-height: 44px;
    max-width: 100%;
  }

  .input-row:focus-within {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-soft);
  }

  .input-row.pinned {
    border-color: var(--teal);
  }

  .input-row input {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    color: var(--text);
    font-family: 'Inter', sans-serif;
    font-size: 0.92rem;
    padding: 10px 6px;
  }

  .input-row input::placeholder {
    color: #5B6274;
  }

  .pin-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s ease, color 0.15s ease;
  }

  .pin-btn:hover { background: var(--accent-soft); color: var(--accent); }

  .pin-btn.active {
    background: var(--accent);
    color: #FFFFFF;
  }

  .pin-btn svg { width: 17px; height: 17px; }

  .map-hint {
    font-size: 0.78rem;
    color: var(--accent);
    display: none;
    align-items: center;
    gap: 6px;
    padding: 8px 10px;
    background: var(--accent-soft);
    border-radius: 8px;
  }

  .map-hint.visible { display: flex; }

  .cab-type-options {
    display: flex;
    gap: 10px;
  }

  .cab-type-btn {
    flex: 1;
    background: var(--panel-alt);
    border: 1.5px solid var(--border);
    border-radius: 12px;
    padding: 12px 14px;
    cursor: pointer;
    text-align: left;
    transition: border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease;
  }

  .cab-type-btn:hover { border-color: var(--accent); transform: translateY(-1px); }

  .cab-type-btn.active {
    border-color: var(--accent);
    background: var(--accent-soft);
    box-shadow: 0 4px 14px -6px var(--accent-soft);
  }

  .cab-type-name {
    display: block;
    font-weight: 600;
    font-size: 0.88rem;
    color: var(--text);
  }

  .cab-type-desc {
    display: block;
    font-size: 0.72rem;
    color: var(--text-muted);
    margin-top: 2px;
  }

  .toggle-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.86rem;
    color: var(--text);
    cursor: pointer;
  }

  .toggle-row input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: var(--accent);
    cursor: pointer;
  }

  .toggle-row strong { color: var(--accent); }

  .sos-btn {
    flex-shrink: 0;
    background: var(--danger);
    color: #FFFFFF;
    border: none;
    font-size: 0.78rem;
    font-weight: 700;
    padding: 8px 12px;
    border-radius: 10px;
    cursor: pointer;
    transition: filter 0.15s ease;
  }

  .sos-btn:hover { filter: brightness(1.08); }

  .sos-panel {
    display: none;
    flex-direction: column;
    gap: 8px;
    background: #FFF7ED;
    border: 1px solid var(--danger);
    border-radius: 12px;
    padding: 14px;
  }

  .sos-panel.visible { display: flex; }

  .sos-title {
    margin: 0;
    font-weight: 700;
    font-size: 0.85rem;
    color: var(--danger);
  }

  .sos-action-btn {
    display: block;
    text-align: center;
    text-decoration: none;
    background: #FFFFFF;
    border: 1px solid var(--danger);
    color: var(--danger);
    font-weight: 600;
    font-size: 0.85rem;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
  }

  .sos-action-btn:hover { background: var(--danger); color: #FFFFFF; }

  .sos-note {
    margin: 0;
    font-size: 0.78rem;
    color: var(--text-muted);
    min-height: 16px;
  }

  .add-stop-btn {
    background: none;
    border: 1px dashed var(--border);
    color: var(--accent);
    font-size: 0.82rem;
    font-weight: 600;
    padding: 10px;
    border-radius: 10px;
    cursor: pointer;
    text-align: center;
    transition: border-color 0.15s ease, background-color 0.15s ease;
  }

  .add-stop-btn:hover { border-color: var(--accent); background: var(--accent-soft); }
  .add-stop-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .stop-row-wrap {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .stop-row-wrap .input-row { flex: 1; }

  .remove-stop-btn {
    flex-shrink: 0;
    background: none;
    border: 1px solid var(--border);
    color: var(--text-muted);
    width: 34px;
    height: 34px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;
    transition: border-color 0.15s ease, color 0.15s ease;
  }

  .remove-stop-btn:hover { border-color: var(--danger); color: var(--danger); }

  .weather-grid {
    display: flex;
    gap: 16px;
  }

  .weather-item { flex: 1; }

  .weather-info {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text);
    margin-top: 2px;
  }

  /* ---------- Button ---------- */
  .primary-btn {
    background: var(--accent);
    color: #FFFFFF;
    border: none;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 0.95rem;
    padding: 14px 18px;
    border-radius: 14px;
    cursor: pointer;
    box-shadow: 0 6px 18px -6px var(--accent-soft);
    transition: filter 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
  }

  .primary-btn:hover { filter: brightness(1.06); transform: translateY(-1px); box-shadow: 0 10px 22px -6px var(--accent-soft); }
  .primary-btn:active { transform: scale(0.98); }
  .primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .status {
    font-size: 0.82rem;
    color: var(--text-muted);
    min-height: 18px;
  }

  .status.error { color: var(--danger); }

  /* ---------- Fare meter ---------- */
  .meter {
    background: var(--panel-alt);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 22px;
    display: none;
    flex-direction: column;
    gap: 16px;
    position: relative;
    box-shadow: 0 1px 2px rgba(20, 20, 15, 0.04), 0 8px 24px -14px rgba(20, 20, 15, 0.18);
    transition: background-color 0.3s ease, border-color 0.3s ease;
  }

  .meter.visible { display: flex; }

  .meter-row-2col {
    display: flex;
    gap: 16px;
  }

  .meter-row-2col .meter-item { flex: 1; }

  /* ---------- Fuel subcard ---------- */
  .subcard {
    background: var(--panel-alt);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 20px 22px;
    display: none;
    flex-direction: column;
    gap: 14px;
    box-shadow: 0 1px 2px rgba(20, 20, 15, 0.04), 0 8px 24px -14px rgba(20, 20, 15, 0.18);
    transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.2s ease, transform 0.2s ease;
  }

  .subcard.visible { display: flex; }

  .card-title {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 600;
    font-size: 0.92rem;
    margin: 0;
  }

  .fuel-inputs {
    display: flex;
    gap: 12px;
  }

  .mini-field {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .mini-field label {
    font-size: 0.64rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--text-muted);
    font-weight: 600;
  }

  .mini-field input {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 8px 10px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.85rem;
    color: var(--text);
    width: 100%;
  }

  .fuel-outputs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .meter::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 14px;
    box-shadow: 0 0 0 1px var(--accent-soft), 0 0 24px -6px var(--accent-soft);
    pointer-events: none;
  }

  .meter-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .meter-item.full { border-top: 1px solid var(--border); padding-top: 14px; }

  .meter-label {
    font-size: 0.66rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-muted);
    font-weight: 600;
  }

  .meter-value {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text);
  }

  .meter-item.full .meter-value {
    color: var(--accent);
    font-size: 1.9rem;
  }

  #meter-arrival {
    color: var(--text);
    font-size: 1.15rem;
  }

  .fare-breakdown {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .breakdown-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.78rem;
    color: var(--text-muted);
    font-family: 'IBM Plex Mono', monospace;
  }

  .breakdown-row span:last-child { color: var(--text); }

  .breakdown-row.total {
    border-top: 1px solid var(--border);
    padding-top: 5px;
    margin-top: 2px;
    color: var(--text);
    font-weight: 600;
  }

  .breakdown-row.total span:last-child { color: var(--accent); }

  /* ---------- Directions ---------- */
  .directions-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    margin: 6px 0 0;
  }

  .directions-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .directions-list li {
    display: flex;
    gap: 12px;
    font-size: 0.86rem;
    line-height: 1.4;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border);
  }

  .directions-list li:last-child { border-bottom: none; padding-bottom: 0; }

  .step-num {
    font-family: 'IBM Plex Mono', monospace;
    color: var(--teal);
    font-size: 0.78rem;
    min-width: 20px;
  }

  .directions-empty {
    color: var(--text-muted);
    font-size: 0.85rem;
    font-style: italic;
  }

  /* ---------- Map ---------- */
  .map-wrap {
    flex: 1;
    position: relative;
    height: 100%;
  }

  #map {
    height: 100%;
    width: 100%;
  }

  .map-wrap.picking #map {
    cursor: crosshair;
  }

  /* ---------- Car tracker ---------- */
  .car-marker-inner {
    display: inline-block;
    filter: drop-shadow(0 2px 3px rgba(0,0,0,0.3));
    transition: transform 0.4s ease;
    transform-origin: center;
  }

  .car-marker-inner svg {
    display: block;
  }

  .trip-status {
    display: none;
    flex-direction: column;
    gap: 10px;
    background: var(--panel-alt);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 14px 16px;
    box-shadow: 0 1px 2px rgba(20, 20, 15, 0.04), 0 8px 24px -14px rgba(20, 20, 15, 0.18);
    transition: background-color 0.3s ease, border-color 0.3s ease;
  }

  .trip-status.visible { display: flex; }

  .trip-status-label {
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--accent);
  }

  .trip-status-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .trip-status.cancelled .trip-dot {
    background: var(--danger);
    animation: none;
  }

  .cancel-btn {
    margin-left: auto;
    flex-shrink: 0;
    background: none;
    border: 1px solid var(--danger);
    color: var(--danger);
    font-size: 0.72rem;
    font-weight: 600;
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
  }

  .cancel-btn:hover { background: var(--danger); color: #fff; }

  /* ---------- Feedback ---------- */
  .star-rating {
    display: flex;
    gap: 6px;
  }

  .star-btn {
    background: none;
    border: none;
    font-size: 1.7rem;
    line-height: 1;
    color: var(--border);
    cursor: pointer;
    padding: 0;
    transition: color 0.15s ease, transform 0.1s ease;
  }

  .star-btn:hover, .star-btn.active { color: var(--accent); }
  .star-btn:active { transform: scale(0.9); }

  #feedback-comment {
    width: 100%;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px;
    font-family: 'Inter', sans-serif;
    font-size: 0.85rem;
    color: var(--text);
    resize: vertical;
    box-sizing: border-box;
    transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
  }

  .feedback-thanks {
    color: var(--accent);
    font-weight: 600;
    font-size: 0.88rem;
    text-align: center;
    margin: 0;
  }

  .trip-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent);
    flex-shrink: 0;
    animation: pulse-dot 1.4s ease-in-out infinite;
  }

  @keyframes pulse-dot {
    0%, 100% { box-shadow: 0 0 0 0 var(--accent-soft); }
    50% { box-shadow: 0 0 0 6px transparent; }
  }

  .trip-status-text {
    font-size: 0.82rem;
    color: var(--text);
  }

  .trip-status-text strong {
    color: var(--accent);
    font-family: 'IBM Plex Mono', monospace;
  }

  /* ---------- Responsive ---------- */
  @media (max-width: 760px) {
    .app { flex-direction: column; }
    .panel { width: 100%; min-width: 0; height: auto; max-height: 55vh; border-right: none; border-bottom: 1px solid var(--border); }
    .map-wrap { height: 45vh; }
  }

      `}</style>
<div className="app">
  <div className="panel">
    <div className="header-row">
      <div>
        <div className="eyebrow">Route Planner</div>
        <h1><span className="title-badge">🚕</span> Plan your ride</h1>
        <p className="subtext">Type an address, or use the pin to set a location by tapping the map.</p>
      </div>
      <button className="sos-btn" id="sos-btn" title="Emergency SOS">🆘 SOS</button>
    </div>

    <div className="sos-panel" id="sos-panel">
      <p className="sos-title">Emergency options</p>
      <a className="sos-action-btn" href="tel:911">📞 Call Emergency Services</a>
      <button className="sos-action-btn" id="sos-share-btn" type="button">📍 Share My Trip Status</button>
      <p className="sos-note" id="sos-note"></p>
    </div>

    <div className="field">
      <label htmlFor="pickup">Pickup</label>
      <div className="input-row" id="pickup-row">
        <input type="text" id="pickup" placeholder="Enter pickup address" />
        <button className="pin-btn" id="pickup-pin" title="Set pickup on map">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
        </button>
      </div>
    </div>

    <div className="field">
      <label htmlFor="drop">Drop</label>
      <div className="input-row" id="drop-row">
        <input type="text" id="drop" placeholder="Enter drop address" />
        <button className="pin-btn" id="drop-pin" title="Set drop on map">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
        </button>
      </div>
    </div>

    <div id="stops-container"></div>
    <button className="add-stop-btn" id="add-stop-btn">+ Add stop</button>

    <div className="field">
      <label>Cab type</label>
      <div className="cab-type-options">
        <button type="button" className="cab-type-btn active" id="cab-type-normal" data-cab="normal">
          <span className="cab-type-name">Normal</span>
          <span className="cab-type-desc">Standard ride</span>
        </button>
        <button type="button" className="cab-type-btn" id="cab-type-luxury" data-cab="luxury">
          <span className="cab-type-name">Luxury</span>
          <span className="cab-type-desc">Premium cars, +80%</span>
        </button>
      </div>
    </div>

    <label className="toggle-row" htmlFor="superfast-toggle">
      <input type="checkbox" id="superfast-toggle" />
      <span>Priority Pickup <strong>(+$10.00 CAD)</strong></span>
    </label>

    <div className="map-hint" id="map-hint">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M2 12h20"/></svg>
      <span id="map-hint-text">Tap the map to set pickup</span>
    </div>

    <button className="primary-btn" id="get-route-btn">Calculate route</button>
    <div className="status" id="status"></div>

    <div className="meter" id="meter">
      <div className="meter-row-2col">
        <div className="meter-item">
          <div className="meter-label">Distance</div>
          <div className="meter-value" id="meter-distance">—</div>
        </div>
        <div className="meter-item">
          <div className="meter-label">Time</div>
          <div className="meter-value" id="meter-time">—</div>
        </div>
      </div>
      <div className="meter-item full">
        <div className="meter-label">Estimated fare (CAD)</div>
        <div className="meter-value" id="meter-fare">—</div>
        <div className="fare-breakdown" id="fare-breakdown">
          <div className="breakdown-row"><span>Base fare</span><span id="bd-base">—</span></div>
          <div className="breakdown-row"><span>Distance charge</span><span id="bd-distance">—</span></div>
          <div className="breakdown-row"><span>Time charge</span><span id="bd-time">—</span></div>
          <div className="breakdown-row"><span>Cab type</span><span id="bd-cabtype">—</span></div>
          <div className="breakdown-row"><span>Fuel cost</span><span id="bd-fuel">—</span></div>
          <div className="breakdown-row"><span>Priority Pickup</span><span id="bd-superfast">—</span></div>
          <div className="breakdown-row total"><span>Total</span><span id="bd-total">—</span></div>
        </div>
      </div>
      <div className="meter-item full">
        <div className="meter-label">Estimated arrival</div>
        <div className="meter-value" id="meter-arrival">—</div>
      </div>
    </div>

    <div className="subcard" id="weather-card">
      <p className="card-title">Weather at pickup &amp; drop</p>
      <div className="weather-grid">
        <div className="weather-item">
          <div className="meter-label">Pickup</div>
          <div className="weather-info" id="weather-pickup">—</div>
        </div>
        <div className="weather-item">
          <div className="meter-label">Drop</div>
          <div className="weather-info" id="weather-drop">—</div>
        </div>
      </div>
    </div>

    <div className="trip-status" id="trip-status">
      <span className="trip-status-label">🔴 Live Tracking</span>
      <div className="trip-status-row">
        <div className="trip-dot"></div>
        <div className="trip-status-text" id="trip-status-text">Car is on the way — <strong id="trip-eta">—</strong> remaining</div>
        <button className="cancel-btn" id="cancel-ride-btn">Cancel</button>
      </div>
    </div>

    <div className="subcard" id="feedback-card">
      <p className="card-title">Rate your ride</p>
      <div className="star-rating" id="star-rating">
        <button className="star-btn" data-value="1">★</button>
        <button className="star-btn" data-value="2">★</button>
        <button className="star-btn" data-value="3">★</button>
        <button className="star-btn" data-value="4">★</button>
        <button className="star-btn" data-value="5">★</button>
      </div>
      <textarea id="feedback-comment" rows="3" placeholder="Optional comments about your ride..."></textarea>
      <button className="primary-btn" id="submit-feedback-btn">Submit feedback</button>
      <p className="feedback-thanks" id="feedback-thanks" style={{display:'none'}}>Thanks for your feedback!</p>
    </div>

    <div className="subcard" id="fuel-card">
      <p className="card-title">Fuel cost estimate</p>
      <div className="fuel-inputs">
        <div className="mini-field">
          <label htmlFor="mileage">Mileage (km/L)</label>
          <input type="number" id="mileage" value="12" min="0.1" step="0.1" />
        </div>
        <div className="mini-field">
          <label htmlFor="fuel-price">Fuel price (CAD/L)</label>
          <input type="number" id="fuel-price" value="1.55" min="0" step="0.01" />
        </div>
      </div>
      <div className="fuel-outputs">
        <div className="meter-item">
          <div className="meter-label">Fuel required</div>
          <div className="meter-value" id="fuel-litres">—</div>
        </div>
        <div className="meter-item">
          <div className="meter-label">Fuel cost</div>
          <div className="meter-value" id="fuel-cost">—</div>
        </div>
      </div>
    </div>

    <div>
      <p className="directions-title">Directions</p>
      <ol className="directions-list" id="directions-list">
        <li className="directions-empty" style={{border:'none'}}>Directions will appear here once a route is calculated.</li>
      </ol>
    </div>
  </div>

  <div className="map-wrap" id="map-wrap">
    <div id="map"></div>
  </div>
</div>
    </>
  );
}
