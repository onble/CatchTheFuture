import { _decorator, Component, EventTouch, instantiate, Node, Prefab, tween, Vec2, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Move")
export class Move extends Component {
    @property(Vec2)
    minBoundary: Vec2 = new Vec2();

    @property(Vec2)
    maxBoundary: Vec2 = new Vec2();

    @property(Prefab)
    FutureWorkLabel: Prefab = null;

    private _offset: Vec2 = new Vec2();
    private _isDragging: boolean = false;
    protected onLoad(): void {
        this.addTouch();
    }
    protected start(): void {
        this.scheduleOnce(() => {
            this.removeTouch();
            let FutureWorkLabelNode = instantiate(this.FutureWorkLabel);
            FutureWorkLabelNode.setParent(this.node);
            let t1 = tween(FutureWorkLabelNode).to(1.5, { position: new Vec3(0, 100, 0) }, { easing: "backInOut" });
            t1.start();
        }, 1);
    }
    protected onDestroy(): void {
        this.removeTouch();
    }
    onTouchStart(event: EventTouch) {
        let touchLocation = event.getLocation(); // 手指触摸的位置
        let nodeLocation = this.node.getPosition(); // 当前节点位置
        // 计算位置偏移量
        this._offset.set(touchLocation.x - nodeLocation.x, touchLocation.y - nodeLocation.y);
        this._isDragging = true;
    }
    onTouchMove(event: EventTouch) {
        if (!this._isDragging) return;
        let touchLocation = event.getLocation(); // 手指触摸的位置
        let newLocation = new Vec3(touchLocation.x - this._offset.x, touchLocation.y - this._offset.y);
        newLocation = this.clampPosition(newLocation);
        this.node.setPosition(newLocation);
    }
    onTouchEnd(event: EventTouch) {
        this._isDragging = false;
    }
    addTouch() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
    clampPosition(position: Vec3): Vec3 {
        // 将位置x限制在最小边界和最大边界之间
        let clampedX = Math.max(this.minBoundary.x, Math.min(position.x, this.maxBoundary.x));
        // 将位置Y限制在最小边界和最大边界之间
        let clampedY = Math.max(this.minBoundary.y, Math.min(position.y, this.maxBoundary.y));
        // 返回新的Vec3位置，其中X和Y都被限制在边界内，Z保持不变
        return new Vec3(clampedX, clampedY, position.z);
    }
    removeTouch() {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
}
