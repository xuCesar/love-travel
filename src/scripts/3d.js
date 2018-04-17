const THREE = require('three');
const Stats = require('dat.gui');
const TWEEN = require('@tweenjs/tween.js');
require:require('./data')

module.exports = {

  container : null,
  scene : null,
  camera : null,
  renderer : null,
  width : null,
  height : null,
  skybox : null,
  controls : null,
  clock : null,
  stats : null,
  sceneImage : [],
  targetRotationX : Math.PI / 180 * -91,
  targetRotationOnMouseDownX : 0,
  targetRotationY : 0,
  targetRotationOnMouseDownY : 0,
  targetEarthRotationX : 0,
  targetEarthRotationOnMouseDownX : 0,
  targetEarthRotationY : 0,
  targetEarthRotationOnMouseDownY : 0,
  targetSceneRotationY : 0,
  targetSceneRotationX : 0,
  mouseX : 0,
  mouseY : 0,
  mouseXOnMouseDown : 0,
  mouseYOnMouseDown : 0,
  windowHalfX : window.innerWidth / 2,
  windowHalfY : window.innerHeight / 2,
  finalRotationY : null,
  objects : [],
  raycaster : new THREE.Raycaster(),
  mouse : new THREE.Vector2(),
  locked : false,
  timeline: null,
  r: 150,
  radius: 160,
  earthContainer: null,
  earth: null,
  earthPol: null,
  hotspot : null,
  showingDetail : false,

  countries : [
    {
      'name': '中国',
      'lat' : 116.20,
      'lng' : 39.55
    },
    {
      'name': '法国',
      'lat' : 2.20,
      'lng' : 48.50,
    },
    {
      'name': '俄罗斯',
      'lat' : 37.35,
      'lng' : 55.45
    },
    {
      'name': '朝鲜',
      'lat' : 125.30,
      'lng' : 39.09
    },
    {
      'name': '澳大利亚',
      'lat' : 149.08,
      'lng' : -35.15
    },
    {
      'name': '巴西',
      'lat' : -47.55,
      'lng' : -15.47
    }
  ],

  init : function () {

    this.container = document.getElementById('container');
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.width/this.height, 1,100000);
    this.camera.position.set(0,0,750)
    this.renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
    this.renderer.setPixelRatio(window.devicePixelRatio); //移动端为了性能，关闭此功能
    this.renderer.setSize(this.width,this.height);
    this.renderer.autoClear = false;

    this.container.appendChild(this.renderer.domElement);


    IDR.eventIndex = [];
    for (i = 0; i < IDR.events.length; i++) {
      IDR.eventIndex.push(IDR.events[i].month + "-" + IDR.events[i].year);
    }

    console.log(IDR.eventIndex)

    this.addSkyBox()
    this.addEarth()
    this.addShips()
    // this.creatPositionObject()
    // this.createHotSpot()
    // this.addTimeline()
    this.addAmbientLight()
    this.eventListeners()
    // this.setStats()
    this.render()

    // this.container.addEventListener( 'mousedown', this.transToThreeCoord, false );

  },

  load : function (img) {
    this.sceneImage.push(img)
  },

  addSkyBox : function () {
    var geo = new THREE.SphereGeometry(1500, 40,40 );
    var src = require("@/assets/stars.jpg")
    // console.log(this.sceneImage)
    var mat = new THREE.MeshBasicMaterial({
      color: 0x7efaff,
      map: new THREE.TextureLoader().load(src),
      side: THREE.BackSide,
      opacity:1,
      transparent:true,
      blending:THREE.AdditiveBlending
    });
    this.skybox = new THREE.Mesh(geo,mat);
    this.scene.add(this.skybox);
  },

  addEarth : function(){
    this.earthContainer = new THREE.Object3D();
    var geo = new THREE.SphereGeometry(this.r, 50, 50);
    var src = require("@/assets/earth.jpg")
    var mat = new THREE.MeshLambertMaterial({
      map: new THREE.TextureLoader().load(src)
    });
    this.earth = new THREE.Mesh(geo, mat);
    this.earthContainer.add(this.earth);

    this.scene.add(this.earthContainer);

    var geo = new THREE.SphereGeometry(this.r + 15, 40, 30);
    var mat = new THREE.MeshLambertMaterial({
      transparent: true,
      color: 0x2AC7CC,
      blending: THREE.AdditiveBlending,
      opacity: .4,
    });
    var egh = new THREE.EdgesHelper(new THREE.Mesh(geo, mat), 0x2AC7CC);
    egh.material.linewidth = .5;
    egh.material.transparent = true;
    egh.material.opacity = .08;
    this.earth.add(egh);

    var geo = new THREE.SphereGeometry(this.r + 15, 20, 30);
    var mat = new THREE.MeshLambertMaterial({
      transparent: true,
      color: 0x2AC7CC,
      blending: THREE.AdditiveBlending,
      opacity: .8,
    });
    var egh = new THREE.EdgesHelper(new THREE.Mesh(geo, mat), 0x2AC7CC);
    egh.material.linewidth = .5;
    egh.material.transparent = true;
    egh.material.opacity = .15;
    this.earth.add(egh);

    var geo = new THREE.SphereGeometry(this.r + 1, 50, 50);
    var src = require("@/assets/earth_political_alpha.png")
    var mat = new THREE.MeshLambertMaterial({
      blending: THREE.AdditiveBlending,
      transparent: true,
      color: 0x2AC7CC,
      opacity: .6,
      map: new THREE.TextureLoader().load(src)
    });
    this.earthPol = new THREE.Mesh(geo, mat);
    this.earth.add(this.earthPol);
    var ep2 = this.earthPol.clone();
    this.earth.add(ep2);

    this.earth.ring = new THREE.Object3D();
    var r = this.r + 50;
    var t = Math.PI / 180 * 2;
    var mat = new THREE.LineBasicMaterial({
      linewidth: .5,
      color: 0x6FD5F0,
      transparent: true,
      opacity: .4
    });

    var lineGeo = new THREE.Geometry();
    for (var i = 0; i < 180; i++) {
      var x = r * Math.cos(t * i);
      var z = r * Math.sin(t * i);

      lineGeo.vertices.push(new THREE.Vector3(x * .985, 0, z * .985));
      lineGeo.vertices.push(new THREE.Vector3(x, 0, z));

      if (i % 5 == 0) {

        lineGeo.vertices.push(new THREE.Vector3(x * .965, 0, z * .965));
        lineGeo.vertices.push(new THREE.Vector3(x, 0, z));
        lineGeo.vertices.push(new THREE.Vector3(x * .965, 0, z * .965));
        lineGeo.vertices.push(new THREE.Vector3(x, 0, z));

      }

      if (Math.floor((Math.random() * 10) + 1) == 1) {

        lineGeo.vertices.push(new THREE.Vector3(x, 0, z));
        lineGeo.vertices.push(new THREE.Vector3(x, 5, z));


      }


    }

    // now add all the lines as one piece of geometry
    var line = new THREE.LineSegments(lineGeo, mat);

    this.earth.ring.add(line);


    this.earth.add(this.earth.ring);

    this.earth.userData = {
      type: "earth"
    };
    this.objects.push(this.earth);

  },

  /**
   * 设置环境光
   * @param  {object} opts 环境光接收的参数
   * @return {object}      返回环境光实例
   */
  setAmbientLight : function(opts){
    opts = opts ? opts : {};
    opts.color = opts.color ? opts.color : 0xffffff;       //颜色
    opts.intensity = opts.intensity ? opts.intensity : 1;
    var light = new THREE.AmbientLight( opts.color, opts.intensity );

    return light;
  },

  /**
   * [addAmbientLight] 添加环境光
   */
  addAmbientLight : function () {
    var ambientLight = this.setAmbientLight({
      color: 0x000000,
      intensity: 1,
    });
    this.scene.add(ambientLight);
  },

  /**
   * 设置状态
   */
  setStats : function(){
    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.bottom = 0;
    this.stats.domElement.style.zIndex = 100;
    this.container.append( this.stats.domElement );
  },

  addShips : function () {
    //create ship array
    IDR.ships = [];
    IDR.lasers = [];
    var _this = this;
    // create ship geo
    var lineGeo = new THREE.Geometry();

    var r = 7;
    var t = Math.PI / 20 * 2;

    var x = (r + 2) * Math.cos(t * 16.8);
    var z = (r + 2) * Math.sin(t * 16.8);

    var x2 = (r + 2) * Math.cos(t * 17.2);
    var z2 = (r + 2) * Math.sin(t * 17.2);

    var x3 = (r + 4) * Math.cos(t * 17);
    var z3 = (r + 4) * Math.sin(t * 17);

    lineGeo.vertices.push(new THREE.Vector3(x, 0, z));
    lineGeo.vertices.push(new THREE.Vector3(x2, 0, z2));

    lineGeo.vertices.push(new THREE.Vector3(x2, 0, z2));
    lineGeo.vertices.push(new THREE.Vector3(x3, 0, z3));

    lineGeo.vertices.push(new THREE.Vector3(x, 0, z));
    lineGeo.vertices.push(new THREE.Vector3(x3, 0, z3));

    var v1 = new THREE.Vector3(0, 0, 0);
    var v2 = new THREE.Vector3(30, 0, 0);
    var v3 = new THREE.Vector3(30, 30, 0);

    for (var j = 0; j < 20; j++) {
      var x = r * Math.cos(t * j);
      var z = r * Math.sin(t * j);
      var x2 = r * Math.cos(t * j * 1.01);
      var z2 = r * Math.sin(t * j * 1.01);
      var x3 = r * Math.cos(t * j * .99);
      var z3 = r * Math.sin(t * j * .99);

      lineGeo.vertices.push(new THREE.Vector3(x * .8, 0, z * .8));
      lineGeo.vertices.push(new THREE.Vector3(x, 0, z));
      lineGeo.vertices.push(new THREE.Vector3(x2 * .8, 0, z2 * .8));
      lineGeo.vertices.push(new THREE.Vector3(x2, 0, z2));
      lineGeo.vertices.push(new THREE.Vector3(x3 * .8, 0, z3 * .8));
      lineGeo.vertices.push(new THREE.Vector3(x3, 0, z3));

      if (j % 5 == 0) {
        lineGeo.vertices.push(new THREE.Vector3(x * 1.05, 0, z * 1.05));
        lineGeo.vertices.push(new THREE.Vector3(x * 1.4, 0, z * 1.4));
      }

      if ((j + 3) % 20 == 0) {
        lineGeo.vertices.push(new THREE.Vector3(x * .3, 0, z * .3));
        lineGeo.vertices.push(new THREE.Vector3(x * .7, 0, z * .7));
      }

    }

    // create ship mat
    var mat = new THREE.LineBasicMaterial({
      linewidth: 1,
      color: 0x6FD5F0,
      transparent: true,
      opacity: .4
    });

    // create ship mat
    var lasermat = new THREE.LineBasicMaterial({
      linewidth: 1.5,
      color: 0x6FD5F0,
      transparent: true,
      opacity: .4
    });

    // cycle to create 36 ships
    for (var i = 0; i < 36; i++) {
      // create ship object using geo
      var ship = new THREE.Object3D();
      ship.shipMesh = new THREE.LineSegments(lineGeo, mat);
      ship.index = i;
      ship.add(ship.shipMesh);
      // add targets 1-4
      ship.targets = [];
      ship.targets.push(IDR.cities.phase1[i]);
      ship.targets.push(IDR.cities.phase2[i]);
      ship.targets.push(IDR.cities.phase3[i]);
      ship.targets.push(IDR.cities.phase4[i]);
      // add x,y,z pos for each target
      ship.positions = [];
      ship.positions.push(this.latLngToVector3(IDR.cities.phase1[i].lat, IDR.cities.phase1[i].lng, this.radius + 100));
      ship.positions.push(this.latLngToVector3(IDR.cities.phase1[i].lat, IDR.cities.phase1[i].lng, this.radius + 50));
      ship.positions.push(this.latLngToVector3(IDR.cities.phase2[i].lat, IDR.cities.phase2[i].lng, this.radius + 50));
      ship.positions.push(this.latLngToVector3(IDR.cities.phase3[i].lat, IDR.cities.phase3[i].lng, this.radius + 50));
      ship.positions.push(this.latLngToVector3(IDR.cities.phase4[i].lat, IDR.cities.phase4[i].lng, this.radius + 50));

      // and 36 lasers
      var geo = new THREE.Geometry();
      geo.vertices.push(new THREE.Vector3(0, 0, 0));
      geo.vertices.push(new THREE.Vector3(0, 0, 50));
      var laser = new THREE.LineSegments(geo, lasermat);
      IDR.lasers.push(laser);
      this.addObjectAtLatLng(laser, IDR.cities.phase1[i].lat, IDR.cities.phase1[i].lng, 0);
      laser.lookAt(new THREE.Vector3(0, 0, 0));

      // ship.start
      ship.start = function() {
        this.shipMesh.material.opacity = 1;
        _this.addObjectAtLatLng(this, this.targets[0].lat, this.targets[0].lng, 20);
      }


      ship.update = function(r) {
        // update position of each ship based on r value
        var pos = {};
        //pre war
        if (r < 7) {
          pos = this.positions[0];
          IDR.lasers[this.index].material.opacity = 0;

        }

        // to wave 1
        if (r >= 7 && r < 13) {
          p = ((r - 7) / 6);
          pos.x = this.positions[0].x + (p * (this.positions[1].x - this.positions[0].x));
          pos.y = this.positions[0].y + (p * (this.positions[1].y - this.positions[0].y));
          pos.z = this.positions[0].z + (p * (this.positions[1].z - this.positions[0].z));
          rotX = Math.PI / 180 * 90 * p;
          this.shipMesh.rotation.x = rotX;
        }

        // during wave 1
        if (r >= 13 && r < 20) {
          pos = this.positions[1];

        }


        // blast em wave 1
        if (r >= 15 && r < 17) {
          p = ((r - 15) / 2);
          IDR.lasers[this.index].position.set(this.positions[1].x, this.positions[1].y, this.positions[1].z);
          IDR.lasers[this.index].material.opacity = .8 * p;
          IDR.lasers[this.index].scale.z = 1 * p;


        }

        // blast em wave 1 done
        if (r >= 19 && r < 21) {
          p = ((r - 19) / 2);
          //IDR.lasers[this.index].position.set(this.positions[1].x, this.positions[1].y,this.positions[1].z);
          IDR.lasers[this.index].material.opacity = .8 * (1 - p);
          IDR.lasers[this.index].scale.z = 1;

          pos2 = this.latLngToVector3(IDR.cities.phase1[this.index].lat, IDR.cities.phase1[this.index].lng, this.radius - 50);
          pos2.x = IDR.lasers[this.index].position.x + (p * (pos2.x - IDR.lasers[this.index].position.x));
          pos2.y = IDR.lasers[this.index].position.y + (p * (pos2.y - IDR.lasers[this.index].position.y));
          pos2.z = IDR.lasers[this.index].position.z + (p * (pos2.z - IDR.lasers[this.index].position.z));
          IDR.lasers[this.index].position.set(pos2.x, pos2.y, pos2.z);


        }

        this.position.set(pos.x, pos.y, pos.z);
        this.lookAt(new THREE.Vector3(0, 0, 0));
        IDR.lasers[this.index].lookAt(new THREE.Vector3(0, 0, 0));

      }


      // add to IDR.ships
      IDR.ships.push(ship);
      ship.start();

    }


  },

  createHotSpot : function() {
    this.hotspot = new THREE.Object3D();

    var hexShape = new THREE.Shape();
    hexShape.moveTo(0, 10);
    hexShape.lineTo(9, 5);
    hexShape.lineTo(9, -5);
    hexShape.lineTo(0, -10);
    hexShape.lineTo(0, -6);
    hexShape.lineTo(5, -3);
    hexShape.lineTo(5, 3);
    hexShape.lineTo(0, 6);
    //hexShape.lineTo(0,10);

    var geo = new THREE.ShapeGeometry(hexShape);
    var mat = new THREE.MeshBasicMaterial({
      blending: THREE.AdditiveBlending,
      color: 0xff8340,
      transparent: true,
      opacity: .6
    });
    this.hotspot.hexSeg1 = new THREE.Mesh(geo, mat);
    this.hotspot.hexSeg2 = new THREE.Mesh(geo, mat);

    this.hotspot.add(this.hotspot.hexSeg1);
    this.hotspot.add(this.hotspot.hexSeg2);

    this.hotspot.hexSeg1.rotation.z = (Math.PI / 180) * -60;
    this.hotspot.hexSeg2.rotation.z = (Math.PI / 180) * 120;
    this.hotspot.hexSeg2.position.z = 3;


    var hexShape3 = new THREE.Shape();
    hexShape3.moveTo(0, 10);
    hexShape3.lineTo(9, 5);
    hexShape3.lineTo(9, -5);
    hexShape3.lineTo(0, -10);
    hexShape3.lineTo(-9, -5);
    hexShape3.lineTo(-9, 5);
    hexShape3.lineTo(0, 10);
    //hexShape3.lineTo(9,5);

    var geo = new THREE.ShapeGeometry(hexShape3);
    var mat = new THREE.LineBasicMaterial({
      blending: THREE.AdditiveBlending,
      linewidth: 2,
      color: 0xff8340,
      transparent: true,
      opacity: .8
    });
    this.hotspot.hexSeg3 = new THREE.Line(geo, mat);
    this.hotspot.add(this.hotspot.hexSeg3);
    this.hotspot.hexSeg3.position.z = 6;
    this.hotspot.hexSeg3.position.x = .25;

    this.hotspot.hexSeg3.scale.set(1.2, 1.2, 1.2);


    var mat = new THREE.MeshBasicMaterial({
      blending: THREE.AdditiveBlending,
      color: 0xff8340,
      transparent: true,
      opacity: .8,
      side: THREE.DoubleSide
    });
    var hexShape4 = new THREE.Shape();
    hexShape4.moveTo(0, 10);
    hexShape4.lineTo(9, 5);
    hexShape4.lineTo(9, -5);
    hexShape4.lineTo(0, -10);
    hexShape4.lineTo(-9, -5);
    hexShape4.lineTo(-8, -4.5);
    hexShape4.lineTo(0, -9);
    hexShape4.lineTo(8, -4.5);
    hexShape4.lineTo(8, 4.5);
    hexShape4.lineTo(0, 9);
    //hexShape4.lineTo(0,10);

    var geo = new THREE.ShapeGeometry(hexShape4);

    this.hotspot.hexSeg4 = new THREE.Mesh(geo, mat);
    this.hotspot.hexSeg4.scale.set(1.5, 1.5, 1.5)

    this.hotspot.add(this.hotspot.hexSeg4);

    this.hotspot.hexSeg4.position.z = 9;
    this.hotspot.hexSeg4.position.x = .4;

    // consider rebuilding this as 2 lines later
    // mght be more efficient than a shape??

    var mat = new THREE.LineBasicMaterial({
      blending: THREE.AdditiveBlending,
      linewidth: 2,
      color: 0xff8340,
      transparent: true,
      opacity: .9
    });
    var plus = new THREE.Shape();
    plus.moveTo(0, 3);
    plus.lineTo(0, -3);
    plus.moveTo(0, 0);
    plus.lineTo(3, 0);
    plus.lineTo(-3, 0);
    var geo = new THREE.ShapeGeometry(plus);
    this.hotspot.plus = new THREE.Line(geo, mat);
    this.hotspot.add(this.hotspot.plus);
    this.hotspot.plus.position.z = 12;
    this.hotspot.plus.position.x = 0;


    // merge to single geo later!!!!

    var mat = new THREE.LineBasicMaterial({
      blending: THREE.AdditiveBlending,
      linewidth: 3,
      color: 0xff8340,
      transparent: true,
      opacity: .5
    });
    var geo = new THREE.Geometry();
    geo.vertices.push(new THREE.Vector3(0, 0, 0));
    geo.vertices.push(new THREE.Vector3(5, 0, 0));
    this.hotspot.line = new THREE.Line(geo, mat);
    this.hotspot.add(this.hotspot.line);
    this.hotspot.line.position.z = 9;
    this.hotspot.line.position.x = 15;

    this.hotspot.line2 = new THREE.Line(geo, mat);
    this.hotspot.add(this.hotspot.line2);
    this.hotspot.line2.position.z = 9;
    this.hotspot.line2.position.x = -15;
    this.hotspot.line2.rotation.z = (Math.PI / 180) * -180;

    this.hotspot.line3 = new THREE.Line(geo, mat);
    this.hotspot.add(this.hotspot.line3);
    this.hotspot.line3.position.z = 9;
    this.hotspot.line3.position.x = -10;
    this.hotspot.line3.position.y = 15;
    this.hotspot.line3.rotation.z = (Math.PI / 180) * -60;

    this.hotspot.line4 = new THREE.Line(geo, mat);
    this.hotspot.add(this.hotspot.line4);
    this.hotspot.line4.position.z = 9;
    this.hotspot.line4.position.x = -10;
    this.hotspot.line4.position.y = -15;
    this.hotspot.line4.rotation.z = (Math.PI / 180) * 240;


    this.hotspot.canvas = document.createElement('canvas');
    this.hotspot.canvas.width = 1024;
    this.hotspot.canvas.height = 256;
    this.hotspot.context = this.hotspot.canvas.getContext('2d');
    this.hotspot.context.font = "80px Borda-Bold";
    this.hotspot.context.fillStyle = "rgba(255,160,67,1)";
    this.hotspot.context.fillText("ABCDEFGHIJKLMNOPQRSTUVWXYZ&!", 0, 300);
    this.hotspot.context.font = "40px Borda-Bold";
    this.hotspot.context.fillText("0123456789.", 0, 200);
    this.hotspot.texture = new THREE.Texture(this.hotspot.canvas);
    //hotspot.texture.needsUpdate = true;
    this.hotspot.pMat = new THREE.MeshBasicMaterial({
      color: 0xff8340,
      blending: THREE.AdditiveBlending,
      map: this.hotspot.texture,
      side: THREE.DoubleSide,
      transparent: true
    });
    this.hotspot.title = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), this.hotspot.pMat);
    this.hotspot.title.position.x = 56;
    this.hotspot.title.position.y = -10;
    this.hotspot.add(this.hotspot.title);
    this.hotspot.canvas = null;

    // add the big line
    var geo = new THREE.Geometry();
    geo.vertices.push(new THREE.Vector3(0, 0, 0));
    geo.vertices.push(new THREE.Vector3(0, 0, 250));
    var mat = new THREE.LineBasicMaterial({
      blending: THREE.AdditiveBlending,
      color: 0xff8340,
      transparent: true,
      opacity: .5
    });
    var line = new THREE.Line(geo, mat);
    this.hotspot.add(line);


    // attach a big transparent click listener
    var geo = new THREE.PlaneGeometry(50, 50, 1, 1);
    var mat = new THREE.MeshBasicMaterial({
      color: 0xff8340,
      transparent: true,
      opacity: 0
    });
    this.hotspot.detector = new THREE.Mesh(geo, mat);
    this.hotspot.detector.position.z = 20;
    this.hotspot.add(this.hotspot.detector);

    //attach classes for listners
    this.hotspot.userData = {
      type: "hotspot"
    };
    this.hotspot.detector.userData = {
      type: "hotspot_target"
    };
    this.hotspot.hexSeg1.userData = {
      type: "hotspot_target"
    };
    this.hotspot.hexSeg2.userData = {
      type: "hotspot_target"
    };
    this.hotspot.hexSeg3.userData = {
      type: "hotspot_target"
    };
    this.hotspot.hexSeg4.userData = {
      type: "hotspot_target"
    };
    this.hotspot.plus.userData = {
      type: "hotspot_target"
    };
    this.hotspot.line.userData = {
      type: "hotspot_target"
    };
    this.hotspot.title.userData = {
      type: "hotspot_target"
    };
    this.hotspot.scale.set(2, 2, 2);


    console.log(this.hotspot)

    this.hotspot.show = function() {
      if (!this.showingDetail) {
        console.log(this.hotspot.event_data);

        this.hotspot.remove(this.hotspot.title);
        this.hotspot.canvas = document.createElement('canvas');
        this.hotspot.canvas.id = 'canvas1';
        this.hotspot.canvas.width = 1024;
        this.hotspot.canvas.height = 256;
        this.hotspot.context = this.hotspot.canvas.getContext('2d');
        this.hotspot.context.font = "76px Borda-Bold";
        this.hotspot.context.fillStyle = "rgba(255,160,67,1)";
        this.hotspot.context.fillText(this.hotspot.event_data.title.toUpperCase(), 0, 200);
        this.hotspot.context.font = "40px Borda-Bold";
        this.hotspot.context.fillText(this.hotspot.event_data.date, 10, 100);
        this.hotspot.texture = new THREE.Texture(this.hotspot.canvas);
        this.hotspot.pMat = new THREE.MeshBasicMaterial({
          blending: THREE.AdditiveBlending,
          map: this.hotspot.texture,
          side: THREE.DoubleSide,
          transparent: true,
          color: 0xff8340
        });
        this.hotspot.title = new THREE.Mesh(new THREE.PlaneGeometry(80, 20), this.hotspot.pMat);
        this.hotspot.texture.needsUpdate = true;
        this.hotspot.remove(this.hotspot.title);
        this.hotspot.title.position.x = 56;
        this.hotspot.title.position.y = 10;
        this.hotspot.add(this.hotspot.title);
        this.hotspot.title.userData = {
          type: "hotspot_target"
        };
        this.hotspot.canvas = null;

        this.addObjectAtLatLng(this.hotspot, this.hotspot.event_data.lat, this.hotspot.event_data.lng, 18);
        this.rotateToLatLng(this.hotspot.event_data.lat, this.hotspot.event_data.lng, this.hotspotYOffset);

        var tween = new TWEEN.Tween(this.hotspot.scale).to({
          x: 1.7,
          y: 1.7,
          z: 1.7
        }, 300).start();
        tween.easing(TWEEN.Easing.Back.InOut);

        // show the preivew element
        // $("#preview-image").attr("src", hotspot.event_data.thumb);
        // console.log(hotspot.event_data);
        // $(".preview-detail").html(hotspot.event_data.preview_detail);
        // setTimeout(function() {
        //   $("#preview").addClass("show");
        // }, 150);


      }
    }

    this.hotspot.hide = function() {
      var tween = new TWEEN.Tween(this.hotspot.scale).to({
        x: .00001,
        y: .00001,
        z: .00001
      }, 300).start();
      tween.easing(TWEEN.Easing.Back.InOut);

      $("#preview").removeClass("show");
    }

    // add hotspot to clickable collection
    this.objects.push(this.hotspot);


  },


  addTimeline : function () {

    // position and add timline
    this.timeline = new THREE.Object3D();
    this.timeline.dial = new THREE.Object3D();
    this.timeline.outerDial = new THREE.Object3D();
    this.timeline.pointer = new THREE.Object3D();
    this.timeline.add(this.timeline.dial);
    this.timeline.add(this.timeline.outerDial);
    this.timeline.add(this.timeline.pointer);

    r = 120;

    var mat = new THREE.LineBasicMaterial({
      linewidth: 1,
      color: 0x6FD5F0,
      transparent: true,
      opacity: .7
    });

    var yr = 1996;
    var t = 2 * Math.PI / 360;
    if (IDR.isPortrait) {
      psize = 3.0;
      py = 1.9;
    } else {
      psize = 2.4;
      py = 1.7;
    }

    // look for methods to merge geometyr instead of all these sepeate geos
    var lineGeo = new THREE.Geometry();
    for (let i = 0; i < 360; i++) {
      var x = r * Math.cos(t * i);
      var z = r * Math.sin(t * i);

      lineGeo.vertices.push(new THREE.Vector3(x * .985, 0, z * .985));
      lineGeo.vertices.push(new THREE.Vector3(x, 0, z));


      var geo = new THREE.Geometry();
      lineGeo.vertices.push(new THREE.Vector3(x * .96, 0, z * .96));
      lineGeo.vertices.push(new THREE.Vector3(x * .965, 0, z * .965));



      if (i == 1 || ((i - 36) % 12 === 0 && i > 36 && i < 280)) {

        var pgeo = new THREE.PlaneGeometry(psize * 2, psize);
        var pmat = new THREE.MeshPhongMaterial({
          map: new THREE.TextureLoader().load("../assets/years/" + yr + ".png"),
          transparent: true,
          opacity: 1
        });
        p = new THREE.Mesh(pgeo, pmat);

        p.position.x = x * 1;
        p.position.z = z * 1;
        p.position.y = py;
        p.lookAt(new THREE.Vector3(0, 60, 0));
        this.timeline.dial.add(p);
        yr++;

        var geo = new THREE.Geometry();
        geo.vertices.push(new THREE.Vector3(x * .96, 0, z * .96));
        geo.vertices.push(new THREE.Vector3(x * .99, 0, z * .99));
        var line = new THREE.Line(geo, mat);
        this.timeline.dial.add(line);

      }



      if (i == 7 || i == 19 || i == 31 || i == 43) {

        if (i == 7) {
          d = "070296";
        }
        if (i == 19) {
          d = "070396";
        }
        if (i == 31) {
          d = "070496";
        }

        if (i != 43) {
          var pgeo = new THREE.PlaneGeometry(psize * 4.1, psize * 1.1);
          var pmat = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load("assets/images/years/" + d + ".png"),
            transparent: true,
            opacity: 1
          });
          p = new THREE.Mesh(pgeo, pmat);
          p.position.x = r * Math.cos(t * (i + psize + .6));
          p.position.z = r * Math.sin(t * (i + psize + .6));
          p.position.y = py;
          p.lookAt(new THREE.Vector3(0, 60, 0));
          this.timeline.dial.add(p);

          // add anngled hash marks
          for (var j = 0; j < 17; j++) {
            var xh = (r - 3) * Math.cos(t * i + (.012 * j));
            var zh = (r - 3) * Math.sin(t * i + (.012 * j));
            var xh2 = (r - 5) * Math.cos(t * i + (.012 * j + .012));
            var zh2 = (r - 5) * Math.sin(t * i + (.012 * j + .012));

            lineGeo.vertices.push(new THREE.Vector3(xh, 0, zh));
            lineGeo.vertices.push(new THREE.Vector3(xh2, 0, zh2));

          }

        }


        lineGeo.vertices.push(new THREE.Vector3(x * .96, 0, z * .96));
        lineGeo.vertices.push(new THREE.Vector3(x * 1.05, 0, z * 1.05));



      }



    }

    // now add all the lines as one piece of geometry
    var line = new THREE.LineSegments(lineGeo, mat);
    this.timeline.dial.add(line);


    // add hotspots ( octgons )

    for (let i = 0; i < IDR.events.length; i++) {
      e = IDR.events[i];
      //console.log(e.month,e.day,e.year);
      var hotspotMat = new THREE.LineBasicMaterial({
        linewidth: 2,
        color: 0xFF9643,
        transparent: true,
        opacity: .6
      });
      geo = new THREE.CircleGeometry(1.2, 6);
      geo.vertices.shift();
      var hotspot = new THREE.Line(geo, hotspotMat);
      hotspot.event_data = e;
      if (e.year == 1996 && e.month < 7) {
        pos = e.month;
      } else if (e.year == 1996 && e.month == 7 && e.day < 5) {
        if (e.day == 2) {
          pos = 7;
        }
        if (e.day == 3) {
          pos = 19;
        }
        if (e.day == 4) {
          pos = 31;
        }
      } else {

        pos = Math.floor((e.year - 1997) * 12) + 47 + e.month + (e.day / 30);


      }

      //console.log(pos);
      hotspot.position.x = r * Math.cos(t * pos);
      hotspot.position.z = r * Math.sin(t * pos);
      hotspot.position.y = -1.5;

      geo = new THREE.PlaneGeometry(5, 5, 1, 1);
      mat = new THREE.MeshBasicMaterial({
        opacity: 0,
        transparent: true
      });
      p = new THREE.Mesh(geo, mat);
      p.userData = {
        type: "timeline_hotspot",
        index: e.id
      };
      p.position.z = 6;
      p.position.y = -1;
      p.position.x = 0;

      hotspot.add(p);
      hotspot.lookAt(new THREE.Vector3(0, 0, 0));
      hotspot.rotation.z = Math.PI / 180 * 30;
      hotspot.userData = {
        type: "timeline_hotspot",
        index: e.id
      };
      this.timeline.dial.add(hotspot);



      //add to clickable objects to detect
      hotspot.userData = {
        type: "timeline_hotspot",
        index: e.id
      };

      this.objects.push(hotspot);
    }



    // add little min hotspots
    for (let i = 0; i < 4; i++) {


      var hotspotMat = new THREE.LineBasicMaterial({
        linewidth: 2,
        color: 0xFF9643,
        transparent: true,
        opacity: .6
      });
      geo = new THREE.CircleGeometry(.6, 6);
      geo.vertices.shift();
      var hotspot = new THREE.Line(geo, hotspotMat);
      if (i == 0) {
        pos = 17;
      }
      if (i == 1) {
        pos = 24;
      }
      if (i == 2) {
        pos = 30;
      }
      if (i == 3) {
        pos = 40;
      }

      //console.log(pos);
      hotspot.position.x = r * Math.cos(t * pos);
      hotspot.position.z = r * Math.sin(t * pos);
      hotspot.position.y = -1.5;
      hotspot.lookAt(new THREE.Vector3(0, 0, 0));
      hotspot.rotation.z = Math.PI / 180 * 30;
      this.timeline.dial.add(hotspot);


      //add to clickable objects to detect
      this.objects.push(hotspot);
    }



    // invisilbe shape inside timeline to help with dragging
    geo = new THREE.PlaneGeometry(250, 50, 1, 1);
    material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      color: 0x6FD5F0
    });
    circle = new THREE.Mesh(geo, material);
    //circle.rotation.x=-Math.PI/180*90;
    //circle.position.z=radius;
    //circle.position.x=-100;
    circle.position.z = -150;
    circle.position.y = -10;
    this.timeline.add(circle);



    // outer dial
    geo = new THREE.CylinderGeometry(r + 12, r + 12, 3, 200, 1, true);
    material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: .1,
      color: 0x6FD5F0,
      side: THREE.DoubleSide
    });
    circle = new THREE.Mesh(geo, material);
    this.timeline.outerDial.add(circle);
    geo = new THREE.CylinderGeometry(r + 14, r + 14, 3, 200, 1, true);
    material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: .2,
      color: 0x6FD5F0,
      side: THREE.DoubleSide
    });
    circle = new THREE.Mesh(geo, material);
    this.timeline.outerDial.add(circle);

    // add some radial lines to this
    var lineGeo = new THREE.Geometry();
    mat = new THREE.LineBasicMaterial({
      linewidth: 2,
      transparent: true,
      opacity: .4,
      color: 0x6FD5F0
    });
    for (i = 0; i < 360; i += 4) {
      var x = (r + 12) * Math.cos(t * i);
      var z = (r + 12) * Math.sin(t * i);
      //var geo = new THREE.Geometry();
      lineGeo.vertices.push(new THREE.Vector3(x * 1.07, 0, z * 1.07));
      lineGeo.vertices.push(new THREE.Vector3(x, 0, z));
      //var line = new THREE.Line(geo, mat);
      //line.rotation.y=Math.PI/180 * 90;
      //timeline.outerDial.add(line);
    }

    // now add all the lines as one piece of geometry
    var line = new THREE.LineSegments(lineGeo, mat);
    this.timeline.outerDial.add(line);


    // pointer object

    var s = new THREE.Shape();

    // can i smoooth out the absarc curve?
    s.absarc(0, 0, r, Math.PI / 180 * 85, Math.PI / 180 * -280.5, false);
    s.lineTo((r - 10) * Math.cos(t * 90), (r - 10) * Math.sin(t * 90));
    s.lineTo((r) * Math.cos(t * 94.7), (r) * Math.sin(t * 94.7));
    //s.lineTo((r)*Math.cos(t*95),(r)*Math.sin(t*95));
    var geo = new THREE.ShapeGeometry(s);
    var mat = new THREE.LineBasicMaterial({
      linewidth: 1,
      transparent: true,
      opacity: .3,
      color: 0x6FD5F0
    });
    var tp = new THREE.Line(geo, mat);
    this.timeline.pointer.add(tp);
    this.timeline.pointer.rotation.x = Math.PI / 180 * -90;

    // add arrows to pointer
    var s = new THREE.Shape();
    s.moveTo(-.7, 0);
    s.lineTo(0, -1.8);
    s.lineTo(.7, 0);
    s.lineTo(-.7, 0);
    var geo = new THREE.ShapeGeometry(s);
    mat = new THREE.MeshLambertMaterial({
      transparent: true,
      opacity: .6,
      color: 0x7efaff,
      side: THREE.DoubleSide
    });
    var arrow = new THREE.Mesh(geo, mat);
    arrow.position.y = 121;
    var arrow2 = arrow.clone();
    arrow2.rotation.z = Math.PI / 180 * 180;
    arrow2.position.z -= 4;
    arrow.position.z -= .2;
    this.timeline.pointer.add(arrow);
    this.timeline.pointer.add(arrow2);


    // add curved arorws below pointer

    var s2 = new THREE.Shape();
    s2.absarc(0, 0, r, Math.PI / 180 * 75, Math.PI / 180 * 87, false);
    s2.moveTo((r) * Math.cos(t * 75), (r) * Math.sin(t * 75))
    s2.lineTo((r) * Math.cos(t * 75) - 2, (r) * Math.sin(t * 75) - 1);
    var geo = new THREE.ShapeGeometry(s2);
    var mat = new THREE.LineBasicMaterial({
      linewidth: 2,
      transparent: true,
      opacity: .2,
      color: 0x7efaff
    });
    var tp2 = new THREE.Line(geo, mat);
    tp2.position.z -= 7;

    var s2 = new THREE.Shape();
    s2.absarc(0, 0, r, Math.PI / 180 * 105, Math.PI / 180 * 93, false);
    s2.moveTo((r) * Math.cos(t * 105), (r) * Math.sin(t * 105))
    s2.lineTo((r) * Math.cos(t * 105) + 2, (r) * Math.sin(t * 105) - 1);
    var geo = new THREE.ShapeGeometry(s2);
    var mat = new THREE.LineBasicMaterial({
      linewidth: 2,
      transparent: true,
      opacity: .2,
      color: 0x7efaff
    });
    var tp3 = new THREE.Line(geo, mat);
    tp3.position.z -= 7;

    this.timeline.pointer.add(tp2);
    this.timeline.pointer.add(tp3);


    // position the whole timeline object
    if (IDR.isPortrait) {
      this.timeline.position.z = 660 - window.innerWidth * .01;
      this.timeline.position.y = -55 - window.innerWidth * .003;
    } else {
      this.timeline.position.z = 530 - window.innerWidth * .01;
      this.timeline.position.y = -55 - window.innerWidth * .003;
    }
    this.timeline.rotation.x = Math.PI / 180 * 5;

    // adjust the rotation of the dial to start
    this.timeline.dial.rotation.y = Math.PI / 180 * 80;
    this.timeline.outerDial.rotation.y = Math.PI / 180 * 80;

    this.scene.add(this.timeline);



    this.timeline.show = function() {
      if (IDR.isPortrait) {
        ypos = -55 - window.innerWidth * .003;
      } else {
        ypos = -55 - window.innerWidth * .003;
      }
      var tween = new TWEEN.Tween(this.timeline.position).to({
        y: ypos
      }, 3000).start();
      tween.easing(TWEEN.Easing.Quadratic.InOut);
      setTimeout(function() {
        $("#date-content").addClass("show");
      }, 1000);

    }

    this.timeline.show2 = function() {
      if (IDR.isPortrait) {
        ypos = -55 - window.innerWidth * .003;
      } else {
        ypos = -55 - window.innerWidth * .003;
      }
      var tween = new TWEEN.Tween(this.timeline.position).to({
        y: ypos
      }, 2000).start();
      tween.easing(TWEEN.Easing.Elastic.InOut);
      $("#date-content").addClass("show");
      setTimeout(function() {
        $("#date-content").addClass("show");
      }, 1000);

    }

    this.timeline.hide = function() {
      var tween = new TWEEN.Tween(this.timeline.position).to({
        y: 40
      }, 4000).start();
      tween.easing(TWEEN.Easing.Quadratic.InOut);
      $("#date-content").removeClass("show");
    }


    this.timeline.hide2 = function() {
      this.timeline.position.y = -100;
      $("#date-content").removeClass("show");
    }

    this.timeline.userData = {
      type: "timeline"
    };
    this.objects.push(this.timeline);

  },

  // createHotSpot : function () {
  //
  //   // this.hotspot = new THREE.Object3D()
  //   // var mat = new THREE.MeshBasicMaterial({
  //   //   blending: THREE.AdditiveBlending,
  //   //   color: 0xff8340,
  //   //   transparent:false,
  //   //   opacity: 1,
  //   // })
  //   //
  //   // var hexShape = new THREE.Shape();
  //   // hexShape.moveTo(0, 10);
  //   // hexShape.lineTo(9, 5);
  //   // hexShape.lineTo(9, -5);
  //   // hexShape.lineTo(0, -10);
  //   // hexShape.lineTo(0, -6);
  //   // hexShape.lineTo(5, -3);
  //   // hexShape.lineTo(5, 3);
  //   // hexShape.lineTo(0, 6);
  //   //
  //   // var geo = new THREE.ShapeGeometry(hexShape);
  //   //
  //   // this.hotspot.hexSeg1 = new THREE.Mesh(geo, mat);
  //   // this.hotspot.hexSeg2 = new THREE.Mesh(geo, mat);
  //   //
  //   // this.hotspot.add(this.hotspot.hexSeg1);
  //   // this.hotspot.add(this.hotspot.hexSeg2);
  //   //
  //   // this.hotspot.hexSeg1.rotation.z = (Math.PI / 180) * -60;
  //   // this.hotspot.hexSeg2.rotation.z = (Math.PI / 180) * 120;
  //   // this.hotspot.hexSeg2.position.z = 3;
  //
  //   // var hexShape3 = new THREE.Shape();
  //   // hexShape3.moveTo(0, 10);
  //   // hexShape3.lineTo(9, 5);
  //   // hexShape3.lineTo(9, -5);
  //   // hexShape3.lineTo(0, -10);
  //   // hexShape3.lineTo(-9, -5);
  //   // hexShape3.lineTo(-9, 5);
  //   // hexShape3.lineTo(0, 10);
  //   //hexShape3.lineTo(9,5);
  //
  //   // var geo = new THREE.ShapeGeometry(hexShape3);
  //   // var mat = new THREE.LineBasicMaterial({
  //   //   blending: THREE.AdditiveBlending,
  //   //   linewidth: 2,
  //   //   color: 0xff8340,
  //   //   transparent: false,
  //   //   opacity: 1
  //   // });
  //   // this.hotspot.hexSeg3 = new THREE.Line(geo, mat);
  //   // this.hotspot.add(this.hotspot.hexSeg3);
  //   // this.hotspot.hexSeg3.position.z = 6;
  //   // this.hotspot.hexSeg3.position.x = .25;
  //   //
  //   // this.hotspot.hexSeg3.scale.set(1.2, 1.2, 1.2);
  //
  //   // var mat = new THREE.LineBasicMaterial({
  //   //   blending: THREE.AdditiveBlending,
  //   //   linewidth: 3,
  //   //   color: 0xff8340,
  //   //   transparent: false,
  //   //   opacity: .5
  //   // });
  //   // var geo = new THREE.Geometry();
  //   // geo.vertices.push(new THREE.Vector3(0, 0, 0));
  //   // geo.vertices.push(new THREE.Vector3(5, 0, 0));
  //   // this.hotspot.line = new THREE.Line(geo, mat);
  //   // this.hotspot.add(this.hotspot.line);
  //   // this.hotspot.line.position.z = 9;
  //   // this.hotspot.line.position.x = 15;
  //   //
  //   // this.hotspot.canvas = document.createElement('canvas');
  //   // this.hotspot.canvas.width = 1024;
  //   // this.hotspot.canvas.height = 256;
  //   // this.hotspot.context = this.hotspot.canvas.getContext('2d');
  //   // this.hotspot.context.font = "80px Borda-Bold";
  //   // this.hotspot.context.fillStyle = "rgba(255,160,67,1)";
  //   // this.hotspot.context.fillText("ABCDEFGHIJKLMNOPQRSTUVWXYZ&!", 0, 300);
  //   // this.hotspot.context.font = "40px Borda-Bold";
  //   // this.hotspot.context.fillText("0123456789.", 0, 200);
  //   // this.hotspot.texture = new THREE.Texture(this.hotspot.canvas);
  //   // //hotspot.texture.needsUpdate = true;
  //   // this.hotspot.pMat = new THREE.MeshBasicMaterial({
  //   //   color: 0xff8340,
  //   //   blending: THREE.AdditiveBlending,
  //   //   map: this.hotspot.texture,
  //   //   side: THREE.DoubleSide,
  //   //   transparent: false
  //   // });
  //   // this.hotspot.title = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), this.hotspot.pMat);
  //   // this.hotspot.title.position.x = 56;
  //   // this.hotspot.title.position.y = -10;
  //   // this.hotspot.add(this.hotspot.title);
  //   // this.hotspot.canvas = null;
  //
  //   // add the big line
  //   // var geo = new THREE.Geometry();
  //   // geo.vertices.push(new THREE.Vector3(0, 0, 0));
  //   // geo.vertices.push(new THREE.Vector3(0, 0, 250));
  //   // var mat = new THREE.LineBasicMaterial({
  //   //   blending: THREE.AdditiveBlending,
  //   //   color: 0xff8340,
  //   //   transparent: false,
  //   //   opacity: .5
  //   // });
  //   // var line = new THREE.Line(geo, mat);
  //   // this.hotspot.add(line);
  //
  //   // attach a big transparent click listener
  //   // var geo = new THREE.PlaneGeometry(50, 50, 1, 1);
  //   // var mat = new THREE.MeshBasicMaterial({
  //   //   color: 0xff8340,
  //   //   transparent: false,
  //   //   opacity: 0
  //   // });
  //   // this.hotspot.detector = new THREE.Mesh(geo, mat);
  //   // this.hotspot.detector.position.z = 20;
  //   // this.hotspot.add(this.hotspot.detector);
  //
  //   //attach classes for listners
  //   // this.hotspot.userData = {
  //   //   type: "hotspot"
  //   // };
  //   // this.hotspot.detector.userData = {
  //   //   type: "hotspot_target"
  //   // };
  //   // this.hotspot.hexSeg1.userData = {
  //   //   type: "hotspot_target"
  //   // };
  //   // this.hotspot.hexSeg2.userData = {
  //   //   type: "hotspot_target"
  //   // };
  //   // this.hotspot.hexSeg3.userData = {
  //   //   type: "hotspot_target"
  //   // };
  //   // this.hotspot.hexSeg4.userData = {
  //   //   type: "hotspot_target"
  //   // };
  //   // this.hotspot.plus.userData = {
  //   //   type: "hotspot_target"
  //   // };
  //   // this.hotspot.line.userData = {
  //   //   type: "hotspot_target"
  //   // };
  //   // this.hotspot.title.userData = {
  //   //   type: "hotspot_target"
  //   // };
  //   // this.hotspot.scale.set(2, 2, 2);
  //
  //   // this.scene.add(this.hotspot);
  //
  // },

  /**
   * 创建HotSpot
   */
  creatPositionObject : function(){
    console.log( this.countries.length)
    for (var i = 0; i < this.countries.length; i++) {
      var position = this.creatPosition(this.countries[i].lat, this.countries[i].lng)
      this.creatPlane(position)
    }
  },
  /**
   * 经纬度转化为三维向量
   * @param lat 经度
   * @param lng 维度
   * @returns {Vector3}
   */
  creatPosition : function(lat, lng){
    var spherical = new THREE.Spherical
    spherical.radius = this.r

    var theta = (lng + 90) * (Math.PI / 180)
    var phi = (90 - lat) * (Math.PI / 180)
    spherical.phi = phi
    spherical.theta = theta
    var position = new THREE.Vector3()
    position.setFromSpherical(spherical)
    return position
  },
  /**
   * 创建一个plane，接收一个V3坐标
   * @param position
   */
  creatPlane : function(position){
    var planeGeometry = new THREE.PlaneGeometry(10,10,2)
    var planeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      side: THREE.DoubleSide
    })
    var plane = new THREE.Mesh( planeGeometry, planeMaterial );
    plane.position.copy(position)
    plane.lookAt(new THREE.Vector3(0, 0, 0))
    this.scene.add(plane)
  },


  /**
   * 渲染
   */
  render : function () {
    this.renderer.clear()

    // if (this.skybox && this.earth) {
    //   this.skybox.rotation.x = this.earth.rotation.x * .25;
    //   this.skybox.rotation.y = this.earth.rotation.y - Math.PI / 180 * 30 * .25;
    //   this.skybox.rotation.z = this.earth.rotation.z * .25;
    // }

    if (!this.locked ) {
      this.earth.rotation.y += (this.targetEarthRotationX - this.earth.rotation.y) * 0.05;
      this.earth.rotation.x += (this.targetEarthRotationY - this.earth.rotation.x) * 0.05;
    }


    if (this.targetSceneRotationY && this.targetSceneRotationX) {
      this.scene.rotation.y += ((this.targetSceneRotationY - this.scene.rotation.y) * .05);
      this.scene.rotation.x += ((this.targetSceneRotationX - this.scene.rotation.x) * .05);
    }

    // this.stats.update();
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render( this.scene, this.camera );
  },


  addObjectAtLatLng : function (obj, lat, lng, height) {
    // heght is height from surface of earth
    if (!height) {
      height = 0;
    }
    var pos = this.latLngToVector3(lat, (lng), this.radius + height);
    obj.position.set(pos.x, pos.y, pos.z);
    //obj.lookAt(earth.position);
    // instead look away :)
    var v = new THREE.Vector3();
    v.subVectors(obj.position, this.earth.position).add(obj.position);
    obj.lookAt(v);

    this.earth.add(obj);
  },


  // convert the positions from a lat, lon to a position on a sphere.
  latLngToVector3 : function (lat, lon, radius) {
    var phi = (lat) * Math.PI / 180;
    var theta = (lon - 180) * Math.PI / 180;

    var x = -(radius) * Math.cos(phi) * Math.cos(theta);
    var y = (radius) * Math.sin(phi);
    var z = (radius) * Math.cos(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
  },

  rotateToLatLng : function (lat, lng, offsetY) {
    if (!this.showingDetail) {
      this.locked = true;
      if (!offsetY) {
        offsetY = 0;
      }
      var rotX = this.earth.rotation.x;
      var rotY = this.earth.rotation.y;
      var rotZ = this.earth.rotation.z;
      var c = this.earth.rotation.y;
      var d = -lng * (Math.PI / 180) % (2 * Math.PI);
      var f = Math.PI / (2 + offsetY) * -1;
      this.earth.rotation.y = c % (2 * Math.PI);
      this.earth.rotation.x = (lat * (Math.PI / 180) % Math.PI) + (Math.PI / 180 * -30);
      this.earth.rotation.y = d + f;
      var newRotX = this.earth.rotation.x;
      var newRotY = this.earth.rotation.y;
      var newRotZ = this.earth.rotation.z;
      this.earth.rotation.x = rotX;
      this.earth.rotation.y = rotY;
      this.earth.rotation.z = rotZ;
      TWEEN.removeAll();
      var tween = new TWEEN.Tween(this.earth.rotation).to({
        x: newRotX,
        y: newRotY,
        z: newRotZ
      }, 500).start();
      tween.easing(TWEEN.Easing.Quadratic.InOut);
      tween.onComplete(function() {
        this.locked = false;
        this.targetEarthRotationX = this.earth.rotation.y;
        this.targetEarthRotationY = this.earth.rotation.x
      });
      //
      //locked=false;
      //targetEarthRotationX = 2;
      //targetEarthRotationY = 2;
      //targetEarthRotationOnMouseDownX = 2;
      //targetEarthRotationOnMouseDownY = 2;
      //targetEarthRotationX = newRotY;
      //console.log("Target Earth Rotation X:" + targetEarthRotationX);
      //console.log("Target we want:" + newRotY);

      // override the rotation targetX with the target we now have
      //targetEarthRotationX = earth.rotation.x;

    }

  },


  /**
   * 屏幕坐标转换3d坐标
   * @param e
   */
  transToThreeCoord : function(e){

    console.log(e)
    this.mouse.x = (e.clientX / this.width) * 2 - 1;
    this.mouse.y = -(e.clientY / this.height) *2 + 1;

    this.raycaster.setFromCamera( this.mouse, this.camera );
    var intersects = this.raycaster.intersectObjects(this.scene.children);

    if(intersects.length){
      // console.log('23123')
    }
  },
  /**
   * 事件容器
   */
  eventListeners: function () {
    // console.log(this)
    this.container.addEventListener('touchstart', this.onDocumentTouchStart.bind(this), false);
    this.container.addEventListener('touchmove', this.onDocumentTouchMove.bind(this), false);
  },

  /**
   * TouchStart
   * @param event
   */
  onDocumentTouchStart : function (event) {
    document.addEventListener('touchend', this.onDocumentMouseUp, false);

    if (event.touches.length == 1) {
      //event.preventDefault();

      this.mouseXOnMouseDown = event.touches[0].pageX - this.windowHalfX;
      this.mouseYOnMouseDown = event.touches[0].pageY - this.windowHalfY;

      this.mouse.x = +(event.targetTouches[0].pageX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.targetTouches[0].pageY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);

      var intersects = this.raycaster.intersectObjects(this.objects, true);

      console.log(intersects)

      this.grabbedEarth = false;
      this.grabbedTimeline = false;

      if (intersects.length > 0) {

        if (intersects[0].object.userData.type == 'earth' || intersects[0].object.parent.userData.type == 'earth' || intersects[0].object.parent.parent.userData.type == 'earth') {
          this.targetEarthRotationOnMouseDownX = this.targetEarthRotationX;
          this.targetEarthRotationOnMouseDownY = this.targetEarthRotationY;
          this.grabbedEarth = true;
          console.log("earth grabbed");

        }

        if (intersects[0].object.userData.type == 'timeline' || intersects[0].object.parent.userData.type == 'timeline' || intersects[0].object.parent.parent.userData.type == 'timeline') {
          this.targetRotationOnMouseDownX = this.targetRotationX;
          //targetRotationOnMouseDownY = targetRotationY;
          this.grabbedTimeline = true;
          if (IDR.mode == "play" && IDR.speechPlaying) {
            this.pauseSpeech();
          }
          console.log(1231231)
          //console.log("timeline grabbed");
        }


      }

    }

  },

  /**
   * TouchMove
   * @param event
   */
  onDocumentTouchMove : function (event) {

    if (event.touches.length == 1) {

      //event.preventDefault();
      console.log('move')

      this.mouseX = event.touches[0].pageX - this.windowHalfX;
      this.mouseY = event.touches[0].pageY - this.windowHalfY;

      if (this.grabbedTimeline) {
        this.targetRotationX = this.targetRotationOnMouseDownX + (this.mouseX - this.mouseXOnMouseDown) * 0.002;
        this.targetRotationY = this.targetRotationOnMouseDownY + (this.mouseY - this.mouseYOnMouseDown) * 0.003;
      }
      if (this.grabbedEarth) {
        this.targetEarthRotationX = this.targetEarthRotationOnMouseDownX + (this.mouseX - this.mouseXOnMouseDown) * 0.005;
        this.targetEarthRotationY = this.targetEarthRotationOnMouseDownY + (this.mouseY - this.mouseYOnMouseDown) * 0.005;
      }

    }

  },

  /**
   * TouchMouseUp
   * @param event
   */
  onDocumentMouseUp : function (event) {

    // document.removeEventListener( 'mousemove', this.onDocumentMouseMove, false );
    document.removeEventListener('mouseup', this.onDocumentMouseUp, false);
    document.removeEventListener('mouseout', this.onDocumentMouseOut, false);
    if (this.grabbedTimeline) {
      this.finishedDrift = false;
    }
    this.grabbedEarth = false;
    this.grabbedTimeline = false;
    document.removeEventListener('touchend', this.onDocumentMouseUp, false);
  },

  /**
   * TouchMouseOut
   * @param event
   */
  onDocumentMouseOut : function (event) {

    // document.removeEventListener( 'mousemove', this.onDocumentMouseMove, false );
    document.removeEventListener('mouseup', this.onDocumentMouseUp, false);
    document.removeEventListener('mouseout', this.onDocumentMouseOut, false);
    if (this.grabbedTimeline) {
      this.finishedDrift = false;
    }
    this.grabbedEarth = false;
    this.grabbedTimeline = false;


  }




}

