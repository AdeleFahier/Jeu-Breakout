
// LES BASES DE CANVAS

// EXEMPLE 1 : UN RECTANGLE

/*ctx.beginPath(); --> Ouverture de l'instruction
ctx.rect(20, 40, 50, 50); --> methode rect() pour créer un rectangle (2 premières valeurs = coordonnées du coin supérieur gauche (X, y), les deux valeur suivante spécifient la largeur et la hauteur du rectangle)
ctx.fillStyle = "#FF0000";
ctx.fill(); (methode pour remplir la figure créé, pas simplement les outline)
ctx.closePath(); --> fermeture de l'instruction*/

// EXEMPLE 2 : UN CERCLE

/*ctx.beginPath();
ctx.arc(240, 160, 20, 0, Math.PI*2, false);
ctx.fillStyle = "green";
ctx.fill();
ctx.closePath();*/

/*--> La méthode arc() : Elle comporte 6 paramètres :
- Les 2 premiers sont les coordonnées X et Y du centre de l'arc
- Ensuite nous avons a valeur du rayon de l'arc (au final ce qui permet de jouer sur sa taille)
- l'angle de départ et l'angle de fin pour finir de dessiner le cercle en radiant (ici 0 et blablabla PI)
- dernier paramètre booléan pour la direction du dessin : false (par défaut) pour un dessin dans le sens des aiguilles d'une montre ou true pour un sens inversé. paramètre facultatif.*/


// CONSTRUCTION DE NOTRE JEU

// Nous donnonsla réference de notre élement Canvas à notre fichier JS
var canvas = document.getElementById("theCanvas");
// Ensuite nous créons la variable ctx pour stocker le "contexte de rendu 2D" --> l'outil que nous utilisons pour dessiner sur canvas
var ctx = canvas.getContext("2d");

//variable pour le score
var score = 0;

//variable vie du joueur
var lives = 3;

// déclarons x et y et leur donnons une valeur de départ : au milieu sur la largeur en divisant par 2 la canvas.width et pour la hauteur on veut une position de départ en bas, mais pas non plus collé, alors on la positionne 30px au dessus en soustrayant 30px à la hauteur totale.
var x = canvas.width/2;
var y = canvas.height-30;

//Nous voulons ajouter une valeur à x et y après que chaque image ait été dessinée our donner l'illusion du mouvement. On va définir deux variables qui viendront incrémenter nos variables x et y dans notre fonction. 
var dx = 2; //(incrémenter de 2px , se décalera sur la droite)
var dy = -2; //(décrémenter de 2px, se décalera de 2px en haut)

//pour faciliter nos calcules nous allons stocker la rayon de notre balle (ici 10) dans une variable
var ballRayon = 10;

//Variables utilisées pour la création de notre raquette contrôlable
var paddleHeight = 15;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2; //ici nous définissons son point de départ sur l'axe x

//variables utilisées pour stocker les infos sur l'état des touches "gauche" et "droite". Par défaut on donne la valeur false à ces deux variables. Puis nous mettrons en places deux écouteurs d'event pour être informé des appuis sur les touches.
var rightPressed = false;
var leftPressed = false;

//Variables pour la construction des briques
var brickRowTotal = 3; //variable stockant le nombre de lignes de brique
var brickColumnTotal = 5; //variable stockant le nombre de colonnes de brique
var brickWidth = 75; // variable stockant la largeur d'une brique
var brickHeight = 20; // variable stockant la hauteur d'une brique
var brickPadding = 10; //variable stockant le padding voulu entre les briques
var brickOffsetTop = 30; //utilisé comme un équivalent de margin Top
var brickOffsetLeft = 30; //utilisé comme un équivalent de margin left

//Nous plaçons nos briques dans un tableau à deux dimensions. Il contiendra les colonnes de briques (c), qui à leur tour contiendront les lignes de briques (r) qui chacune contiendront un objet défini par une position x et y pour afficher chaque brique à l'écran.
// Le tableau de brique
var bricks = []; // Nous créons le tableau, pour l'instant, nous avons la référence, mais le tableau est vide. 
// Puis nous utilisons une boucle qui va parcourir les lignes et colonnes et créer de nouvelles briques.
for (var c = 0; c < brickColumnTotal; c++){
    bricks[c] = []; //Initialisation d'un tableau dans le tableau -- Ici va créer 5 sous tableaux colonne
    for (var r = 0; r < brickRowTotal; r++){ // Initialisation d'un nouveau tableau -- Ici on va créer 3 sous tableaux dans chacun des 5 tableaux colonnes déjà créé. On se retrouve avec 15 arrays (les 15 briques, chaque array de brique va contenu les propriétés et les valeurs de cet objet brique) nested in arrays, nested in arrays nested in array bricks
        bricks[c][r] = { x:0, y:0, status: 1}; // Dans le tableau bricks --> qui contient le tableau colonne --> qui contient le tableau ligne --> qui contient les briques (les briques n'existent pas encore, nous allons les créer dans une fonction avec une boucle. bricks[c][r] = l'objet brique (qui se trouve dans le tableau row, du tableau colonne, du tableau bricks).
        // La propriété status va nous permettre d'indiquer si nous voulons ou non afficher chaque brique à l'écran. Au début nous les affichons toutes, mais en modifiant cette valeur de status nous pourrons faire disparaitre les briques qui ont été touché.
        // x, y et status sont les propriétés de l'objet brique
    }
}

function drawBall(){
    // Code pour dessiner la balle
    ctx.beginPath();
    ctx.arc(x, y, ballRayon, 0, Math.PI*2);
    ctx.fillStyle = "#BFCC94";
    ctx.fill();
    ctx.closePath();
}

// Il nous faut une raquette et un contrôle du clavier pour une intéraction avec le joueur 
function drawPaddle(){
    // code pour dessiner la raquette de contrôle
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#B4CDED";
    ctx.fill();
    ctx.closePath();

}
// LA fonction pour parcourir les briques dans le tableau et les dessiner sur l'écran :
function drawBricks(){
    for(var c=0; c<brickColumnTotal; c++){
        for(var r=0; r<brickRowTotal; r++){
            if(bricks[c][r].status == 1){ //ici on a la condition que le status doit être == 1 pour que la brique soit dessinée
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft; // le nombre de colonne multiplie (la largeur de la brique + le padding, l'espace voulu entre les briques) et on ajoute au tout un espace à gauche
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#344966";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

//Une fonction pour créer et mettre à jour l'affichage du score
function drawScore(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#344966";
    ctx.fillText("Score: "+ score, 8, 20); //premiere paramètre le texte qu'on veut afficher, les deux paramètres suivants sont les coordonnées où le texte est placé sur le canevas
}
function drawLives(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#344966";
    ctx.fillText("Lives: "+ lives, canvas.width-65, 20);
}

//Lorsque l'event "keydown" est déclanché par l'appui d'une des touches du clavier enfoncées, la fonction keyDownHandler() est exécutée
document.addEventListener("keydown", keyDownHandler, false);
//lorsque l'event "keyup" est déclanché lorsque les touches cessent d'être enfoncées, la fonction keyUpHandler() est éxécutée
document.addEventListener("keyup", keyUpHandler, false);
// Pour détecter les mouvements de la souris :
// document.addEventListener("mousemove", mouseMoveHandler, false);

//Dans cette fonction, nous calculons d'abord une valeur relativeX, qui est égale à la position horizontale de la souris dans la fenêtre de visualisation (e.clientX) moins la distance entre le bord gauche de la toile et le bord gauche de la fenêtre de visualisation (canvas.offsetLeft) — en fait, cette valeur est égale à la distance entre le bord gauche du canevas et le pointeur de la souris. Si la position relative du pointeur X est supérieure à zéro et inférieure à la largeur du canevas, le pointeur se trouve dans les limites du canevas, et la position paddleX (ancrée sur le bord gauche de la palette) est fixée à la valeur relativeX moins la moitié de la largeur de la palette, de sorte que le mouvement sera en fait relatif au milieu de la raquette.
// function mouseMoveHandler(e){
//     var relativeX = e.clientX - canvas.offsetLeft;
//     if(relativeX > 0 && relativeX < canvas.width){
//         paddleX = relativeX - paddleWidth/2;
//     }
// }

//Que se passe-t-il quand les fonctions sont exécutées ? Quand on va appuyer sur une touche du clavier, l'information qui est stocké dans nos variables "rightPressed" et "leftPressed" va changer. En appuyant, elles prennent la valeur de "true", et lorsque la touche est relâché, elles repprennent la valeur de "false".
// Les deux fonctions prennent un event comme paramètre, représenté par la variable "e". On va rajouter à ce paramètre event la propriété key qui contiendra l'information sur la touche enfoncée. Ici nous utiliserons les flèches de gauche et de droite. "Right" pour le navigateur IE et "ArrowRight" pour tous les autres navigateurs.
function keyDownHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight"){
        rightPressed = true;
    } else if(e.key == "Left" || e.key == "ArrowLeft"){
        leftPressed = true;
    }
}

function keyUpHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight"){
        rightPressed = false;
    } else if(e.key == "Left" || e.key == "ArrowLeft"){
        leftPressed = false;
    }
}

//Detection de collision entre les briques et la balle. Pour cel anous créons une fonction de détection de collision qui va parcourir toutes les briques et comparer la positition de chaque brique avec les coordonnées de la balle lorsque chaque image est dessinée. Nous utilisons une boucle pour parcourir toutes les briques : la variable b est définie pour stocker l'objet brique.
function collisionDetection(){
    for(var c=0; c<brickColumnTotal; c++){
        for(var r=0; r<brickRowTotal; r++){
            var b = bricks[c][r];
            if(b.status == 1){ //si status == 1 cad si la brique est visible alors on évalue la condition suivante
            //si le centre le de balle se trouve à l'intérieur des coordonnées d'une de nos briques, nous changerons la direction de la balle. Pour que le centre de la balle soit à l'intérieur de la brique, les quatres affirmations suivantes doivent être vraies : 
            // - La position x de la balle est supérieur à la position x de la barique
            // - La position x de la balle est inférieur à la position x de la brique plus sa largeur
            // - la position y de la balle est supérieur à la position y de la brique
            // - la position y de la balle est inférieur à la position y de la brique plus sa hauteur
               if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight){
                dy = -dy;
                b.status = 0;//et on l'on modifie le status de la brique qui a été touchée pour la faire la disparaitre. Avec un status = 0, l'objet n'est pas affiché à l'écran. 
                score++;
                // Ajouter un message de victoire si toutes les briques ont été détruites
                if(score == brickRowTotal*brickColumnTotal){
                    alert("C'est gagné, Bravo !");
                    document.location.reload();
                    // clearInterval(interval);
                }
               }
            }
        }
    }
}

// Nous définissons une boucle de dessin avec une fonction draw() qui sera exécutée en continue et qui utilisera des variables pour les positions des éléments. Pour qu'une fonction s'exécute de façon répétée avec JS, on peut utiliser les methodes setInterval() ou requestAnimationFrame()
function draw(){
    // La méthode clearRect() permet d'effacer le contenu de notre canvas. Les paramètres définissent la zone à effacer. Ici on efface toute la zone à chaque fois.
    ctx.clearRect (0, 0, canvas.width, canvas.height); //paramètres(coordonnées X et Y du coin supérieur gauche et coordonnées du coin inférieur droit)
    drawBall();
    drawPaddle();
    drawBricks();
    collisionDetection();
    drawScore();
    drawLives();
    // code pour mofidier sa position
    x += dx; //incrémente x
    y += dy; // incrémente y

    //ETAPE DETECTION DES COLLISIONS : but --> faire rebondir la balle sur les bors de la toile. 
    //Pour détecter la collision, nous vérifierons si la balle touche (entre en collision avec) le mur et, si c'est le cas, nous modifierons la direction de son mouvement en conséquence.
    //Si la valeur y de la position de la balle est inférieure à zéro, changez la direction du mouvement sur l'axe y en le rendant égal à son inverse. Si la balle se déplaçait vers le haut à une vitesse de 2 pixels par image, elle se déplacera maintenant "vers le haut" à une vitesse de -2 pixels, ce qui équivaut en fait à se déplacer vers le bas à une vitesse de 2 pixels par image.

    //(première condition cible le bord supérieur, deuxième condition vise la bord inférieur)
    // On soustrait ou rajoute la valeur du rayon de notre balle, pour que le point de collision ne soit pas le centre de la balle mais l'extrémitité de sa circonférence. Si l'on écrit (y + dy) < 0, lorsque la balle frappe le mur elle s'enfoncera de sa moitié avant de changer de direction. alors on remplace ce zéro par la valeur du rayon de notre balle. Et pour la hauteur et la width ou soustrait au total cette même valeur du rayon.
    if((y + dy) < ballRayon){ // SI COLLISION AVEC MUR DU HAUT
        dy = -dy; //on inverse la direction 
    } else if((y + dy) > canvas.height-(ballRayon*1.2)) { // SI COLLISION AVEC MUR DU BAS : 2 cas de figure
        if (x > paddleX && x < paddleX + paddleWidth){ // si la position x de la balle est supérieur à la position x de la raquette tout en étant inférieur à la position x de la raquette + la largeur de la raquette, alors ça veut dire que la balle a touché la raquette. Alors on renvoie la balle dans la direction inverse.
            dy = -dy;
        } else{ // Si les conditions précédentes ne sont pas remplis c'est que la balle a touché le mur du bas et donc game over
            lives--;
            if(!lives){ // !lives = false = 0
                alert("GAME OVER");
                document.location.reload(); // La méthode Location.reload() recharge la ressource depuis l'URL actuelle.
                // clearInterval(interval); //Methode pour stoper le temps du setInterval(). Entre parenthèse la variable qui applique la méthode a la fonction draw()
            }
            else{ // Si il reste aux joueurs des vies, alors on replace la balle en bas au milieu
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    
    }

    // (première condition cible le bord gauche, deuxième condition vise la bord droit)
    if((x + dx) < ballRayon || (x + dx) > canvas.width-ballRayon) {
        dx = -dx; //on inverse aussi la direction
    }

    // Nous avons des variables et events associés aux touches pressées. Maintenant nous devons donner des instructions de déplacement pour la raquette lorsque les touches sont pressées
    //(si rightPressed (ou leftPressed) est true (pour rappel les fonctions keyDownHandler et keyUpHandler permettent de changer l'état true ou false de nos variables rightPressed et leftPressed), alors exécute le code à l'intérieur, c'est à dire modifie la variable paddleX qui positionne notre raquette sur l'axe x)
    if(rightPressed){
        paddleX += 7; //si touche flèche droite enfoncée --> raquette se déplace de 7 pixels sur la droite
        // Si la cordonnée x de notre raquette + la largeur de notre raquette est supérieur à la largeur totale de note canvas --> on limite la poisition paddleX à la largeur du canvas - la largeur de la raquette. Par exemple ici notre canvas fait 480px de largeur, notre raquette fait 75, si notre paddingX se situe à 460px alors 55px de notre raquette disparait. Ici on limite la position paddleX à 405px !
        if (paddleX + paddleWidth > canvas.width){
            paddleX = canvas.width - paddleWidth;
        }
    }else if(leftPressed){
        paddleX -= 7; //si touche flèche gauche enfoncée --> raquette se déplace de 7 pixels sur la gauche
        // Même principe pour la gauche, on va aussi donner une limite. Comme les pixels se compte de gauche à doirte, le 0 est à gauche. Donc nous limitons simplement le paddingX à zéro ! Rappel : le paddingX c'est la position du bord gauche de notre raquette
        if(paddleX < 0){
            paddleX = 0;
        }
    }

    requestAnimationFrame(draw);
    //La fonction draw() est maintenant exécutée indéfiniment dans une boucle requestAnimationFrame(), mais au lieu de la cadence fixe de 10 millisecondes, nous redonnons le contrôle de la cadence au navigateur. Il synchronisera la cadence en conséquence et ne n'acutalisera l'affichage que lorsque cela sera nécessaire. Cela permet d'obtenir une boucle d'animation plus efficace et plus fluide que l'ancienne méthode setInterval().
}

draw(); 

// setInterval(draw, 10) 
// Ici on utilise la methode sur la fonction draw et le deuxième paramètre en millisecondes indique que la fonction sera éxécutée toutes les 10 millisecondes jusqu'à ce qu'on y mette un terme.
// var interval = setInterval(draw, 10);




