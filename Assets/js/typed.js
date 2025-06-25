!function($){

    "use strict";

    var Typed = function(el, options){

        
        this.el = $(el);

        
        this.options = $.extend({}, $.fn.typed.defaults, options);

        this.baseText = this.el.text() || this.el.attr('placeholder') || '';

        this.typeSpeed = this.options.typeSpeed;

        this.startDelay = this.options.startDelay;

        this.backSpeed = this.options.backSpeed;

        this.backDelay = this.options.backDelay;

        this.strings = this.options.strings;

        this.strPos = 0;

        this.arrayPos = 0;

        this.stopNum = 0;

        this.loop = this.options.loop;
        this.loopCount = this.options.loopCount;
        this.curLoop = 0;

        this.stop = false;

        this.showCursor = this.isInput ? false : this.options.showCursor;

        this.cursorChar = this.options.cursorChar;

        this.isInput = this.el.is('input');
        this.attr = this.options.attr || (this.isInput ? 'placeholder' : null);

        this.build();
    };

        Typed.prototype =  {

            constructor: Typed

            , init: function(){
                var self = this;
                self.timeout = setTimeout(function() {
                    self.typewrite(self.strings[self.arrayPos], self.strPos);
                }, self.startDelay);
            }

            , build: function(){
                if (this.showCursor === true){
                  this.cursor = $("<span class=\"typed-cursor\">" + this.cursorChar + "</span>");
                  this.el.after(this.cursor);
                }
                this.init();
            }

            , typewrite: function(curString, curStrPos){
                if(this.stop === true)
                   return;
                var humanize = Math.round(Math.random() * (100 - 30)) + this.typeSpeed;
                var self = this;

                // ------------- optional ------------- //
                // backpaces a certain string faster
                // ------------------------------------ //
                // if (self.arrayPos == 1){
                //  self.backDelay = 50;
                // }
                // else{ self.backDelay = 500; }

                self.timeout = setTimeout(function() {
                    var charPause = 0;
                    var substr = curString.substr(curStrPos);
                    if (substr.charAt(0) === '^') {
                        var skip = 1;  
                        if(/^\^\d+/.test(substr)) {
                           substr = /\d+/.exec(substr)[0];
                           skip += substr.length;
                           charPause = parseInt(substr);
                        }
                        curString = curString.substring(0,curStrPos)+curString.substring(curStrPos+skip);
                    }

                    self.timeout = setTimeout(function() {
                        if(curStrPos === curString.length) {
                           self.options.onStringTyped(self.arrayPos);

                           if(self.arrayPos === self.strings.length-1) {
                              self.options.callback();

                              self.curLoop++;

                              if(self.loop === false || self.curLoop === self.loopCount)
                                 return;
                           }

                           self.timeout = setTimeout(function(){
                              self.backspace(curString, curStrPos);
                           }, self.backDelay);
                        } else {

                           if(curStrPos === 0)
                              self.options.preStringTyped(self.arrayPos);
                           var nextString = self.baseText + curString.substr(0, curStrPos+1);
                           if (self.attr) {
                            self.el.attr(self.attr, nextString);
                           } else {
                            self.el.text(nextString);
                           }

                           curStrPos++;
                           self.typewrite(curString, curStrPos);
                        }
                    }, charPause);
                }, humanize);

            }

            , backspace: function(curString, curStrPos){
                if (this.stop === true) {
                   return;
                }
                var humanize = Math.round(Math.random() * (100 - 30)) + this.backSpeed;
                var self = this;

                self.timeout = setTimeout(function() {

                    // check string array position
                    // on the first string, only delete one word
                    // the stopNum actually represents the amount of chars to
                    // keep in the current string. In my case it's 14.
                    // if (self.arrayPos == 1){
                    //  self.stopNum = 14;
                    // }
                    //every other time, delete the whole typed string
                    // else{
                    //  self.stopNum = 0;
                    // }

                    var nextString = self.baseText + curString.substr(0, curStrPos);
                    if (self.attr) {
                     self.el.attr(self.attr, nextString);
                    } else {
                     self.el.text(nextString);
                    }

                    if (curStrPos > self.stopNum){
                        curStrPos--;
                        self.backspace(curString, curStrPos);
                    }
                    else if (curStrPos <= self.stopNum) {
                        self.arrayPos++;

                        if(self.arrayPos === self.strings.length) {
                           self.arrayPos = 0;
                           self.init();
                        } else
                            self.typewrite(self.strings[self.arrayPos], curStrPos);
                    }
                }, humanize);

            }

            // Start & Stop currently not working

            // , stop: function() {
            //     var self = this;

            //     self.stop = true;
            //     clearInterval(self.timeout);
            // }

            // , start: function() {
            //     var self = this;
            //     if(self.stop === false)
            //        return;

            //     this.stop = false;
            //     this.init();
            // }

            , reset: function(){
                var self = this;
                clearInterval(self.timeout);
                var id = this.el.attr('id');
                this.el.after('<span id="' + id + '"/>')
                this.el.remove();
                this.cursor.remove();
                self.options.resetCallback();
            }

        };

    $.fn.typed = function (option) {
        return this.each(function () {
          var $this = $(this)
            , data = $this.data('typed')
            , options = typeof option == 'object' && option;
          if (!data) $this.data('typed', (data = new Typed(this, options)));
          if (typeof option == 'string') data[option]();
        });
    };

    $.fn.typed.defaults = {
        strings: ["These are the default values...", "You know what you should do?", "Use your own!", "Have a great day!"],
        typeSpeed: 0,
        startDelay: 0,
        backSpeed: 0,
        backDelay: 1500,
        loop: true,
        loopCount: false,
        showCursor: true,
        cursorChar: "|",
        attr: null,
        callback: function() {},
        preStringTyped: function() {},
        onStringTyped: function() {},
        resetCallback: function() {}
    };

    const buttons = document.querySelectorAll('.btn--md--extra--border--animation');

buttons.forEach(button => {
    button.addEventListener('mouseover', function() {
        const spans = this.querySelectorAll('.marquee--inner span');
        spans.forEach(span => {
            span.style.marginRight = '30px'; // Aggiungi spazio tra i testi
        });
    });

    button.addEventListener('mouseleave', function() {
        const spans = this.querySelectorAll('.marquee--inner span');
        spans.forEach(span => {
            span.style.marginRight = '20px'; // Ripristina lo spazio originale
        });
    });

    button.addEventListener('click', function() {
        const mailto = this.getAttribute('href');
        window.location.href = mailto;
    });
});


}(window.jQuery);
