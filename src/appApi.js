

// used by backend server
export const restApi= {
  notes: { url: 'notes'}
}

// used by routers
export const appApi = {
  root: "/",
}

export const appMenu = [
  [`${appApi.root}`, 'Home'],
  [`${appApi.root}`, 'About'],
  [`${appApi.root}`, 'Contacts'],
]
