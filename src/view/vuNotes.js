
// Add Note Button
const addButton= vnode=> {
  const _new_note= ()=> vnode.attrs.model.getItem(null);
  return { view() { return m('.pure-g', 
  m('.pure-u-1-2.pure-u-md-1-1', { style: 'border-bottom: 1px solid #eee;' } , [ 
    m('h1.add-note', 'Add New Note'),
    m('button[title="Add Note"',
      { style: 'float: right; display: inline-block;', onclick: _new_note },
      m('i.fas.fa-plus'))
  ]) );
  }};
};

// Single Note 
const vuNote= note=> m('section.note', [
  m('header.note-header', [ m('p.note-meta', [
    note.meta,
    m('a.note-pan', m('i.fas.fa-trash' )),
    m('a.note-pan', m('i.fas.fa-pen' )),
    m('a.note-pan', m('i.fas.fa-check' ))
  ]),
    m('h2.note-title', note.title)
  ]),
  m('.note-content', m('p', note.content))
]);

//Notes List
export const vuNotes= function(vnode) {
  const { model }= vnode.attrs;
  const _display= ()=> model.editMode ? 'display:none': 'display:block';
  
  return { view() {
    return model.error ? m('h2', {style: 'color:red'}, model.error) :
    !model.list ? m('h1', '...LOADING' ) :
    m('div', { style: _display() }, [
      m(addButton , { model } ),
      m('.pure-g', m('.pure-u-1-2.pure-u-md-1-1',
        m('.notes', model.list.map( vuNote ) )
      ))
    ]);
  }};
}
