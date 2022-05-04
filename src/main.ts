import { Game } from "./game/game";
import "./style.css";
import { LevelData } from "./typings/level";

const levelData: LevelData = {
  components: [
    {
      type: "single-key",
      transform: {
        tx: 0,
        ty: 0,
        rz: 0,
        sx: 1,
        sy: 1,
      },
      time: [0, 3],
      data: {
        key: "A",
        time: 1,
      },
    },
    {
      type: "single-key",
      transform: {
        tx: 0,
        ty: 0,
        rz: 0,
        sx: 1,
        sy: 1,
      },
      time: [1, 3],
      data: {
        key: "B",
        time: 1.2,
      },
    },
  ],
};

async function main() {
  const game = new Game(levelData, document.querySelector("#app")!);
  globalThis.game = game;
}

main();
