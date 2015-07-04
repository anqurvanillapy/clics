(function() {
    var Clics = {
        loadUsercolor: function() {
            var colorcookie = document.cookie;

            if (colorcookie) {
                var usercolor = colorcookie.split('=')[1];

                this.initUsercolor(usercolor);

            } else {
                var ajaxUsr = new XMLHttpRequest(),
                    url = './' + this.username().innerHTML + '/init',
                    user;

                ajaxUsr.onreadystatechange = function() {
                    if (ajaxUsr.readyState == 4 && ajaxUsr.status == 200) {
                        user = JSON.parse(ajaxUsr.responseText);
                        this.initUsercolor(user);
                    }
                }.bind(this);

                ajaxUsr.open('GET', url, true);
                ajaxUsr.send();
            }
        },

        initUsercolor: function(c) {
            var usercolor = document.querySelector('#username');
            
            usercolor.style.backgroundColor = (typeof c == 'object') ? c.usercolor : c;
        },

        stdout: function() {
            return document.querySelector('#stdout');
        },

        username: function() {
            return document.querySelector('#username');
        },

        usercolor: function() {
            return document.querySelector('#username').style.backgroundColor;
        },

        main: function() {

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
            this.loadUsercolor();
        },

        write: function(text) {
            var output = this.stdout();

            if (!output)
                return;

            output.innerHTML += text;
        },

        typeWriter: function(key) {
            var stdout = this.stdout();

            // Input normal characters.
            if (!stdout || key == 9 || key == 13 || key > 0x7E || key < 0x20)
                return;

            stdout.innerHTML += String.fromCharCode(key);
        },

        handleSpecialKey: function(key, e) {
            var stdout = this.stdout();

            if (!stdout)
                return;
            // Backspace/Delete.
            if (key == 8 || key == 46)
                // Delete the last character.
                stdout.innerHTML = stdout.innerHTML.replace(/.$/, '');
            // Tab.
            else if (key == 9)
                // Output four spaces.
                stdout.innerHTML += "    ";
            // Ctrl+C, Ctrl+D
            else if ((key == 67 || key == 68) && e.ctrlKey) {
                if (key == 67)
                    this.write('^C');
                setTimeout(function() {
                    stdout.innerHTML = '';
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
                    "message": this.stdout().innerHTML
                }

            ajaxMsg.open('POST', './send_msg', true);
            ajaxMsg.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            ajaxMsg.send(JSON.stringify(MSG));

            this.stdout().innerHTML = 'Sending...';
            setTimeout(function() {
                this.stdout().innerHTML = '';
            }.bind(this), 400);
        },
    }

    var clics = Object.create(Clics);
    clics.main();
})();