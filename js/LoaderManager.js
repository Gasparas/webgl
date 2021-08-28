import * as utils from "./utils.js";

export default class LoaderManager {
  constructor(sceneManager, gameManager) {
    this.sceneManager = sceneManager;
    this.game = gameManager;

    this.assetsManager = new BABYLON.AssetsManager(this.sceneManager.scene);
    this.assetsManager.useDefaultLoadingScreen = false;

    this.previousRoom = null;
    this.roomBaseMent = null;
    this.backGroundMusic = null;
  }

  initializeSceneAssets() {
    //first Load

    //room's
    var hallTask = this.assetsManager.addMeshTask(
      "hall_Task",
      "",
      "models/gallary/",
      "chicagoGallery.babylon"
    );

    hallTask.onSuccess = (task) => {
      //Test --On Mesh Success

      //   for (let i = 0; i < task.loadedMeshes.length; i++) {
      //     console.log("tr22" , task.loadedMeshes[i].name , "----- > ", i );
      // }

      this.hallMesh = task.loadedMeshes[395]; //Hall
    };

    this.assetsManager.onProgress = (
      remainingCount,
      totalCount,
      lastFinishedTask
    ) => {
      // console.log("r ",remainingCount, "pp", totalCount )
      this.game.engine.loadingUIText =
        "We are loading the scene. " +
        remainingCount +
        " out of " +
        totalCount +
        " items still need to be loaded.";
    };

    this.assetsManager.onFinish = (tasks) => {
      //On ALL Done
      // console.log("loaded !!! ")
    };

    // Start loading
    this.assetsManager.load();
  }
}
