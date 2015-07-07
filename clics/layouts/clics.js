(function() {
    /**
     * TODO:
     * Write an external AJAX object,
     * avoiding creating various ones in different functions.
     * And write an internal function to inherit the external one.
     */
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
            var usercolor = document.querySelector('#username'),
                sync = document.querySelector('#sync');
            
            usercolor.style.backgroundColor = (typeof c == 'object') ? c.usercolor : c;

            sync.innerHTML += "Done.";
            this.beginPolling();
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
            this.kb = true;

            window.onkeydown = function(e) {
                var key = (e.which) ? e.which : e.keyCode;

                if (this.kb) {
                    // Backspace, Tab, Enter or Delete.
                    if (key == 8 || key == 9 || key == 13 || key == 46 || e.ctrlKey)
                        e.preventDefault();
                    this.handleSpecialKey(key, e);
                }
            }.bind(this);

            window.onkeypress = function(e) {
                if (this.kb)
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
            /**
             * TODO:
             * Make Ctrl+L execute the `clear` command,
             * wiping out all the `pre` labels in the screen.
             */
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
                setTimeout(function() {
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

            /**
             * TODO:
             * Handle special commands,
             * like `clear` to wipe out all the `pre` labels.
             */
            if (MSG.message) {
                ajaxMsg.open('POST', './send_msg', true);
                ajaxMsg.setRequestHeader(
                    'Content-Type',
                    'application/json; charset=UTF-8'
                );
                ajaxMsg.send(JSON.stringify(MSG));
                this.sending();
            }
        },

        sending: function() {
            var stdout = this.stdout(),
                span = document.createElement('span');

            stdout.innerHTML = '';
            span.innerHTML = 'Sending...';
            span.id = 'sending';
            stdout.appendChild(span);
            this.kb = false;
        },

        sent: function() {
            var sending = document.querySelector('#sending');

            if (sending)
                sending.parentNode.removeChild(sending);
            this.kb = true;
        },

        beginPolling: function() {
            var ajaxSync = new XMLHttpRequest(),
                timestamp;

            ajaxSync.onreadystatechange = function() {
                if (ajaxSync.readyState == 4 && ajaxSync.status == 200) {
                    timestamp = JSON.parse(ajaxSync.responseText);
                    this._setInterval(timestamp);
                }
            }.bind(this);

            ajaxSync.open('GET', './sync', true);
            ajaxSync.send();
        },

        _setInterval: function(timestamp) {
            var d = new Date();
                
            if (timestamp) {
                this.interval = timestamp.timeout * 1000 - d.getTime();
                this.sleep = timestamp.sleep * 1000;
                this.fetchMsg();
            }
        },

        fetchMsg: function() {
            var ajaxPoll = new XMLHttpRequest(),
                server_msg;

            setTimeout(function() {
                ajaxPoll.onreadystatechange = function() {
                    if (ajaxPoll.readyState == 4 && ajaxPoll.status == 200) {
                        server_msg = JSON.parse(ajaxPoll.responseText);
                        this.displayMsg(server_msg);
                    }
                }.bind(this);

                ajaxPoll.open('POST', './recv_msg', true);
                ajaxPoll.send();
            }.bind(this), this.interval);
        },

        displayMsg: function(m) {
            var pre, label,
                item;

            if (m) {
                m.forEach(function(item) {
                    pre = document.createElement('pre');
                    label = document.createElement('span');
                    pre.appendChild(label);
                    document.body.appendChild(pre);
                    label.innerHTML = item.username;
                    label.style.backgroundColor = item.usercolor;
                    pre.innerHTML += ": " + item.message;
                });

                window.scrollTo(0, document.body.scrollHeight);
                this.sent();

                setTimeout(function() {
                    this.beginPolling();
                }.bind(this), this.sleep);
            }
        },
    };

    var clics = Object.create(Clics);
    clics.main();
})();