// ajaxForm
var aF = FORMx.ajaxForm = {
    selector: 'form[ajax]'
};
//TODO: actual ajax submission
Eventi.on('^ready', function() {
    Eventi.on(D.queryAll(aF.selector), 'submit', function(e) {
        e.preventDefault();
    });
});
// end ajaxForm
