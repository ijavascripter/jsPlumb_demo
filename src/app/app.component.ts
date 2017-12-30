import {Component, OnInit, ViewEncapsulation} from '@angular/core';

declare let jsPlumb: any;
declare let jsPlumbUtil: any;
declare let $: any;

@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.None, // 禁用angular样式
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  plumbInstance = jsPlumb.getInstance(
    /*
      初始化设置
     */
    {
      PaintStyle: {
        gradient: {
          stops:
            [
              [0, '#ffce7b'],
              [1, '#6d5826'],
            ]
        },
        stroke: '#000000',
        // 画笔的宽度
        strokeWidth: 4,
      },
      // 选择线的类型
      Connector: ['Bezier', {
        curviness: 150,
        stub: 30,
        alwaysRespectStubs: true,
        // 端点和元素的距离
        gap: 5,
        // 直角的弧度
        midpoint: 0.5,
        cornerRadius: 1,
      }],
      EndpointStyle: {outlineStroke: '#2a5caa'},  //端点轮廓颜色,fill整体填充 ，Stroke内部填充
      Container: 'canvas', // 默认容器
    });

  connectionInfo: any; // 删除连接对象

  infoArray = []; //  连接信息数组

  offsetX = 0; // 画板新生成节点X轴偏移量
  offsetY = 0; // 画板新生成节点Y轴偏移量

  ngOnInit() {
    this.panZoom();
    this.addElement();
    this.addEventListener();
  }

  addEventListener() {
    /*
     创建连接事件
      */
    this.plumbInstance.bind('connection', (info, originalEvent) => {
      if (info.connection.sourceId !== info.connection.targetId) {  // 防止回环
        info.connection.addClass('addConn');
        this.infoArray.push(info);
      } else {
        this.plumbInstance.detach(info);
      }
    });
    // 删除连接
    this.plumbInstance.bind('contextmenu', (conn) => {
      this.connectionInfo = conn;
    });
    // 右键菜单删除连接
    $.contextMenu({
      selector: 'svg.addConn',
      callback: (key, options) => {
        // this.plumbInstance.select({source: this.connectionInfo.sourceId, target: this.connectionInfo.targetId}).detach();// 删除连接1
        this.plumbInstance.detach(this.connectionInfo); // 删除连接
        this.deleteConnInfo2(this.connectionInfo.sourceId, this.connectionInfo.targetId);
      },
      items: {
        'delete': {name: '删除连接', icon: 'delete'}
      }
    });
    /*
    右键菜单=>删除节点
     */
    $.contextMenu({
      selector: '.smallWindow',
      autoHide: true,
      callback: (key, options) => {
      },
      items: {
        'delete': {
          name: '删除节点',
          callback: (key, opt) => {
            this.plumbInstance.remove(opt.$trigger[0].id);
            this.deleteConnInfo1(opt.$trigger[0].id);
          },
          icon: 'delete'
        },
        'getUpOut': {
          name: '出度入度',
          callback: (key, opt) => {
            const inNumber = this.getNumber(opt.$trigger[0].id).sNum;
            const outNumber = this.getNumber(opt.$trigger[0].id).tNum;
            confirm('出度:' + inNumber + ',入度值：' + outNumber);
          },
          icon: 'fa-thumbs-o-up'
        }
      }
    });
    /*
    zoom
     */
    this.plumbInstance.bind('zoom', (value) => {
      console.log(value);
    });
  }

  /**
   * 创建元素
   */
  addElement() {
    $('#canvas2').click(() => {
      const id = jsPlumbUtil.uuid();  // 生成随机数作为元素Id
      const name = id.substring(0, 8);
      $('#canvas').append(
        `<div  class="window smallWindow" id="${id}" style="top: ${this.offsetY}px;left: ${this.offsetX}px;">
                      <strong>${name} </strong><br><br></div>
                    `
      );
      // const elementId = 'pro-' + treeNodeId; //添加id前缀
      this.increaseDyeing(id);
      this.offsetX += 155;
      if (this.offsetX > 1000) {
        this.offsetX = 0;
        this.offsetY += 120;
      }
    });
  }

  /**
   * 渲染新添加元素
   */
  increaseDyeing(nodeId) {

    jsPlumb.ready(() => {
      /*
      连接、端点设置
       */
      const exampleEndpoint = {

        deleteEndpointsOnDetach: false,  // 删除连接后保留节点
        allowLoopback: false, // 回环连接
        maxConnections: -1,   // 最大连接数目
        isSource: true, // 是连接源
        isTarget: true, // 也是连接目标
        connectorOverlays:
          [
            ['Arrow', {width: 10, length: 30, location: 1, id: 'arrow'}],  // 添加箭头
            ['Label', {label: '标签', location: 0.3, id: 'label'}]    // 添加标签
          ],
        endpoint: ['Dot', {radius: 7}],  // 端点的类型
        endpointHoverStyle: {fill: '#EE3B3B'},  // 鼠标悬停端点填充
        // connectorHoverPaintStyle: {stroke: '#EE3B3B', outlineStroke: '#EE3B3B', outlineWidth: 1} // 填充、轮廓、宽度
        // connectorHoverStyle: {stroke: '#EE3B3B'}, //鼠标悬停箭头和端点填充
        // hoverPaintStyle: {stroke: '#EE3B3B'}, // 鼠标悬停连接填充----不好使！

      };
      // const smallWindows = this.plumbInstance.getSelector('.smallWindow');    // 获取列表元素，返回数组
      /*
      每调用依次addEndpoint方法，元素上面就会增加一个连线的端点。(使用动态锚点)
       */

      this.plumbInstance.addEndpoint(nodeId, exampleEndpoint, {anchors: [[0.5, 0, 0, -1], [1, 0.5, 1, 0], [0.5, 1, 0, 1], [0, 0.5, -1, 0]]});
      this.plumbInstance.addEndpoint(nodeId, exampleEndpoint, {anchors: [[1, 0.5, 1, 0], [0.5, 0, 0, -1], [0.5, 1, 0, 1], [0, 0.5, -1, 0]]});
      this.plumbInstance.addEndpoint(nodeId, exampleEndpoint, {anchors: [[0.5, 1, 0, 1], [0.5, 0, 0, -1], [1, 0.5, 1, 0], [0, 0.5, -1, 0]]});
      this.plumbInstance.addEndpoint(nodeId, exampleEndpoint, {anchors: [[0, 0.5, -1, 0], [0.5, 0, 0, -1], [1, 0.5, 1, 0], [0.5, 1, 0, 1]]});

      /*
      每调用依次addEndpoint方法，元素上面就会增加一个连线的端点。(不使用动态锚点)
       */
      // this.plumbInstance.addEndpoint(nodeId, exampleEndpoint, {anchors: 'top'});
      // this.plumbInstance.addEndpoint(nodeId, exampleEndpoint, {anchors: 'Right'});
      // this.plumbInstance.addEndpoint(nodeId, exampleEndpoint, {anchors: 'Bottom'});
      // this.plumbInstance.addEndpoint(nodeId, exampleEndpoint, {anchors: 'Left'});
      this.enableDraggable(nodeId);
    });
    this.plumbInstance.fire('jsPlumbDemoLoaded', this.plumbInstance); //  立即生效
    // });
  }


  /**
   * 让元素可拖动，记录元素位置
   */
  enableDraggable(nodeId) {

    this.plumbInstance.draggable(nodeId, {
      containment: 'canvas', // 只能在容器内拖动
      start: (event) => {
        // console.log('start');
        // console.log(event);
      },
      drag: (event) => {
        // console.log('drag');
        // console.log(event);
      },
      stop: (event) => {
        const canvasX = event.finalPos[0];
        const canvasY = event.finalPos[1];
        console.log(event.drag.el.id, canvasX, canvasY);
      },
    });
    // this.plumbInstance.draggable('canvas'); // 使容器可拖动，有问题。

  }

  /**
   * 查询某个节点的出度入度
   */
  getNumber(nodeId) {
    let sourceNumber = 0;
    let targetNumber = 0;
    const cpInfoArray = [].concat(this.infoArray);
    for (let i = 0; i < cpInfoArray.length; i++) {
      if (nodeId === cpInfoArray[i].sourceId) {
        sourceNumber += 1;
      }
    }
    for (let j = 0; j < cpInfoArray.length; j++) {
      if (nodeId === cpInfoArray[j].targetId) {
        targetNumber += 1;
      }
    }
    const data = {'sNum': sourceNumber, 'tNum': targetNumber};
    return data;
  }

  /**
   * 删除连接信息(节点)
   */
  deleteConnInfo1(nodeId) {
    const cpInfoArray = [].concat(this.infoArray);
    for (let i = 0; i < cpInfoArray.length; i++) {
      if ((nodeId === cpInfoArray[i].targetId) || (nodeId === cpInfoArray[i].sourceId)) {
        this.infoArray.splice(this.infoArray.indexOf(cpInfoArray[i]), 1);
      }
    }
  }

  /**
   * 删除连接信息(连接)
   */
  deleteConnInfo2(sNodeId, tNodeId) {
    const cpInfoArray = [].concat(this.infoArray);
    for (let i = 0; i < cpInfoArray.length; i++) {
      if ((sNodeId === cpInfoArray[i].sourceId) && (tNodeId === cpInfoArray[i].targetId)) {
        this.infoArray.splice(this.infoArray.indexOf(cpInfoArray[i]), 1);
        return;
      }
    }
  }

  /**
   *   使用panzoom进行缩放
   */
  panZoom() {
    const $panzoom = $('#canvas').panzoom({
      cursor: 'move',
      minScale: 0.1,
      maxScale: 2,
      increment: 0.1,
      duration: 100,
      disablePan: true,
    });
    /*
    parent().on 光标在父容器缩放
     */
    $panzoom.parent().on('mousewheel', function (e) {
      e.preventDefault();
      const delta = e.delta || e.originalEvent.wheelDelta;
      const zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
      $panzoom.panzoom('zoom', zoomOut, {
        animate: false,
        focal: e
      });
    });
    /*
    将缩放比例给jsplumb实例
     */
    $panzoom.on('panzoomzoom', (e, panzoom, scale) => {
      this.plumbInstance.setZoom(scale);
    });
  }
}



