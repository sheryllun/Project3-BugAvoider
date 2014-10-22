var Engine = (function(global) {
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        patterns = {},
        lastTime;

    canvas.width = 505;
    canvas.height = 600;
    document.getElementById('container').appendChild(canvas);

    function main() {
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        update(dt);
        render();

        lastTime = now;
        win.requestAnimationFrame(main);
    };

    function init() {

        reset();
        lastTime = Date.now();
        //Game doesn't start until user clicks button. Rearranges some elements on the page.
        document.getElementById('start').onclick = function() {
            main();
            createTimer('timer', 30);
            document.getElementById('timer').style.display = "inline-block";
            document.getElementById('refresh').style.display = "inline-block";
            var h2 = document.getElementById('description');
            h2.parentNode.removeChild(h2);
            var startButton = document.getElementById('start');
            startButton.parentNode.removeChild(startButton);
        }
    }

    function update(dt) {
        updateEntities(dt);
        checkCollisions(allEnemies, player);
        reachEnd();
    }

    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    function render() {
        var rowImages = [
                'images/water-block.png',
                'images/stone-block.png',
                'images/stone-block.png',
                'images/stone-block.png',
                'images/grass-block.png',
                'images/grass-block.png'
            ],

            rowOneImages = [
                'images/water-block.png',
                'images/stone-block-top.png',
                'images/water-block.png',
                'images/stone-block-top.png',
                'images/water-block.png'
            ],

            numRows = 6,
            numCols = 5,
            row, col;

        for(row = 0; row < 1; row++) {
            for(col = 0; col < numCols; col++) {
                ctx.drawImage(Resources.get(rowOneImages[col]), col*101, row *83);
            }
        }

        for (row = 1; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            } 
        }
        renderEntities();
    }


    function renderEntities() {
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        player.render();
        roundLife.render();
    }

    function reset() {
       // noop
    }

    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/Heartsmall.png',
        'images/stone-block-top.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'
    ]);
    Resources.onReady(init);

    global.ctx = ctx;
})(this);
