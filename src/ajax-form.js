// ajaxForm
var aF = FORMx.ajaxForm = {
    selector: 'form[ajax]',
    init: function() {
        D.queryAll(aF.selector).each(function(form) {
            if (form.getAttribute('ajax') !== 'ready') {
                form.setAttribute('ajax', 'ready');
                form.addEventListener('submit', aF.block);
            }
        });
    },
    block: function(e){ e.preventDefault(); }
};
//TODO: actual ajax submission
aF.init();// early availability
D.addEventListener('DOMContentLoaded', aF.init);// eventual consistency
// end ajaxForm
