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
      type:Phaser.AUTO,parent:root.current,width:960,height:540,pixelArt:true,backgroundColor:"#6f9f58",
      scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH},render:{antialias:false,roundPixels:true},
      physics:{default:"arcade",arcade:{debug:false}},
      scene:{
        preload(this:Phaser.Scene){
          this.load.image("tiles","/game/rpg-tileset.svg");
          ["cervia","leondoro","lucertola","madonnina","ponte","pozzo","quercia","ranocchio"].forEach(id=>this.load.image(`player-${id}`,`/game/player-${id}.svg`));
          this.load.image("npc","/game/npc.svg");
          BENIAMINI_MAPPA.forEach(b=>this.load.image(`beni-${b.id}`,b.image));
        },
        create(this:Phaser.Scene){
          const scene=this, WORLD_W=COLS*TILE, WORLD_H=ROWS*TILE;
          const mobile=window.innerWidth<768||"ontouchstart"in window||navigator.maxTouchPoints>0||/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
          scene.physics.world.setBounds(0,0,WORLD_W,WORLD_H);
          scene.cameras.main.setBounds(0,0,WORLD_W,WORLD_H).setZoom(mobile?1.85:2);
          const map=scene.make.tilemap({tileWidth:TILE,tileHeight:TILE,width:COLS,height:ROWS});
          const tiles=map.addTilesetImage("rpg-tileset","tiles",TILE,TILE,0,0,1); if(!tiles)return;
          const ground=map.createBlankLayer("ground",tiles,0,0,COLS,ROWS,TILE,TILE); if(!ground)return;

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
          let joyX=0,joyY=0,joyPointer:number|null=null;

          const say=(s:string)=>{timer?.remove();const text=dialog.getAt(1) as Phaser.GameObjects.Text;text.setText(s);dialog.setVisible(true);timer=scene.time.delayedCall(5000,()=>dialog.setVisible(false));};
          const updateProgress=()=>{progress.setText(`BENIAMINI ${collected.size} / 8`);tregua.setVisible(collected.size===8);};

          const drawMap=(id:MapId)=>{
            const def=MAPS[id]; current=id;
            ground.fill(0);
            ground.fill(2,14,0,4,ROWS);
            ground.fill(2,0,10,COLS,4);
            ground.fill(2,4,5,24,2);
            ground.fill(2,7,20,21,2);
            ground.fill(3,12,8,8,8);
            if(id==="cervia"||id==="ponte"){ground.fill(4,2,15,7,5);ground.fill(5,4,17,3,2);}
            if(id==="pozzo"){ground.fill(3,22,3,6,6);}
            if(id==="lucertola"){ground.fill(4,19,1,8,5);}
            if(id==="ranocchio"||id==="cervia"){ground.fill(12,2,2,7,5);}
            // Ogni mappa ha una piccola "città" leggibile: strada principale, piazza, vicoli, case, verde e un punto d'interesse.
            mapCollisionObjects.forEach(o=>o.destroy());
            mapCollisionObjects=[];

            ground.fill(0);
            ground.fill(2,14,0,4,ROWS);
            ground.fill(2,0,10,COLS,4);

            const blocked=new Set<string>();
            const block=(x:number,y:number,w:number,h:number)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)blocked.add(xx+","+yy);};
            const contradaBanner=(x:number,y:number,label:string)=>{              const c=scene.add.container(x*TILE,y*TILE).setDepth(y*TILE+80);              c.add(scene.add.rectangle(0,0,4,42,0x6b4933));              c.add(scene.add.rectangle(15,10,26,18,def.primary).setStrokeStyle(2,def.accent,.9));              c.add(scene.add.rectangle(15,10,26,6,def.secondary,.9));              c.add(scene.add.text(15,10,label,{fontFamily:"Arial",fontSize:"6px",fontStyle:"bold",color:"#fff",stroke:"#241812",strokeThickness:3}).setOrigin(.5));              c.add(scene.add.triangle(28,10,0,18,10,0,18,18,def.accent).setOrigin(.5));            };            const stoneMarker=(x:number,y:number)=>{              scene.add.ellipse(x*TILE,y*TILE+10,28,14,0x77746d,.9).setStrokeStyle(2,def.secondary,.8).setDepth(y*TILE+20);              scene.add.ellipse(x*TILE,y*TILE+6,21,9,0xa7a39a,.95).setDepth(y*TILE+21);            };            const marbleBlock=(x:number,y:number)=>{              scene.add.rectangle(x*TILE,y*TILE,28,42,0xc9c5b9,.98).setStrokeStyle(2,0x77746d,.8).setDepth(y*TILE+20);              scene.add.rectangle(x*TILE-3,y*TILE-13,34,6,0xe1ded5).setDepth(y*TILE+21);              scene.add.line(x*TILE,y*TILE,0,0,20,38,0x9a978f,.7).setLineWidth(2).setDepth(y*TILE+22);            };            const path=(x:number,y:number,w:number,h:number)=>{
              scene.add.rectangle((x+w/2)*TILE,(y+h/2)*TILE,w*TILE,h*TILE,0xd9c79f,.96).setDepth(1);
              scene.add.rectangle((x+w/2)*TILE,(y+h/2)*TILE,w*TILE-6,h*TILE-6,0xe7d6b1,.22).setDepth(2);
              if(w>h){
                for(let xx=x;xx<x+w;xx+=2){
                  scene.add.rectangle((xx+.5)*TILE,(y+h/2)*TILE,15,2,0xa58c66,.26).setDepth(3);
                }
              } else {
                for(let yy=y;yy<y+h;yy+=2)scene.add.rectangle((x+w/2)*TILE,(yy+.5)*TILE,2,15,0xa58c66,.22).setDepth(3);
              }
            };
            const plaza=(x:number,y:number,w:number,h:number)=>{
              scene.add.rectangle((x+w/2)*TILE,(y+h/2)*TILE,w*TILE,h*TILE,0xe1d2ad,.96).setDepth(1);
              scene.add.rectangle((x+w/2)*TILE,(y+h/2)*TILE,w*TILE-10,h*TILE-10,0xd2bd91,.35).setDepth(2).setStrokeStyle(2,0xb3986c,.55);
            };
            const house=(x:number,y:number,w:number,h:number,roof:number,label?:string)=>{
              const px=(x+w/2)*TILE,py=(y+h/2)*TILE;
              scene.add.ellipse(px,(y+h+.35)*TILE,w*TILE-4,13,0x241b16,.24).setDepth(y*TILE);
              scene.add.rectangle(px,py,w*TILE-5,h*TILE-4,0xead9b9).setDepth(y*TILE+8);
              scene.add.rectangle(px,py+5,w*TILE-9,h*TILE-11,0xd8c09b,.32).setDepth(y*TILE+9);
              scene.add.triangle(px,(y-9)*TILE,0,38,w*TILE/2,0,w*TILE,38,roof).setOrigin(.5).setDepth(y*TILE+7);
              scene.add.triangle(px,(y-5)*TILE,0,28,w*TILE/2,0,w*TILE,28,roof).setOrigin(.5).setAlpha(.28).setDepth(y*TILE+8);
              // Tegole / bordo del tetto.
              for(let i=0;i<w;i+=2)scene.add.rectangle((x+i+1)*TILE,(y+0.65)*TILE,18,3,0x5a3c2d,.45).setDepth(y*TILE+10);
              // Finestre con cornice e riflesso.
              for(const wx of [x+w*.3,x+w*.7]){
                scene.add.rectangle(wx*TILE,(y+h*.5)*TILE,20,18,0x765036).setDepth(y*TILE+11);
                scene.add.rectangle(wx*TILE,(y+h*.5)*TILE,15,13,0x9ed5d5).setDepth(y*TILE+12);
                scene.add.rectangle(wx*TILE,(y+h*.5)*TILE,2,13,0x6c8e8f).setDepth(y*TILE+13);
                scene.add.rectangle(wx*TILE,(y+h*.5)*TILE,15,2,0xdaf2e8,.7).setDepth(y*TILE+13);
              }
              // Porta.
              scene.add.rectangle(px,(y+h*.69)*TILE,14,25,0x74492f).setDepth(y*TILE+12);
              scene.add.rectangle(px-2,(y+h*.67)*TILE,3,3,0xd4af37).setDepth(y*TILE+13);
              if(label)scene.add.text(px,(y-20)*TILE,label,{fontFamily:"Arial",fontSize:"7px",fontStyle:"bold",color:"#fff",stroke:"#241812",strokeThickness:4}).setOrigin(.5).setDepth(y*TILE+20);
              const hit=scene.add.rectangle(px,py,w*TILE-8,h*TILE-4,0xffffff,0);
              scene.physics.add.existing(hit,true);scene.physics.add.collider(player,hit);mapCollisionObjects.push(hit);block(x,y,w,h);
            };
            const fence=(x:number,y:number,w:number,h:number)=>{
              for(let yy=y;yy<y+h;yy+=2)scene.add.rectangle(x*TILE+10,(yy+.5)*TILE,4,24,0x765036).setDepth(yy*TILE+10);
              for(let xx=x;xx<x+w;xx+=2)scene.add.rectangle((xx+.5)*TILE,y*TILE+10,24,4,0x765036).setDepth(y*TILE+10);
            };
            const bench=(x:number,y:number)=>{
              scene.add.rectangle(x*TILE,y*TILE,34,7,0x765036).setDepth(y*TILE+10);
              scene.add.rectangle(x*TILE-9,y*TILE+10,4,14,0x5d402d).setDepth(y*TILE+9);
              scene.add.rectangle(x*TILE+9,y*TILE+10,4,14,0x5d402d).setDepth(y*TILE+9);
            };

            path(14,0,4,24);path(0,10,32,4);plaza(11,8,10,8);            contradaBanner(10,7,def.label.replace("La ","").replace("Il ","").slice(0,8));            contradaBanner(22,13,def.label.replace("La ","").replace("Il ","").slice(0,8));

            const roofs=[def.secondary,def.accent,0x9b6845];
            if(id==="quercia"){
              house(3,3,6,4,roofs[0],"BORGO");house(23,3,6,4,roofs[1],"BOTTEGA");house(3,18,6,4,roofs[2],"OSTERIA");house(23,18,6,4,def.secondary,"SEDE");
              path(4,7,24,2);path(7,14,18,2);fence(1,17,5,4);bench(9,11);              scene.add.circle(17*TILE,12*TILE,30,0x355f3e,.85).setStrokeStyle(3,def.primary,.9).setDepth(5);              scene.add.rectangle(17*TILE,14*TILE,10,34,0x765036).setDepth(6);              scene.add.text(17*TILE,9*TILE,"QUERCIA", {fontFamily:"Arial",fontSize:"7px",fontStyle:"bold",color:"#fff",stroke:"#241812",strokeThickness:3}).setOrigin(.5).setDepth(7);
            } else if(id==="ranocchio"){
              house(3,3,6,4,roofs[0],"CASA");house(23,3,6,4,roofs[1],"FIENILE");house(4,18,6,4,roofs[2],"CASCINA");
              path(6,7,20,2);path(8,14,16,2);fence(22,17,7,4);bench(11,11);
              scene.add.ellipse(7*TILE,17*TILE,70,42,0x79a95d,.7).setStrokeStyle(3,def.secondary,.6).setDepth(3);
              scene.add.circle(7*TILE,17*TILE,10,0x3d7d45).setDepth(4);              scene.add.ellipse(17*TILE,19*TILE,120,42,0x739f54,.72).setDepth(2);              scene.add.text(17*TILE,19*TILE,"CUGNIA", {fontFamily:"Arial",fontSize:"9px",fontStyle:"bold",color:"#fff",stroke:"#31502b",strokeThickness:4}).setOrigin(.5).setDepth(4);              contradaBanner(16,17,"RANOCCHIO");
            } else if(id==="leondoro"){
              house(3,3,6,4,roofs[0],"CAFAGGIO");house(23,3,6,4,roofs[1],"MARZOCCHINO");house(3,18,6,4,roofs[2],"BOTTEGA");
              path(6,7,20,2);path(8,14,16,2);fence(22,17,7,4);bench(11,11);
              for(let i=0;i<4;i++)marbleBlock(8+i*5,17);              stoneMarker(13,12);stoneMarker(18,12);              scene.add.text(15*TILE,12*TILE,"BARAGLINO", {fontFamily:"Arial",fontSize:"8px",fontStyle:"bold",color:"#fff",stroke:"#241812",strokeThickness:4}).setOrigin(.5).setDepth(6);
            } else if(id==="lucertola"){
              house(3,3,6,4,roofs[0],"RIPA");house(23,3,6,4,roofs[1],"MARGINETTA");house(4,18,6,4,roofs[2],"CASA");
              path(6,7,20,2);path(8,14,16,2);fence(1,17,7,4);bench(23,12);
              scene.add.rectangle(25*TILE,14*TILE,48,10,0xc4b08d,.9).setDepth(5).setStrokeStyle(2,def.primary,.7);
              scene.add.text(25*TILE,14*TILE,"RIPA",{fontFamily:"Arial",fontSize:"8px",fontStyle:"bold",color:"#fff",stroke:"#241812",strokeThickness:3}).setOrigin(.5).setDepth(6);              scene.add.circle(16*TILE,18*TILE,20,0xe6d8b7).setStrokeStyle(3,def.secondary).setDepth(5);              scene.add.triangle(16*TILE,14*TILE,0,22,12,0,24,22,def.primary).setOrigin(.5).setDepth(6);              scene.add.text(16*TILE,19*TILE,"MARGINETTA",{fontFamily:"Arial",fontSize:"6px",fontStyle:"bold",color:"#fff",stroke:"#241812",strokeThickness:3}).setOrigin(.5).setDepth(7);
            } else if(id==="pozzo"){
              house(3,3,6,4,roofs[0],"POZZI");house(23,3,6,4,roofs[1],"BOTTEGA");house(4,18,6,4,roofs[2],"CASA");
              path(6,7,20,2);path(8,14,16,2);bench(11,11);fence(22,17,7,4);
              scene.add.ellipse(25*TILE,17*TILE,52,28,0xb7b1a5,.95).setStrokeStyle(4,def.secondary).setDepth(5);
              scene.add.ellipse(25*TILE,16*TILE,35,14,0x304a55,.9).setDepth(6);
              scene.add.text(25*TILE,18*TILE,"POZZO",{fontFamily:"Arial",fontSize:"7px",fontStyle:"bold",color:"#fff",stroke:"#241812",strokeThickness:3}).setOrigin(.5).setDepth(7);              scene.add.rectangle(25*TILE,13*TILE,4,38,0x765036).setDepth(7);              scene.add.rectangle(22*TILE,13*TILE,10,4,0x765036).setDepth(7);
            } else if(id==="madonnina"){
              house(3,3,6,4,roofs[0],"PAGLIAIO");house(23,3,6,4,roofs[1],"BORGO");house(3,18,6,4,roofs[2],"CASA");house(23,18,6,4,def.secondary,"CHIESINA");
              path(6,7,20,2);path(8,14,16,2);bench(11,11);fence(17,18,4,4);
              scene.add.circle(25*TILE,17*TILE,22,0xe6d8b7).setStrokeStyle(3,def.secondary).setDepth(5);
              scene.add.triangle(25*TILE,14*TILE,0,25,14,0,28,25,def.primary).setOrigin(.5).setDepth(6);              for(let i=0;i<5;i++)scene.add.rectangle((11+i)*TILE,18*TILE,10,28,0xd5b26c,.8).setDepth(4);              scene.add.text(25*TILE,18*TILE,"CHIESINA",{fontFamily:"Arial",fontSize:"6px",fontStyle:"bold",color:"#fff",stroke:"#241812",strokeThickness:3}).setOrigin(.5).setDepth(7);
            } else if(id==="cervia"){
              house(3,3,6,4,roofs[0],"MONTISCENDI");house(23,3,6,4,roofs[1],"TORRE");house(18,18,7,4,roofs[2],"SEDE");
              path(6,7,20,2);path(8,14,16,2);fence(1,17,8,4);bench(11,11);
              scene.add.rectangle(8*TILE,15*TILE,18,55,0x8b6a48).setDepth(5).setStrokeStyle(3,def.secondary);
              scene.add.rectangle(8*TILE,10*TILE,46,20,0xd8d0bd).setDepth(6);
              scene.add.text(8*TILE,10*TILE,"PORTA BELTRAME",{fontFamily:"Arial",fontSize:"6px",fontStyle:"bold",color:"#fff",stroke:"#241812",strokeThickness:3}).setOrigin(.5).setDepth(7);              scene.add.rectangle(27*TILE,14*TILE,24,70,0xb7a88f).setDepth(5).setStrokeStyle(3,def.secondary);              scene.add.triangle(27*TILE,8*TILE,0,20,12,0,24,20,def.secondary).setOrigin(.5).setDepth(6);              scene.add.text(27*TILE,17*TILE,"TORRE MEDICEA",{fontFamily:"Arial",fontSize:"6px",fontStyle:"bold",color:"#fff",stroke:"#241812",strokeThickness:3}).setOrigin(.5).setDepth(7);
            } else {
              house(3,3,6,4,roofs[0],"VAIANA");house(23,3,6,4,roofs[1],"MAGAZZENO");house(19,18,7,4,roofs[2],"SEDE");
              path(6,7,20,2);path(8,14,16,2);bench(11,11);fence(1,17,7,4);
              scene.add.rectangle(25*TILE,10*TILE,70,12,0x765036).setDepth(5);
              scene.add.rectangle(25*TILE,9*TILE,58,6,def.primary).setDepth(6);
              scene.add.rectangle(25*TILE,11*TILE,58,6,def.secondary).setDepth(6);
              scene.add.text(25*TILE,8*TILE,"PONTE DI TAVOLE",{fontFamily:"Arial",fontSize:"7px",fontStyle:"bold",color:"#fff",stroke:"#241812",strokeThickness:3}).setOrigin(.5).setDepth(7);              scene.add.rectangle(8*TILE,17*TILE,18*TILE,3*TILE,0x4d91ad,.65).setDepth(2);              for(let i=0;i<6;i++)scene.add.rectangle((3+i*5)*TILE,17*TILE,4,10,0x8fd0dc,.7).setDepth(3);
            }

            const trees:Array<[number,number]>=[[1,1],[10,2],[28,1],[1,22],[12,22],[29,21]];
            if(id==="cervia"||id==="ranocchio")trees.push([16,2],[27,22]);
            if(id==="lucertola")trees.push([12,6],[28,16]);
            if(id==="cervia")trees.push([12,18],[28,15]);
            trees.forEach(([x,y],i)=>{
              const tx=x*TILE+16,ty=y*TILE+24,c=scene.add.container(tx,ty).setDepth(ty+30);
              c.add(scene.add.ellipse(0,17,48,14,0x26351f,.24));
              c.add(scene.add.rectangle(0,7,12,28,0x765036));
              c.add(scene.add.circle(-12,-10,20,i%2?0x326d43:0x2f7045));
              c.add(scene.add.circle(2,-18,25,i%2?0x3e8750:0x377b49));
              c.add(scene.add.circle(15,-8,19,i%2?0x2e7044:0x438a52));
            });
            for(let i=0;i<5;i++){const x=(3+i*6)%29+1,y=(5+i*4)%16+6;ground.putTileAt(i%2?10:14,x,y);}
            // Piccoli dettagli ambientali: cespugli, fiori e pietre danno profondità alla mappa.
            const flowerSpots:Array<[number,number]>=[[10,5],[21,6],[9,17],[22,17],[2,12],[29,12]];
            flowerSpots.forEach(([x,y],i)=>{
              const col=i%2?0xe8c85a:0xd86f7b;
              scene.add.circle(x*TILE+9,y*TILE+20,3,col).setDepth(y*TILE+12);
              scene.add.circle(x*TILE+15,y*TILE+18,3,col).setDepth(y*TILE+12);
              scene.add.rectangle(x*TILE+12,y*TILE+25,2,9,0x4f8a4d).setDepth(y*TILE+11);
            });
            [[2,8],[29,7],[10,22],[22,22]].forEach(([x,y])=>{
              scene.add.ellipse(x*TILE+16,y*TILE+25,22,10,0x817967,.7).setDepth(y*TILE+10);
              scene.add.ellipse(x*TILE+12,y*TILE+23,9,4,0xc3bca9,.7).setDepth(y*TILE+11);
            });
            scene.add.rectangle(16*TILE,12*TILE,7*TILE,5*TILE,def.secondary,.08).setDepth(2);

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
              const tag=scene.add.text(img.x,img.y-38,npc.nome,{fontFamily:"Arial",fontSize:"8px",fontStyle:"bold",color:"#fff",backgroundColor:"#241812",padding:{x:4,y:3}}).setOrigin(.5).setDepth(1000);
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
              g.add(scene.add.text(0,-1,"➜",{fontFamily:"Arial",fontSize:"16px",color:"#fff",fontStyle:"bold"}).setOrigin(.5));
              g.setData("exit",e);
            });
            scene.cameras.main.setBounds(0,0,WORLD_W,WORLD_H);
            scene.cameras.main.startFollow(player,true,.12,.12);
            mapTitle.setText(def.label.toUpperCase());
            locationText.setText(def.place);
            if(currentBeni)currentBeni.setData("map",id);
          };

          player=scene.physics.add.sprite(MAPS.quercia.spawn.x*TILE,MAPS.quercia.spawn.y*TILE,"player-quercia");
          player.setScale(.72).setCollideWorldBounds(true);
          const body=player.body as Phaser.Physics.Arcade.Body;body.setSize(22,18).setOffset(13,40);
          usernameText=scene.add.text(player.x,player.y-55,username,{fontFamily:"Arial",fontSize:mobile?"11px":"12px",color:"#fff",fontStyle:"bold",stroke:"#241812",strokeThickness:4}).setOrigin(.5).setDepth(20000);

          const hud=scene.add.container(18,18).setScrollFactor(0).setDepth(9000);
          hud.add(scene.add.rectangle(0,0,300,104,0x2b1c14,.94).setOrigin(0).setStrokeStyle(2,0xd4af37));
          hud.add(scene.add.text(15,10,"TREGUA TRA CONTRADE",{fontFamily:"Arial",fontSize:"15px",color:"#f4cf64",fontStyle:"bold"}));
          progress=scene.add.text(15,36,"BENIAMINI 0 / 8",{fontFamily:"Arial",fontSize:"21px",color:"#fff",fontStyle:"bold"});hud.add(progress);
          mapTitle=scene.add.text(15,67,"LA QUERCIA",{fontFamily:"Arial",fontSize:"12px",color:"#f4cf64",fontStyle:"bold"});hud.add(mapTitle);
          locationText=scene.add.text(105,67,"Querceta",{fontFamily:"Arial",fontSize:"12px",color:"#eadfce"});hud.add(locationText);
          hud.add(scene.add.text(15,87,mobile?"🕹️ Muovi · E interagisci":"WASD / FRECCE · E per interagire",{fontFamily:"Arial",fontSize:"10px",color:"#eadfce"}));

          const world=scene.add.container(scene.scale.width-118,92).setScrollFactor(0).setDepth(11000);
          world.add(scene.add.rectangle(0,0,210,125,0x16251b,.92).setStrokeStyle(2,0xd4af37));
          world.add(scene.add.text(-95,-52,"8 TERRITORI",{fontFamily:"Arial",fontSize:"11px",color:"#f4cf64",fontStyle:"bold"}));
          const pts:Record<MapId,[number,number]>={quercia:[0,0],ranocchio:[-35,-35],leondoro:[35,-35],lucertola:[70,-5],pozzo:[80,35],madonnina:[35,45],cervia:[-10,70],ponte:[-65,45]};
          (Object.keys(pts) as MapId[]).forEach(id=>{const [x,y]=pts[id],d=MAPS[id];world.add(scene.add.circle(x,y,6,d.secondary).setStrokeStyle(2,d.primary));world.add(scene.add.text(x,y+9,d.label.replace("Il ","").replace("La ",""),{fontFamily:"Arial",fontSize:"7px",color:"#fff"}).setOrigin(.5));});
          worldDots=world;

          dialog=scene.add.container(scene.scale.width/2,scene.scale.height-78).setScrollFactor(0).setDepth(12000).setVisible(false);
          dialog.add(scene.add.rectangle(0,0,760,108,0x241812,.97).setStrokeStyle(3,0xd4af37));
          dialog.add(scene.add.text(-350,-38,"",{fontFamily:"Arial",fontSize:"15px",color:"#fff",wordWrap:{width:700},lineSpacing:5}));

          tregua=scene.add.container(scene.scale.width/2,18).setScrollFactor(0).setDepth(9500).setVisible(false);
          const tb=scene.add.rectangle(0,0,250,42,0xd4af37).setStrokeStyle(2,0x5c3a21).setInteractive({useHandCursor:true});
          tregua.add(tb);tregua.add(scene.add.text(0,0,"🤝 CERCA IL BARONE",{fontFamily:"Arial",fontSize:"15px",color:"#3b2617",fontStyle:"bold"}).setOrigin(.5));tb.on("pointerdown",()=>window.location.href="/tregua");

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
              if(!userId){say("Devi accedere per raccogliere il Beniamino.");return;}
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
          const mobileUi=scene.add.container(92,scene.scale.height-195).setScrollFactor(0).setDepth(50000).setVisible(mobile);
          const jb=scene.add.circle(0,0,70,0x171717,.82).setStrokeStyle(3,0xffffff,.5).setInteractive(),jk=scene.add.circle(0,0,30,0xd4af37,.95).setStrokeStyle(2,0xffffff,.7);mobileUi.add([jb,jk]);
          const act=scene.add.container(scene.scale.width-90,scene.scale.height-190).setScrollFactor(0).setDepth(50000).setVisible(mobile);
          const ab=scene.add.circle(0,0,42,0x8b3f2f,.9).setStrokeStyle(3,0xffffff,.35).setInteractive();act.add([ab,scene.add.text(0,0,"E",{fontFamily:"Arial",fontSize:"24px",color:"#fff",fontStyle:"bold"}).setOrigin(.5)]);ab.on("pointerdown",()=>void interact());

          jb.on("pointerdown",(p:Phaser.Input.Pointer)=>{if(!mobile)return;joyPointer=p.id;scene.input.setPollAlways();const dx=p.x-mobileUi.x,dy=p.y-mobileUi.y,l=Math.hypot(dx,dy),m=50,s=l>m?m/l:1;joyX=dx*s/m;joyY=dy*s/m;jk.setPosition(dx*s,dy*s);});
          scene.input.on("pointermove",(p:Phaser.Input.Pointer)=>{if(p.id!==joyPointer)return;const dx=p.x-mobileUi.x,dy=p.y-mobileUi.y,l=Math.hypot(dx,dy),m=50,s=l>m?m/l:1;joyX=dx*s/m;joyY=dy*s/m;jk.setPosition(dx*s,dy*s);});
          scene.input.on("pointerup",(p:Phaser.Input.Pointer)=>{if(p.id===joyPointer){joyPointer=null;joyX=joyY=0;jk.setPosition(0,0);}});

          const setPlayer=(id:string)=>{contradaId=MAPS[id as MapId]?id:"quercia";player.setTexture(`player-${contradaId}`);};
          scene.events.on("update",(_t:number,delta:number)=>{
            Math.min(delta,32);if(!keys)return;let x=joyX,y=joyY;
            if(keys.A.isDown||keys.LEFT.isDown)x--;if(keys.D.isDown||keys.RIGHT.isDown)x++;if(keys.W.isDown||keys.UP.isDown)y--;if(keys.S.isDown||keys.DOWN.isDown)y++;
            const l=Math.hypot(x,y);if(l>1){x/=l;y/=l;}const moving=Math.abs(x)+Math.abs(y)>.05;player.setVelocity(x*(keys.SHIFT.isDown?190:135),y*(keys.SHIFT.isDown?190:135));
            player.setDepth(player.y);usernameText.setPosition(player.x,player.y-55);
            if(moving){player.setScale(.72,.69);if(Math.abs(x)>Math.abs(y))player.setFlipX(x<0);else player.setFlipX(false);}else{player.setScale(.72);player.setFlipX(false);}
            if(Phaser.Input.Keyboard.JustDown(keys.E)||Phaser.Input.Keyboard.JustDown(keys.SPACE))void interact();
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
    return()=>game.destroy(true);
  },[]);
  return <div ref={root} className="fixed inset-0 overflow-hidden bg-black"/>;
}
