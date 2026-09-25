"use client";

import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { createClient } from "@/lib/supabase/client";
import { BENIAMINI_MAPPA, NPCS } from "@/data/offseason";

type MapId = "quercia"|"ranocchio"|"leondoro"|"lucertola"|"pozzo"|"madonnina"|"cervia"|"ponte";
type Exit = {x:number;y:number;target:MapId;label:string};
type MapDef = {
  id:MapId; label:string; place:string; center:[number,number]; spawn:{x:number;y:number};
  beniamino:string; primary:number; secondary:number; accent:number; exits:Exit[];
};

const MAPS:Record<MapId,MapDef> = {
  quercia:{id:"quercia",label:"La Quercia",place:"Querceta",center:[43.97659,10.20043],spawn:{x:16,y:12},beniamino:"quercia",primary:0xf4f1e8,secondary:0x252525,accent:0xb58b42,
    exits:[{x:14,y:0,target:"ranocchio",label:"Verso Ranocchio"},{x:27,y:0,target:"leondoro",label:"Verso Leon d'Oro"},{x:0,y:10,target:"ponte",label:"Verso Ponte"},{x:31,y:14,target:"madonnina",label:"Verso Madonnina"}]},
  ranocchio:{id:"ranocchio",label:"Il Ranocchio",place:"Ranocchiaio / Cugnia",center:[43.97924,10.19747],spawn:{x:17,y:20},beniamino:"ranocchio",primary:0xe5b93f,secondary:0x4d914f,accent:0xffffff,
    exits:[{x:16,y:23,target:"quercia",label:"Verso Querceta"},{x:31,y:11,target:"leondoro",label:"Verso Leon d'Oro"}]},
  leondoro:{id:"leondoro",label:"Il Leon d'Oro",place:"Marzocchino",center:[43.98086,10.20304],spawn:{x:6,y:20},beniamino:"leondoro",primary:0xe5b93f,secondary:0xc63f3f,accent:0x3f67ad,
    exits:[{x:5,y:23,target:"quercia",label:"Verso Querceta"},{x:0,y:11,target:"ranocchio",label:"Verso Ranocchio"},{x:31,y:12,target:"lucertola",label:"Verso Lucertola"}]},
  lucertola:{id:"lucertola",label:"La Lucertola",place:"Ripa",center:[43.98458,10.21372],spawn:{x:3,y:18},beniamino:"lucertola",primary:0xc63f3f,secondary:0x4d914f,accent:0xe5b93f,
    exits:[{x:0,y:18,target:"leondoro",label:"Verso Leon d'Oro"},{x:31,y:15,target:"pozzo",label:"Verso Pozzo"}]},
  pozzo:{id:"pozzo",label:"Il Pozzo",place:"Pozzi",center:[43.9769,10.2152],spawn:{x:4,y:8},beniamino:"pozzo",primary:0xf4f1e8,secondary:0xc63f3f,accent:0x3f67ad,
    exits:[{x:0,y:8,target:"lucertola",label:"Verso Ripa"},{x:31,y:18,target:"madonnina",label:"Verso Madonnina"}]},
  madonnina:{id:"madonnina",label:"La Madonnina",place:"Madonnina dei Pagliai",center:[43.97315,10.20749],spawn:{x:5,y:7},beniamino:"madonnina",primary:0x3f67ad,secondary:0xe5b93f,accent:0xc63f3f,
    exits:[{x:0,y:15,target:"quercia",label:"Verso Querceta"},{x:31,y:18,target:"pozzo",label:"Verso Pozzi"},{x:18,y:23,target:"cervia",label:"Verso Cervia"}]},
  cervia:{id:"cervia",label:"La Cervia",place:"Montiscendi",center:[43.95773,10.22506],spawn:{x:25,y:4},beniamino:"cervia",primary:0xf4f1e8,secondary:0x7bb8d9,accent:0x6c9b5b,
    exits:[{x:18,y:0,target:"madonnina",label:"Verso Madonnina"},{x:0,y:18,target:"ponte",label:"Verso Ponte"}]},
  ponte:{id:"ponte",label:"Il Ponte",place:"Vaiana",center:[43.96688,10.19238],spawn:{x:25,y:6},beniamino:"ponte",primary:0xc63f3f,secondary:0x3f67ad,accent:0xe5b93f,
    exits:[{x:31,y:7,target:"quercia",label:"Verso Querceta"},{x:0,y:17,target:"cervia",label:"Verso Cervia"}]},
};

const TILE=32, COLS=32, ROWS=24;
const beniById=(id:string)=>BENIAMINI_MAPPA.find(b=>b.id===id);

export default function TreguaGame(){
  const root=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(!root.current)return;
    const supabase=createClient();
    const config:Phaser.Types.Core.GameConfig={
      type:Phaser.AUTO,parent:root.current,width:960,height:540,pixelArt:true,backgroundColor:"#5f8f4e",
      scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH},
      input:{activePointers:3},render:{antialias:false,roundPixels:true},
      physics:{default:"arcade",arcade:{debug:false}},
      scene:{
        preload(this:Phaser.Scene){
          this.load.image("tiles","/game/rpg-tileset.svg");
          ["cervia","leondoro","lucertola","madonnina","ponte","pozzo","quercia","ranocchio"].forEach(id=>this.load.image(`player-${id}`,`/game/player-${id}.svg`));
          this.load.image("npc","/game/npc.svg");
          this.load.image("house-borgo","/game/house-borgo.svg");
          this.load.image("house-osteria","/game/house-osteria.svg");
          this.load.image("tree-large","/game/tree-large.svg");
            Object.keys(MAPS).forEach((mapId)=>this.load.image(`map-${mapId}`,`/game/map-${mapId}.svg`));
          BENIAMINI_MAPPA.forEach(b=>this.load.image(`beni-${b.id}`,b.image));
        },
        create(this:Phaser.Scene){
          const scene=this, WORLD_W=COLS*TILE, WORLD_H=ROWS*TILE;
          const FONT="Verdana, Arial, sans-serif";
          const mobile=window.innerWidth<768||"ontouchstart"in window||navigator.maxTouchPoints>0||/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
          scene.physics.world.setBounds(0,0,WORLD_W,WORLD_H);
          scene.cameras.main.setBounds(0,0,WORLD_W,WORLD_H).setZoom(mobile?1.85:2);
          // Rendering diretto dei tile per evitare incompatibilita del Tilemap con SVG.
          const T={grass:0,flowers:1,path:2,plaza:3,water:4,bridge:5,wall:6,roof:7,tree:8,fence:9,stone:10,darkGrass:11,dirt:12,goldRoof:13,darkTree:14,flowerPatch:15};
          const ground:any=scene.add.container(0,0).setDepth(0);
          (ground as any).putTileAt=(tile:number,x:number,y:number)=>{
            const img=scene.add.image(x*TILE+TILE/2,y*TILE+TILE/2,"tiles").setOrigin(.5);
            const tx=(tile%8)*TILE, ty=Math.floor(tile/8)*TILE;
            img.setCrop(tx,ty,TILE,TILE);
            ground.add(img);
            return img;
          };

          let userId:string|null=null,username="Contradaiolo",contradaId="quercia";
          const collected=new Set<string>();
          const objects=new Map<string,Phaser.GameObjects.Image>();
          let current:MapId="quercia";
          let currentNpcs:Phaser.GameObjects.Image[]=[];
          let currentNpcData:any[]=[];
          let currentBeni:Phaser.GameObjects.Image|null=null;
          let mapCollisionObjects:Phaser.GameObjects.GameObject[]=[];
          let player:Phaser.Physics.Arcade.Sprite;
          let usernameText:Phaser.GameObjects.Text;
          let progress:Phaser.GameObjects.Text;
          let mapTitle:Phaser.GameObjects.Text;
          let locationText:Phaser.GameObjects.Text;
          let worldDots:Phaser.GameObjects.Container;
          let dialog:Phaser.GameObjects.Container;
          let tregua:Phaser.GameObjects.Container;
          let timer:Phaser.Time.TimerEvent|null=null;
          let trialOverlay:Phaser.GameObjects.Container|null=null;
          let trialCompleted=new Set<string>();
          let trialStep=0;
          let trialTime=0;
          let trialTimer:Phaser.Time.TimerEvent|null=null;
          let joyX=0,joyY=0,joyPointer:number|null=null;

          const say=(s:string)=>{timer?.remove();const text=dialog.getAt(1) as Phaser.GameObjects.Text;text.setText(s);dialog.setVisible(true);timer=scene.time.delayedCall(5000,()=>dialog.setVisible(false));};
          const updateProgress=()=>{progress.setText(`BENIAMINI ${collected.size} / 8`);tregua.setVisible(collected.size===8);};

          // Prima del Beniamino c'è sempre una prova. Questa prima implementazione
          // è già giocabile e usa una meccanica diversa per ogni territorio.
          const startTrial=(id:MapId)=>{
            if(trialOverlay||trialCompleted.has(id))return;
            trialStep=0;
            trialTime=id==="pozzo"||id==="madonnina"?90:id==="leondoro"?30:60;
            const def=MAPS[id];
            trialOverlay=scene.add.container(scene.scale.width/2,scene.scale.height/2).setScrollFactor(0).setDepth(60000);
            trialOverlay.add(scene.add.rectangle(0,0,Math.min(scene.scale.width-28,760),Math.min(scene.scale.height-28,460),0x17110d,.98).setStrokeStyle(3,def.accent,1));
            trialOverlay.add(scene.add.text(0,-185,def.label.toUpperCase()+"  •  PROVA",{fontFamily:FONT,fontSize:"24px",fontStyle:"bold",color:"#f7e7b0"}).setOrigin(.5));
            const info=scene.add.text(0,-145,"",{fontFamily:FONT,fontSize:"13px",color:"#fff",align:"center",wordWrap:{width:650}}).setOrigin(.5);
            trialOverlay.add(info);
            const status=scene.add.text(0,160,"",{fontFamily:FONT,fontSize:"16px",fontStyle:"bold",color:"#f4cf64"}).setOrigin(.5);
            trialOverlay.add(status);
            const close=scene.add.text(330,-185,"✕",{fontFamily:FONT,fontSize:"24px",color:"#fff"}).setOrigin(.5).setInteractive({useHandCursor:true});
            trialOverlay.add(close);
            close.on("pointerdown",()=>{trialTimer?.remove();trialOverlay?.destroy();trialOverlay=null;});

            const fail=()=>{
              trialTimer?.remove();
              status.setText("PROVA FALLITA — RIPROVA");
              scene.time.delayedCall(900,()=>{if(trialOverlay){trialOverlay.destroy();trialOverlay=null;}});
            };
            const win=()=>{
              trialTimer?.remove();
              trialCompleted.add(id);
              status.setText("✓ PROVA SUPERATA — IL BENIAMINO È SBLOCCATO");
              scene.time.delayedCall(900,()=>{if(trialOverlay){trialOverlay.destroy();trialOverlay=null;}});
            };

            if(id==="quercia"){
              info.setText("Segui i tre segni dorati nell'ordine corretto.");
              const order=[1,2,3];
              [1,2,3].forEach((n,i)=>{
                const b=scene.add.rectangle((i-1)*150,-30,120,90,def.accent,.25).setStrokeStyle(2,def.accent).setInteractive({useHandCursor:true});
                const t=scene.add.text((i-1)*150,-30,"SEGNO "+n,{fontFamily:FONT,fontSize:"15px",fontStyle:"bold",color:"#fff"}).setOrigin(.5);
                trialOverlay!.add([b,t]);
                b.on("pointerdown",()=>{if(n===order[trialStep]){trialStep++;status.setText("Segno "+trialStep+" / 3");if(trialStep===3)win();}else fail();});
              });
              status.setText("Segno 0 / 3");
            } else if(id==="pozzo"){
              info.setText("Ricostruisci il mistero: scegli Acqua → Pietra → Miccio.");
              const labels=["ACQUA","PIETRA","MICCIO"];
              labels.forEach((label,i)=>{
                const b=scene.add.rectangle((i-1)*150,-20,120,70,def.primary,.2).setStrokeStyle(2,def.accent).setInteractive({useHandCursor:true});
                trialOverlay!.add(b);trialOverlay!.add(scene.add.text((i-1)*150,-20,label,{fontFamily:FONT,fontSize:"13px",fontStyle:"bold",color:"#fff"}).setOrigin(.5));
                b.on("pointerdown",()=>{if(i===trialStep){trialStep++;status.setText("Traccia "+trialStep+" / 3");if(trialStep===3)win();}else fail();});
              });
              status.setText("Traccia 0 / 3");
            } else if(id==="leondoro"){
              info.setText("Sopravvivi per 30 secondi. Usa il movimento del personaggio.");
              status.setText("30 secondi");
              trialTimer=scene.time.addEvent({delay:100,loop:true,callback:()=>{
                trialTime-=.1;status.setText("SOPRAVVIVI  "+Math.max(0,trialTime).toFixed(1)+"s");
                if(trialTime<=0)win();
              }});
            } else {
              info.setText("Completa la prova della Contrada per sbloccare il Beniamino.");
              const b=scene.add.rectangle(0,20,230,72,def.accent,.3).setStrokeStyle(3,def.accent).setInteractive({useHandCursor:true});
              trialOverlay.add(b);trialOverlay.add(scene.add.text(0,20,"INIZIA PROVA",{fontFamily:FONT,fontSize:"18px",fontStyle:"bold",color:"#fff"}).setOrigin(.5));
              b.on("pointerdown",()=>win());
            }
          };

          const drawMap=(id:MapId)=>{
            const def=MAPS[id]; current=id;
            // Il container del terreno viene riutilizzato tra i territori:
            // svuotarlo evita che le mappe precedenti restino sovrapposte.
            ground.removeAll(true);
            mapCollisionObjects.forEach(o=>o.destroy());
            mapCollisionObjects=[];
            // Base del villaggio: tutto viene costruito con il tileset pixel-art.
            const tileRect=(tile:number,x:number,y:number,w:number,h:number)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)ground.putTileAt(tile,xx,yy);};
            tileRect(T.grass,0,0,COLS,ROWS);
            tileRect(T.path,14,0,4,24);
            tileRect(T.path,0,10,32,4);
            tileRect(T.plaza,11,8,10,8);
            if(id==="ranocchio"||id==="cervia")tileRect(T.darkGrass,0,0,12,9);
            if(id==="leondoro")tileRect(T.stone,7,16,18,6);
            if(id==="lucertola")tileRect(T.darkGrass,8,5,7,18);
            if(id==="pozzo")tileRect(T.stone,21,13,8,7);
            if(id==="madonnina")tileRect(T.flowers,2,15,9,7);
            if(id==="ponte"){tileRect(T.water,2,16,27,4);tileRect(T.bridge,20,9,11,3);}
            if(id==="quercia"){tileRect(T.flowerPatch,8,3,8,5);tileRect(T.darkGrass,22,16,8,6);}
            const blocked=new Set<string>();
            const block=(x:number,y:number,w:number,h:number)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)blocked.add(xx+","+yy);};
            const contradaBanner=(x:number,y:number,label:string)=>{              const c=scene.add.container(x*TILE,y*TILE).setDepth(y*TILE+80);              c.add(scene.add.rectangle(0,0,4,42,0x6b4933));              c.add(scene.add.rectangle(15,10,26,18,def.primary).setStrokeStyle(2,def.accent,.9));              c.add(scene.add.rectangle(15,10,26,6,def.secondary,.9));              c.add(scene.add.text(15,10,label,{fontFamily:FONT,fontSize:"6px",fontStyle:"bold",color:"#fff",stroke:"#241812",strokeThickness:3}).setOrigin(.5));              c.add(scene.add.triangle(28,10,0,18,10,0,18,18,def.accent).setOrigin(.5));            };            const stoneMarker=(x:number,y:number)=>{              scene.add.ellipse(x*TILE,y*TILE+10,28,14,0x77746d,.9).setStrokeStyle(2,def.secondary,.8).setDepth(y*TILE+20);              scene.add.ellipse(x*TILE,y*TILE+6,21,9,0xa7a39a,.95).setDepth(y*TILE+21);            };            const marbleBlock=(x:number,y:number)=>{              scene.add.rectangle(x*TILE,y*TILE,28,42,0xc9c5b9,.98).setStrokeStyle(2,0x77746d,.8).setDepth(y*TILE+20);              scene.add.rectangle(x*TILE-3,y*TILE-13,34,6,0xe1ded5).setDepth(y*TILE+21);              scene.add.line(x*TILE,y*TILE,0,0,20,38,0x9a978f,.7).setLineWidth(2).setDepth(y*TILE+22);            };            const path=(_x:number,_y:number,_w:number,_h:number)=>{};
                        const plaza=(_x:number,_y:number,_w:number,_h:number)=>{};
                        const house=(x:number,y:number,w:number,h:number,roof:number,label?:string)=>{
              const px=(x+w/2)*TILE,py=(y+h/2)*TILE;
              const key=label==="OSTERIA"?"house-osteria":"house-borgo";
              const img=scene.add.image(px,py+6,key).setOrigin(.5,1).setDepth((y+h)*TILE);
              img.setDisplaySize(w*TILE+8,h*TILE+18);
              if(label)scene.add.text(px,(y-4)*TILE,label,{fontFamily:FONT,fontSize:"7px",fontStyle:"bold",color:"#fff",stroke:"#241812",strokeThickness:4}).setOrigin(.5).setDepth((y+h)*TILE+20);
              const hit=scene.add.rectangle(px,py+8,w*TILE-8,h*TILE-8,0xffffff,0);
              scene.physics.add.existing(hit,true);scene.physics.add.collider(player,hit);mapCollisionObjects.push(hit);block(x,y,w,h);
            };
            const fence=(x:number,y:number,w:number,h:number)=>{ for(let yy=y;yy<y+h;yy++) ground.putTileAt(T.fence,x,yy); for(let xx=x;xx<x+w;xx++) ground.putTileAt(T.fence,xx,y); };
                        const bench=(x:number,y:number)=>{
              scene.add.rectangle(x*TILE,y*TILE,34,7,0x765036).setDepth(y*TILE+10);
              scene.add.rectangle(x*TILE-9,y*TILE+10,4,14,0x5d402d).setDepth(y*TILE+9);
              scene.add.rectangle(x*TILE+9,y*TILE+10,4,14,0x5d402d).setDepth(y*TILE+9);
            };

            // Mappa completa in pixel-art: un unico asset coerente, invece di primitive sparse.
            const mapBg=scene.add.image(WORLD_W/2,WORLD_H/2,`map-${id}`).setOrigin(.5).setDepth(1);
            mapBg.setDisplaySize(WORLD_W,WORLD_H);
            const trees:Array<[number,number]>=[[1,1],[10,2],[28,1],[1,22],[12,22],[29,21]];
            if(id==="cervia"||id==="ranocchio")trees.push([16,2],[27,22]);
            if(id==="lucertola")trees.push([12,6],[28,16]);
            if(id==="cervia")trees.push([12,18],[28,15]);
            trees.forEach(([x,y],i)=>{
              if(i<3) scene.add.image(x*TILE+TILE,y*TILE+TILE,"tree-large").setOrigin(.5,1).setDisplaySize(64,82).setDepth((y+2)*TILE);
              else { ground.putTileAt(i%3===0?T.darkTree:T.tree,x,y); ground.putTileAt(T.tree,x+1,y); }
            });
            // Piccoli dettagli ambientali: cespugli, fiori e pietre danno profondità alla mappa.
            const flowerSpots:Array<[number,number]>=[[10,5],[21,6],[9,17],[22,17],[2,12],[29,12]];
            flowerSpots.forEach(([x,y])=>ground.putTileAt(T.flowerPatch,x,y));
            [[2,8],[29,7],[10,22],[22,22]].forEach(([x,y])=>ground.putTileAt(T.stone,x,y));
            // Landmark della Contrada, sempre nello stesso territorio.
            const lx=(id==="cervia"?8:id==="leondoro"?26:id==="lucertola"?26:id==="madonnina"?24:id==="ponte"?25:id==="pozzo"?25:id==="ranocchio"?8:17)*TILE;
            const ly=(id==="cervia"?15:id==="leondoro"?15:id==="lucertola"?10:id==="madonnina"?14:id==="ponte"?9:id==="pozzo"?12:id==="ranocchio"?14:12)*TILE;
            const lm=scene.add.container(lx,ly).setDepth(ly+50);
            lm.add(scene.add.ellipse(0,18,54,15,0x2b211b,.22));
            if(id==="quercia"){lm.add(scene.add.circle(0,-5,25,0x355f3e).setStrokeStyle(3,def.primary));lm.add(scene.add.rectangle(-5,8,10,25,0x765036));}
            else if(id==="ranocchio"){lm.add(scene.add.circle(0,0,21,def.secondary).setStrokeStyle(3,def.primary));lm.add(scene.add.circle(-7,-5,4,0xffffff));lm.add(scene.add.circle(7,-5,4,0xffffff));}
            else if(id==="pozzo"){lm.add(scene.add.ellipse(0,4,35,20,0xb7b1a5).setStrokeStyle(3,def.secondary));lm.add(scene.add.rectangle(-2,-15,4,22,0x765036));}
            else if(id==="ponte"){lm.add(scene.add.rectangle(-18,3,8,20,0x8a5b3a));lm.add(scene.add.rectangle(10,3,8,20,0x8a5b3a));lm.add(scene.add.rectangle(-15,-5,30,7,def.primary));}
            else {lm.add(scene.add.rectangle(0,2,28,25,0xe6d8b7).setStrokeStyle(3,def.secondary));lm.add(scene.add.triangle(0,-18,0,25,14,0,28,25,def.primary));}
            scene.tweens.add({targets:lm,y:ly-2,duration:1500,yoyo:true,repeat:-1,ease:"Sine.easeInOut"});

            // NPC storici: ogni territorio ospita più personaggi, ciascuno dedicato a un capitolo diverso.
            const beni=beniById(def.beniamino);
            const npcs=NPCS.filter(n=>n.mapId===id);
            currentNpcData=npcs;
            currentNpcs=npcs.map((npc)=>{
              const [nx,ny]=npc.position;
              const img=scene.add.image(nx*TILE+16,ny*TILE+10,`player-${id}`).setScale(.58).setDepth(ny*TILE+30);
              const tag=scene.add.text(img.x,img.y-38,npc.nome,{fontFamily:FONT,fontSize:"8px",fontStyle:"bold",color:"#fff",backgroundColor:"#241812",padding:{x:4,y:3}}).setOrigin(.5).setDepth(1000);
              scene.tweens.add({targets:[img,tag],y:"-=2",duration:900,yoyo:true,repeat:-1,ease:"Sine.easeInOut"});
              img.setData("npcId",npc.id);
              return img;
            });
            if(beni){
              const bx=Math.max(3,Math.min(28,def.spawn.x+7)),by=Math.max(3,Math.min(20,def.spawn.y+1));
              currentBeni=scene.add.image(bx*TILE+16,by*TILE+10,`beni-${beni.id}`).setDisplaySize(54,54).setDepth(by*TILE+40);
              currentBeni.setVisible(!collected.has(beni.id));
              scene.tweens.add({targets:currentBeni,y:currentBeni.y-5,duration:700,yoyo:true,repeat:-1,ease:"Sine.easeInOut"});
            }
            def.exits.forEach((e)=>{
              const g=scene.add.container(e.x*TILE+16,e.y*TILE+16).setDepth(5000);
              g.add(scene.add.rectangle(0,0,42,26,def.accent,.25).setStrokeStyle(2,def.accent,.8));
              g.add(scene.add.text(0,-1,"➜",{fontFamily:FONT,fontSize:"16px",color:"#fff",fontStyle:"bold"}).setOrigin(.5));
              g.setData("exit",e);
            });
            scene.cameras.main.setBounds(0,0,WORLD_W,WORLD_H);
            scene.cameras.main.startFollow(player,true,.12,.12);
            mapTitle.setText(def.label.toUpperCase());
            locationText.setText(def.place);
            const zone=scene.add.container(WORLD_W/2,34).setDepth(7000);
            zone.add(scene.add.rectangle(0,0,430,52,0x241812,.92).setStrokeStyle(2,def.accent,.95));
            zone.add(scene.add.text(0,-7,def.label.toUpperCase(),{fontFamily:FONT,fontSize:"22px",fontStyle:"bold",color:"#f7e7b0",stroke:"#241812",strokeThickness:5}).setOrigin(.5));
            zone.add(scene.add.text(0,13,def.place.toUpperCase(),{fontFamily:FONT,fontSize:"10px",fontStyle:"bold",letterSpacing:2,color:"#ffffff",stroke:"#241812",strokeThickness:3}).setOrigin(.5));
            scene.tweens.add({targets:zone,alpha:0,duration:900,delay:3500,ease:"Sine.easeInOut"});
            if(currentBeni)currentBeni.setData("map",id);

            // Segnali narrativi nel mondo: piccoli punti interattivi che guidano
            // il giocatore verso la prova senza trasformare gli NPC in semplici waypoint.
            const clueSpots:Record<MapId,Array<{x:number;y:number;text:string}>>={
              quercia:[
                {x:9,y:6,text:"Un segno dorato è inciso sulla corteccia.\n\n\"Non seguire il sentiero più corto.\""},
                {x:18,y:17,text:"Secondo segno: tre graffi dorati indicano il bosco."},
                {x:26,y:19,text:"Terzo segno.\n\nLa Quercia Antica è vicina."}
              ],
              cervia:[
                {x:12,y:8,text:"Una pietra porta il simbolo della campana.\n\n\"Guarda sopra di te.\""}
              ],
              pozzo:[
                {x:23,y:15,text:"Traccia I — acqua."},
                {x:26,y:16,text:"Traccia II — pietra."},
                {x:28,y:18,text:"Traccia III — Miccio."}
              ],
              leondoro:[{x:18,y:18,text:"Graffi profondi nella pietra.\n\nIl Leone è passato di qui."}],
              ranocchio:[{x:20,y:18,text:"Petali dorati sulla ninfea.\n\nIl prossimo salto è quello sicuro."}],
              ponte:[{x:23,y:11,text:"Le tavole mostrano un ritmo: sicura, sicura, pausa."}],
              madonnina:[{x:7,y:17,text:"Un simbolo appare tra il fieno.\n\nMemorizzalo."}],
              lucertola:[{x:18,y:13,text:"Un'incisione sulla pietra indica una sola delle due strade."}]
            };
            (clueSpots[id]||[]).forEach((clue)=>{
              const marker=scene.add.container(clue.x*TILE+16,clue.y*TILE+12).setDepth(6500);
              marker.add(scene.add.circle(0,0,10,def.accent,.22).setStrokeStyle(2,def.accent,.9));
              marker.add(scene.add.text(0,0,"?",{fontFamily:FONT,fontSize:"12px",fontStyle:"bold",color:"#fff"}).setOrigin(.5));
              marker.setData("clueText",clue.text);
              scene.tweens.add({targets:marker,alpha:{from:0.65,to:1},duration:700,yoyo:true,repeat:-1});
              marker.setInteractive(new Phaser.Geom.Circle(0,0,14),Phaser.Geom.Circle.Contains);
              marker.on("pointerdown",()=>say(clue.text));
            });
          };

          player=scene.physics.add.sprite(MAPS.quercia.spawn.x*TILE,MAPS.quercia.spawn.y*TILE,"player-quercia");
          player.setScale(.72).setCollideWorldBounds(true);
          const body=player.body as Phaser.Physics.Arcade.Body;body.setSize(22,18).setOffset(13,40);
          usernameText=scene.add.text(player.x,player.y-55,username,{fontFamily:FONT,fontSize:mobile?"10px":"11px",color:"#fff",fontStyle:"bold",stroke:"#17110d",strokeThickness:5,backgroundColor:"#241812",padding:{x:5,y:3}}).setOrigin(.5).setDepth(20000);

          const hud=scene.add.container(18,18).setScrollFactor(0).setDepth(9000);
          hud.add(scene.add.rectangle(0,0,300,104,0x2b1c14,.94).setOrigin(0).setStrokeStyle(2,0xd4af37));
          hud.add(scene.add.text(15,10,"TREGUA TRA CONTRADE",{fontFamily:FONT,fontSize:"15px",color:"#f4cf64",fontStyle:"bold"}));
          progress=scene.add.text(15,36,"BENIAMINI 0 / 8",{fontFamily:FONT,fontSize:"21px",color:"#fff",fontStyle:"bold"});hud.add(progress);
          mapTitle=scene.add.text(15,67,"LA QUERCIA",{fontFamily:FONT,fontSize:"12px",color:"#f4cf64",fontStyle:"bold"});hud.add(mapTitle);
          locationText=scene.add.text(105,67,"Querceta",{fontFamily:FONT,fontSize:"12px",color:"#eadfce"});hud.add(locationText);
          hud.add(scene.add.text(15,87,mobile?"🕹️ Muovi · E interagisci":"WASD / FRECCE · E per interagire",{fontFamily:FONT,fontSize:"10px",color:"#eadfce"}));

          const world=scene.add.container(scene.scale.width-118,92).setScrollFactor(0).setDepth(11000);
          world.add(scene.add.rectangle(0,0,210,125,0x16251b,.92).setStrokeStyle(2,0xd4af37));
          world.add(scene.add.text(-95,-52,"8 TERRITORI",{fontFamily:FONT,fontSize:"11px",color:"#f4cf64",fontStyle:"bold"}));
          const pts:Record<MapId,[number,number]>={quercia:[0,0],ranocchio:[-35,-35],leondoro:[35,-35],lucertola:[70,-5],pozzo:[80,35],madonnina:[35,45],cervia:[-10,70],ponte:[-65,45]};
          (Object.keys(pts) as MapId[]).forEach(id=>{const [x,y]=pts[id],d=MAPS[id];world.add(scene.add.circle(x,y,6,d.secondary).setStrokeStyle(2,d.primary));world.add(scene.add.text(x,y+9,d.label.replace("Il ","").replace("La ",""),{fontFamily:FONT,fontSize:"7px",color:"#fff"}).setOrigin(.5));});
          worldDots=world;

          dialog=scene.add.container(scene.scale.width/2,scene.scale.height-78).setScrollFactor(0).setDepth(12000).setVisible(false);
          dialog.add(scene.add.rectangle(0,0,760,108,0x241812,.97).setStrokeStyle(3,0xd4af37));
          dialog.add(scene.add.text(-350,-38,"",{fontFamily:FONT,fontSize:"15px",color:"#fff",wordWrap:{width:700},lineSpacing:5}));

          tregua=scene.add.container(scene.scale.width/2,18).setScrollFactor(0).setDepth(9500).setVisible(false);
          const tb=scene.add.rectangle(0,0,250,42,0xd4af37).setStrokeStyle(2,0x5c3a21).setInteractive({useHandCursor:true});
          tregua.add(tb);tregua.add(scene.add.text(0,0,"🤝 CERCA IL BARONE",{fontFamily:FONT,fontSize:"15px",color:"#3b2617",fontStyle:"bold"}).setOrigin(.5));tb.on("pointerdown",()=>window.location.href="/tregua");

          const transition=async(id:MapId,spawn?:{x:number;y:number})=>{
            if(current===id)return;
            scene.cameras.main.fadeOut(180,0,0,0);
            await new Promise(r=>scene.time.delayedCall(190,r));
            currentNpcs.forEach(n=>n.destroy()); currentNpcs=[];
            currentNpcData=[];
            if(currentBeni)currentBeni.destroy(); currentBeni=null;
            // Ogni territorio è una mappa separata: prima di caricare la nuova
            // eliminiamo solo gli oggetti del mondo, mantenendo player e HUD.
            const keep = new Set<any>([player, usernameText, hud, world, dialog, tregua, mobileUi, act, ground]);
            scene.children.list.slice().forEach((o:any)=>{if(!keep.has(o))o.destroy();});
            current=id; const s=spawn||MAPS[id].spawn;
            player.setPosition(s.x*TILE+16,s.y*TILE+16);
            drawMap(id); player.setTexture(`player-${contradaId||"quercia"}`);
            scene.cameras.main.fadeIn(220,0,0,0);say(`Sei entrato nel territorio di ${MAPS[id].label}, ${MAPS[id].place}.`);
          };

          const interact=async()=>{
            const def=MAPS[current];
            if(currentBeni&&currentBeni.visible&&Phaser.Math.Distance.Between(player.x,player.y,currentBeni.x,currentBeni.y)<85){
              if(!trialCompleted.has(def.beniamino)){startTrial(current);return;}
              if(!userId){say("Devi accedere per salvare il Beniamino.");return;}
              const id=def.beniamino;const {error}=await supabase.from("user_beniamini").insert({user_id:userId,beniamino_id:id});
              if(error&&error.code!=="23505"){say("Errore nel salvataggio.");return;}
              collected.add(id);currentBeni.setVisible(false);updateProgress();const b=beniById(id);if(b)say(`✨ Hai trovato ${b.nome}! ${collected.size===8?"Hai completato la raccolta. Ora cerca un giocatore di un'altra Contrada.":""}`);return;
            }
            if(currentNpcs.length){
              let nearestIndex=-1,nearest=Infinity;
              currentNpcs.forEach((npc,index)=>{
                const d=Phaser.Math.Distance.Between(player.x,player.y,npc.x,npc.y);
                if(d<nearest){nearest=d;nearestIndex=index;}
              });
              if(nearestIndex>=0&&nearest<90){
                const npc=currentNpcData[nearestIndex];
                say(`${npc.nome}: ${npc.text}\\n\\n${npc.clue}`);
                return;
              }
            }
            for(const e of def.exits){const ex=e.x*TILE+16,ey=e.y*TILE+16;if(Phaser.Math.Distance.Between(player.x,player.y,ex,ey)<72){const target=MAPS[e.target];const incoming=target.exits.find(x=>x.target===current);await transition(e.target,incoming?{x:incoming.x+(incoming.x===0?2:incoming.x===COLS-1?-2:0),y:incoming.y+(incoming.y===0?2:incoming.y===ROWS-1?-2:0)}:target.spawn);return;}}
          };

          const keys=scene.input.keyboard?.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT,E,SPACE,SHIFT") as Record<string,Phaser.Input.Keyboard.Key>|undefined;
          // Joystick touch: il punto critico è usare coordinate SCHERMO, non coordinate
          // trasformate dalla camera. Il controllo resta quindi stabile anche con resize/zoom.
          const mobileUi=scene.add.container(92,scene.scale.height-195).setScrollFactor(0).setDepth(50000).setVisible(mobile);
          const jb=scene.add.circle(0,0,76,0x171717,.84).setStrokeStyle(3,0xffffff,.5);
          const jk=scene.add.circle(0,0,30,0xd4af37,.98).setStrokeStyle(2,0xffffff,.75);
          jb.setInteractive(new Phaser.Geom.Circle(0,0,76),Phaser.Geom.Circle.Contains);
          mobileUi.add([jb,jk]);

          const act=scene.add.container(scene.scale.width-90,scene.scale.height-190).setScrollFactor(0).setDepth(50000).setVisible(mobile);
          const ab=scene.add.circle(0,0,42,0x8b3f2f,.92).setStrokeStyle(3,0xffffff,.35).setInteractive();
          act.add([ab,scene.add.text(0,0,"E",{fontFamily:FONT,fontSize:"24px",color:"#fff",fontStyle:"bold"}).setOrigin(.5)]);
          ab.on("pointerdown",()=>void interact());

          const updateJoystick=(p:Phaser.Input.Pointer)=>{
            const dx=p.x-mobileUi.x;
            const dy=p.y-mobileUi.y;
            const max=50;
            const len=Math.hypot(dx,dy);
            const scale=len>max?max/len:1;
            joyX=(dx*scale)/max;
            joyY=(dy*scale)/max;
            jk.setPosition(dx*scale,dy*scale);
          };
          const releaseJoystick=(p:Phaser.Input.Pointer)=>{
            if(p.id!==joyPointer)return;
            joyPointer=null;
            joyX=0;
            joyY=0;
            jk.setPosition(0,0);
          };

          jb.on("pointerdown",(p:Phaser.Input.Pointer)=>{
            if(!mobile || joyPointer!==null)return;
            joyPointer=p.id;
            if(p.event && "preventDefault" in p.event) (p.event as any).preventDefault();
            updateJoystick(p);
          });
          scene.input.on("pointermove",(p:Phaser.Input.Pointer)=>{if(p.id===joyPointer)updateJoystick(p);});
          scene.input.on("pointerup",releaseJoystick);
          scene.input.on("pointerupoutside",releaseJoystick);

          const setPlayer=(id:string)=>{contradaId=MAPS[id as MapId]?id:"quercia";player.setTexture(`player-${contradaId}`);};
          scene.events.on("update",(_t:number,delta:number)=>{
            const dt=Math.min(delta,32);
            let x=joyX,y=joyY;
            if(!keys && !mobile)return;

            if(keys){
              if(keys.A.isDown||keys.LEFT.isDown)x--;
              if(keys.D.isDown||keys.RIGHT.isDown)x++;
              if(keys.W.isDown||keys.UP.isDown)y--;
              if(keys.S.isDown||keys.DOWN.isDown)y++;
            }
            const l=Math.hypot(x,y);if(l>1){x/=l;y/=l;}
            const moving=Math.abs(x)+Math.abs(y)>.05;
            const sprint=keys && keys.SHIFT.isDown;
            player.setVelocity(x*(sprint?190:135),y*(sprint?190:135));
            player.setDepth(player.y);usernameText.setPosition(player.x,player.y-55);
            if(moving){player.setScale(.72,.69);if(Math.abs(x)>Math.abs(y))player.setFlipX(x<0);else player.setFlipX(false);}else{player.setScale(.72);player.setFlipX(false);}
            if(keys && (Phaser.Input.Keyboard.JustDown(keys.E)||Phaser.Input.Keyboard.JustDown(keys.SPACE)))void interact();
            const def=MAPS[current];for(const e of def.exits){const ex=e.x*TILE+16,ey=e.y*TILE+16;if(Phaser.Math.Distance.Between(player.x,player.y,ex,ey)<42){say(`➜ ${e.label}. Premi E.`);break;}}
          });

          const load=async()=>{
            const {data:{user}}=await supabase.auth.getUser();if(!user){say("Accedi per salvare la tua raccolta.");drawMap("quercia");return;}userId=user.id;
            const {data:profile}=await supabase.from("profiles").select("username,contrada_id").eq("id",user.id).maybeSingle();
            if(profile){username=profile.username||"Contradaiolo";setPlayer(profile.contrada_id||"quercia");}
            const {data}=await supabase.from("user_beniamini").select("beniamino_id").eq("user_id",user.id);
            (data??[]).forEach((r:{beniamino_id:string})=>{if(MAPS[r.beniamino_id as MapId])collected.add(r.beniamino_id);});
            updateProgress();drawMap("quercia");scene.cameras.main.fadeIn(400,0,0,0);
          };
          const resize=()=>{tregua.setPosition(scene.scale.width/2,18);dialog.setPosition(scene.scale.width/2,scene.scale.height-78);mobileUi.setPosition(92,scene.scale.height-195);act.setPosition(scene.scale.width-90,scene.scale.height-190);world.setPosition(scene.scale.width-118,92);};
          scene.scale.on("resize",resize);resize();void load();
        }
      }
    };
    const game=new Phaser.Game(config);
    game.canvas.style.touchAction="none";
    return()=>game.destroy(true);
  },[]);
  return <div ref={root} className="fixed inset-0 overflow-hidden bg-black"/>;
}
