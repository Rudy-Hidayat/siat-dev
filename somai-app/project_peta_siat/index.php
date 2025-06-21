<?php
$apiUrl = 'https://datalatih.siat.web.id/dataset/e6ae7f53-de58-4694-833e-94880ab62664/resource/6f887563-7ed3-40fd-b55d-b599c0a00ea3/download/gp_bna.json';
$response = file_get_contents($apiUrl);
$gampongData = json_decode($response, true);
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Peta Gampong Banda Aceh</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
        body { margin: 0; padding: 0; font-family: sans-serif; }
        h1 { background: #007b83; color: white; padding: 15px; text-align: center; }
        #map { height: 90vh; width: 100%; }
    </style>
</head>
<body>
    <h1>Peta Lokasi Gampong di Banda Aceh</h1>
    <div id="map"></div>

    <script>
        var map = L.map('map').setView([5.55, 95.32], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        var gampongData = <?php echo json_encode($gampongData); ?>;
        gampongData.forEach(function(gp) {
            if (gp.latitude && gp.longitude) {
                var marker = L.marker([parseFloat(gp.latitude), parseFloat(gp.longitude)]).addTo(map);
                marker.bindPopup(`
                    <b>${gp.nama_gp}</b><br>
                    Kecamatan: ${gp.nama_kec}<br>
                    <a href="${gp.web_gp}" target="_blank">Website</a> |
                    <a href="${gp.sid_gp}" target="_blank">SID</a>
                `);
            }
        });
    </script>
</body>
</html>
