import LoaderManager from "./LoaderManager.js";

export default class MainSceneManager {
  constructor(gameManager) {
    this.game = gameManager;
    this.scene = null;
    this.MainCamera = null;
    this.HemiLight = null;
    this.isLocked = false;
  }
  createScene() {
    this.scene = new BABYLON.Scene(this.game.engine);
    this.scene.imageProcessingConfiguration.exposure = 0.6; //0.6;
    this.scene.imageProcessingConfiguration.contrast = 1.8; //1.6;
    this.scene.imageProcessingConfiguration.toneMappingEnabled = true;
    // this.scene.imageProcessingConfiguration.vignetteEnabled = true;
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);
    // this.scene.imageProcessingConfiguration.colorCurvesEnabled = true;
    // this.scene.imageProcessingConfiguration.colorCurves = new BABYLON.ColorCurves();
    // this.scene.imageProcessingConfiguration.colorCurves.globalSaturation = 0;

    this.scene.gravity = new BABYLON.Vector3(0, -0.9, 0);
    this.scene.collisionsEnabled = true;

    this.scene.onPointerObservable.add((pointerInfo) => {
      switch (pointerInfo.type) {
        case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
          break;
        default:
          break;
      }
    });
    // On click event, request pointer lock
    this.scene.onPointerDown = (evt) => {
      //true/false check if we're locked, faster than checking pointerlock on each single click.
      if (!this.isLocked && !this.IsMobile) {
        this.game.canvas.requestPointerLock =
          this.game.canvas.requestPointerLock ||
          this.game.canvas.msRequestPointerLock ||
          this.game.canvas.mozRequestPointerLock ||
          this.game.canvas.webkitRequestPointerLock;
        if (this.game.canvas.requestPointerLock) {
          console.log("ddddddd");
          if(!this.IsMobile) {
            this.game.canvas.requestPointerLock();
          };

        }
      }
    };

    // Attach events to the document
    document.addEventListener(
      "pointerlockchange",
      this.pointerlockchange(),
      false
    );
    document.addEventListener(
      "mspointerlockchange",
      this.pointerlockchange(),
      false
    );
    document.addEventListener(
      "mozpointerlockchange",
      this.pointerlockchange(),
      false
    );
    document.addEventListener(
      "webkitpointerlockchange",
      this.pointerlockchange(),
      false
    );

    // this.keys = { left: 37, right: 39, up: 38, down: 40 };

    this.createCamera();
    this.initializeEnvironMent();

    //init LoadManager
    this.loaderManager = new LoaderManager(this, this.game);
    this.loaderManager.initializeSceneAssets();

    // this.scene.debugLayer.show();
    return this.scene;
  }
  pointerlockchange() {
    var controlEnabled =
      document.mozPointerLockElement ||
      document.webkitPointerLockElement ||
      document.msPointerLockElement ||
      document.pointerLockElement ||
      null;
    // If the user is already locked
    if (!controlEnabled) {
      //camera.detachControl(canvas);
      this.isLocked = false;
    } else {
      //camera.attachControl(canvas);
      this.isLocked = true;
    }
  }
  createCamera() {
    this.IsMobile = this.isMobile();
    console.log("is mobile", this.IsMobile);

    //Moving Camera
    this.MainCamera = new BABYLON.FreeCamera(
      "UniversalCamera",
      new BABYLON.Vector3(6.5, 5, -42),
      this.scene
    );
    this.MainCamera.checkCollisions = true;
    this.MainCamera.attachControl(this.game.canvas, true);
    this.MainCamera.speed = 2.3;
    this.MainCamera.minZ = 0.5;
    this.MainCamera.fov = 1.3;
    //Controls  WASD
    this.MainCamera.keysUp.push(87);
    this.MainCamera.keysDown.push(83);
    this.MainCamera.keysRight.push(68);
    this.MainCamera.keysLeft.push(65);

    this.MainCamera.position = new BABYLON.Vector3(-161, 12, -100);
    this.MainCamera.ellipsoid = new BABYLON.Vector3(1, 5, 1);

    this.MainCamera.rotation.y = 1.52;
    this.MainCamera.target = new BABYLON.Vector3(-160.0, 12, -99.946);

    this.MainCamera.inertia = 0.6;

    if (this.IsMobile) {
      this.setupMobile();
    }


    // console.log("You're using web", this.MainCamera.inputs);

    // this.camBox = BABYLON.MeshBuilder.CreateBox(
    //   "CameraBox",
    //   { size: 2 },
    //   this.scene
    // );
    // this.camBox.position.y -= 2;
    // this.camBox.parent = this.MainCamera;
  }
  initializeEnvironMent() {
    this.HemiLight = new BABYLON.HemisphericLight(
      "HemiLight",
      new BABYLON.Vector3(0, -1, 0),
      this.scene
    );
    this.HemiLight.intensity = 1.8;
    this.HemiLight.groundColor = new BABYLON.Color3(
      90 / 255,
      90 / 255,
      90 / 255
    );
    
/*
    // var box = BABYLON.MeshBuilder.CreateBox("MainBox", {size:1}, this.scene);
    this.alphaMaterial = new BABYLON.StandardMaterial("alphaMat", this.scene);
    this.alphaMaterial.alpha = 0;

    var ground = BABYLON.MeshBuilder.CreateGround(
      "ground",
      { width: 250, height: 250 },
      this.scene
    );
    ground.checkCollisions = true;
    ground.material = this.alphaMaterial;

    // this.camBox.material = this.alphaMaterial;
    this.MainCamera.applyGravity = true;
  }
  //#region controls
  detachCameraControl() {
    this.MainCamera.detachControl(this.game.canvas);
  }
  //#endregion
*/

  setupMobile() {
    let adt = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    let xAddPos = 0;
    let yAddPos = 0;
    let xAddRot = 0;
    let yAddRot = 0;
    let sideJoystickOffset = 10;
    let bottomJoystickOffset = -5;
    let translateTransform;

    var w = window.innerWidth /2.5;


    let leftThumbContainer = makeThumbArea("leftThumb", 2, "blue", null);
    leftThumbContainer.height = `${w}px`;
 `${w}px`;
    leftThumbContainer.width =`${w}px`;
 `${w}px`;
    leftThumbContainer.isPointerBlocker = true;
    leftThumbContainer.horizontalAlignment =
      BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    leftThumbContainer.verticalAlignment =
      BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    leftThumbContainer.alpha = 0.4;
    leftThumbContainer.left = sideJoystickOffset;
    leftThumbContainer.top = bottomJoystickOffset;

    let leftInnerThumbContainer = makeThumbArea(
      "leftInnterThumb",
      4,
      "blue",
      null
    );
    leftInnerThumbContainer.height = "100px";
    leftInnerThumbContainer.width = "100px";
    leftInnerThumbContainer.isPointerBlocker = true;
    leftInnerThumbContainer.horizontalAlignment =
      BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    leftInnerThumbContainer.verticalAlignment =
      BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    let leftPuck = makeThumbArea("leftPuck", 0, "blue", "blue");
    leftPuck.height = "60px";
    leftPuck.width = "60px";
    leftPuck.isPointerBlocker = true;
    leftPuck.horizontalAlignment =
      BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    leftPuck.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    leftThumbContainer.onPointerDownObservable.add(function (coordinates) {
      leftPuck.isVisible = true;
      leftPuck.floatLeft =
        coordinates.x -
        leftThumbContainer._currentMeasure.width * 0.5 -
        sideJoystickOffset;
      leftPuck.left = leftPuck.floatLeft;
      leftPuck.floatTop =
        adt._canvas.height -
        coordinates.y -
        leftThumbContainer._currentMeasure.height * 0.5 +
        bottomJoystickOffset;
      leftPuck.top = leftPuck.floatTop * -1;
      leftPuck.isDown = true;
      leftThumbContainer.alpha = 0.9;
    });

    leftThumbContainer.onPointerUpObservable.add(function (coordinates) {
      xAddPos = 0;
      yAddPos = 0;
      leftPuck.isDown = false;
      leftPuck.isVisible = false;
      leftThumbContainer.alpha = 0.4;
    });

    leftThumbContainer.onPointerMoveObservable.add(function (coordinates) {
      if (leftPuck.isDown) {
        xAddPos =
          coordinates.x -
          leftThumbContainer._currentMeasure.width * 0.5 -
          sideJoystickOffset;
        yAddPos =
          adt._canvas.height -
          coordinates.y -
          leftThumbContainer._currentMeasure.height * 0.5 +
          bottomJoystickOffset;
        leftPuck.floatLeft = xAddPos;
        leftPuck.floatTop = yAddPos * -1;
        leftPuck.left = leftPuck.floatLeft;
        leftPuck.top = leftPuck.floatTop;
      }
    });

    adt.addControl(leftThumbContainer);
    leftThumbContainer.addControl(leftInnerThumbContainer);
    leftThumbContainer.addControl(leftPuck);
    leftPuck.isVisible = false;

    this.MainCamera.attachControl(this.game.canvas, true);

    this.scene.registerBeforeRender( () => {
      translateTransform = BABYLON.Vector3.TransformCoordinates(
        new BABYLON.Vector3(xAddPos / 3000, 0, yAddPos / 3000),
        BABYLON.Matrix.RotationY(this.MainCamera.rotation.y)
      );
      this.MainCamera.cameraDirection.addInPlace(translateTransform);
      this.MainCamera.cameraRotation.y += (xAddRot / 15000) * -1;
      this.MainCamera.cameraRotation.x += (yAddRot / 15000) * -1;
    });

    function makeThumbArea(name, thickness, color, background, curves) {
      let rect = new BABYLON.GUI.Ellipse();
      rect.name = name;
      rect.thickness = thickness;
      rect.color = color;
      rect.background = background;
      rect.paddingLeft = "0px";
      rect.paddingRight = "0px";
      rect.paddingTop = "0px";
      rect.paddingBottom = "0px";

      return rect;
    }
  }
  //#region Utils
  isMobile() {
    let a = navigator.userAgent || navigator.vendor || window.opera;
    return (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    );
  }
  //#region
}
