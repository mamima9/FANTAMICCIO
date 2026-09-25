"use client";

import { useEffect, useRef } from "react";
import Phaser from "phaser";

export default function TreguaGame() {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,

      parent: gameRef.current,

      width: 960,
      height: 540,

      backgroundColor: "#79b85a",

      pixelArt: true,

      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },

      physics: {
        default: "arcade",
        arcade: {
          debug: false,
        },
      },

      scene: {
        create() {
          const scene = this;

          // =====================================================
          // MONDO
          // =====================================================

          const worldWidth = 3200;
          const worldHeight = 2200;

          scene.physics.world.setBounds(
            0,
            0,
            worldWidth,
            worldHeight
          );

          scene.cameras.main.setBounds(
            0,
            0,
            worldWidth,
            worldHeight
          );

          // =====================================================
          // TERRENO
          // =====================================================

          scene.add
            .rectangle(
              worldWidth / 2,
              worldHeight / 2,
              worldWidth,
              worldHeight,
              0x79b85a
            )
            .setDepth(-20);

          // =====================================================
          // ACQUA
          // =====================================================

          scene.add
            .rectangle(
              2750,
              1100,
              650,
              2200,
              0x58a6c7
            )
            .setDepth(-19);

          // =====================================================
          // STRADA PRINCIPALE
          // =====================================================

          scene.add
            .rectangle(
              1550,
              1100,
              180,
              2200,
              0xd9bd82
            )
            .setDepth(-18);

          scene.add
            .rectangle(
              1550,
              1100,
              3100,
              170,
              0xd9bd82
            )
            .setDepth(-18);

          // =====================================================
          // STRADE SECONDARIE
          // =====================================================

          const secondaryRoads = [
            {
              x: 750,
              y: 500,
              width: 1500,
              height: 110,
            },
            {
              x: 750,
              y: 1700,
              width: 1500,
              height: 110,
            },
            {
              x: 2150,
              y: 650,
              width: 110,
              height: 900,
            },
            {
              x: 850,
              y: 1100,
              width: 110,
              height: 900,
            },
          ];

          secondaryRoads.forEach((road) => {
            scene.add
              .rectangle(
                road.x,
                road.y,
                road.width,
                road.height,
                0xd9bd82
              )
              .setDepth(-17);
          });

          // =====================================================
          // PIAZZA CENTRALE
          // =====================================================

          scene.add
            .rectangle(
              1550,
              1100,
              600,
              450,
              0xcaa76a
            )
            .setStrokeStyle(8, 0x9a7547)
            .setDepth(-16);

          scene.add
            .text(
              1550,
              900,
              "QUERCETA",
              {
                fontFamily: "Arial",
                fontSize: "48px",
                color: "#5b3a22",
                fontStyle: "bold",
              }
            )
            .setOrigin(0.5)
            .setDepth(-10);

          // =====================================================
          // CASE
          // =====================================================

          const houses = [
            [500, 450],
            [900, 450],
            [1200, 450],
            [1900, 450],
            [2300, 450],

            [500, 750],
            [900, 750],
            [2200, 800],

            [500, 1450],
            [900, 1450],
            [2100, 1450],

            [500, 1800],
            [950, 1800],
            [1900, 1800],
            [2300, 1800],
          ];

          houses.forEach(([x, y]) => {
            const house = scene.add
              .rectangle(
                x,
                y,
                150,
                110,
                0xf1d5a6
              )
              .setStrokeStyle(6, 0x68452c)
              .setDepth(2);

            scene.add
              .triangle(
                x,
                y - 75,
                x - 95,
                y - 15,
                x + 95,
                y - 15,
                0x9b5039
              )
              .setDepth(3);

            scene.add
              .rectangle(
                x,
                y + 25,
                32,
                50,
                0x6f4931
              )
              .setDepth(4);

            scene.physics.add.existing(
              house,
              true
            );
          });

          // =====================================================
          // ALBERI
          // =====================================================

          const trees = [
            [250, 250],
            [400, 350],
            [650, 250],
            [1050, 250],
            [1450, 250],
            [1800, 250],
            [2150, 250],
            [2450, 300],

            [250, 700],
            [350, 950],
            [250, 1250],
            [350, 1550],

            [1150, 1550],
            [1400, 1750],
            [1650, 1550],
            [1800, 1950],
            [2150, 1600],
            [2500, 1700],
          ];

          trees.forEach(([x, y]) => {
            scene.add
              .rectangle(
                x,
                y + 28,
                22,
                65,
                0x70472f
              )
              .setDepth(1);

            scene.add
              .circle(
                x,
                y,
                48,
                0x2f7d32
              )
              .setDepth(2);

            scene.add
              .circle(
                x - 28,
                y + 10,
                30,
                0x398d38
              )
              .setDepth(2);

            scene.add
              .circle(
                x + 28,
                y + 10,
                30,
                0x398d38
              )
              .setDepth(2);
          });

          // =====================================================
          // PERSONAGGIO
          // =====================================================

          const player = scene.add
            .rectangle(
              1550,
              1250,
              34,
              46,
              0x4f46e5
            )
            .setDepth(10);

          scene.physics.add.existing(player);

          const body =
            player.body as Phaser.Physics.Arcade.Body;

          body.setCollideWorldBounds(true);

          // =====================================================
          // NOME PLAYER
          // =====================================================

          const nameTag = scene.add
            .text(
              player.x,
              player.y - 42,
              "TU",
              {
                fontFamily: "Arial",
                fontSize: "15px",
                color: "#ffffff",
                backgroundColor: "#49301f",
                padding: {
                  x: 6,
                  y: 3,
                },
                fontStyle: "bold",
              }
            )
            .setOrigin(0.5)
            .setDepth(20);

          // =====================================================
          // CAMERA
          // =====================================================

          scene.cameras.main.startFollow(
            player,
            true,
            0.10,
            0.10
          );

          // =====================================================
          // CONTROLLI
          // =====================================================

          const cursors =
            scene.input.keyboard!.createCursorKeys();

          const keys =
            scene.input.keyboard!.addKeys(
              "W,A,S,D"
            ) as Record<
              string,
              Phaser.Input.Keyboard.Key
            >;

          scene.events.on(
            "update",
            () => {
              const speed = 220;

              body.setVelocity(0);

              if (
                cursors.left.isDown ||
                keys.A.isDown
              ) {
                body.setVelocityX(-speed);
              }

              if (
                cursors.right.isDown ||
                keys.D.isDown
              ) {
                body.setVelocityX(speed);
              }

              if (
                cursors.up.isDown ||
                keys.W.isDown
              ) {
                body.setVelocityY(-speed);
              }

              if (
                cursors.down.isDown ||
                keys.S.isDown
              ) {
                body.setVelocityY(speed);
              }

              if (
                body.velocity.x !== 0 &&
                body.velocity.y !== 0
              ) {
                body.velocity.normalize().scale(speed);
              }

              nameTag.setPosition(
                player.x,
                player.y - 42
              );
            }
          );
        },
      },
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div
      ref={gameRef}
      className="w-full h-screen overflow-hidden bg-black"
    />
  );
}