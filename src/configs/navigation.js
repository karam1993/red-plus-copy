export default {
  // main navigation - side menu
  menu: [{
    text: '',
    key: '',
    items: [
      { icon: 'mdi-view-dashboard-outline', key: 'menu.dashboard', link: '/' , rol : '' } ,
      { icon: 'mdi-account-group-outline', key: 'menu.users', link: '/users' , rol : 'user viewAny' } ,
      { icon: 'mdi-server', key: 'menu.nas', link: '/nases' , rol : 'nas viewAny' } ,
      { icon: 'mdi-package-variant-closed', key: 'menu.packets', link: '/packets' , rol : 'packet viewAny' } ,
      { icon: 'mdi-credit-card-outline', key: 'menu.cards', link: '/cards' , rol : 'card viewAny' } ,
      { icon: 'mdi-cards-outline', key: 'menu.patchcard', link: '/patchcard' , rol : 'patchcard viewAny' } ,
      { icon: 'mdi-clipboard-text-clock-outline', key: 'menu.sessions', link: '/sessions' , rol : 'session viewAny' } ,
      { icon: 'mdi-account-lock-open-outline', key: 'menu.rols', link: '/rols' , rol : 'role viewAny' } ,
      { icon: 'mdi-clipboard-text-clock-outline', key: 'menu.log', link: '/logs' , rol : 'radlog viewAny' } ,
      { icon: 'mdi-bullhorn-outline', key: 'menu.announcement', link: '/announcement' , rol : 'send notification' } 
      
    ]
  }]
}
