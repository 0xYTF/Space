(function() {
	var World = this.World = THREE.Object3D.extend({
		init: function(long, width, height, wallcolor, groundcolor) {
			this._super();
			long = long || 10240;
			width = width || 10240;
			height = height || 1000;

			// ground
			this.ground = new THREE.Mesh(
				new THREE.PlaneGeometry(width, long), new THREE.MeshPhongMaterial({
					color: groundcolor || 0xffffff
				}));
			this.ground.rotation.x = -Math.PI / 2;
			this.ground.name = "ground";
			this.add(this.ground);



			// walls
			this.walls = [];
			var wallsGeo = [
				new THREE.CubeGeometry(long, height, 10),
				new THREE.CubeGeometry(width, height, 10),
				new THREE.CubeGeometry(long, height, 10),
				new THREE.CubeGeometry(width, height, 10)
			];
			var wallsMaterial = new THREE.MeshPhongMaterial({
				color: wallcolor || 0x000000
			});
			for (var i in wallsGeo) {
				var mesh = new THREE.Mesh(wallsGeo[i], wallsMaterial);
				mesh.position.y = height / 2;
				this.walls.push(mesh);
				mesh.name = "wall"+ i;
				this.add(this.walls[i]);
			}
			this.walls[0].rotation.y = -Math.PI / 2;
			this.walls[0].position.x = width / 2;
			this.walls[1].rotation.y = Math.PI;
			this.walls[1].position.z = long / 2;
			this.walls[2].rotation.y = Math.PI / 2;
			this.walls[2].position.x = -width / 2;
			this.walls[3].position.z = -long / 2;

			for(var i in this.walls){
				this.walls.castShadow = true;
			}
			this.addLightAtWall = function(){
				console.log(this);
			}

			// set objects in it
			this.userData.Objects = {};
			this.userData.Objects['collide'] = [].concat(this.walls).concat([this.ground]);
			this.userData.Objects['stepOn'] = [].concat(this.ground);

			//20161204
			//to create a box with texture
			//var box = CreateBoxWithTexture();
			//box.position.set(0, 100, -100);
			//this.add(box);
		}
	});

	var Room = this.Room = World.extend({
		init: function(long, width, height, wallcolor, groundcolor){
			long = long || 2048;
			width = width || 2048,
			height = height || 500,
			wallcolor = wallcolor || 0xffffff,
			groundcolor = groundcolor || 0x888888;
			this._super(long,
						width,
						height,
						wallcolor,
						groundcolor);
			this.position.set(0,2,0);

			// set light on the top
			this.lights = this.lights || [];
			this.lights.push(new THREE.PointLight(0xffffff));
			this.lights[0].position.set(0,height,0);
			this.add(this.lights[0]);
		}

	});


})();
