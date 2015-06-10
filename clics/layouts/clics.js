(function() {
    var Clics = {
        stdio: function() {
            return document.querySelector('#stdio');
        },

        begin: function() {
            window.onkeydown = function(e) {
                var key = (e.which) ? e.which : e.keyCode;

                // Backspace, Tab, Enter or Delete.
                if (key == 8 || key == 9 || key == 13 || key == 46 || e.ctrlKey)
                    e.preventDefault();
                this.handleSpecialKey(key, e);
            }.bind(this);

            window.onkeypress = function(e) {
                this.typeWriter((e.which) ? e.which : e.keyCode);
            }.bind(this);

            this.toggleCursor(600);
        },

        write: function(text) {
            var output = this.stdio();

            if (!output)
                return;

            output.innerHTML += text;
        },

        typeWriter: function(key) {
            var stdio = this.stdio();

            // Input normal characters.
            if (!stdio || key == 9 || key == 13 || key > 0x7E || key < 0x20)
                return;

            stdio.innerHTML += String.fromCharCode(key);
        },

        handleSpecialKey: function(key, e) {
            var stdio = this.stdio();

            if (!stdio)
                return;
            // Backspace/Delete.
            if (key == 8 || key == 46)
                // Delete the last character.
                stdio.innerHTML = stdio.innerHTML.replace(/.$/, '');
            // Enter.
            else if (key == 13)
                console.log("Press Enter");
            // Tab.
            else if (key == 9)
                // Output four spaces.
                stdio.innerHTML += "    ";
            // Ctrl+C, Ctrl+D
            else if ((key == 67 || key == 68) && e.ctrlKey) {
                if (key == 67)
                    this.write('^C');
                stdio.innerHTML = '';
            }
        },

        toggleCursor: function(timeout) {
            var cursor = document.querySelector('#cursor'),
                insert = document.querySelector('#cmd');

            if (cursor) {
                cursor.parentNode.removeChild(cursor);
            } else {
                cursor = document.createElement('span');
                cursor.id = 'cursor';
                cursor.innerHTML = '&#x2588';
                insert.appendChild(cursor);
            }

            if (timeout) {
                setTimeout(function(){
                    this.toggleCursor(timeout);
                }.bind(this), timeout);
            }
        },
    }

    var clics = Object.create(Clics);
    clics.begin();
})();