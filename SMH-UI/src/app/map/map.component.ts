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
  private merge4km;
  private estadosIBGE;
  private PrecMedia_Bacias_N1;
  private municipioIbge;
  private busca;
  private waterColor;
  private toner;
  private osm;
  private gebco;
  private terrain;
  value: number = 0;
  val1: number = 100;
  testep: boolean = false;
  private features = [];
  setMap: string = 'GEBCO';
  checked1: boolean = true;
  private data;
  // selectedCategories: string[] = ['pcd', 'estado'];
  // private geoserverIBGE = 'http://www.geoservicos.ibge.gov.br/geoserver/wms?';
  private geoserverTerraMaCurso = 'http://www.terrama2.dpi.inpe.br/chuva/geoserver/wms?';
  private geoserverTerraMaLocal = 'http://localhost:8080/geoserver/wms?';
  // private geoserverCemaden = 'http://200.133.244.148:8080/geoserver/cemaden_dev/wms';
  // private geoserverQueimada = 'http://queimadas.dgi.inpe.br/queimadas/geoserver/wms?';

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.initData();
    this.initilizeMap();
    this.initilizeJson();
    
  }


  initData() {

    var dataNow = new Date(Math.round(Date.now() / 3600000) * 3600000 - 3600000 * 3);
    var dia = dataNow.getDate();
    var mes = dataNow.getMonth();
    var ano = dataNow.getFullYear();

    this.data = ano + '-' + mes + '-' + dia
    console.log(this.data);


  }

  initilizeMap() {

    let interval = setInterval(() => {
      this.value = this.value + Math.floor(Math.random() * 10) + 1;
      if (this.value >= 100) {
        this.value = 100;
        this.testep = true;
        // this.messageService.add({severity: 'info', summary: 'Success', detail: 'Process Completed'});
        clearInterval(interval);
      } else if (this.value >= 10) {
        // this.map.addLayer(this.pcd);
      } else if (this.value >= 5) {
        // this.map.addLayer(this.prec4km);
      } else if (this.value >= 2) {
        // this.map.addLayer(this.estado);
        // this.map.addLayer(this.baciashidrografica);
      }
    }, 2000);


    this.municipioIbge = new TileLayer({
      title: 'municipioIbge',
      source: new TileWMS({
        url: this.geoserverTerraMaCurso,
        params: {
          'LAYERS': 'terrama2_9:view9',
          'VERSION': '1.1.1',
          'FORMAT': 'image/png',
          'EPSG': '4326',
          'TILED': true
        },
        preload: Infinity,
        // opacity: 1,
        projection: 'EPSG:4326',
        serverType: 'geoserver',
        name: 'municipioIbge'
      })
    });


    this.PrecMedia_Bacias_N1 = new TileLayer({
      title: 'PrecMedia_Bacias_N1',
      source: new TileWMS({
        url: this.geoserverTerraMaCurso,
        params: {
          'LAYERS': 'terrama2_11:view11',
          'VERSION': '1.1.1',
          'FORMAT': 'image/png',
          'EPSG': '4326',
          'TILED': true,
          'TIME': '1998-03-18'
        },
        preload: Infinity,
        // opacity: 1,
        projection: 'EPSG:4326',
        serverType: 'geoserver',
        name: 'PrecMedia_Bacias_N1'
      })
    });


    this.merge4km = new TileLayer({
      title: 'merge4km',
      source: new TileWMS({
        url: this.geoserverTerraMaCurso,
        params: {
          'LAYERS': 'terrama2_3:view3',
          'VERSION': '1.1.1',
          'FORMAT': 'image/png',
          'EPSG': '4326',
          'TILED': true,
          'TIME': this.data
        },
        preload: Infinity,
        projection: 'EPSG:4326',
        serverType: 'geoserver',
        name: 'merge4km'
      })
    });

    this.pcd = new TileLayer({
      title: 'pcd',
      source: new TileWMS({
        url: this.geoserverTerraMaLocal,
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

    this.estadosIBGE = new TileLayer({
      title: 'estados',
      source: new TileWMS({
        url: this.geoserverTerraMaCurso,
        params: {
          'LAYERS': 'terrama2_10:view10',
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

    var interaction = new DragRotateAndZoom();

    var control = new FullScreen();

    this.osm = new TileLayer({
      preload: Infinity,
      visible: false,
      title: "osm",
      baseLayer: true,
      source: new OSM(),
      layer: 'osm',
    });

    this.gebco = new TileLayer({
      source: new TileWMS(({
        preload: Infinity,
        visible: false,
        title: "gebco",
        baseLayer: true,
        url: 'http://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?',
        params: { 'LAYERS': 'GEBCO_LATEST', 'VERSION': '1.1.1', 'FORMAT': 'image/png' }
      })),
      serverType: 'mapserver'
    });

    this.waterColor = new TileLayer(
      {
        preload: Infinity,
        visible: false,
        title: "Watercolor",
        baseLayer: true,
        source: new Stamen({
          layer: 'watercolor'
        })
      });


    this.toner = new TileLayer(
      {
        preload: Infinity,
        title: "Toner",
        baseLayer: true,
        visible: false,
        source: new Stamen({
          layer: 'toner'
        })
      });


    this.terrain = new TileLayer(
      {
        preload: Infinity,
        title: "terrain",
        baseLayer: true,
        visible: false,
        source: new Stamen({
          layer: 'terrain'
        })
      });

    var center = [-6124801.2015823, -1780692.0106836];
    var view = new View({
      center: center,
      zoom: 4
    });

    var layers = [this.osm, this.gebco, this.waterColor, this.toner, this.terrain];

    this.map = new Map({
      target: 'map',
      layers: layers,
      // interactions: [interaction],
      controls: [control],
      view: view
    });

    // var lis = document.getElementById('menu') as HTMLElement;
    // console.log(lis);
    // var lis = document.getElementById('menu').getElementsByTagName('li');
    // var lis_array = [].slice.call(lis); //convert to array
    // lis_array.forEach(function (li) {
    //   li.addEventListener('click', switchLayer, false);
    // });

    this.map.addLayer(this.PrecMedia_Bacias_N1);
    this.PrecMedia_Bacias_N1.setOpacity(0.52);
    this.map.addLayer(this.merge4km);
    // this.merge4km.setOpacity(0.52);
    // this.map.addLayer(this.estadosIBGE);
    // this.map.addLayer(this.pcd);
    // this.map.addLayer(this.quimadalayer);

    this.map.on('singleclick', function (evt) {
      // var coordinate = evt.coordinate;
      // console.log(coordinate);
      // var pixel = map.getPixelFromCoordinate(coordinate);
      // var el = document.getElementById('name');
      console.log(evt.pixel);

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

    // this.mapService.listar()
    // .subscribe(resposta => this.features = <any>resposta)

    // console.log(this.features[0]);

    // for (var i = 1; i <= 2; i++) {

    //   console.log(i);
    // console.log(this.selectedCategories);
    // }
  }

  private setLayerType() {
    console.log(this.val1 / 100);
    this.merge4km.setVisible(this.checked1);
    this.merge4km.setOpacity(this.val1 / 100);
  }

  private setMapType() {
    switch (this.setMap) {
      case 'osm':
        this.osm.setVisible(true); this.waterColor.setVisible(false); this.toner.setVisible(false); this.terrain.setVisible(false); this.gebco.setVisible(false);
        break;
      case 'GEBCO':
        this.gebco.setVisible(true); this.osm.setVisible(false); this.waterColor.setVisible(false); this.toner.setVisible(false); this.terrain.setVisible(false);
        break;
      case 'Watercolor':
        this.osm.setVisible(false); this.waterColor.setVisible(true); this.toner.setVisible(false); this.terrain.setVisible(false); this.gebco.setVisible(false);
        break;
      case 'Toner':
        this.osm.setVisible(false); this.waterColor.setVisible(false); this.toner.setVisible(true); this.terrain.setVisible(false); this.gebco.setVisible(false);
        break;
      case 'Terrain':
        this.osm.setVisible(false); this.waterColor.setVisible(false); this.toner.setVisible(false); this.terrain.setVisible(true); this.gebco.setVisible(false);
        break;
    }
  }

  // Botão salvar
  private salvar() {

    // this.prec4km.setOpacity(0.52);
    // this.prec4km.setVisible(false);
    // this.estado.setVisible(false);
    // this.prec4km.setParams('TIME : 2018-01-01 ');

    // this.map.addLayer(this.osm);


    // var group = this.map.getLayerGroup();
    // var layers = group.getLayers();
    // var element = layers.item(0);
    // var name = element.get('title');
    // console.log(layers.length);



    // var layers = this.map.getLayers().getArray();
    // var baseLayers = new Array();
    // for (var i = 0; i < layers.length; i++) {
    //   var lyrprop = layers[i].getProperties();
    //   baseLayers.push(layers[i]);
    //   console.log(layers[i]);
    //   // if (lyrprop.type == 'Watercolor') {
    //   //   baseLayers.push(layers[i]);
    //   //   console.log(layers[i]);
    //   // }
    // }

    var group = this.map.getLayerGroup();
    var gruplayers = group.getLayers();
    var layers = this.map.getLayers().getArray();
    for (var i = 5; i < layers.length; i++) {
      var element = gruplayers.item(i);
      // this.map.removeLayer(element);
      var name = element.get('title');
      // console.log(element);
      console.log(name);
    }
    this.merge4km.getSource().updateParams({ 'TIME': '2019-01-05' });
    // if (this.busca == null) {
    //   console.log("nulo");
    // } else {
    //   console.log(this.busca);
    // }
  }

  private activeLayer() {
    // this.prec4km.setVisible(false);
    this.PrecMedia_Bacias_N1.setVisible(false);
  }

  dellLayer() {
    this.map.removeLayer(this.merge4km);
    this.map.removeLayer(this.PrecMedia_Bacias_N1);
  }

}
