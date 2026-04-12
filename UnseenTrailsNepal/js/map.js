/* =========================================================
   Unseen Trails — map.js
   Google Maps JavaScript API integration
   Callback: initGoogleMap (fired by the API script tag)
   ========================================================= */

'use strict';

/* ── Destination pin data — ALL destinations ── */
var MAP_PLACES = {
  'ilam': {
    lat: 26.9115, lng: 87.9272,
    name: 'Ilam',
    desc: 'Tea Gardens · Province No. 1',
    link: 'destination.php?place=ilam'
  },
  'janakpur': {
    lat: 26.7288, lng: 85.9250,
    name: 'Janakpur',
    desc: 'Sacred City · Madhesh Province',
    link: 'destination.php?place=janakpur'
  },
  'koshi-tappu': {
    lat: 26.6318, lng: 87.0036,
    name: 'Koshi Tappu',
    desc: 'Wildlife Reserve · Koshi River',
    link: 'destination.php?place=koshi-tappu'
  },
  'kanchenjunga': {
    lat: 27.7025, lng: 88.1475,
    name: 'Kanchenjunga',
    desc: 'Mountain Trek · Far East Nepal',
    link: 'destination.php?place=kanchenjunga'
  },
  'rara-lake': {
    lat: 29.5258, lng: 82.0823,
    name: 'Rara Lake',
    desc: 'Alpine Lake · Karnali Province',
    link: 'destination.php?place=rara-lake'
  },
  'khaptad': {
    lat: 29.3167, lng: 81.2500,
    name: 'Khaptad National Park',
    desc: 'Sacred Plateau · Far West Nepal',
    link: 'destination.php?place=khaptad'
  },
  'tsho-rolpa': {
    lat: 27.8702, lng: 86.4708,
    name: 'Tsho Rolpa Lake',
    desc: 'Glacial Lake · Rolwaling Valley',
    link: 'destination.php?place=tsho-rolpa'
  },
  'bardia': {
    lat: 28.3167, lng: 81.4833,
    name: 'Bardia National Park',
    desc: 'Jungle Safari · Lumbini Province',
    link: 'destination.php?place=bardia'
  },
  'upper-mustang': {
    lat: 29.1773, lng: 83.9597,
    name: 'Upper Mustang',
    desc: 'Forbidden Kingdom · Gandaki Province',
    link: 'destination.php?place=upper-mustang'
  },
  'dolpo': {
    lat: 29.1500, lng: 82.9500,
    name: 'Dolpo',
    desc: 'Hidden Valley · Karnali Province',
    link: 'destination.php?place=dolpo'
  },
  'phoksundo-lake': {
    lat: 29.1800, lng: 82.9400,
    name: 'Phoksundo Lake',
    desc: 'Deepest Lake · Karnali Province',
    link: 'destination.php?place=phoksundo-lake'
  },
  'gosaikunda': {
    lat: 28.0947, lng: 85.4167,
    name: 'Gosaikunda Lake',
    desc: 'Sacred Lake · Bagmati Province',
    link: 'destination.php?place=gosaikunda'
  },
  'pathibhara': {
    lat: 27.7167, lng: 87.8333,
    name: 'Pathibhara Temple',
    desc: 'Hilltop Shrine · Taplejung',
    link: 'destination.php?place=pathibhara'
  },
  'manaslu': {
    lat: 28.5500, lng: 84.5597,
    name: 'Manaslu Circuit',
    desc: 'Mountain Circuit · Gandaki Province',
    link: 'destination.php?place=manaslu'
  },
  'shey-phoksundo': {
    lat: 29.0800, lng: 82.9700,
    name: 'Shey Phoksundo NP',
    desc: 'Snow Leopard Country · Karnali',
    link: 'destination.php?place=shey-phoksundo'
  },
  'api-himal': {
    lat: 30.0000, lng: 80.9167,
    name: 'Api Himal',
    desc: 'Untouched Peaks · Far West Nepal',
    link: 'destination.php?place=api-himal'
  },
  'sinja-valley': {
    lat: 29.0500, lng: 82.1700,
    name: 'Sinja Valley',
    desc: 'Ancient Capital · Karnali Province',
    link: 'destination.php?place=sinja-valley'
  },
  'tsum-valley': {
    lat: 28.7167, lng: 85.0667,
    name: 'Tsum Valley',
    desc: 'Hidden Sacred Valley · Gandaki',
    link: 'destination.php?place=tsum-valley'
  },
  'nar-phu': {
    lat: 28.7000, lng: 84.1333,
    name: 'Nar Phu Valley',
    desc: 'Restricted Valley · Gandaki Province',
    link: 'destination.php?place=nar-phu'
  },
  'rolwaling': {
    lat: 27.8700, lng: 86.4800,
    name: 'Rolwaling Valley',
    desc: 'Glacial Valley · Bagmati Province',
    link: 'destination.php?place=rolwaling'
  },
  'halesi-mahadev': {
    lat: 27.4500, lng: 86.6000,
    name: 'Halesi Mahadev',
    desc: 'Sacred Caves · Koshi Province',
    link: 'destination.php?place=halesi-mahadev'
  },
  'bandipurr': {
    lat: 27.9333, lng: 84.4167,
    name: 'Bandipur',
    desc: 'Hilltop Town · Gandaki Province',
    link: 'destination.php?place=bandipurr'
  },
  'sundarijal': {
    lat: 27.7667, lng: 85.4333,
    name: 'Sundarijal',
    desc: 'Watershed Trek · Bagmati Province',
    link: 'destination.php?place=sundarijal'
  },
  'dhorpatan': {
    lat: 28.5000, lng: 83.0833,
    name: 'Dhorpatan',
    desc: 'Hunting Reserve · Lumbini Province',
    link: 'destination.php?place=dhorpatan'
  }
};

/* Called automatically by Google Maps API (async defer callback) */
function initGoogleMap() {
  var mapEl = document.getElementById('main-map');
  if (!mapEl) return; /* Not on a page that has the map */

  /* ── Map instance centred on Nepal ── */
  var nepal = { lat: 28.3, lng: 84.1 };

  var map = new google.maps.Map(mapEl, {
    center: nepal,
    zoom: 7,
    mapTypeId: 'terrain',
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM
    },
    styles: [
      { featureType: 'water',      elementType: 'geometry', stylers: [{ color: '#b3d1e8' }] },
      { featureType: 'landscape',  elementType: 'geometry', stylers: [{ color: '#e8f0e9' }] },
      { featureType: 'poi.park',   elementType: 'geometry', stylers: [{ color: '#c5dfc6' }] },
      { featureType: 'road',       elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
      { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#1a6b4a' }, { weight: 2 }] },
      { featureType: 'administrative',         elementType: 'labels.text.fill', stylers: [{ color: '#1a1f2e' }] }
    ]
  });

  /* ── Store globally so script.js sidebar buttons can pan ── */
  window._googleMap = map;
  window._googleMapMarkers = {};

  /* ── Custom SVG marker icon ── */
  var pinSvg = encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 36 46">' +
    '<ellipse cx="18" cy="43" rx="7" ry="3" fill="rgba(0,0,0,0.15)"/>' +
    '<path d="M18 0C8.059 0 0 8.059 0 18c0 13.5 18 28 18 28S36 31.5 36 18C36 8.059 27.941 0 18 0z" fill="#1a6b4a"/>' +
    '<circle cx="18" cy="18" r="8" fill="#ffffff"/>' +
    '<circle cx="18" cy="18" r="4" fill="#1a6b4a"/>' +
    '</svg>'
  );
  var markerIcon = {
    url: 'data:image/svg+xml,' + pinSvg,
    scaledSize: new google.maps.Size(36, 46),
    anchor:     new google.maps.Point(18, 46),
    origin:     new google.maps.Point(0, 0)
  };

  /* Track the currently open InfoWindow so we can close it on map click */
  var openInfoWindow = null;

  /* ── Add markers + info windows for ALL destinations ── */
  Object.entries(MAP_PLACES).forEach(function(entry) {
    var slug = entry[0];
    var place = entry[1];

    var marker = new google.maps.Marker({
      position: { lat: place.lat, lng: place.lng },
      map:      map,
      title:    place.name,
      icon:     markerIcon,
      animation: google.maps.Animation.DROP
    });

    var infoContent =
      '<div style="font-family:Poppins,sans-serif;padding:4px 2px;min-width:150px">' +
        '<div style="font-size:0.92rem;font-weight:700;color:#1a1f2e;margin-bottom:3px">' + place.name + '</div>' +
        '<div style="font-size:0.75rem;color:#8892a4;margin-bottom:8px">' + place.desc + '</div>' +
        '<a href="' + place.link + '" style="' +
          'display:inline-block;background:#1a6b4a;color:#fff;' +
          'font-size:0.73rem;font-weight:600;padding:5px 14px;' +
          'border-radius:999px;text-decoration:none;">' +
          'Explore &rarr;' +
        '</a>' +
      '</div>';

    var infoWindow = new google.maps.InfoWindow({ content: infoContent, maxWidth: 220 });

    marker.googleInfoWindow = infoWindow;
    window._googleMapMarkers[slug] = marker;

    marker.addListener('click', function() {
      /* Close any open windows first */
      if (openInfoWindow) openInfoWindow.close();
      infoWindow.open(map, marker);
      openInfoWindow = infoWindow;

      /* Sync sidebar active state */
      document.querySelectorAll('.map-place-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.slug === slug);
      });
    });
  });

  /* Close info window when clicking the map background */
  map.addListener('click', function() {
    if (openInfoWindow) {
      openInfoWindow.close();
      openInfoWindow = null;
    }
    document.querySelectorAll('.map-place-btn').forEach(function(btn) {
      btn.classList.remove('active');
    });
  });

  /* ── Fit Nepal bounds using the four primary sidebar locations ── */
  var primarySlugs = ['ilam', 'janakpur', 'koshi-tappu', 'kanchenjunga'];
  var bounds = new google.maps.LatLngBounds();
  primarySlugs.forEach(function(slug) {
    var p = MAP_PLACES[slug];
    if (p) bounds.extend({ lat: p.lat, lng: p.lng });
  });
  map.fitBounds(bounds, { top: 60, right: 60, bottom: 60, left: 60 });
}
