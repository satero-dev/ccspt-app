import { Events } from "./../../middleware/event-handler";
import { Floorplan, Property, System } from "./../../types";
import * as OBC from "openbim-components";
import * as THREE from "three";
import { downloadZip } from "client-zip";
import { BuildingDatabase } from "./building-database";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import { Building } from "../../types";
import { unzip } from "unzipit";
import "./building-scene.css";

import * as dat from 'lil-gui';
//import * as dat from 'three/examples/jsm/libs/lil-gui.module.min';
import { stringify } from "querystring";

export class BuildingScene {
  database = new BuildingDatabase();

  private floorplans: Floorplan[] = [];
  private components: OBC.Components;
  private fragments: OBC.Fragments;
  private loadedModels = new Set<string>();
  private whiteMaterial = new THREE.MeshBasicMaterial({ color: "white" });
  private properties: { [fragID: string]: any } = {};
  private propID: any;
  private gui: any;

  get container() {
    const domElement = this.components.renderer.get().domElement;
    return domElement.parentElement as HTMLDivElement;
  }

  private sceneEvents: { name: any; action: any }[] = [];
  private events: Events;

  constructor(container: HTMLDivElement, building: Building, events: Events) {
    this.events = events;
    this.components = new OBC.Components();

    this.components.scene = new OBC.SimpleScene(this.components);
    this.components.renderer = new OBC.SimpleRenderer(
      this.components,
      container
    );

    const scene = this.components.scene.get();
    scene.background = new THREE.Color();

    const camera = new OBC.OrthoPerspectiveCamera(this.components);
    this.components.camera = camera;
    this.components.raycaster = new OBC.SimpleRaycaster(this.components);
    this.components.init();

    const dimensions = new OBC.SimpleDimensions(this.components);
    this.components.tools.add(dimensions);

    const clipper = new OBC.EdgesClipper(this.components, OBC.EdgesPlane);
    this.components.tools.add(clipper);
    const thinLineMaterial = new LineMaterial({
      color: 0xFF0000,
      linewidth: 0.001,
    });

    clipper.styles.create("thin_lines", [], thinLineMaterial);
    const floorNav = new OBC.PlanNavigator(clipper, camera);
    this.components.tools.add(floorNav);

    const directionalLight = new THREE.DirectionalLight();
    directionalLight.position.set(5, 10, 3);
    directionalLight.intensity = 0.5;
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight();
    ambientLight.intensity = 0.5;
    scene.add(ambientLight);

    const grid = new OBC.SimpleGrid(this.components);
    this.components.tools.add(grid);

    this.fragments = new OBC.Fragments(this.components);

    this.fragments.highlighter.active = true;
    const selectMat = new THREE.MeshBasicMaterial({ color: 0x44ff44 });
    const preselectMat = new THREE.MeshBasicMaterial({ color: 0x4444ff, opacity: 0.8, transparent: true });
    const selectSystemMat = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.8, transparent: true });

    this.fragments.highlighter.add("selection", [selectMat]);
    this.fragments.highlighter.add("preselection", [preselectMat]);
    this.fragments.highlighter.add("systemSelection", [selectSystemMat]);

    this.setupEvents();

    this.loadAllModels(building);

    this.fragments.exploder.groupName = "floor";



    const redMaterial = new THREE.MeshBasicMaterial({ color: '#FF0000' });
    const translucentMat = new THREE.MeshLambertMaterial({ transparent: true, opacity: 0.4 });

    this.fragments.highlighter.add('red', [redMaterial]);
    this.fragments.highlighter.add('translucent');

    //Ventana de control GUI
    this.gui = new dat.GUI({ title: 'Parámetros' });
    this.gui.domElement.classList.add('my-gui-container');

    var text = {
      message: 'dat.gui',
      speed: 0.8,
      displayOutline: false,
      otlo: true,
    };

    //Ventana GUI
    var menu = this.gui.addFolder('folder');
    menu.add(text, 'message');
    menu.add(text, 'speed', -5, 5);
    menu.add(text, 'displayOutline');
    menu.add(text, 'otlo');

    var customContainer = document.getElementById('my-gui-container');
    if (customContainer) {
      customContainer.appendChild(this.gui.domElement);
      customContainer.classList.add('my-gui-container');
    }





  }

  dispose() {
    this.properties = {};
    this.toggleEvents(false);
    this.loadedModels.clear();
    this.components.dispose();
    this.fragments.dispose();
    this.whiteMaterial.dispose();
    (this.components as any) = null;
    (this.fragments as any) = null;
    this.gui.destroy();
  }

  explode(active: boolean) {
    const exploder = this.fragments.exploder;
    if (active) {
      exploder.explode();
    } else {
      exploder.reset();
    }
  }

  async convertIfcToFragments(ifc: File) {

    let fragments = new OBC.Fragments(this.components);

    fragments.ifcLoader.settings.optionalCategories.length = 0;

    fragments.ifcLoader.settings.wasm = {
      path: "../../",
      absolute: false,
    };

    fragments.ifcLoader.settings.webIfc = {
      COORDINATE_TO_ORIGIN: false,
      USE_FAST_BOOLS: true,
    };

    const url = URL.createObjectURL(ifc) as any;
    const model = await fragments.ifcLoader.load(url);
    const file = await this.serializeFragments(model);

    fragments.dispose();
    (fragments as any) = null;

    return file as File;
  }

  toggleFloorplan(active: boolean, floorplan?: Floorplan) {
    const floorNav = this.getFloorNav();
    if (!this.floorplans.length) return;
    if (active && floorplan) {
      this.toggleGrid(false);
      this.toggleEdges(true);
      floorNav.goTo(floorplan.id);
      this.fragments.materials.apply(this.whiteMaterial);
    } else {
      this.toggleGrid(true);
      this.toggleEdges(false);
      this.fragments.materials.reset();
      floorNav.exitPlanView();
    }
  }

  toggleClippingPlanes(active: boolean) {
    const clipper = this.getClipper();
    if (clipper) {
      clipper.enabled = active;
    }
  }

  toggleDimensions(active: boolean) {
    const dimensions = this.getDimensions();
    if (dimensions) {
      dimensions.enabled = active;
    }
  }

  private setupEvents() {
    this.sceneEvents = [
      { name: "mousemove", action: this.preselect },
      { name: "click", action: this.select },
      { name: "click", action: this.selectSystem },
      { name: "mouseup", action: this.updateCulling },
      { name: "wheel", action: this.updateCulling },
      { name: "keydown", action: this.createClippingPlane },
      { name: "keydown", action: this.createDimension },
      { name: "keydown", action: this.deleteClippingPlaneOrDimension },
    ];
    this.toggleEvents(true);
  }

  private toggleEvents(active: boolean) {
    for (const event of this.sceneEvents) {
      if (active) {
        window.addEventListener(event.name, event.action);
      } else {
        window.removeEventListener(event.name, event.action);
      }
    }
  }

  private createClippingPlane = (event: KeyboardEvent) => {
    if (event.code === "KeyP") {
      const clipper = this.getClipper();
      if (clipper) {
        clipper.create();
      }
    }
  };

  private createDimension = (event: KeyboardEvent) => {
    if (event.code === "KeyD") {
      const dims = this.getDimensions();
      if (dims) {
        dims.create();
      }
    }
  };

  private toggleGrid(visible: boolean) {
    const grid = this.components.tools.get("SimpleGrid") as OBC.SimpleGrid;
    const mesh = grid.get();
    mesh.visible = visible;
  }

  private getClipper() {
    return this.components.tools.get("EdgesClipper") as OBC.EdgesClipper;
  }

  private getFloorNav() {
    return this.components.tools.get("PlanNavigator") as OBC.PlanNavigator;
  }

  private getDimensions() {
    return this.components.tools.get(
      "SimpleDimensions"
    ) as OBC.SimpleDimensions;
  }

  private deleteClippingPlaneOrDimension = (event: KeyboardEvent) => {
    if (event.code === "Delete") {
      const dims = this.getDimensions();
      dims.delete();
      const clipper = this.getClipper();
      clipper.delete();
    }
  };

  private updateCulling = () => {
    this.fragments.culler.needsUpdate = true;
  };


  //Buscamos el sistema del elemento seleccionado

  private selectSystem = () => {

    //Resaltamos el elemento seleccionado
    const result = this.fragments.highlighter.highlight("selection");

    //Variable para guardar el nombre del sistema del elemento seleccionado
    let nombreSistema = "";
    let habitacioCodi = "";

    //Si hay un elemento seleccionado
    if (result) {

      //Recuperamos todas las propiedades de los elementos
      const allProps = this.properties[result.fragment.id];

      //console.log("RESILTADO: " + result.id);
      //console.log("RESULTADO: " + result.fragment.id);
      //console.log("props: " + JSON.stringify(this.properties));

      //Flag para controlar cuántos IDs están relacionados con nuesta selección
      //El formato IFC guarda los parámetros en IDs consecutivos al elemento base
      let flag = true;

      //El ID del elemento seleccionado marca el punto de partida para la lectura de parámetros
      let currentId = parseInt(result.id);



      //Itera mientras no encontremos el parámetro que nos interesa
      while (flag) {

        //console.log("currentId!!: " + currentId);

        //Si el elemento existe
        if (allProps[currentId]) {

          //console.log("allProps[currentId]: " + JSON.stringify(allProps[currentId]));
          //console.log("allProps[currentId]: " + JSON.stringify(allProps[currentId].Name.value));
          //console.log("properties[currentId]: " + JSON.stringify(properties[currentId].Name.value));

          //Buscamos el parámetro "Nombre de sistema". Ponemos un try por si el parámetro no existe
          try {

            //console.log("CSPT_FM_HabitacioCodi: " + JSON.stringify(allProps[currentId].Name.value));

            if (allProps[currentId].Name.value === "Nombre de sistema") {

              //Si lo encontramos, guardamos su valor en la variable nombreSistema
              nombreSistema = allProps[currentId].NominalValue.value;
            }

            if (allProps[currentId].Name.value === "CSPT_FM_HabitacioCodi") {

              //Si lo encontramos, guardamos su valor en la variable nombreSistema
              habitacioCodi = allProps[currentId].NominalValue.value;
              //console.log("habitacioCodi: " + habitacioCodi);
            }
          } catch { }

          //formatted.push({ tmp, nombreSistema });
          //formatted.push({ nombreSistema });
          //Buscamos el parámetro en el siguiente ID
          currentId = currentId + 1;
        } else {
          //No existe el ID
          flag = false;
        }

      }

      /*return this.events.trigger({
        type: "UPDATE_SYSTEMS",
        payload: "DATOS",
      });*/


      //Seleccionamos todos los elementos cuyo nombre de sistema coincida con el seleccionado
      const flowsegment = this.fragments.groups.groupSystems.nombreSistema[nombreSistema];
      const habitacioCodiGroup = this.fragments.groups.groupSystems.codigoHabitacion[habitacioCodi];

      const codi = this.fragments.groups.groupSystems.codigoHabitacion;



      //console.log("flowsegment: " + JSON.stringify(flowsegment));

      //const datos = this.fragments.groups.groupSystems;

      const nombreSistemaF = this.fragments.groups.groupSystems.nombreSistema;
      const codigoHabitacionF = this.fragments.groups.groupSystems.codigoHabitacion;

      //console.log("nombreSistemaF: " + JSON.stringify(nombreSistemaF));
      //console.log("codigoHabitacionF: " + JSON.stringify(codigoHabitacionF));


      this.events.trigger({ type: "UPDATE_SYSTEMS", payload: [] });
      //this.fragments.highlighter.highlightByID(selectionName, furniture, settings.singleSelect);

      //Destacamos los elementos selecciondos
      this.fragments.highlighter.highlightByID("red", flowsegment, true);

      console.log("PROP IDS: " + JSON.stringify(this.propID[42]));

      let IDS = [];

      //Guardamos en un array todos los IDs de los elementos que pertenecen al sistema
      for (const name in flowsegment) {
        IDS.push(flowsegment[name]);
      }

      //Aplanamas la lista para que quede de una sola dimensión
      IDS = IDS.flat();

      console.log("IDS: " + JSON.stringify(IDS));
      console.log("flowsegment: " + JSON.stringify(flowsegment));
      console.log("codi: " + JSON.stringify(codi));

      const filtroHabitaciones = this.searchFirstKeysAndValuesInJson(codi, IDS);


      const habitaciones = Array.from(new Set(filtroHabitaciones.map(obj => obj.key)));

      console.log("habitaciones: " + JSON.stringify(habitaciones));


      const formatted: System[] = [];
      for (const name in habitaciones) {
        let value = habitaciones[name];
        formatted.push({ name, value });
      }
      return this.events.trigger({
        type: "UPDATE_SYSTEMS",
        payload: formatted,
      });

    }

  };

  private searchFirstKeysAndValuesInJson = (jsonObj: any, searchList: string[]): { key: string, value: string }[] => {
    const foundKeysAndValues: { key: string, value: string }[] = [];

    const searchRecursively = (obj: any, parentKey?: string) => {
      Object.keys(obj).forEach((key) => {
        const value = obj[key];

        if (Array.isArray(value)) {
          value.forEach((item) => {
            if (searchList.includes(item)) {
              foundKeysAndValues.push({ key: parentKey || key, value: item });
            }
          });
        } else {
          searchRecursively(value, key);
        }
      });
    };

    searchRecursively(jsonObj);

    return foundKeysAndValues;
  };

  private preselect = () => {
    this.fragments.highlighter.highlight("preselection");
  };

  private select = () => {
    const result = this.fragments.highlighter.highlight("selection");

    if (result) {

      const allProps = this.properties[result.fragment.id];
      const props = allProps[result.id];
      if (props) {
        const formatted: Property[] = [];
        for (const name in props) {
          let value = props[name];
          //console.log("VALUE PROPERTY: " + JSON.stringify(value));
          if (!value) value = "Desconocido";
          if (value.value) value = value.value;
          if (typeof value === "number") value = value.toString();
          formatted.push({ name, value });
          //console.log("Property NAME: " + name);
          //console.log("Property VALUE: " + value);
        }
        return this.events.trigger({
          type: "UPDATE_PROPERTIES",
          payload: formatted,
        });
      }


    }
    this.events.trigger({ type: "UPDATE_PROPERTIES", payload: [] });
  };

  private async serializeFragments(model: OBC.FragmentGroup) {
    const files = [];
    for (const frag of model.fragments) {
      const file = await frag.export();
      files.push(file.geometry, file.data);
    }

    files.push(new File([JSON.stringify(model.properties)], "properties.json"));
    files.push(new File([JSON.stringify(model.levelRelationships)], "levels-relationship.json"));
    files.push(new File([JSON.stringify(model.itemTypes)], "model-types.json"));
    files.push(new File([JSON.stringify(model.allTypes)], "all-types.json"));
    files.push(new File([JSON.stringify(model.floorsProperties)], "levels-properties.json"));
    files.push(new File([JSON.stringify(model.coordinationMatrix)], "coordination-matrix.json"));
    files.push(new File([JSON.stringify(model.expressIDFragmentIDMap)], "express-fragment-map.json"));

    return downloadZip(files).blob();
  }

  private toggleEdges(visible: boolean) {
    const edges = Object.values(this.fragments.edges.edgesList);
    const scene = this.components.scene.get();
    for (const edge of edges) {
      if (visible) scene.add(edge);
      else edge.removeFromParent();
    }
  }



  private async loadAllModels(building: Building) {

    const buildingsURLs = await this.database.getModels(building);

    for (const model of buildingsURLs) {
      const { url, id } = model;

      console.log("URL: " + id);

      if (this.loadedModels.has(id)) {
        continue;
      }

      this.loadedModels.add(id);

      const { entries } = await unzip(url);

      const fileNames = Object.keys(entries);

      const properties = await entries["properties.json"].json();
      const allTypes = await entries["all-types.json"].json();
      const modelTypes = await entries["model-types.json"].json();
      const levelsProperties = await entries["levels-properties.json"].json();
      const levelsRelationship = await entries["levels-relationship.json"].json();
      const fragmentMap = await entries['express-fragment-map.json'].json();



      this.propID = properties;


      // Set up floorplans

      const levelOffset = 1.5;
      const floorNav = this.getFloorNav();



      if (this.floorplans.length === 0) {
        for (const levelProps of levelsProperties) {
          const elevation = levelProps.SceneHeight + levelOffset;

          this.floorplans.push({
            id: levelProps.expressID,
            name: levelProps.Name.value,
          });

          // Create floorplan
          await floorNav.create({
            id: levelProps.expressID,
            ortho: true,
            normal: new THREE.Vector3(0, -1, 0),
            point: new THREE.Vector3(0, elevation, 0),
          });
        }

        this.events.trigger({
          type: "UPDATE_FLOORPLANS",
          payload: this.floorplans,
        });
      }

      // Load all the fragments within this zip file

      //console.log("PROPERTIES: " + JSON.stringify(properties));

      for (let i = 0; i < fileNames.length; i++) {
        const name = fileNames[i];
        if (!name.includes(".glb")) continue;

        const geometryName = fileNames[i];
        const geometry = await entries[geometryName].blob();
        const geometryURL = URL.createObjectURL(geometry);

        const dataName = geometryName.substring(0, geometryName.indexOf(".glb")) + ".json";
        const data = await entries[dataName].json();
        const dataBlob = await entries[dataName].blob();

        const dataURL = URL.createObjectURL(dataBlob);

        const fragment = await this.fragments.load(geometryURL, dataURL);

        this.properties[fragment.id] = properties;


        // Set up edges

        const lines = this.fragments.edges.generate(fragment);
        lines.removeFromParent();

        // Set up clipping edges

        const styles = this.getClipper().styles.get();
        const thinStyle = styles["thin_lines"];
        thinStyle.meshes.push(fragment.mesh);

        // Group items by category and by floor

        const groups = { category: {}, floor: {}, nombreSistema: {}, codigoHabitacion: {} } as any;

        //const sistemas = { sistema: {} } as any;
        const floorNames = {} as any;

        for (const levelProps of levelsProperties) {
          floorNames[levelProps.expressID] = levelProps.Name.value;
        }



        for (const id of data.ids) {
          // Get the category of the items

          const numId = parseInt(id);

          const categoryExpressID = modelTypes[id];
          const category = allTypes[categoryExpressID];
          if (!groups.category[category]) {
            groups.category[category] = [];
          }

          groups.category[category].push(id);

          /*console.log("categoryExpressID: " + JSON.stringify(categoryExpressID));
          console.log("category: " + JSON.stringify(category));
          console.log("id:" + JSON.stringify(id));*/

          // Get the floors of the items

          const floorExpressID = levelsRelationship[id];
          const floor = floorNames[floorExpressID];
          if (!groups["floor"][floor]) {
            groups["floor"][floor] = [];
          }
          groups["floor"][floor].push(id);


          /*if (!sistemas["sistema"][sistema]) {
            sistemas["sistema"][sistema] = [];
          }*/
          /*console.log("sistema: " + numId + 1);
          console.log("sistemaExpressID: " + JSON.stringify(sistemaExpressID));
          console.log("sistema: " + JSON.stringify(sistema));*/

          let flag = true;
          let currentId = numId;
          let nombreSistema = "";
          let codigoHabitacion = "";

          while (flag) {

            if (properties[currentId]) {
              //console.log("properties[currentId]: " + JSON.stringify(properties[currentId]));

              try {

                //console.log("properties[currentId]: " + JSON.stringify(properties[currentId].NominalValue.value));

                if (properties[currentId].Name.value === "Nombre de sistema") {
                  //console.log("properties[currentId]: " + JSON.stringify(properties[currentId].NominalValue.value));
                  nombreSistema = properties[currentId].NominalValue.value;
                  //console.log("ID: " + numId);
                  //console.log("sistemaExpressID: " + JSON.stringify(sistemaExpressID));
                  //console.log("sistema: " + JSON.stringify(sistema));
                  if (!groups.nombreSistema[nombreSistema]) {
                    groups.nombreSistema[nombreSistema] = [];
                  }

                  groups.nombreSistema[nombreSistema].push(id);

                }

                if (properties[currentId].Name.value === "CSPT_FM_HabitacioCodi") {
                  //console.log("properties[currentId]: " + JSON.stringify(properties[currentId].NominalValue.value));
                  codigoHabitacion = properties[currentId].NominalValue.value;
                  //console.log("ID: " + numId);
                  //console.log("sistemaExpressID: " + JSON.stringify(sistemaExpressID));
                  console.log("codigoHabitacion: " + JSON.stringify(codigoHabitacion));
                  if (!groups.codigoHabitacion[codigoHabitacion]) {
                    groups.codigoHabitacion[codigoHabitacion] = [];
                  }

                  groups.codigoHabitacion[codigoHabitacion].push(id);

                }
              } catch (error) { };

              currentId = currentId + 1;
            } else {
              //console.log("NO EXOSTE ID!!");
              flag = false;
            }

          }


          //console.log("sistemaExpressID: " + JSON.stringify(sistemaExpressID));
          //console.log("sistema: " + JSON.stringify(sistema));
          //console.log("sistemaExpressID: " + JSON.stringify(sistemaExpressID));
          //console.log("floorExpressID: " + JSON.stringify(floorExpressID));
          //console.log("floor: " + JSON.stringify(floor));


        }

        //console.log("groups.category[category]: " + JSON.stringify(groups.category));
        //console.log("salida: " + JSON.stringify(sistemas.sistema));


        this.fragments.groups.add(fragment.id, groups);
        //this.fragments.groups.add(fragment.id, sistemas);

        this.fragments.culler.needsUpdate = true;
        this.fragments.highlighter.update();
      }
    }

    //console.log("fragments: " + JSON.stringify(this.fragments.groups.groupSystems));
  }
}
