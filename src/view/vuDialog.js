
export const vuDialog = {
  
  dialog: null,
  //dialog: document.getElementById('dialog'),
  
  oncreate(vnode) {
      vuDialog.dialog = vnode.dom;
  },
  
  view(vnode) {
    return m('dialog#dialog', m('.dialog-content', [
      m('i.fas fa-times.dclose', { onclick: vuDialog.close }),
        m('span.dheader', `${vnode.attrs.header} (${vnode.attrs.word})`),
          vnode.children
        ])
    );
  },
  
  open () {
    vuDialog.dialog.showModal();
    return false;
  },
  
  close (reload=false) {
    const f= vuDialog.dialog.querySelector('form');
    if (Boolean(f)) f.reset();
    vuDialog.dialog.close();
    if ( reload ) m.redraw();
    return false;
  },
}
