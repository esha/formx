// ajax
var ajax = FORMx.ajax = {
    selector: 'form[ajax]',
    init: function() {
        D.queryAll(ajax.selector).each(function(form) {
            if (form.getAttribute('ajax') !== 'ready') {
                form.setAttribute('ajax', 'ready');
                form.setAttribute('onsubmit', 'return false');
                form.addEventListener('submit', ajax.submit);
            }
        });
    },
    submit: function(e) {
        var form = this;
        if (validate.all(form)) {
            var action = form.getAttribute('action'),
                method = form.getAttribute('method') || 'post',
                fn = Eventi._.resolve(action, this) || Eventi._.resolve(action, window);
            if (fn) {
                if (typeof fn[method] === "function") {
                    fn = fn[method];
                }
                fn.call(form, form.xValue, e);
            } else {
                window.console.log('todo: actual ajax submission ', action, method);
            }
        }
    }
};
ajax.init();// early availability
D.addEventListener('DOMContentLoaded', ajax.init);// eventual consistency
// end ajax
