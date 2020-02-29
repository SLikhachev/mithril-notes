
const addButt= ()=> m('.pure-g', 
  m('.pure-u-1-2.pure-u-md-1-1', { style: 'border-bottom: 1px solid #eee;' } , [ 
    m('h1.add-note', 'Add New Note'),
    m('button[title="Add Note"', { style: 'float: right; display: inline-block;' },
      m('i.fas.fa-plus'))
  ])
);

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

export const vuNotes= function(vnode) {
  const note={
    meta: 'Created at 20.09.2019',
    title: 'Introducing Pure',
    content: `
      esterday at CSSConf, we launched Pure – a new CSS library. 
		  Phew! Here are the <a href="https://speakerdeck.com/tilomitra/pure-bliss">slides
		  from the presentation</a>. Although it looks pretty minimalist, 
		  we’ve been working on Pure for several months. After many iterations, 
		  we have released Pure as a set of small, responsive, CSS modules 
		  that you can use in every web project.
    `
  };
  const notes= [note];
  
  return { view() {
    return [ addButt(),
    m('.pure-g', m('.pure-u-1-2.pure-u-md-1-1',
      m('.notes', notes.map( vuNote ) )
    )) ];
  }};
}
