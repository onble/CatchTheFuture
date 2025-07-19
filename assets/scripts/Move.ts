import { _decorator, Component, EventTouch, Node, Vec2, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Move")
export class Move extends Component {
    private _offset: Vec2 = new Vec2();
    private _isDragging: boolean = false;
    protected onLoad(): void {
        this.addTouch();
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
        this.node.setPosition(newLocation);
    }
    onTouchEnd(event: EventTouch) {}
    addTouch() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
    removeTouch() {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
}
