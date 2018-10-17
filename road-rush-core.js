// Черновик

function getRandDiapason (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function playSound(string) {	
  switch(string) {
  	case "beginMusic":
			beginMusic = new Audio();
			beginMusic.src = "sound/begin/bgm-" + getRandDiapason(1, 2) + ".mp3";
			beginMusic.volume = 1.0;
			beginMusic.play();
			break;

  	case "bgMusic":
			backgroundMusic = new Audio();
			backgroundMusic.src = "sound/context/cnm-" + getRandDiapason(1, 5) + ".mp3";
			backgroundMusic.volume = 1.0;
			backgroundMusic.play();
			break;

		case "statMusic":
			statisticMusic = new Audio();
			statisticMusic.src = "sound/statis/stm-" + getRandDiapason(1, 2) + ".mp3";
			statisticMusic.volume = 1.0;
			statisticMusic.play();
			break;

    case "extraMusic":
      extraMusic = new Audio(); 
      extraMusic.src = "sound/extra/exm-" + getRandDiapason(1, 3) + ".mp3";
      extraMusic.play();
      break;

    case "lvlFailed":
      var lvlFailed = new Audio(); 
      lvlFailed.src = "sound/game/lvl-failed.mp3";
      lvlFailed.play();
      break;

		case "lvlComplete":
			var endSound = new Audio();
			endSound.src = "sound/game/lvl-complete.mp3";
			endSound.play();
			break;

		case "extraSpeed":
			var extraSpeed = new Audio();
			extraSpeed.src = "sound/game/checkpoint.mp3";
			extraSpeed.play();
			break;

		case "carCrash":
			var carCrash = new Audio();
			carCrash.src = "sound/game/explosion.wav";
			carCrash.play();
			break;

    case "speedUp":
    	initVal = getRandDiapason(1, 2);
    	if(initVal == 1) {
	      var speedUp = new Audio(); 
	      speedUp.src = "sound/game/speed-up1.wav";
	      speedUp.volume = 0.9;
	      speedUp.play();
    		break;
    	}
    	else if(initVal == 2) {
	      var speedUp = new Audio(); 
	      speedUp.src = "sound/game/speed-up2.wav";
	      speedUp.volume = 0.9;
	      speedUp.play();
    		break;
    	} else return;

    case "oilSqueak":
    initVal = getRandDiapason(1, 2);
    if(initVal == 1) {
      var oilSqueak = new Audio(); 
      oilSqueak.src = "sound/game/oil-squeak1.wav";
      oilSqueak.volume = 0.5;
      oilSqueak.currentTime = 1.1;
      oilSqueak.play();
      break;
    }
    else if(initVal == 2) {
      var oilSqueak = new Audio(); 
      oilSqueak.src = "sound/game/oil-squeak2.wav";
      oilSqueak.volume = 0.5;
      oilSqueak.currentTime = 0.0;
      oilSqueak.play();
      break;
    } else return;

    case "coinUp":
    	initVal = getRandDiapason(1, 2);
    	if(initVal == 1) {
	      var coinUp = new Audio();
	      coinUp.src = "sound/game/coin-up1.wav";
	      coinUp.play();
	      break;    		
    	}
    	else if(initVal == 2) {
	      var coinUp = new Audio();
	      coinUp.src = "sound/game/coin-up2.wav";   
	      coinUp.play();
	      break;   		
    	} else return;

    case "carMove":
      var carMove = new Audio();
      carMove.src = "sound/game/car-move.wav";
      carMove.volume = 0.3;
      carMove.play();
      break;

    default: return;
  }
}

// Инициализация сценариев

function setScenario(string) {
	switch(string) {
		case "login_scenario":
			useStartWindow();
			break;
		case "game_scenario":
			useGameWindow();
			break;
		case "stat_scenario":
			useStatWindow();
			break;
		default:
			alert("Я не знаю такого сценария");
		  break;
	}
}

// Общие данные
var speed = 0,
		coin = 0,
		axel = 0,
		oil = 0,
		wall = 0,
		spdMeter = 0,
		totalScore = 0;

var playerName,
		roadResult,
		delayBeforeStat;

var beginMusic,
		backgroundMusic,
		extraMusic,
		statisticMusic;		

// Фаза 1
function useStartWindow() {
	playSound("beginMusic");
	$("#start-zone").css("display", "flex");
	$("#game-zone").css("display", "none");
	$("#stat-zone").css("display", "none");
	$("#start-button").on("click", startPlay);

	function startPlay() {
		playerName = $("#get-name").val();
		$("#start-button").off("click", startPlay);
		setScenario("game_scenario");
		beginMusic.pause();
		beginMusic.currentTime = 0.0;
	}
}

// Фаза 3
function useStatWindow() {
	clearTimeout(delayBeforeStat);
	playSound("statMusic");
	totalScore = ((coin * 4) + (axel * 3) + (oil * 2)) - (wall * 50);
	displayResult();

	$("#start-zone").css("display", "none");
	$("#game-zone").css("display", "none");
	$("#stat-zone").css("display", "flex");

	$("#restart-game-button").on("click", restartGame);
	$("#change-player-button").on("click", changePlayer);
	
	function restartGame() {
		statisticMusic.pause();
		statisticMusic.currentTime = 0.0;
		setScenario("game_scenario");
		$("#restart-game-button").off("click", restartGame);
		$("#change-player-button").off("click", changePlayer);
	}

	function changePlayer() {
		statisticMusic.pause();
		statisticMusic.currentTime = 0.0;
		setScenario("login_scenario");
		$("#restart-game-button").off("click", restartGame);
		$("#change-player-button").off("click", changePlayer);
	}

	function displayResult() {
		$("#player-name").html(playerName);
		$("#result-stat").html(roadResult);
	  $("#speed-result").html(spdMeter);
	  $("#coin-result").html(coin);
	  $("#axel-result").html(axel);
	  $("#oil-result").html(oil);
	  $("#wall-result").html(wall);
	  $("#total-score").html(totalScore);
	}
}

// Фаза 2
function useGameWindow() {
	$("#start-zone").css("display", "none");
	$("#game-zone").css("display", "flex");
	$("#stat-zone").css("display", "none");
	$(".crashGlass").css("display", "none");

	$(document).on("keydown", ArrowEvent);	

	// музыкальный фон
	playSound("bgMusic");

	// Инициализация
	var road = [ [],[],[],[] ];

	// обнуление, игровые переменные
	speed = 0;
	coin = 0;
	axel = 0;
	oil = 0;
	wall = 0;
	spdMeter = 70;

	var curSpeed = 300,
			carPos = ((getRandDiapason(1, 4)) - 1);

	var oilDelay,
			roadObjDraw,
			initVal,
			timer;

	setCarPosition();

	// инициализируем игровое время
	var startTime = Date.now();	
	var gameTime = setInterval(function() {
		addSpeedInterval();
		lastStep();
		gameOver();
	}, 1000);

	var timeLeft = setInterval(function () {
		var counter = Date.now() - startTime;
		// console.warn(counter);
		timeInGame(counter);
			function timeInGame(count) {
				$("#timer").css("width", (100 * ((60000 - count) / 60000) + '%'));
				if(count >= 59000) {
					$("#timer").css("width", "0%");
				}
			}
	}, 1000);

	const GAME_OBJ = {
	  0: "obj-void",
	  1: "obj-coin",
	  2: "obj-oil",
	  3: "obj-speed",
	  4: "obj-wall"
	};

	function setCarPosition() {
		$("#obj-car").fadeIn(100);
		$("#obj-car").attr("style", "");
		$("#obj-car").removeClass();
		$("#obj-car").addClass("car-position-" + carPos);
	}

	function gameOver() {
		if ((Date.now() - startTime) > 60000) {			
			$(document).off("keydown", ArrowEvent);			
			carFinalRush();			
			clearInterval(gameTime);
			clearInterval(timeLeft);
			clearInterval(roadObjDraw);
			delayBeforeStat = setTimeout(function() {
				// roadInit();
				setScenario("stat_scenario");
			}, 3000);
			return;
		}
	}

	function lastStep() {
		if ((Date.now() - startTime) >= 45000 && (Date.now() - startTime) <= 45900) {			
			backgroundMusic.pause();
			backgroundMusic.currentTime = 0.0;
			playSound("extraMusic");
		}
	}

	function carFinalRush() {
		setRoadResult("Finish");
		playSound("lvlComplete");
		extraMusic.pause();
		extraMusic.currentTime = 0.0;
		$("#obj-car").css("transition", "all 0.6s ease-out");
		$("#obj-car").css("left", "800px");
		$("#obj-car").fadeOut(600);
	}

	function carCrashMove() {
		setRoadResult("Crash");
		playSound("carCrash");	
		$("#obj-car").css("transition", "all 0.3s ease-out");
		setTimeout(function() {
			playSound("lvlFailed");
			backgroundMusic.pause();
			backgroundMusic.currentTime = 0.0;
			extraMusic.pause();
			extraMusic.currentTime = 0.0;
		}, 2000);
		$("#obj-car").css({'transform' : 'rotate(-70deg)'});
		$("#obj-car").css("left", "0px");
		$("#obj-car").fadeIn(100).fadeOut(5000);
	}

	function addSpeed() {
		if (curSpeed > 70) {
			curSpeed -= 10;
			clearInterval(roadObjDraw);
			roadDraw(curSpeed);
			converSpeed(curSpeed);
		}
		else return;
	}

	function addSpeedInterval() {
		if ((Date.now() - startTime) >= 10000 && (Date.now() - startTime) <= 10900) {
			if (curSpeed > 200) {
				playSound("extraSpeed");
				curSpeed -= 30;
				clearInterval(roadObjDraw);
				roadDraw(curSpeed);
				converSpeed(curSpeed);
			}	else return;
		}
		else if ((Date.now() - startTime) >= 20000 && (Date.now() - startTime) <= 20900) {
			if (curSpeed > 150) {
				playSound("extraSpeed");

				curSpeed -= 30;
				clearInterval(roadObjDraw);
				roadDraw(curSpeed);
				converSpeed(curSpeed);
			}	else return;
		} 
		else if ((Date.now() - startTime) >= 30000 && (Date.now() - startTime) <= 30900) {
			if (curSpeed > 150) {
				playSound("extraSpeed");
				curSpeed -= 30;
				clearInterval(roadObjDraw);
				roadDraw(curSpeed);
				converSpeed(curSpeed);
			}	else return;
		} 
		else if ((Date.now() - startTime) >= 40000 && (Date.now() - startTime) <= 40900) {
			if (curSpeed > 150) {
				playSound("extraSpeed");
				curSpeed -= 30;
				clearInterval(roadObjDraw);
				roadDraw(curSpeed);
				converSpeed(curSpeed);
			}	else return;
		}
		else if ((Date.now() - startTime) >= 50000 && (Date.now() - startTime) <= 50900) {
			if (curSpeed > 100) {
				playSound("extraSpeed");
				curSpeed -= 30;
				clearInterval(roadObjDraw);
				roadDraw(curSpeed);
				converSpeed(curSpeed);
			}	else return;
		} else return;
	}

	function ArrowEvent(event) {
	// console.log(event.key);
	  switch (event.key) {
	    case "ArrowUp":
	    	arrowUpEffect();
	      if (carPos !== 0) {
					playSound("carMove");
	      	carPos--;
	      }
	      rotateUp();
	      changePos();
	      break;
	    case "ArrowDown":
	    	arrowDownEffect();
	      if (carPos !== 3) {
	      	playSound("carMove");
	      	carPos++;      
	      }
	      rotateDown();
	      changePos();
	      break;
	  }
	}

	function arrowUpEffect() {
		$("#arrow-up-img").fadeIn(60);	
		$("#arrow-up-img").css("margin-top", "-30px");		
		$("#arrow-up-img").delay(60);
		$("#arrow-up-img").fadeOut(60);
		setTimeout(function() {
  		$("#arrow-up-img").css("margin-top", "0px");
  		// $("#arrow-up-img").fadeIn(60);
		}, 180);
	}

	function arrowDownEffect() {
		$("#arrow-down-img").fadeIn(60);		
		$("#arrow-down-img").css("margin-top", "30px");		
		$("#arrow-down-img").delay(60);
		$("#arrow-down-img").fadeOut(60);
		setTimeout(function() {
  		$("#arrow-down-img").css("margin-top", "0px");
  		// $("#arrow-down-img").fadeIn(60);
		}, 180);
	}

	function getRandom() {
		var num = Math.random();
		if(num < 0.80) return 0; 			// вероятность 80%
		else if(num < 0.85) return 1; // вероятность 5%
		else if(num < 0.90) return 2; // вероятность 5%
		else if(num < 0.95) return 3; // вероятность 5%
		else return 4; 								// вероятность 5%
	}

	function getStepNum() {
		var step = [];
		for(let index = 0; index < 4; index++) {
			step[index] = getRandom();
		}
		return step;
	}

	function converSpeed(tempSpeed) {
		switch(tempSpeed) {
			case 300:
				spdMeter = 70;
				break;
			case 270:
				spdMeter = 80;
				break;
			case 240:
				spdMeter = 90;
				break;
			case 210:
				spdMeter = 100;
				break;
			case 180: 
				spdMeter = 110;
				break;
			case 150: 
				spdMeter = 120;
				break;
			case 120: 
				spdMeter = 130;
				break;
			case 90: 
				spdMeter = 140;
				break;
			case 70:
				spdMeter = 150;
				break;
		}
	}

	function displayStatus() {
	  $("#speed-val").html(spdMeter);	  
	  $("#coin-val").html(coin);
	  $("#axel-val").html(axel);
	  $("#oil-val").html(oil);
	  $("#wall-val").html(wall);	  
	}

	function rotateUp() {
		$('#obj-car').css({'transform' : 'rotate(-15deg)'});
		clearTimeout(carMoveDelay);
		var carMoveDelay = setTimeout(function() {
			$('#obj-car').css({'transform' : 'rotate(0deg)'})
	  }, 100);
	}

	function rotateDown() {
		$('#obj-car').css({'transform' : 'rotate(15deg)'});
		clearTimeout(carMoveDelay);
		var carMoveDelay = setTimeout(function() {
			$('#obj-car').css({'transform' : 'rotate(0deg)'})
	  }, 100);	
	}

	function roadInit() {
		for(let col_index = 0; col_index < 4; col_index++) {
			for(let row_index = 0; row_index < 20; row_index++) {
				road[col_index][row_index] = 0;
			}
		}
	}

	function changePos() {
		$("#obj-car").removeClass();
		$("#obj-car").addClass("car-position-" + carPos);
	}

	function addCrashGlass() {
		$(".crashGlass").css("display", "block");
	}

	function setRoadResult(roadStringResult) {
		switch(roadStringResult) {
			case "Crash":
				roadResult = "Failed";
				$("#result-stat").css("color", "red");
				break;
			case "Finish":
				roadResult = "Success";
				$("#result-stat").css("color", "green");
				break;
			default:
				roadResult = "undefined";
				$("#result-stat").css("color", "#ffcc00");
				break;
		}
	}

	function carCollision() {
		switch(road[carPos][1]) {
			case 0:
				// playSound('motor');
				break;
			// coin
			case 1:
				coin++;
				road[carPos][1] = 0;
				playSound("coinUp");
				break;
			// oil
			case 2:
				oil++;
				forceMove();
				playSound("oilSqueak");
				$(document).off("keydown", ArrowEvent);
				oilDelay = setTimeout(function() {
					$(document).on("keydown", ArrowEvent);
				}, 400);
				break;
			// axel
			case 3:
				axel++;
				addSpeed();
				playSound("speedUp");
				break;
			// wall
			case 4:				
				$(document).off("keydown", ArrowEvent);
				wall++;
				carCrashMove();
				addCrashGlass();
				clearInterval(gameTime);
				clearInterval(timeLeft);
				clearInterval(roadObjDraw);
				roadCrashDraw(2000);
				delayBeforeStat = setTimeout(function() {
					clearInterval(roadObjDraw);
					roadInit();
					setScenario("stat_scenario");
				}, 6000);
				break;
			default:
				break;
		}
	}

	function forceMove() {
		initVal = getRandDiapason(1, 3);
		switch(initVal) {
			case 1:
				// console.warn("case 1");
				if (carPos !== 0) { 				
					carPos--;
					rotateUp();
					changePos();
					break;
				} else carPos++;
				rotateDown();
				changePos();
				break;
			case 2:
				// console.warn("case 2");
				if (carPos !== 3) {
					carPos++;
					rotateDown();
					changePos();
					break;
				}
				else carPos--;
				rotateUp();
				changePos();
				break;
			case 3:
				break;
			default:
				break;
		}
	}

	function setPlayzone() {
		road.forEach(function(col_item, col_index) {
			road[col_index].forEach(function(row_item, row_index) {
		    var selector = '#road-col-' + col_index + '-row-' + row_index;
		    var Obj = GAME_OBJ[row_item];
		    
		    Object.keys(GAME_OBJ).forEach(function(index) {
					$(selector).removeClass(GAME_OBJ[index]);
		    });

		    $(selector).addClass(Obj);
			});
		});
	}

	function roadCrashDraw(timeScale) {
		roadObjDraw = setInterval(function() {
			road[0].unshift(0);
			road[1].unshift(0);
			road[2].unshift(0);
			road[3].unshift(0);

			road[0].pop(19);
			road[1].pop(19);
			road[2].pop(19);
			road[3].pop(19);

			setPlayzone();
		}, timeScale);
	}

	function roadDraw(timeScale) {
		roadObjDraw = setInterval(function() {
			road[0].shift();
			road[1].shift();
			road[2].shift();
			road[3].shift();

			road[0].push(getRandom());
			road[1].push(getRandom());
			road[2].push(getRandom());
			road[3].push(getRandom());
			setPlayzone();
			carCollision();
			displayStatus();
		}, timeScale);
	}

	roadInit();
	setPlayzone();
	roadDraw(curSpeed);
}

// Запуск программы
window.onload = function() {
	setScenario("login_scenario");
	// setScenario("game_scenario");
	// setScenario("stat_scenario");
};