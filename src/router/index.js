import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import routes from './routes';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes,
});

router.beforeEach(async (to, from, next) => {
  const needsDialogPresistance = to.meta.isDialog && !store.getters.isDialog;

  if (needsDialogPresistance && to.name !== 'Bridge') {
    return next('bridge');
  }

  return next();
});

export default router;
