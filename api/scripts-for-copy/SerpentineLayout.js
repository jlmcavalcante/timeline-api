class SerpentineLayout extends go.Layout {
  constructor(init) {
    super();
    this._spacing = new go.Size(120, 80);
    this._wrapCount = 3;
    this._root = null;
    this.isViewportSized = true;
    if (init) Object.assign(this, init);
  }

  get spacing() {
    return this._spacing;
  }
  set spacing(val) {
    if (!this._spacing.equals(val)) {
      this._spacing = val;
      this.invalidateLayout();
    }
  }

  get wrapCount() {
    return this._wrapCount;
  }
  set wrapCount(val) {
    if (this._wrapCount !== val) {
      this._wrapCount = val;
      this.invalidateLayout();
    }
  }

  doLayout(collection) {
    const diagram = this.diagram;
    if (!diagram) return;

    const coll = this.collectParts(collection);
    let root = this._root;

    if (!root) {
      for (const part of coll.iterator) {
        if (part instanceof go.Node && part.findLinksInto().count === 0) {
          root = part;
          break;
        }
      }
    }

    if (!root) return;

    const spacing = this.spacing;
    diagram.startTransaction('Serpentine Layout');

    this.arrangementOrigin = this.initialOrigin(this.arrangementOrigin);
    let x = this.arrangementOrigin.x;
    let y = this.arrangementOrigin.y;
    let rowHeight = 0;
    let increasing = true;
    let node = root;
    let count = 0;
    let rowNodes = [];

    while (node !== null) {
      rowNodes.push(node);
      const bounds = this.getLayoutBounds(node);

      let nextlink = null;
      for (const link of node.findLinksOutOf()) {
        if (coll.has(link)) {
          nextlink = link;
          break;
        }
      }

      let nextnode = nextlink ? nextlink.toNode : null;

      if (increasing) {
        node.move(new go.Point(x, y));
        x += bounds.width;
        rowHeight = Math.max(rowHeight, bounds.height);
        count++;

        if (count >= this._wrapCount || nextnode === null) {
          this.alinharLinha(rowNodes, y, rowHeight, increasing);
          rowNodes = [];
          y += rowHeight + spacing.height;
          count = 0;
          increasing = false;
          x -= spacing.width;
        } else {
          x += spacing.width;
        }
      } else {
        x -= bounds.width;
        node.move(new go.Point(x, y));
        rowHeight = Math.max(rowHeight, bounds.height);
        count++;

        if (count >= this._wrapCount || nextnode === null) {
          this.alinharLinha(rowNodes, y, rowHeight, increasing);
          rowNodes = [];
          y += rowHeight + spacing.height;
          count = 0;
          increasing = true;
          x += spacing.width;
        } else {
          x -= spacing.width;
        }
      }
      node = nextnode;
    }

    if (rowNodes.length > 0) {
      this.alinharLinha(rowNodes, y, rowHeight, increasing);
    }

    diagram.commitTransaction('Serpentine Layout');
  }

  alinharLinha(rowNodes, y, rowHeight, increasing) {
    if (rowNodes.length === 0) return;

    const nodeWidth = this.getLayoutBounds(rowNodes[0]).width + this.spacing.width;
    let startX = this.arrangementOrigin.x;

    if (rowNodes.length < this._wrapCount) {
      startX = increasing ? this.arrangementOrigin.x : this.arrangementOrigin.x + (this._wrapCount - rowNodes.length) * nodeWidth;
    }

    let nodeX = increasing ? startX : startX + (rowNodes.length - 1) * nodeWidth;

    for (const node of rowNodes) {
      const nb = this.getLayoutBounds(node);
      node.move(new go.Point(nodeX, y + (rowHeight - nb.height) / 2));
      nodeX += increasing ? nodeWidth : -nodeWidth;
    }
  }
}
