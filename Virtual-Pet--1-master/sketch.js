var dog,dogImg,dogImg1;
var database;
var foodS,foodStock;
var happyDog, feed, addFood, foodS, foodStock;
var fedTime, lastFed;
var foodObj;

function preload(){

   dogImg=loadImage("Images/Dog.png");
   dogImg1=loadImage("Images/happy dog.png");

  bedroomIMG = loadImage("images/Bed Room.png");
  gardenIMG = loadImage("images/Garden.png");
  washroomIMG = loadImage("images/Wash Room.png");

  
  }

//Function to set initial environment

function setup() {
  database=firebase.database();
  createCanvas(500,500);

  foodObj = new Food();

  dog=createSprite(250,300,150,150);
  dog.addImage(dogImg);
  dog.scale=0.15;

  feed = createButton("Feed");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  textSize(20); 

  

}


function draw() {
  background(46,139,87);
 
  currentTime = hour();
  if(currentTime === lastFed + 1){
    gameState = "playing";
    updateGameState();
    foodObj.garden();
  }
  else if(currentTime === lastFed + 2){
    gameState = "sleeping";
    updateGameState();
    foodObj.bedroom();
  }
  else if(currentTime > lastFed + 2 && currentTime <= lastFed + 4){
    gameState = "bathing";
    updateGameState();
    foodObj.washroom();
  }
  else {
    gameState = "hungry";
    updateGameState();
    foodObj.display();
  }



    fedTime = database.ref("Feed Time");
    fedTime.on("value", function(data){
      lastFed = data.val();
    })

  if(keyWentDown(UP_ARROW)){
    writeStock(foodS);
    dog.addImage(dogImg1);
  }

  if(lastFed >= 12){
    text("Last Feed : " + lastFed % 12 + "PM",350,30);
  }else if(lastFed == 0){
    text("Last Feed : 12 AM",350,30);
  }else{
    text("Last Feed : " + lastFed + "AM",350,30);
  }
  foodObj.getFoodStock();
  //console.log(foodStock);
  getGameState();

  fedTime = database.ref('feedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  })

  fedTime = database.ref('feedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  })

  if(gameState === "hungry"){
    feed.show();
    addFood.show();
    dog.addAnimation("hungry",hungryDog);
  }
  else {
    feed.hide();
    addFood.hide();
    dog.remove();
  }


  foodObj.display();
  drawSprites();

  fill(255,255,254);
  stroke("black");
  text("Food remaining : "+foodS,170,200);
  textSize(13);
  text("Note: Press UP_ARROW Key To Feed Drago Milk!",130,10,300,20);
}


//Function to read values from DB
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

//Function to write values in DB
function writeStock(x){
  if(x<=0){
    x=0;
  }else{
    x=x-1;
  } 
  database.ref('/').update({
    Food:x
  })
}
function addFoods(){
  foodObj.addFood();
  foodObj.updateFoodStock();
}

function feedDog(){
  dog.addImage(happyDog);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1)
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
}

function addFoods(){
  foodS ++;
  database.ref('/').update({
    Food: foodS
  })
}

function getGameState(){
  gameStateRef = database.ref('gameState');
  gameStateRef.on("value",function(data){
    gameState = data.val();
  });
};

function updateGameState(){
  database.ref('/').update({
    gameState: gameState
  })
}