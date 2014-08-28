// ajax
var ajax = FORMx.ajax = {
    selector: 'form[ajax]',
    init: function() {
        D.queryAll(ajax.selector).each(function(form) {
            if (form.getAttribute('ajax') !== 'ready') {
                form.setAttribute('ajax', 'ready');
                form.addEventListener('submit', ajax.block);
            }
        });
    },
    block: function(e){ e.preventDefault(); }
};
//TODO: actual ajax submission
ajax.init();// early availability
D.addEventListener('DOMContentLoaded', ajax.init);// eventual consistency
// end ajax
