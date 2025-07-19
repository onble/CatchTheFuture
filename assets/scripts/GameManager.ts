import { _decorator, Component, Node, Prefab } from "cc";
const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
    @property([String])
    workNameArray: string[] = [];

    @property(Prefab)
    workLabelPrefab: Prefab = null;

    private static _instance: GameManager = null;

    public static get instance() {
        return this._instance;
    }

    protected onLoad(): void {
        if (GameManager._instance == null) {
            GameManager._instance = this;
        } else {
            console.log("GameManager is already existed");
            this.node.destroy();
            return;
        }
    }
}
