import * as THREE from "three";
import * as OBC from "openbim-components";
import * as MAPBOX from "mapbox-gl";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { GisParameters, Building, LngLat, Asset } from "../../types";
import { User } from "firebase/auth";
import { MapDataBase } from "./map-database";
import { Events } from "../../middleware/event-handler";

import { v4 as uuidv4 } from "uuid";

export class MapScene {
  private components = new OBC.Components();
  private readonly style = "mapbox://styles/mapbox/streets-v12";
  //private readonly style = "mapbox://styles/mapbox/outdoors-v12";
  //private readonly style = "mapbox://styles/mapbox/light-v11";
  //private readonly style = "mapbox://styles/mapbox/navigation-day-v1";


  private map: MAPBOX.Map;
  private center: LngLat = { lat: 0, lng: 0 }; //Centro de la escena
  private clickedCoordinates: LngLat = { lat: 0, lng: 0 };
  private labels: { [id: string]: CSS2DObject } = {};
  private database = new MapDataBase();
  private events: Events;


  constructor(container: HTMLDivElement, events: Events) {
    this.events = events;
    const config = this.getConfig(container);
    //const [isCreatingBuilding, setIsCreatingBuilding] = useState(false);
    this.map = this.createMap(config);
    this.initializeComponent(config);
    this.createScene();


  }

  dispose() {
    this.components.dispose();
    (this.map as any) = null;
    (this.components as any) = null;
    for (const id in this.labels) {
      const label = this.labels[id];
      label.removeFromParent();
      label.element.remove();
    }
    this.labels = {};

  }

  async getAllBuildings() {
    const buildings = await this.database.getBuildings();
    if (!this.components) return;
    this.addBuildingToScene(buildings);
  }

  async getAllAssets() {

    console.log("ADDUSERLOCATION");

    const assets = await this.database.getAssets();

    for (const asset of assets) {
      const { name } = asset;
      ////console.log("assets: " + id);
    }

    if (!this.components) return;
    this.addAssetToScene(assets);
  }

  private initializeComponent(config: GisParameters) {
    this.components.scene = new OBC.SimpleScene(this.components);
    this.components.camera = new OBC.MapboxCamera();
    this.components.renderer = this.createRenderer(config);
    this.components.init();
  }

  private getCoordinates(config: GisParameters) {
    const merc = MAPBOX.MercatorCoordinate;
    return merc.fromLngLat(config.center, 0);
  }

  private createRenderer(config: GisParameters) {
    const coords = this.getCoordinates(config);
    return new OBC.MapboxRenderer(this.components, this.map, coords);
  }

  private createMap(config: GisParameters) {
    const map = new MAPBOX.Map({
      ...config,
      style: this.style,
      antialias: true,
    });

    map.addControl(
      new MAPBOX.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true,
        showAccuracyCircle: false,
      }), 'bottom-right'
    );



    map.on("contextmenu", this.storeMousePosition);

    map.on('style.load', () => {
      // Insert the layer beneath any symbol layer.
      const layers = map.getStyle().layers;
      const labelLayer = layers.find((layer) => layer.type === 'symbol' && layer.layout && layer.layout['text-field']);


    });



    ////console.log(map.getCenter().lat);
    //this.setGeoLocation(map.getCenter().lng, map.getCenter().lat);
    return map;
  }



  async addAsset(asset: Asset) {

    let longitud = 0;
    let latitud = 0;

    navigator.geolocation.getCurrentPosition(position => {

      longitud = position.coords.longitude;
      latitud = position.coords.latitude;
      this.datos(longitud, latitud, asset.name, asset.level);

    });

  }

  async datos(longitud: number, latitud: number, name: string, level: string) {


    const { lat, lng } = { lat: latitud, lng: longitud };
    const tipo = "Activo";
    console.log("NAME: " + name);
    console.log("LEVEL: " + level);
    const asset = { uid: "", name, lat, lng, tipo, level };
    asset.name = await this.database.addAsset(asset);
    console.log("ASSET 5");

    this.addAssetToScene([asset]);


  }

  private addAssetToScene(assets: Asset[]) {

    console.log("ASSET 6");

    for (const asset of assets) {


      const { name, lng, lat, level } = asset;
      const htmlElement = this.createHTMLElementAsset("🚩", asset);
      const label = new CSS2DObject(htmlElement);

      ////console.log("addUserLocation lng: " + lng);
      ////console.log("addUserLocation lat: " + lat);

      const center = MAPBOX.MercatorCoordinate.fromLngLat(
        { ...this.center },
        0
      );

      const units = center.meterInMercatorCoordinateUnits();
      const model = MAPBOX.MercatorCoordinate.fromLngLat({ lng, lat }, 0);
      model.x /= units;
      model.y /= units;
      center.x /= units;
      center.y /= units;

      ////console.log("ASSET center.x: " + center.x + " center.y: " + center.y);
      ////console.log("ASSET model.x: " + model.x + " model.y: " + model.y);

      label.position.set(model.x - center.x, 0, model.y - center.y);

      ////console.log("ASSET LABEL POSITION: " + label.position.x);

      this.components.scene.get().add(label);
      this.labels[name] = label;



    }

  }

  async gotoAsset(asset: Asset) {

    this.map.flyTo({
      center: [asset.lng, asset.lat],
      essential: true // this animation is considered essential with respect to prefers-reduced-motion
    });

    this.addAssetToScene([asset]);
  }

  //Añadimos edificio, esta opción solo ha de ser visible para el administrador en Escritorio
  async addBuilding(user: User) {

    //console.log("ADD_BUILDING map-scene");

    const { lat, lng } = this.clickedCoordinates;
    const tipo = "Edificio";
    const userID = user.uid;

    const building = { name: "", userID, lat, lng, uid: "", tipo, models: [] };


    building.uid = await this.database.addBuilding(building);
    this.addBuildingToScene([building]);
  }


  private addBuildingToScene(buildings: Building[]) {

    //console.log("ADD_BUILDING map-scene addBuildingToScene");

    for (const building of buildings) {

      const { name, lng, lat } = building;
      const htmlElement = this.createHTMLElement(building);
      const label = new CSS2DObject(htmlElement);

      //console.log("addToScene lng: " + lng);
      //console.log("addToScene lat: " + lat);

      const center = MAPBOX.MercatorCoordinate.fromLngLat(
        { ...this.center },
        0
      );

      const units = center.meterInMercatorCoordinateUnits();
      const model = MAPBOX.MercatorCoordinate.fromLngLat({ lng, lat }, 0);
      model.x /= units;
      model.y /= units;
      center.x /= units;
      center.y /= units;

      //console.log("BUILDING center.x: " + center.x + " center.y: " + center.y);
      //console.log("BUILDING model.x: " + model.x + " model.y: " + model.y);

      label.position.set(model.x - center.x, 0, model.y - center.y);

      ////console.log("BUILDING LABEL POSITION: " + label.position.x);

      this.components.scene.get().add(label);
      this.labels[name] = label;

    }
  }

  private createHTMLElement(building: Building) {

    const div = document.createElement("div");

    //const name = document.createElement("div");
    //name.textContent = building.name;

    const icon = document.createElement("div");
    icon.textContent = building.name;

    //div.appendChild(name);
    div.appendChild(icon);

    //name.classList.add("buildingLabel");

    icon.onclick = () => {
      this.events.trigger({ type: "OPEN_BUILDING", payload: building });
    }
    icon.classList.add("buildingLabel");
    return div;
  }

  private createHTMLElementAsset(content: string, asset: Asset) {

    ////console.log("PONIENDO LA PICA");
    const div = document.createElement("div");
    //div.textContent = id;
    div.textContent = content;
    /*div.onclick = () => {
        this.events.trigger({ type: "OPEN_BUILDING", payload: asset });
    }*/
    div.classList.add("asset");
    return div;
  }

  private createScene() {
    const scene = this.components.scene.get();
    scene.background = null;
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, -70, 100).normalize();
    scene.add(directionalLight);
    const directionalLight2 = new THREE.DirectionalLight(0xffffff);
    directionalLight2.position.set(0, 70, 100).normalize();
    scene.add(directionalLight2);
  }

  //Capturamos la posición del mouse
  private storeMousePosition = (event: MAPBOX.MapMouseEvent) => {
    this.clickedCoordinates = { ...event.lngLat };
  }

  private getConfig(container: HTMLDivElement) {
    const center = [2.112, 41.556] as [number, number];
    this.center = { lng: center[0], lat: center[1] };
    //let token = process.env.REACT_APP_MAPBOX_KEY;
    let token = "pk.eyJ1Ijoic2F0ZXJvIiwiYSI6ImNsZXk5Zzl5YjJpdG8zenAxOHp3bmJ1c2oifQ.f_vSjnzZ4IzwP1HjGWOemQ";

    return {
      container,
      accessToken: token,
      zoom: 17,
      pitch: 50,
      bearing: -10,
      center,
      buildings: [],
    };
  }
}

