var games = [];

function renderGames(){
	for(i=0;i<games.length;i++){
		games[i].drawScene();
	}
}

function Breakout(div, width, height){
	this.container = div;
	this.canvas = jQuery('<canvas width="600" height="400"></canvas>')[0];
	jQuery(this.canvas).mousemove(this, function(event){ event.data.onMouseMove(event); }); 
	jQuery(this.canvas).width(width);
	jQuery(this.canvas).height(height);
	this.container.append(this.canvas);
	this.ctx = this.canvas.getContext('2d');
	this.ball = new BreakoutBall(this);
	this.tick = 0;
	this.bricks = new Array(this.canvas.height/10);
	for(i = 0; i<this.bricks.length; i++){
		this.bricks[i] = new Array(this.canvas.width/10);
		for(j=0; j<this.bricks[i].length; j++){
			if(i<this.bricks.length/3){
				this.bricks[i][j] = new BreakoutBrick(this, j*10, i*10);
			}
			else {
				this.bricks[i][j] = null;
			}
		}
	}
	this.paddleX = 0;
	games.push(this);

	this.drawScene = function() { // main drawScene function
		this.ball.update();
		if(this.ball.x>this.canvas.width){
			this.ball.addVel(-5,0);
		}
		else if(this.ball.x<0){
			this.ball.addVel(5,0);
		}
		else if(this.ball.y>this.canvas.height){
			this.ball.addVel(0,-5);
		}
		else if(this.ball.y<0){
			this.ball.addVel(0,5);
		}
		else if((this.ball.x>this.paddleX) && (this.ball.x<this.paddleX+50) 
			&& (this.ball.y>this.canvas.height-50) && (this.ball.y<this.canvas.height-40)){
			this.ball.addVel(0, -5);
		}
		if(this.tick%1000 == 0){
			this.render(0, 0, this.canvas.width, this.canvas.height);
		}
		else{
			this.render(this.ball.x-20, this.ball.y-20, 40, 40);
		}
		this.ctx.clearRect(0, this.canvas.height-50, this.canvas.width, 10);
		this.ctx.fillStyle = "#0000FF";
		this.ctx.fillRect(this.paddleX, this.canvas.height-50, 50, 10);
		this.ball.draw();
		this.tick ++;
	}
	
	this.render = function(x, y, w, h){
		this.ctx.clearRect(x, y, w, h);
		var minj = (x<0) ? 0 : Math.floor(x/10); 
		var mini = (y<0) ? 0 : Math.floor(y/10); 
		var maxj = (x+w>this.canvas.width)? Math.floor(this.canvas.width/10) : Math.ceil((x+w)/10); 
		var maxi = (y+h>this.canvas.height)? Math.floor(this.canvas.height/10) : Math.ceil((y+h)/10);
		for(var i = mini; i<maxi; i++){
			for(var j = minj; j<maxj; j++){
				if((this.bricks[i][j]!=null)&&(this.bricks[i][j].isLive)){
					this.bricks[i][j].update();
					this.bricks[i][j].draw();
				}
			}
		}
	}
	
	this.onMouseMove = function(event){
		this.paddleX = event.clientX-this.canvas.offsetLeft;
	}
}


function BreakoutBall(game){
	this.game = game;
	this.x = game.canvas.width/2;
	this.y = game.canvas.height/2;
	this.velx = ((Math.random()*2)-1)*5;
	this.vely = ((Math.random()*2)-1)*10;
	
	this.draw = function(){
		this.game.ctx.fillStyle = 'rgba(255, 35, 55, 1.0)';
		this.game.ctx.beginPath();
		this.game.ctx.arc(this.x, this.y, 5, 0, Math.PI*2, true);
		this.game.ctx.closePath();
		this.game.ctx.fill();
	}
	
	this.update = function(){
		this.x = this.x + this.velx;
		this.y = this.y + this.vely;
	}
	
	this.addVel = function(x, y){
		this.velx = this.velx+x;
		this.vely = this.vely+y;
		if(this.velx>5) this.velx = 5;
		if(this.vely>5) this.vely = 5;
		if(this.velx<-5) this.velx = -5;
		if(this.vely<-5) this.vely = -5;
	}
}

function BreakoutBrick(game, x, y){
	this.x = x;
	this.y = y;
	this.game = game;
	this.w = 10;
	this.h = 10;
	this.isLive = true;
	
	this.update = function(){
		var ballx = this.game.ball.x;
		var bally = this.game.ball.y;
		if((this.x <= ballx) && (this.x+this.w >= ballx) && (this.y <= bally) && (this.y+this.h >= bally)){
			this.isLive = false;
		}
	}
	
	this.draw = function(){
		if(this.isLive){
			var ctx = this.game.ctx;
			ctx.fillStyle = "#00FF00";
			ctx.fillRect(this.x, this.y, this.w, this.h);
			ctx.strokeStyle = "#0000FF";
			ctx.strokeRect(this.x, this.y, this.w, this.h);
		}
	}
}
