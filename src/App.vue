<template>
  <div>
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>

    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import { urlParse } from 'common/js/util';
  import header from './components/header/header.vue';
  const ERR_OK = 0;
  export default {
    data() {
      return {
        seller: {
          id: (() => {
            let urlParams = urlParse();
            return urlParams.id;
          })()
        }
      };
    },
    created() {
      this.$http.get('api/seller').then((response) => {
        let body = response.body;
        if (body.code === ERR_OK) {
          this.seller = Object.assign({}, this.seller, body.data);
        }
      });
    },
    components: {
      'v-header': header
    }
  };
</script>

<style lang="scss">
  @import "common/scss/mixin";

  .tab {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    .tab-item {
      flex: 1;
      text-align: center;
      @include border-1px(rgba(7, 17, 27, 0.1));
      a {
        display: block;
        font-size: 14px;
        color: rgb(77, 85, 93);

      }
      .active {
        color: rgb(240, 20, 20);
      }
    }
  }

</style>
