<template>
  <div class="star" :class="starType">
    <span v-for="itemClass in itemClasses" :class="itemClass" class="star-item" track-by="$index"></span>
  </div>
</template>

<script>
  const LENGTH = 5;
  const CLS_ON = 'on';
  const CLS_HALF = 'half';
  const CLS_OFF = 'off';
  export default {
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    computed: {
      starType() {
        return 'star-' + this.size;
      },
      itemClasses() {
        let result = [];
        let score = Math.floor(this.score * 2) / 2;
        let hasDecimal = score % 1 !== 0;
        let integer = Math.floor(score);
        for (let i = 0; i < integer; i++) {
          result.push(CLS_ON);
        }
        if (hasDecimal) {
          result.push(CLS_HALF);
        }
        while (result.length < LENGTH) {
          result.push(CLS_OFF);
        }
        return result;
      }
    }
  };
</script>

<style lang="scss">
  @import "../../common/scss/mixin";

  .star {
    .star-item {
      display: inline-block;
      background-repeat: no-repeat;
    }
  }

  @mixin starMixin($size) {
    $width: 20px;
    $padding: 22px;
    @if $size == 36 {
      $width: 15px;
      $padding: 6px;
    } @else if $size == 24 {
      $width: 10px;
      $padding: 3px;
    }
    .star-item {
      width: $width;
      height: $width;
      margin-right: $padding;
      background-size: $width $width;
      &:last-child {
        margin-right: 0;
      }

    }
    .on {
      @include bg-image('star#{$size}_on');
    }
    .half {
      @include bg-image('star#{$size}_half');
    }
    .off {
      @include bg-image('star#{$size}_off');
    }
  }

  .star-48 {
    @include starMixin(48);
  }

  .star-36 {
    @include starMixin(36);
  }

  .star-24 {
    @include starMixin(24);
  }
</style>
