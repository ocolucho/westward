/**
 * Created by Jerome on 06-10-17.
 */
function Panel(x,y,width,height,title){
    this.container = [];
    this.slots = []; // slot number -> coordinates
    this.sprites = []; // pool of sprites to display items
    this.texts = []; // pool of texts for items
    this.nextItemSprite = 0;
    this.test = [];
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.verticalOffset = 20;
    this.displayed = false;
    this.displayInventory = false;
    this.inventory = null;
    this.makeBody();
    if(title) this.addCapsule(20,-9,title);
    this.finalize();
}

Panel.prototype.makeBody = function(){
    var w = this.width - 2*32;
    var h = this.height - 2*32;

    var x = this.x;
    var y = this.y;
    this.container.push(Engine.scene.add.sprite(x,y,'UI','panel-topleft'));
    x += 32;
    this.container.push(Engine.scene.add.tileSprite(x,y,w,32,'UI','panel-top'));
    x += w;
    this.container.push(Engine.scene.add.sprite(x,y,'UI','panel-topright'));
    x = this.x;
    y += 32;
    this.container.push(Engine.scene.add.tileSprite(x,y,32,h,'UI','panel-left'));
    x += 32;
    this.container.push(Engine.scene.add.tileSprite(x,y,w,h,'UI','panel-center'));
    x += w;
    this.container.push(Engine.scene.add.tileSprite(x,y,32,h,'UI','panel-right'));
    x = this.x;
    y += h;
    this.container.push(Engine.scene.add.sprite(x,y,'UI','panel-bottomleft'));
    x += 32;
    this.container.push(Engine.scene.add.tileSprite(x,y,w,32,'UI','panel-bottom'));
    x += w;
    this.container.push(Engine.scene.add.sprite(x,y,'UI','panel-bottomright'));
};

Panel.prototype.addCapsule = function(xOffset,yOffset,title,image){
    var x = this.x + xOffset;
    var y = this.y + yOffset;

    if(image) {
        var img = Engine.scene.add.sprite(x+8,y+6,'UI',image);
        img.depth = Engine.UIDepth+2;
    }
    var textX = (image ? x + img.width : x) + 10;
    var textY = (image ? y - 1: y);

    var text = Engine.scene.add.text(textX, textY, title,
        { font: '16px belwe', fill: '#ffffff', stroke: '#000000', strokeThickness: 3 }
    );
    var w = text.width -25;
    if(image) w += img.width;
    this.container.push(text);
    this.container.push(Engine.scene.add.sprite(x,y,'UI','capsule-left'));
    x += 24;
    this.container.push(Engine.scene.add.tileSprite(x,y,w,24,'UI','capsule-middle'));
    x += w;
    this.container.push(Engine.scene.add.sprite(x,y,'UI','capsule-right'));

    if(image) this.container.push(img);
};

Panel.prototype.addRing = function(xs,ys,color,symbol,callback){
    var x = this.x + xs;
    var y = this.y + ys;
    this.container.push(Engine.scene.add.sprite(x,y,'UI','ring'));
    x += 5;
    y += 5;
    var cs = Engine.scene.add.sprite(x,y,'UI',color);
    this.container.push(cs);
    x += 4;
    y += 4;
    var ss = Engine.scene.add.sprite(x,y,'UI',symbol);

    this.container.push(ss);
    cs.handleClick = callback.bind(this);
    ss.handleClick = callback.bind(this);
    this.finalize();
};

Panel.prototype.setInventory = function(inventory,displayNumbers){
    this.displayInventory = true;
    this.displayNumbers = displayNumbers;
    this.inventory = inventory;
};

Panel.prototype.addSlots = function(nbHorizontal,nbVertical,total){
    var paddingX = 15;
    var offsetx = 0;
    var offsety = 0;
    this.verticalOffset += 5;

    for(var y = 0; y < nbVertical; y++){
        for(var x = 0; x < nbHorizontal; x++){
            if((y*nbHorizontal)+x >= total) break;
            var frame = 'slots-';
            var center = 0;
            switch(y){
                case 0:
                    frame += 'top';
                    break;
                case nbVertical-1:
                    frame += 'bottom';
                    break;
                default:
                    center++;
                    break;
            }
            switch(x){
                case 0:
                    frame += 'left';
                    break;
                case nbHorizontal-1:
                    frame += 'right';
                    break;
                default:
                    center++;
                    break;
            }
            if(center == 2) frame += 'middle';
            offsetx = (x > 0 ? 2 : 0);
            offsety = (y > 0 ? 2 : 0);
            //var slotx = this.x+paddingX+(x*36)+offsetx;
            //var sloty = this.y+paddingY+(y*36)+offsety;
            var slotx = this.x+paddingX+(x*36)+offsetx;
            var sloty = this.y+this.verticalOffset+(y*36)+offsety;
            this.slots.push({
                x: slotx,
                y: sloty
            });
            this.container.push(Engine.scene.add.sprite(slotx,sloty,'UI',frame));
        }
    }
    this.verticalOffset += nbVertical*36 + 5;
    this.finalize();
};

Panel.prototype.addLine = function(line){
    var text = Engine.scene.add.text(this.x+15, this.y+this.verticalOffset, line,
        { font: '14px belwe', fill: '#ffffff', stroke: '#000000', strokeThickness: 3 }
    );
    this.container.push(text);
    this.verticalOffset += 20;
    this.finalize();
};

Panel.prototype.addSprite = function(atlas,frame,x,y){
    console.log(this.x+x,this.y+y);
    var sprite = Engine.scene.add.sprite(this.x+x,this.y+y,atlas,frame);
    this.container.push(sprite);
    this.finalize;
};

Panel.prototype.finalize = function(){
    this.container.forEach(function(e){
        var isText = (e.constructor.name == 'Text');
        if(e.depth == 1 || !e.depth) e.depth = Engine.UIDepth;
        if(isText) e.depth++;
        e.setScrollFactor(0);
        e.setDisplayOrigin(0,0);
        e.setInteractive();
        e.visible = false;
        if(e.frame) console.log(e.frame.name);
        if(e.frame && e.frame.name == 'ring'){
            console.log(e);
        }
    });
};

Panel.prototype.getNextItemSprite = function(item){
    if(this.sprites.length <= this.nextItemSprite){
        var empty = Engine.scene.add.sprite(0,0,'');
        empty.setScrollFactor(0);
        empty.depth = Engine.UIDepth+3;
        this.sprites.push(empty);
    }
    var data = Engine.itemsData[item];
    var sprite = this.sprites[this.nextItemSprite];
    sprite.setTexture(data.atlas);
    sprite.setFrame(data.frame);
    sprite.setDisplayOrigin(Math.floor(sprite.frame.width/2),Math.floor(sprite.frame.height/2));
    sprite.visible = true;
    return sprite;
};

Panel.prototype.getNextText = function(item){
    if(this.texts.length <= this.nextItemSprite){
        var empty = Engine.scene.add.text(100,10, 'lorem ipsum',
            { font: '14px belwe', fill: '#ffffff', stroke: '#000000', strokeThickness: 3 }
        );
        empty.setScrollFactor(0);
        empty.setOrigin(1,0);
        empty.depth = Engine.UIDepth+4;
        this.texts.push(empty);
    }
    var text = this.texts[this.nextItemSprite];
    text.setText(this.inventory.getNb(item));
    text.visible = true;
    return text;
};

Panel.prototype.display = function(){
    for(var i = 0; i < this.container.length; i++){
        this.container[i].visible = true;
    }
    if(this.displayInventory) {
        var j = 0;
        for(var item in this.inventory.items){
            var sprite = this.getNextItemSprite(item);
            var pos = this.slots[j];
            sprite.setPosition(pos.x+2+16,pos.y+4+16);
            if(this.displayNumbers) {
                var text = this.getNextText(item);
                text.setPosition(pos.x + 37, pos.y + 18);
            }
            j++;
            this.nextItemSprite++;
        }
    }
    this.displayed = true;
};

Panel.prototype.hide = function(){
    for(var i = 0; i < this.container.length; i++){
        this.container[i].visible = false;
    }
    if(this.displayInventory) {
        for(var j = 0; j < this.sprites.length; j++){
            this.sprites[j].visible = false;
            if(this.texts[j]) this.texts[j].visible = false;
        }
        this.nextItemSprite = 0;
    }
    this.displayed = false;
};