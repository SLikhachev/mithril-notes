
// POJO Component
export const vuDialog = {
  
  dialog: null,
  //dialog: document.getElementById('dialog'),
  model: null,
  
  oncreate(vnode) {
    vuDialog.dialog= vnode.dom;
    vuDialog.model= vnode.attrs.model;  
  },
  
  header(model) {
    const hdr= model.save && model.save.err ? 'Error' : 'Confirm';
    const wrd= model.word ? model.word : '';
    return `${hdr} (${wrd})`;   
  },
  
  view(vnode) {
    return m('dialog#dialog', m('.dialog-content', [
      m('i.fas fa-times.dclose', { onclick: vuDialog.close }),
        m('span.dheader', vuDialog.header(vnode.attrs.model) ),
          vnode.children
        ])
    );
  },
  
  open () {
    vuDialog.dialog.showModal();
    return false;
  },
  
  close (e, reload=false) {
    const f= vuDialog.dialog.querySelector('form');
    // if dialog children had form inside reset it 
    if (Boolean(f)) f.reset();
    if ( vuDialog.model.word !== 'Edit') 
      vuDialog.model.editMode= false;
    vuDialog.dialog.close();
    if ( reload ) m.redraw();
    return false;
  },
}
