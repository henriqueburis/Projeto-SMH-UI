import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import TileWMS from 'ol/source/TileWMS';
import Vector from 'ol/source/Vector';
import Stamen from 'ol/source/Stamen';
import GeoJSON from 'ol/format/GeoJSON';

import FullScreen from 'ol/control/FullScreen';
import DragRotateAndZoom from 'ol/interaction/DragRotateAndZoom';

import Select from 'ol/interaction/Select';
import { Icon, Style, Stroke } from 'ol/style';
import control from 'ol/control';


// import VectorSource from 'ol/source';
// import Overlay from 'ol/Overlay';
// import xx from '';
// import Point from 'ol/geom/Point';
// import Feature from 'ol/Feature';
// import VectorLayer from 'ol/layer';


import { MapService } from 'src/app/map.service';
import { mapToMapExpression } from '@angular/compiler/src/render3/util';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  private map;
  private busca;
  private features = [];
  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.initilizeMap();
    this.initilizeJson();
  }

  initilizeMap() {


    var baciashidrografica = new TileLayer({
      title: 'torreEnergia',
      source: new TileWMS({
        url: 'http://www.geoservicos.ibge.gov.br/geoserver/wms?',
        params: {
          'LAYERS': 'CGEO:ANMS2010_06_baciashidrograficas',
          'VERSION': '1.1.1',
          'FORMAT': 'image/png',
          'EPSG': '4326',
          'TILED': true
        },
        preload: Infinity,
        opacity: 1,
        projection: 'EPSG:4326',
        serverType: 'geoserver',
        visible: true,
        name: 'layer_baciashidrografica'
      })
    });


    var prec4km = new TileLayer({
      source: new TileWMS({
        url: 'http://www.terrama2.dpi.inpe.br/curso/geoserver/wms?',
        params: {
          'LAYERS': 'terrama2_506:view506',
          'VERSION': '1.1.1',
          'FORMAT': 'image/png',
          'EPSG': '4326',
          'TILED': true,
          'TIME': '2019-01-01'
        },
        preload: Infinity,
        opacity: 20,
        projection: 'EPSG:4326',
        serverType: 'geoserver',
        visible: false,
        name: 'layer_pcd'
      })
    });

    var pcd = new TileLayer({
      source: new TileWMS({
        url: 'http://localhost:8080/geoserver/wms?',
        params: {
          'LAYERS': 'terrama2_1:view1',
          'VERSION': '1.1.1',
          'FORMAT': 'image/png',
          'EPSG': '4326',
          'TILED': true
        },
        projection: 'EPSG:4326',
        serverType: 'geoserver',
        visible: false,
        name: 'layer_pcd'
      })
    });

    var estado = new TileLayer({
      source: new TileWMS({
        url: 'http://200.133.244.148:8080/geoserver/cemaden_dev/wms',
        params: {
          'LAYERS': 'cemaden_dev:br_estados',
          'VERSION': '1.1.1',
          'FORMAT': 'image/png',
          'EPSG': '4326',
          'TILED': true
        },
        projection: 'EPSG:4326',
        serverType: 'geoserver',
        visible: false,
        name: 'layer_estado'
      })
    });

    //-------------------grup test---------------------------//
    var teste = new Vector({
      title: 'added Layer',
      source: new Vector({
        url: 'http://www.geoservicos.ibge.gov.br/geoserver/CCAR/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=CCAR:BC100_Capital_P&maxFeatures=50&outputFormat=json',
        format: new GeoJSON()
      })
    });

    var vectorSource = new Vector(
      {
        url: 'http://www.geoservicos.ibge.gov.br/geoserver/CCAR/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=CCAR:BC100_Capital_P&maxFeatures=50&outputFormat=json',
        projection: 'EPSG:3857',
        format: new GeoJSON(),
        attributions: ["&copy; <a href='https://data.culture.gouv.fr/explore/dataset/fonds-de-la-guerre-14-18-extrait-de-la-base-memoire'>data.culture.gouv.fr</a>"],
        logo: "https://www.data.gouv.fr/s/avatars/37/e56718abd4465985ddde68b33be1ef.jpg"
      });


    var vector = new Vector(
      {
        name: '1914-18',
        preview: "http://www.culture.gouv.fr/Wave/image/memoire/2445/sap40_z0004141_v.jpg",
        source: vectorSource
      });


    //---------------------final test ----------------------------//     

    // Configurações do Mapas
    // create an interaction to add to the map that isn't there by default
    var interaction = new DragRotateAndZoom();

    // var overlay = new Overlay({
    //   position: center,
    //   element: document.getElementById('overlay')
    // });
    // var ControlLayerSwitcher = new LayerSwitcher();
    //  map.addControl(new LayerSwitcher());

    // create a control to add to the map that isn't there by default
    var control = new FullScreen();

    var osm = new TileLayer({
      preload: Infinity,
      source: new OSM(),
      name: 'osm'
    });

    var Watercolor = new TileLayer(
      {
        preload: Infinity,
        title: "Watercolor",
        baseLayer: true,
        source: new Stamen({
          layer: 'watercolor'
        })
      });


    var Toner = new TileLayer(
      {
        preload: Infinity,
        title: "Toner",
        baseLayer: true,
        visible: true,
        source: new Stamen({
          layer: 'toner'
        })
      });


    var center = [-6124801.2015823, -1780692.0106836];
    var view = new View({
      center: center,
      zoom: 4
    });

    var map = new Map({
      target: 'map',
      layers: [Watercolor],
      // interactions: [interaction],
      controls: [control],
      // overlays: [overlay],
      view: view
    });

    // map.addControl (new control.LayerSwitcherImage());


    map.addLayer(baciashidrografica);
    map.addLayer(prec4km);
    map.addLayer(pcd);
    map.addLayer(estado);

    map.on('singleclick', function (evt) {
      var coordinate = evt.coordinate;
      var pixel = map.getPixelFromCoordinate(coordinate);
      var WIDTH = map.getSize().x;
      // var el = document.getElementById('name');

      // el.innerHTML = '';
      // map.forEachFeatureAtPixel(pixel, function (feature) {
      //   el.innerHTML += feature.get('name') + '<br>';
      // });
      console.log(WIDTH);
      // console.log(coordinate);
      map.removeLayer(prec4km);


      // var feature = new Feature(
      //   new Point(evt.coordinate)
      // );

      // console.log(feature);
      // feature.setStyle(iconStyle);
      // vectorSource.addFeature(feature);

      // map.addLayer(pcd)
      // if (evt.dragging) {
      //   return;
      // }
      // var pixel = map.getEventPixel(evt.originalEvent);
      // console.log(pixel)

      // var hit = map.forEachLayerAtPixel(pixel, function() {
      //   return true;
      // });
      // var teste = map.getTargetElement().style.cursor = true ? 'pointer' : 'teste';
      // console.log(teste)

      // var source = TileWMS.getSouce();
      // var params = source.getParams();


    });

  }

  // Método json pcd
  initilizeJson() {
    // var url = "http://sjc.salvar.cemaden.gov.br/resources/dados/327_24.json";

    // this.mapService.listar()
    //   .subscribe(resposta => this.features = <any>resposta)

    // console.log(this.features[0]);

    for (var i = 1; i <= 2; i++) {
      console.log(i);

    }
  }

  // Botão salvar
  private salvar() {
    if (this.busca == null) {
      console.log("nulo");
    } else {
      console.log(this.busca);
    }
  }

}
