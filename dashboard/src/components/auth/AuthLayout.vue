<template>
  <div class="auth-layout">
    <div class="nav d-lg-none">
    </div>
    <div class="main va-row">
      <div class="auth-content flex lg6 xs12 fill-height">
        <div class="flex-center">
          <router-view/>
        </div>
      </div>
      <div class="auth-layout__auth-wallpaper flex md6">
        <div class="flex-center">
          <div class="auth-layout__auth-wallpaper__cross-line"/>
          <router-link class="auth-layout__auth-wallpaper__logo" :to="{path: '/'}">
            <pulsar-icon/>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PulsarIcon from '../icon/PulsarIcon'

export default {
  name: 'AuthLayout',
  components: { PulsarIcon },
}
</script>

<style lang="scss" scoped>
.auth-layout {
  height: 100vh;
  margin: 0;

  &__auth-wallpaper {
    position: relative;
    background-color: $top-nav-bg;
    overflow: hidden;
    @include va-flex-center();
    &__logo {
      z-index: 2;
      position: absolute;
      height: $auth-wallpaper-ivuestic-h;
      width: 100%;
    }
    .vuestic-icon-vuestic {
      height: $auth-wallpaper-ivuestic-h;
      width: 100%;
    }

    &__cross-line {
      z-index: 1;
      position: absolute;
      background-color: $auth-wallpaper-oblique-line;
      left: calc(50% - 27% / 2);
      transform: rotate(15deg);
      width: 27%;
      height: 115%;
    }
  }

  .nav {
    display: flex;
    align-items: center;
    justify-content: center;
    height: $top-mobile-nav-height;
    background-color: $top-nav-bg;
    .vuestic-icon-vuestic {
      height: $auth-mobile-nav-ivuestic-h;
      width: 100%;
    }
  }
  .main {
    margin: 0;
    height: 100vh;
    .auth-content {
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: white;
    }
  }

  @include media-breakpoint-down(md) {
    .main {
      height: $auth-mobile-main-h;
      .auth-content {
        align-items: flex-start;
        padding-top: $auth-content-padding-t;
      }
      .auth-wallpaper {
        display: none;
      }
    }
  }
}
</style>
