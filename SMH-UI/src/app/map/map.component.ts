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
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';

import Select from 'ol/interaction/Select';
import { Icon, Style, Stroke } from 'ol/style';

// import VectorSource from 'ol/source';
// import Overlay from 'ol/Overlay';
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
  private pcd;
  private prec4km;
  private estado;
  private baciashidrografica;
  private busca;
  private Watercolor;
  private Toner;
  private osm;
  private features = [];
  val2: string = 'Watercolor';
  selectedCategories: string[] = ['pcd', 'estado'];
  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.initilizeMap();
    this.initilizeJson();
  }

  initilizeMap() {


    this.baciashidrografica = new TileLayer({
      title: 'baciashidrografica',
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
        name: 'layer_baciashidrografica'
      })
    });


    this.prec4km = new TileLayer({
      title: 'prec4km',
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
        projection: 'EPSG:4326',
        serverType: 'geoserver',
        name: 'layer_pcd'
      })
    });

    this.pcd = new TileLayer({
      title: 'pcd',
      source: new TileWMS({
        url: 'http://localhost:8080/geoserver/wms?',
        params: {
          'LAYERS': 'terrama2_1:view1',
          'VERSION': '1.1.1',
          'FORMAT': 'image/png',
          'EPSG': '4326',
          'TILED': true
        },
        preload: Infinity,
        projection: 'EPSG:4326',
        serverType: 'geoserver',
        name: 'layer_pcd'
      })
    });

    this.estado = new TileLayer({
      title: 'estados',
      source: new TileWMS({
        url: 'http://200.133.244.148:8080/geoserver/cemaden_dev/wms',
        params: {
          'LAYERS': 'cemaden_dev:br_estados',
          'VERSION': '1.1.1',
          'FORMAT': 'image/png',
          'EPSG': '4326',
          'TILED': true
        },
        preload: Infinity,
        projection: 'EPSG:4326',
        serverType: 'geoserver',
        name: 'layer_estado'
      })
    });

    //-------------------grup test---------------------------//
    // var teste = new Vector({
    //   title: 'added Layer',
    //   source: new Vector({
    //     url: 'http://localhost:8080/geoserver/terrama2_1/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=terrama2_1:view1&outputFormat=application/json&srsname=EPSG:4326',
    //     format: new GeoJSON()
    //   })
    // });

    // var vectorSource = new Vector(
    //   {
    //     url: 'http://www.geoservicos.ibge.gov.br/geoserver/CCAR/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=CCAR:BC100_Capital_P&maxFeatures=50&outputFormat=json',
    //     projection: 'EPSG:3857',
    //     format: new GeoJSON(),
    //     attributions: ["&copy; <a href='https://data.culture.gouv.fr/explore/dataset/fonds-de-la-guerre-14-18-extrait-de-la-base-memoire'>data.culture.gouv.fr</a>"],
    //     logo: "https://www.data.gouv.fr/s/avatars/37/e56718abd4465985ddde68b33be1ef.jpg"
    //   });


    // var vector = new Vector(
    //   {
    //     name: '1914-18',
    //     preview: "http://www.culture.gouv.fr/Wave/image/memoire/2445/sap40_z0004141_v.jpg",
    //     source: vectorSource
    //   });


    // var iconFeature = new Feature({
    //   geometry: new Point([-6124801.2015823, -1780692.0106836]),
    //   name: 'Null Island',
    //   population: 4000,
    //   rainfall: 500
    // });


    // var vectorSource = new Vector({
    //   features: [iconFeature]
    // });

    // var vectorLayer = new Vector({
    //   source: vectorSource
    // });

    // var vectorSource = new Vector({
    //   format: new GeoJSON(),
    //   url: function (extent) {
    //     return 'http://localhost:8080/geoserver/terrama2_1/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=terrama2_1:view1&outputFormat=application/json&srsname=EPSG:4326&' +
    //       'bbox=' + extent.join(',') + ',EPSG:32640';

    //   },
    //   // strategy: LoadingStrategy.bbox
    // });


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

    this.osm = new TileLayer({
      preload: Infinity,
      source: new OSM(),
      name: 'osm'
    });

    this.Watercolor = new TileLayer(
      {
        preload: Infinity,
        title: "Watercolor",
        baseLayer: true,
        source: new Stamen({
          layer: 'watercolor'
        })
      });


    this.Toner = new TileLayer(
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

    this.map = new Map({
      target: 'map',
      layers: [this.Watercolor],
      // interactions: [interaction],
      controls: [control],
      // overlays: [overlay],
      view: view
    });


    // var insertLayer = function (layer) {
    //   var layers = map.getLayers();
    //   console.log(layers);
    // };
    // var switchLayer = function (evt) {
    //   var attr = this.getAttribute('data-type');
    //   console.log(attr);
    //   switch (attr) {
    //     case 'OSM':
    //       insertLayer(osm);
    //       break;
    //     case 'mapQuestOSM':
    //       insertLayer(Watercolor);
    //       map.removeLayer(osm);
    //       break;
    //     case 'mapQuestSAT':
    //       insertLayer(Toner);
    //       break;
    //   }
    // };

    // var lis = document.getElementById('menu') as HTMLElement;
    // console.log(lis);
    // var lis = document.getElementById('menu').getElementsByTagName('li');
    // var lis_array = [].slice.call(lis); //convert to array
    // lis_array.forEach(function (li) {
    //   li.addEventListener('click', switchLayer, false);
    // });

    // this.map.addLayer(this.baciashidrografica);
    this.map.addLayer(this.prec4km);
    this.map.addLayer(this.pcd);
    this.map.addLayer(this.estado);
    // map.addLayer(teste);


    // maps on singleclick
    this.map.on('singleclick', function (evt) {
      var coordinate = evt.coordinate;
      console.log(coordinate);
      // var pixel = map.getPixelFromCoordinate(coordinate);
      // var WIDTH = map.getSize().x;
      // var el = document.getElementById('name');
    });

    function changeMap() {
      console.log('name');
    }

    // function setMapType(newType) {
    //   console.log('teste');
    //   if (newType == 'OSM') {
    //     this.map.setLayerGroup(this.osm);
    //   } else if (newType == 'MAPQUEST_OSM') {
    //     this.map.setLayerGroup(this.Watercolor);
    //   }
    // }

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

  private setLayerType() {
    console.log(this.selectedCategories);

    // if (this.val2 == 'osm') {

    // } else if (this.val2 == 'Watercolor') {

    // } else if (this.val2 == 'Toner') {

    // }
  }

  private setMapType() {
    if (this.val2 == 'osm') {
      // this.map.addLayer(this.osm);
      this.map.removeLayer(this.Watercolor);
      // this.map.removeLayer(this.Toner);
    } else if (this.val2 == 'Watercolor') {
      this.map.addLayer(this.Watercolor);
      this.map.removeLayer(this.osm);
      this.map.removeLayer(this.Toner);
    } else if (this.val2 == 'Toner') {
      this.map.addLayer(this.Toner);
      this.map.removeLayer(this.Watercolor);
      this.map.removeLayer(this.osm);
    }
  }

  // Botão salvar
  private salvar() {

    // this.prec4km.setOpacity(0.52);
    this.prec4km.setVisible(false);

    // var group = this.map.getLayerGroup();
    // var layers = group.getLayers();
    // var element = layers.item(0);
    // var name = element.get('title');
    // console.log(name);


    var layers = this.map.getLayers().getArray();
    var baseLayers = new Array();
    for (var i = 0; i < layers.length; i++) {
      var lyrprop = layers[i].getProperties();
      console.log(lyrprop);
      if (lyrprop.type == 'Watercolor') {
        baseLayers.push(layers[i]);
        console.log(layers[i]);
      }
    }

    // console.log(this.val2);
    if (this.busca == null) {
      console.log("nulo");
    } else {
      console.log(this.busca);
    }
  }

  private activeLayer() {
    this.prec4km.setVisible(true);
  }

}
