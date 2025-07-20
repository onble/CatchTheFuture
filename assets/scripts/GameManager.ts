import {
    _decorator,
    BoxCollider2D,
    Component,
    find,
    instantiate,
    Label,
    Node,
    Prefab,
    randomRange,
    randomRangeInt,
    UITransform,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
    @property([String])
    workNameArray: string[] = [];

    @property(Prefab)
    workLabelPrefab: Prefab = null;

    @property(Node)
    TimerLabel: Node = null;

    @property(Number)
    public totalTime: number = 8;

    private currentTime: number = this.totalTime;

    // 使用过的索引
    private usedIndes: Set<number> = new Set<number>();

    private static _instance: GameManager = null;

    public static get instance(): GameManager {
        return this._instance;
    }

    protected onLoad(): void {
        if (GameManager._instance == null) {
            GameManager._instance = this;
        } else {
            console.log("GameManager is already existed");
            this.destroy();
            return;
        }
    }

    protected start(): void {
        this.schedule(this.instantiateAndReplaceLabelContent, 0.5);
    }

    protected update(dt: number): void {
        if (this.currentTime > 0) {
            this.currentTime -= dt;
        } else {
            this.currentTime = 0;
            console.log("游戏结束");
        }
        this.TimerLabel.getComponent(Label).string = this.currentTime.toFixed(2);
    }

    /**
     * 实例化并替换label内容
     */
    private instantiateAndReplaceLabelContent() {
        if (this.workNameArray.length === this.usedIndes.size) {
            this.unschedule(this.instantiateAndReplaceLabelContent);
            return;
        }
        let randomIndex: number;
        do {
            // 生成随机索引
            randomIndex = randomRangeInt(0, this.workNameArray.length);
        } while (this.usedIndes.has(randomIndex));
        // 标记此索引已被使用
        this.usedIndes.add(randomIndex);
        let WorkLabelNode = instantiate(this.workLabelPrefab);
        // 设置标签的为本内容为随机选中的工作名称
        WorkLabelNode.getComponent(Label).string = this.workNameArray[randomIndex];
        this.scheduleOnce(() => {
            WorkLabelNode.getComponent(BoxCollider2D).size.set(WorkLabelNode.getComponent(UITransform).contentSize);
            WorkLabelNode.getComponent(BoxCollider2D).apply();
        }, 0);
        // 将标签节点设置到"Canvas/WorkLabelList"下
        WorkLabelNode.parent = find("Canvas/WorkLabelList");
        // 设置标签节点的位置为随机位置和固定高度670
        WorkLabelNode.setPosition(randomRange(-320, 320), 670);
    }
}
