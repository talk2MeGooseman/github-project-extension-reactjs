export const displaySavingOverylay = (text) => {
    // initialize modal element
    var modalEl = document.createElement('div');
    modalEl.innerHTML = `<div style="padding-top: 25%;height: 100%;" class="mui--align-middle mui--text-center"><h1>${text}</h1></div>`;
    modalEl.style.width = '400px';
    modalEl.style.height = '300px';
    modalEl.style.margin = '100px auto';
    modalEl.style.backgroundColor = '#fff';

    // show modal
    window.mui.overlay('on', {
        static: true
    }, modalEl);
}

export const hideOverlay = () => {
    window.mui.overlay('off');
}