// Bahadır GÜltekin 15011057
// Helim Doğuş Toygur Kukul 15011055
//PHASE 3
// Oyunun sonlandırma kısmı; yılan yemi yediğinde veya kendi kuyruğuna çarptığında 
// çıkan sesleri ekledik.
// gorsellestirmeler yapıldı.

var hız=40, c, cc, yilan, elma, grid, skor, yeniskor, kafa, yenikafa, d, paused, yemsesi, gameoversesi,patternkafa,patterngovde,patterncount,image_c=1;
/* 
c : canvas nesnesi
cc: getContext("2d")  iki boyutlu çizim
yilan: array tipinde nesne yılanın kendisi
elma : yilanın yemi
grid: 20px  yılanın parçalarının her birinin genişliği yüksekliği ve hareket etmesi için referans alınacak
skor: yılan yemi yediğinde 1 puan artacak
kafa:yılanın başı:)
yeni kafa guncellemeler sonrası yeni kafasının kordinatlarını tutacak
d: yön tuşlarını hafızada tutacak
yemsesi: yılan yemi yediğinde çalacak olan müzik
gameoversesi :oyun bitti müziği çalacak.
*/

class game {

    constructor(w,h){
        c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        /*c.style.border = "1px solid #fff";*/
        cc = c.getContext("2d");
        document.body.appendChild(c);
        document.addEventListener("keydown", this.kontrol.bind(this));
        this.timer = setInterval(this.animate.bind(this), hız);
       
        
    }

    init(){
        yemsesi = new ses("sesler/elma.mp3");
        gameoversesi = new ses("sesler/gameover.mp3");
        
        
        // başlangıç değerleri
        skor = 0;
        yeniskor=0;
        grid = 35;
        yilan = [];
        kafa = {
            x: 9 * grid,
            y: 9 * grid
        }
        yilan.push(kafa);

        elma = {
            x: Math.floor(Math.random() * 19 + 0) * grid,
            y: Math.floor(Math.random() * 19 + 0) * grid
        }

    }
    
    clear(){
        cc.clearRect(0,0,c.width,c.height);
    }
    
    eslesme(x,y){
        var e = false;
        
        yilan.forEach(t => {
            e = e || (t.x == x && t.y === y)
        });
        return e ;
    }
    
    carpisma(head, array) { 
        for (let i = 0; i < array.length; i++) {
            if (head.x == array[i].x && head.y == array[i].y) {
                return true;
            }
        }
        return false;
    }
    
    stop(){
        cc.font = "60px site";
        cc.textAlign = "center";
        cc.textBaseline = "hanging";
        cc.fillStyle = "red";
        cc.fillText("GAME OVER" , c.width/2, 300);
        
        clearInterval(this.timer);
    }
    update(){
        
        if(paused){
            return;
        }            
 
                    
         // yön tuşları ayarı ( vx,vy)
        if (d == "LEFT") {
            kafa.x += -grid;
            patterncount=1;

                     
        }
        if (d == "RIGHT") {
            kafa.x += grid;
            patterncount=2;
            
        }
        if (d == "UP") {
            kafa.y += -grid;
            patterncount=3;
            
        }   //canvas ust taraf - işaretlidir...
        if (d == "DOWN") {
            kafa.y += grid;
            patterncount=4;
            
        }
        
        //yılanın ekrandan taşması durumu
        if(kafa.x <0){
            kafa.x = c.width - grid ;
        }
        
        if(kafa.x >c.width - grid){
            kafa.x = 0;
        }
        
        if(kafa.y < 0){
            kafa.y = c.height - grid;
        }
        
        if(kafa.y > c.height - grid){
            kafa.y = 0  ;
        }
        
        //yılan yemi yediyse

            document.getElementById("skor").innerHTML = "score: "+yeniskor*10;
            document.getElementById("fruit").innerHTML = "eaten apple: "+skor;
        if (elma.x == kafa.x && elma.y == kafa.y){
            skor +=1;
            if(skor!=1 && skor%5==1){
                yeniskor=yeniskor+3;
            }
            else{
                yeniskor++;
            }
            document.getElementById("skor").innerHTML = "score: "+yeniskor*10;
            document.getElementById("fruit").innerHTML = "eaten apple: "+skor;
            yemsesi.play();
            
            elma = {
            x: Math.floor(Math.random() * 19 + 0) * grid,
            y: Math.floor(Math.random() * 19 + 0) * grid
            }
            
            
            while(this.eslesme(elma.x , elma.y)){                                   // bu kısımda yılan yemi yedikten sonra tekrardan ekrana geldiğinde 
                elma.x =  Math.floor(Math.random() * 19 + 0) * grid;                // yılanın üzerinde yem çıkmasını engellemek  eğer biz burada false değeri döndürmüş olsaydık
                elma.y =  Math.floor(Math.random() * 19 + 0) * grid;                // yemi her yediğimizde yem yılanın üzerinde oluşacaktı
            }
            
        }
        else{
            yilan.pop();
        }
        yenikafa={
            x:kafa.x , 
            y:kafa.y 
        }
        
        //yılanın kendisine carpmasi
        if(this.carpisma(kafa,yilan)){
            
            gameoversesi.play();
            this.stop();
        }
        
        //yılana yeni kafa ekleme
        yilan.unshift(yenikafa);
                      
    }
    
    draw(){
        // yem oluşturma
        if(skor!=0 && skor%5==0){
            var image = new Image();
            image.src="images/golden_apple2.png";
            var pattern = cc.createPattern(image,"repeat");
        }
        else{
            var image = new Image();
            image.src="images/elma2.png";
            var pattern = cc.createPattern(image,"repeat");
        }

        cc.fillStyle =  pattern ;
        cc.fillRect(elma.x, elma.y, grid, grid);
        
        // skor ekleme

        cc.font = "20px Arial";
        cc.textAlign = "left";
        cc.textBaseline = "hanging";
        cc.fillStyle = "#000";
        //cc.fillText("SKOR:" + skor, 3, 3);
        
        // yılanı çizme

        if(image_c==2){
        let count=0;
            if(count==0){
            var resimkafa = new Image();
            resimkafa.src="images/yılan/d_bas1_R.png";
            patternkafa = cc.createPattern(resimkafa, "repeat");
            count=1;
        }
        }
        else if(image_c==1){
        let count=0;
            if(count==0){
            var resimkafa = new Image();
            resimkafa.src="images/yılan/EBAS1.png";
            patternkafa = cc.createPattern(resimkafa, "repeat");
            count=1;
        }
        }
        else if(image_c==3){
        let count=0;
            if(count==0){
            var resimkafa = new Image();
            resimkafa.src="images/yılan/kyuz1.png";
            patternkafa = cc.createPattern(resimkafa, "repeat");
            count=1;
        }
        }
        else if(image_c==4){
        let count=0;
            if(count==0){
            var resimkafa = new Image();
            resimkafa.src="images/yılan/NYUZ1.png";
            patternkafa = cc.createPattern(resimkafa, "repeat");
            count=1;
        }
        }

        if(patterncount==1){
            if(image_c==2){
            var resimkafa = new Image();
            resimkafa.src="images/yılan/d_bas2_R.png";
            patternkafa = cc.createPattern(resimkafa, "repeat");
            }   
            else if (image_c==1){
            var resimkafa = new Image();
            resimkafa.src="images/yılan/EBAS2.png";
            patternkafa = cc.createPattern(resimkafa, "repeat");
            }
            else if (image_c==3){
            var resimkafa = new Image();
            resimkafa.src="images/yılan/kyuz2.png";
            patternkafa = cc.createPattern(resimkafa, "repeat");
            }
            else if (image_c==4){
            var resimkafa = new Image();
            resimkafa.src="images/yılan/NYUZ2.png";
            patternkafa = cc.createPattern(resimkafa, "repeat");
            }

        }
        else if(patterncount==2){
            if(image_c==2){
            var resimkafa = new Image();
            resimkafa.src="images/yılan/d_bas4_R.png";
            patternkafa = cc.createPattern(resimkafa, "repeat");
            }   
            else if (image_c==1){
            var resimkafa = new Image();
            resimkafa.src="images/yılan/EBAS4.png";
            patternkafa = cc.createPattern(resimkafa, "repeat");
            }
            else if (image_c==3){
            var resimkafa = new Image();
            resimkafa.src="images/yılan/kyuz4.png";
            patternkafa = cc.createPattern(resimkafa, "repeat");
            }
            else if (image_c==4){
            var resimkafa = new Image();
            resimkafa.src="images/yılan/NYUZ4.png";
            patternkafa = cc.createPattern(resimkafa, "repeat");
            }

        }
        else if(patterncount==3){
            if(image_c==2){
            var resimkafa = new Image();
            resimkafa.src="images/yılan/d_bas3_R.png";
            patternkafa = cc.createPattern(resimkafa, "repeat");
            }   
            else if (image_c==1){
            var resimkafa = new Image();
            resimkafa.src="images/yılan/EBAS3.png";
            patternkafa = cc.createPattern(resimkafa, "repeat");
            }
            else if (image_c==3){
            var resimkafa = new Image();
            resimkafa.src="images/yılan/kyuz3.png";
            patternkafa = cc.createPattern(resimkafa, "repeat");
            }
            else if (image_c==4){
            var resimkafa = new Image();
            resimkafa.src="images/yılan/NYUZ3.png";
            patternkafa = cc.createPattern(resimkafa, "repeat");
            }

        }
        else if(patterncount==4){
            if(image_c==2){
            var resimkafa = new Image();
            resimkafa.src="images/yılan/d_bas1_R.png";
            patternkafa = cc.createPattern(resimkafa, "repeat");
            }   
            else if (image_c==1){
            var resimkafa = new Image();
            resimkafa.src="images/yılan/EBAS1.png";
            patternkafa = cc.createPattern(resimkafa, "repeat");
            }
            else if (image_c==1){
            var resimkafa = new Image();
            resimkafa.src="images/yılan/kyuz1.png";
            patternkafa = cc.createPattern(resimkafa, "repeat");
            }
            else if (image_c==1){
            var resimkafa = new Image();
            resimkafa.src="images/yılan/NYUZ1.png";
            patternkafa = cc.createPattern(resimkafa, "repeat");
            }

        }
          

        if(image_c==2){
        var resimgovde = new Image();
            resimgovde.src="images/yılan/govde.png";
            patterngovde = cc.createPattern(resimgovde, "repeat");
        }
        else if(image_c==1){
        var resimgovde = new Image();
            resimgovde.src="images/yılan/EGOVDE.png";
            patterngovde = cc.createPattern(resimgovde, "repeat");    
        } 
        else if(image_c==3){
        var resimgovde = new Image();
            resimgovde.src="images/yılan/kgovde.png";
            patterngovde = cc.createPattern(resimgovde, "repeat");    
        }
        else if(image_c==4){
        var resimgovde = new Image();
            resimgovde.src="images/yılan/NGOVDE.png";
            patterngovde = cc.createPattern(resimgovde, "repeat");    
        }

        let sayi = 0;
        yilan.forEach(element => {

            if(sayi==0)
            cc.fillStyle = patternkafa;
            else
            cc.fillStyle = patterngovde;
            cc.fillRect(element.x, element.y, grid, grid);

            cc.strokeStyle = "#2D2D2D";
            cc.strokeRect(element.x, element.y, grid, grid);
            sayi++;
        });
        
        // kafasının kordinatları
        kafa.x = yilan[0].x;
        kafa.y = yilan[0].y;
    }
    
    animate(){
        this.clear();//temizleme
        this.update();//güncelleme
        this.draw();// çizdirme 
    }
     kontrol(event) {
        let key = event || window.event;
        if (key.keyCode == 37 && d !== "RIGHT") {
            d = "LEFT";
        }
        if (key.keyCode == 38 && d !== "DOWN") {
            d = "UP";
        }
        if (key.keyCode == 39 && d !== "LEFT") {
            d = "RIGHT";
        }
        if (key.keyCode == 40 && d !== "UP") {
            d = "DOWN";
        }
        if (key.keyCode == 80 ){
            paused = !paused;
        }
        if (key.keyCode == 49 ){
            image_c=1;
        }
        if (key.keyCode == 50 ){
            image_c=2;
        }
        if (key.keyCode == 51 ){
            image_c=3;
        }
        if (key.keyCode == 52 ){
            image_c=4;
        }

    }
}

function ses(src) {
    this.music = document.createElement("audio");
    this.music.src = src;
    this.music.setAttribute("preloads", "auto");
    this.music.setAttribute("controls", "none");
    this.music.style.display = "none";
    document.body.appendChild(this.music);
    this.play = function () {
        this.music.play();
    }
    this.stop = function () {
        this.music.pause();
    }
}


window.onload =()=>{
    const oyun=new game(805, 805).init();
} 