import { _decorator, Component, find, instantiate, Label, Node, Prefab, randomRange, randomRangeInt } from "cc";
const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
    @property([String])
    workNameArray: string[] = [];

    @property(Prefab)
    workLabelPrefab: Prefab = null;

    // 使用过的索引
    private usedIndes: Set<number> = new Set<number>();

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

    protected start(): void {
        this.schedule(this.instantiateAndReplaceLabelContent, 0.5);
    }

    /**
     * 实例化并替换label内容
     */
    private instantiateAndReplaceLabelContent() {
        let randomIndex: number;
        randomIndex = randomRangeInt(0, this.workNameArray.length);
        // 标记此索引已被使用
        this.usedIndes.add(randomIndex);
        let WorkLabelNode = instantiate(this.workLabelPrefab);
        // 设置标签的为本内容为随机选中的工作名称
        WorkLabelNode.getComponent(Label).string = this.workNameArray[randomIndex];
        // 将标签节点设置到"Canvas/WorkLabelList"下
        WorkLabelNode.parent = find("Canvas/WorkLabelList");
        // 设置标签节点的位置为随机位置和固定高度670
        WorkLabelNode.setPosition(randomRange(-320, 320), 670);
    }
}
