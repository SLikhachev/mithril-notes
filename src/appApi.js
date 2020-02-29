

// used by backend server
export const restApi= {
  notes: { url: 'notes', editable: ['add', 'edit', 'del'] }
}

// used by routers
export const appApi = {
  root: "/",
}
// used by navBar
// here array of arrays while it may be hash eg
export const appMenu = [
  [`${appApi.root}`, 'Home'],
  [`${appApi.root}`, 'About'],
  [`${appApi.root}`, 'Contacts'],
]
