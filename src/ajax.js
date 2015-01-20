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
                target = form.getAttribute('target'),
                fn = Eventi._.resolve(action, this) || Eventi._.resolve(action, window);
            if (fn) {
                if (typeof fn[method] === "function") {
                    fn = fn[method];
                }
                var ret = fn.call(form, form.xValue, e);
                if (target) {
                    ajax.target(target, ret);
                }
            } else {
                window.console.log('todo: actual ajax submission ', action, method);
            }
        }
    },
    target: function(target, result) {
        if (result && typeof result.then === "function") {
            result.then(function() {
                history.pushState(null, null, target);
            });
        } else if (result !== false) {
            history.pushState(null, null, target);
        }
    }
};
ajax.init();// early availability
D.addEventListener('DOMContentLoaded', ajax.init);// eventual consistency
// end ajax
