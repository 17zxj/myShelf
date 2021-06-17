export default [
  {
    path: '/Login',
    component: '../layouts/LoginLayout',
    routes: [
      { path: '/Login', component: '../pages/Login/index'},
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    // redirect:"/Login",
    routes: [
      { path: '/403', component: '../pages/403' },
      { path: '/404', component: '../pages/404' },
      { path: '/500', component: '../pages/500' },
      { path: '/', component: '../pages/index',breadcrumb: '' },
    ],
  }
];
