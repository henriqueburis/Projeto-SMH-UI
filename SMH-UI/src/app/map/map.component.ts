import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import TileWMS from 'ol/source/TileWMS';
import Vector from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
// import Control from 'ol/control/Control';

import { MapService } from 'src/app/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  private map;
  private features = [];
  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.initilizeMap();
    this.initilizeJson();
  }

  initilizeMap() {
    

    var torreEnergia = new TileLayer({
      title: 'torreEnergia',
      source: new TileWMS({
        url: 'http://www.geoservicos.ibge.gov.br/geoserver/wms?',
        params: {
          'LAYERS': 'BC250_Edif_Energia_P',
          'VERSION': '1.1.1',
          'FORMAT': 'image/png',
          'EPSG': '4326',
          'TILED': true
        },
        projection: 'EPSG:4326',
        serverType: 'geoserver',
        visible: true,
        name: 'layer_torreEnergia'
      })
    });

    var teste = new Vector({
      title: 'added Layer',
      source: new Vector({
        url: 'http://www.geoservicos.ibge.gov.br/geoserver/CCAR/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=CCAR:BC100_Capital_P&maxFeatures=50&outputFormat=json',
        format: new GeoJSON()
      })
    })

    var pcd = new TileLayer({
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
        projection: 'EPSG:4326',
        serverType: 'geoserver',
        visible: false,
        name: 'layer_pcd'
      })
    });

    var geoTeste = new TileLayer({
      source: new TileWMS({
        url: 'http://localhost:8080/geoserver/wms?',
        params: {
          'LAYERS': '	terrama2_4:view4',
          'VERSION': '1.1.1',
          'FORMAT': 'image/png',
          'EPSG': '4326',
          'TILED': true
        },
        projection: 'EPSG:4326',
        serverType: 'geoserver',
        visible: false,
        name: 'layer_geoTeste'
      })
    });

    var osm = new TileLayer({
      preload: Infinity,
      source: new OSM(),
      name: 'osm'
    })

    var view = new View({
      center: [-6124801.2015823, -1780692.0106836],
      zoom: 5
    })

    var map = new Map({
      target: 'map',
      layers: [osm],
      view: view
    });

    map.addLayer(torreEnergia);
    map.addLayer(pcd);
    

    // var myControl = new Control({element: torreEnergia});


    map.on('singleclick', function (evt) {
      var coordinate = evt.coordinate;
      console.log(coordinate[0]);
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

  initilizeJson() {
    // var url = "http://sjc.salvar.cemaden.gov.br/resources/dados/327_24.json";

    // this.mapService.listar()
    //   .subscribe(resposta => this.features = <any>resposta)

    // console.log(this.features[0]);

    for (var i = 1; i <= 5; i++) {
      console.log(i);

    }


  }

}
