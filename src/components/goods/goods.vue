<template>
  <div class="goods">
    <div class="menu-wrapper" v-el:menu-wrapper>
      <ul>
        <li v-for="item in goods" class="menu-item" :class="{'current':currentIndex===$index}"
            @click="selectMenu($index,$event)">
          <span class="text border-1px">
            <span class="icon" v-show="item.type>0" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" v-el:foods-wrapper>
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item border-1px">
              <div class="icon">
                <img width="57px" height="57px" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">${{food.price}}</span>
                  <span v-show="food.oldPrice" class="old">{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart v-ref:shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice"
              :min-price="seller.minPrice"></shopcart>
  </div>
  <food :food="selectedFood" v-ref:food></food>
</template>

<script>
  const ERR_OK = 0;
  import BScroll from 'better-scroll';
  import shopcart from 'components/shopcart/shopcart';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import food from 'components/food/food';
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    components: {
      shopcart,
      cartcontrol,
      food
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
      this.$http.get('/api/goods').then((response) => {
        let body = response.body;
        if (body.code === ERR_OK) {
          this.goods = body.data;
          this.$nextTick(() => {
            this._initBScorll();
            this._calculateHeight();
          });
        }
      });
    },
    data() {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        selectedFood: {}
      };
    },
    methods: {
      _initBScorll() {
        this.menuScorll = new BScroll(this.$els.menuWrapper, {
          click: true
        });
        this.foodsScorll = new BScroll(this.$els.foodsWrapper, {
          click: true,
          probeType: 3
        });

        this.foodsScorll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      _calculateHeight() {
        let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');
        let hight = 0;
        this.listHeight.push(hight);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          hight += item.clientHeight;
          this.listHeight.push(hight);
        }
      },
      selectMenu(index, event) {
        if (!event._constructed) {
          // 浏览器派发的事件,  在PC模式下有
          return;
        }
        let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');
        this.foodsScorll.scrollToElement(foodList[index], 300);
      },
      _drop(target) {
//        this.$nextTick(() => {
          this.$refs.shopcart.drop(target);
//        });
        // 如果卡 打开
      },
      selectFood(food, event) {
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        this.$refs.food.show();
      }
    },
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height = this.listHeight[i];
          let heightNext = this.listHeight[i + 1];
          if (!heightNext || (this.scrollY >= height && this.scrollY < heightNext)) {
            return i;
          }
        }
        return 0;
      },
      selectFoods() {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    events: {
      'cart.add': function(target) {
        this._drop(target);
      }
    }
  };
</script>

<style lang="scss">

  @import "../../common/scss/mixin";

  .goods {
    display: flex;
    position: absolute;
    top: 174px;
    bottom: 46px;
    width: 100%;
    overflow: hidden;
    .menu-wrapper {

      flex: 0 0 80px;
      width: 80px;
      background: #f3f5f7;
      .menu-item {
        display: table;
        height: 54px;
        width: 56px;
        padding: 0 12px;
        line-height: 14px;
        &.current {
          position: relative;
          z-index: 10;
          margin-top: -1px;
          background: #fff;
          font-weight: 700;
          .text {
            border: none;
          }
        }
        .icon {
          display: inline-block;
          vertical-align: top;
          width: 12px;
          height: 12px;
          margin-right: 2px;
          background-size: 12px 12px;
          background-repeat: no-repeat;
          &.decrease {
            @include bg-image('decrease_3');
          }
          &.discount {
            @include bg-image('discount_3');
          }
          &.guarantee {
            @include bg-image('guarantee_3');
          }
          &.invoice {
            @include bg-image('invoice_3');
          }
          &.special {
            @include bg-image('special_3');
          }
        }
        .text {
          display: table-cell;
          width: 56px;
          vertical-align: middle;
          font-size: 12px;
          @include border-1px(rgba(7, 17, 27, 0.1));
        }

      }

    }
    .foods-wrapper {
      flex: 1;
      .title {
        padding-left: 14px;
        height: 26px;
        line-height: 26px;
        border-left: 2px solid #d9dde1;
        font-size: 12px;
        color: rgb(147, 153, 159);
        background: #f3f5f7;
      }
      .food-item {
        display: flex;
        margin: 18px;
        padding-bottom: 18px;
        @include border-1px(rgba(7, 17, 27, 0.1));
        &:last-child {
          @include border-none();
          margin-bottom: 0;
        }
        .icon {
          flex: 0 0 57px;
          margin-right: 10px;
        }
        .content {
          flex: 1;
          .name {
            margin: 2px 0 8px 0;
            height: 14px;
            line-height: 14px;
            font-size: 14px;
            color: rgb(7, 17, 27);
          }
          .desc, .extra {
            line-height: 10px;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
          .desc {
            margin-bottom: 8px;
            line-height: 12px;
          }
          .extra {
            .count {
              margin-right: 12px;
            }
          }
        }
        .price {
          font-weight: 700;
          line-height: 24px;
          .now {
            margin-right: 8px;
            color: rgb(240, 20, 20);
            font-size: 14px;
          }
          .old {
            text-decoration: line-through;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
        }
        .cartcontrol-wrapper {
          position: absolute;
          bottom: 12px;
          right: 0;
        }
      }
    }
  }
</style>
