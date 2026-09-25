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
      backgroundColor: "#7ec850",
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
        preload() {},

        create() {
          const scene = this;

          // =========================
          // MONDO
          // =========================

          const worldWidth = 2400;
          const worldHeight = 1600;

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

          // prato
          scene.add
            .rectangle(
              worldWidth / 2,
              worldHeight / 2,
              worldWidth,
              worldHeight,
              0x7ec850
            )
            .setDepth(-10);

          // =========================
          // STRADE
          // =========================

          scene.add
            .rectangle(
              1200,
              800,
              180,
              1600,
              0xd8bd8a
            )
            .setDepth(-5);

          scene.add
            .rectangle(
              1200,
              800,
              2400,
              150,
              0xd8bd8a
            )
            .setDepth(-5);

          // =========================
          // PIAZZA
          // =========================

          scene.add
            .rectangle(
              1200,
              800,
              500,
              350,
              0xc9a96e
            )
            .setDepth(-4);

          scene.add
            .text(
              1200,
              690,
              "QUERCETA",
              {
                fontFamily: "Arial",
                fontSize: "42px",
                color: "#5c3a21",
                fontStyle: "bold",
              }
            )
            .setOrigin(0.5)
            .setDepth(5);

          // =========================
          // CASE
          // =========================

          const houses = [
            [850, 650],
            [1550, 650],
            [850, 950],
            [1550, 950],
            [1050, 500],
            [1350, 500],
            [1050, 1100],
            [1350, 1100],
          ];

          houses.forEach(([x, y]) => {
            scene.add
              .rectangle(x, y, 150, 120, 0xf2d7a5)
              .setStrokeStyle(6, 0x5c3a21)
              .setDepth(1);

            scene.add
              .triangle(
                x,
                y - 90,
                x - 95,
                y - 20,
                x + 95,
                y - 20,
                0x8c4b32
              )
              .setDepth(2);
          });

          // =========================
          // ALBERI
          // =========================

          const trees = [
            [450, 400],
            [600, 550],
            [400, 900],
            [550, 1150],
            [1850, 400],
            [2050, 600],
            [1900, 1000],
            [2100, 1250],
            [700, 1350],
            [1750, 1350],
          ];

          trees.forEach(([x, y]) => {
            scene.add
              .circle(x, y - 30, 45, 0x2e7d32)
              .setDepth(2);

            scene.add
              .rectangle(x, y + 20, 18, 55, 0x6d4c41)
              .setDepth(1);
          });

          // =========================
          // PERSONAGGIO
          // =========================

          const player = scene.add
            .rectangle(
              1200,
              900,
              34,
              48,
              0x4f46e5
            )
            .setDepth(10);

          scene.physics.add.existing(player);

          const body =
            player.body as Phaser.Physics.Arcade.Body;

          body.setCollideWorldBounds(true);

          // =========================
          // NOME
          // =========================

          const nameTag = scene.add
            .text(1200, 860, "TU", {
              fontFamily: "Arial",
              fontSize: "16px",
              color: "#ffffff",
              backgroundColor: "#5c3a21",
              padding: {
                x: 6,
                y: 3,
              },
              fontStyle: "bold",
            })
            .setOrigin(0.5)
            .setDepth(20);

          // =========================
          // CAMERA
          // =========================

          scene.cameras.main.startFollow(
            player,
            true,
            0.08,
            0.08
          );

          // =========================
          // CONTROLLI
          // =========================

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