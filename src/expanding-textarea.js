// expandingTextarea
var eTa = FORMx.expandingTextarea = {
    selector: 'textarea[expanding]',
    events: 'input onpropertychange change validate',
    handle: function(e) {
        var el = e.target,
            was = el.rows,
            h = 0;
        if (el.value === '') {
            el.rows = 1;
        } else {
            while (el.rows > 1 && el.scrollHeight < el.offsetHeight) {
                el.rows--;
            }
            while (h !== el.offsetHeight && el.scrollHeight > el.offsetHeight) {
                h = el.offsetHeight;
                el.rows++;
            }
        }
        if (was !== el.rows) {
            Eventi.fire(el, 'rowChange', was);
        }
    }
};
eTa.events.split(' ').forEach(function(type) {
    Eventi.on(D.body, type+'<'+eTa.selector+'>', eTa.handle);
});
// end expandingTextarea