var points;

var countboxes = function() {
    var count = 0;
    for (var row = 0; row < 9; row++) {
        for (var col = 0; col < 9; col++) {
            if ($('#'+row+col).val()) {
                count++;
            }
        }
    }
    return count;
};

(function() {

    var body = $('body'),
        user_progress = $('#user_progress');

    $('#game input').change(function() {
        if (errorExists()) {
            body.css('background-color', 'red');
        }
        else {
            body.css('background-color', 'white');
            points = countboxes();
            user_progress.val(points);
        }
    });

    var errorExists = function() {
        // check for row errors
        for (var row = 0; row < 9; row++) {

            var nums = [];
            for (var col = 0; col < 9; col++) {
                var val = $('#'+row+col).val();
                if (nums.indexOf(val) === -1 || val === '') {
                    nums.push(val);
                }
                else {
                    return true;
                }
            }
        }

        // check for column errors
        for (var col = 0; col < 9; col++) {
            var nums = [];
            for (var row = 0; row < 9; row++) {
                var val = $('#'+row+col).val();
                if (nums.indexOf(val) === -1 || val === '') {
                    nums.push(val);
                }
                else {
                    return true;
                }
            }
        }

        // check for 3x3 errors
        for (var corner = 0; corner < 9; corner++) {
            var startRow = (corner / 3 | 0) * 3;
            var startCol = corner % 3 * 3;
            var nums = [];
            for (var row = startRow; row < startRow + 3; row++) {
                for (var col = startCol; col < startCol + 3; col++) {
                    var val = $('#'+row+col).val();
                    if (nums.indexOf(val) === -1 || val === '') {
                        nums.push(val);
                    }
                    else {
                        return true;
                    }
                }
            }
        }

        return false;
    }

})();
