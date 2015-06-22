(function() {
    var Clics = {
        loadUsercolor: function(url) {
            var ajaxUsr = new XMLHttpRequest(),
                user;

            ajaxUsr.onreadystatechange = function() {
                if (ajaxUsr.readyState == 4 && ajaxUsr.status == 200) {
                    user = JSON.parse(ajaxUsr.responseText);
                    this.initUsercolor(user);
                }
            }.bind(this);

            ajaxUsr.open('GET', url, true);
            ajaxUsr.send();
        },

        initUsercolor: function(user) {
            var username = this.username(),
                usercolor;

            if (user) {
                usercolor = user.usercolor;
                username.style.backgroundColor = usercolor;
            }
        },

        stdio: function() {
            return document.querySelector('#stdio');
        },

        username: function() {
            return document.querySelector('#username');
        },

        usercolor: function() {
            return document.querySelector('#username').style.backgroundColor;
        },

        main: function() {
            var url = './' + this.username().innerHTML + '/init';

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
            this.loadUsercolor(url);
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
            // Tab.
            else if (key == 9)
                // Output four spaces.
                stdio.innerHTML += "    ";
            // Ctrl+C, Ctrl+D
            else if ((key == 67 || key == 68) && e.ctrlKey) {
                if (key == 67)
                    this.write('^C');
                setTimeout(function() {
                    stdio.innerHTML = '';
                }, 300);
            }
            // Enter.
            else if (key == 13) {
                this.transJSON();
            }
        },

        toggleCursor: function(timeout) {
            var cursor = document.querySelector('#cursor'),
                insert = document.querySelector('#cmd');

            if (cursor)
                cursor.parentNode.removeChild(cursor);
            else {
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

        transJSON: function() {
            var ajaxMsg = new XMLHttpRequest(),
                MSG = {
                    "username": this.username().innerHTML,
                    "usercolor": this.usercolor(),
                    "message": this.stdio().innerHTML,
                }

            ajaxMsg.open("POST", './msg', true);
            ajaxMsg.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            ajaxMsg.send(JSON.stringify(MSG));

            this.stdio().innerHTML = 'Sending...';
            setTimeout(function() {
                this.stdio().innerHTML = '';
            }.bind(this), 400);
        },
    }

    var clics = Object.create(Clics);
    clics.main();
})();