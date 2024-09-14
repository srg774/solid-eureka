<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Simple Platformer Game</title>
    <style>
        body {
            margin: 0;
            overflow: hidden;
            touch-action: none; /* Prevents default touch behavior */
            background-color: #87CEEB; /* Sky blue background */
        }
        #gameCanvas {
            display: block;
            background-color: #87CEEB;
        }
        #restartButton {
            display: none;
            position: absolute;
            top: 20%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 10px 20px;
            font-size: 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <canvas id="gameCanvas"></canvas>
    <button id="restartButton">Restart</button>
    <script src="game.js"></script>
</body>
</html>
